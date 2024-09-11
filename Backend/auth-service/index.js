const express = require('express')
const mongoose = require('mongoose')
const grpc = require('@grpc/grpc-js')
const protoLoader = require('@grpc/proto-loader')
const cors =require('cors')
const User = require('./DbModel/user')
const app = express()
const { ObjectId } = require('mongodb');

const jwt = require('jsonwebtoken')
const JWT_SECRET = 'your_secret_key'

async function connectDb(){
    try{
        let data=await mongoose.connect('mongodb://mongodb:27017/auth-service', {});
        console.log("MONGODB CONNECTED")
    }catch(error){
        console.log(error)
        throw error
    }
    
}
connectDb()

const profileprotoPath = './profile.proto';
const profilepackage = protoLoader.loadSync(profileprotoPath,{})
const profileproto = grpc.loadPackageDefinition(profilepackage).profile
// const profileProto = require('../profile-service/profile.proto')
const user = require('./DbModel/user')
app.use(express.json())
app.use(cors())





//client setUp for profile service
const profileClient = new profileproto.ProfileService('profile-service:50052' , grpc.credentials.createInsecure())

//Grpc method to register user
async function RegisterUser(call , callback){
    const {username , password , email , mobile} = call.request
    try {
        const existingUser = await User.findOne({email})
        if(existingUser){
            return callback(new Error('user already exists'))
        }

        const newUser = new User({username , password , email , mobile})
        await newUser.save()



        //optionally create an initial user
        profileClient.CreateUserProfile({
            userId:newUser._id.toString(),
            username : newUser.username,
            password : newUser.password,
            mobile : newUser.mobile
        } , (err , response)=>{
            if(err){
                console.log("error creating user profile",err)
            }else if(!response.success){
                console.log("failed to create user profile")
            }
        })


        callback(null , {userId:newUser._id.toString()})
    } catch (error) {
        console.log("Error from grpc Register user from auth service")
    }
}

async function LoginUser(call ,callback){
    
    const {username , password } = call.request
    try {
        const user = await User.findOne({username , password})
        if(user){
            const token = "some token"
            callback(null , {token})
        }else{
            callback(new Error("invalid credentials"))
        }
    } catch (error) {
        console.log("error from LoginUser grpc in auth-service")
    }
}


async function UpdateUserProfile(call , callback){
    const {userId , username , password , mobile} = call.request
    console.log("userId got in auth-service",userId)
   
    const objectIdd = new ObjectId(userId)
    const existingUser = await user.findById(objectIdd)
    console.log("haii",existingUser)

    if(username) existingUser.username = username;
    if (password) existingUser.password = password;
    if (mobile) existingUser.mobile = mobile;
    await existingUser.save()
    callback(null, { success: true });
}




//grpc server setup
const protoPath = 'auth.proto'
const packageDefinition = protoLoader.loadSync(protoPath, {})
const authproto = grpc.loadPackageDefinition(packageDefinition).auth
const server = new grpc.Server()
server.addService(authproto.AuthService.service , {RegisterUser,LoginUser ,UpdateUserProfile})
server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(),()=>{
    console.log("auth-service grpc server started")
})


function generateToken(user){
    return jwt.sign(
        {userId:user._id, email:user.email},
        JWT_SECRET,
        {expiresIn:'1h'}

    )
}





app.post('/register' , async(req,res)=>{
    const {username , password , email , mobile } = req.body
    try {
        const existingUser = await user.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }


        const newUser = new user({ username, password , email , mobile});
        await newUser.save();

        // Optionally create an initial user profile
        profileClient.CreateUserProfile({
            userId :newUser._id,
            username: newUser.username,
            email : newUser.email,
            password : newUser.password,
            mobile : newUser.mobile
        }, (err, response) => {
            if (err) {
                console.error('Error creating user profile:', err);
            } else if (!response.success) {
                console.error('Failed to create user profile');
            }
        });

        //generating token
        const token = generateToken(newUser)
        res.json({ userId: newUser._id.toString() ,token});


    } catch (error) {
        
    }
})

app.post('/login' , async(req,res)=>{
    const {email , password} = req.body

    try {
        const existingUser = await user.findOne({email})

        if(!existingUser){
            console.log("nos such user")
            return res.status(404).send({message : 'user not found'})
        }

        if(existingUser.password !== password){
            console.log("invalid credentials")
            return res.status(401).send({message:"invalid credentials"})
        }


        //generating token
        const token = generateToken(existingUser)
        console.log("User is valid");
        return res.status(200).send({ message: "Login is successful" , token });


    } catch (error) {
        
    }
})

app.get('/user-profile' , async(req,res)=>{
    // console.log("you are inside home")
    const token = req.headers.authorization?.split(' ')[1];
    if(!token){
        return res.status(401).send({ message: 'No token provided' });
 
    }

    try {

        const decoded = jwt.verify(token, JWT_SECRET);
        const rr = await user.findById(decoded.userId);
        // console.log("heeeeee")

        // console.log("dfsdf",decoded)
        // console.log("jjjjj",rr)

        if (!rr) {
            return res.status(404).send({ message: 'User not found' });
          }

          ///rr inside it the userdetails we are passing it to frontend
          res.status(200).json({ rr: {
            userId:rr._id,
            username: rr.username,
            email: rr.email,
            mobile: rr.mobile
          } });
    } catch (error) {
        
    }
})



app.listen(3002,()=>{
    console.log("server listening on localhost 3002")
})