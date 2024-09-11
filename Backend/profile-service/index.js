const express = require('express')
const mongoose = require('mongoose')
const grpc = require('@grpc/grpc-js')
const protoLoader = require('@grpc/proto-loader')
const profile = require('./DbModel/profile')
const app = express()


async function connectDb(){
    try{

        let data=await mongoose.connect('mongodb://mongodb:27017/profile-service',{})

        console.log("MONGODB CONNECTED")
    }catch(error){
        console.log(error)
        throw error
    }
    
}
connectDb()


const cors = require('cors')
app.use(express.json())

app.use(cors());


const authprotoPath = './auth.proto';
const authpackage = protoLoader.loadSync(authprotoPath,{})
const authProto = grpc.loadPackageDefinition(authpackage).auth
//client setup for auth-service
const authClient = new authProto.AuthService('auth-service:50051', grpc.credentials.createInsecure())



//grpc service implementation
function CreateUserProfile(call, callback) {
    const {userId,  username , email , password , mobile } = call.request;


    try {
        const newProfile = new profile({userId, username  , email , password , mobile});
        newProfile.save()
        callback(null , {success:true})
    } catch (error) {
        console.error('Error in CreateUserProfile:', error);
    }


}


async function UpdateUserProfile(call , callback){
    const {userId , username , password , mobile }= call.request;
    try {

    // const uup=  await profile.findOneAndUpdate({userId} ,{username , password , mobile})

    const uup=  await profile.findOne({userId} ,{username , password , mobile})
        console.log("up fron profile-serv",uup)

     
       if(uup){
        console.log("hererere")
        callback(null , {success : true})
       } 
        
    } catch (error) {
        
    }
}



//grpc server setup
const protoPath = 'profile.proto'
const packageDefinition = protoLoader.loadSync(protoPath, {})
const profileproto = grpc.loadPackageDefinition(packageDefinition).profile
const server = new grpc.Server()
server.addService(profileproto.ProfileService.service , {CreateUserProfile ,UpdateUserProfile})
server.bindAsync('0.0.0.0:50052', grpc.ServerCredentials.createInsecure(),()=>{
    console.log("profile-service grpc server started")
})


app.post('/update' ,async(req,res)=>{
    console.log("I am here")
    const {userId ,username , password , mobile} = req.body
    console.log("user id form profile",userId)


    try {

        const updatedFields = {}
        if(username) updatedFields.username = username
        if(password) updatedFields.password = password
        if(mobile) updatedFields.mobile = mobile

        const rr = await profile.findOneAndUpdate({userId},
            updatedFields,
            {new : true}
        )

        if(!rr){
            return res.status(404).send({message:'Profile not found'})
        }

        authClient.UpdateUserProfile({userId , username , password , mobile},


            (err,response)=>{
                if(err){
                    console.log("error updating user profile in auth-service" , err)
                    return res.status(500).send({message : 'failed to update user profile in auth-service'})
                }

                if(!response.success){
                    return res.status(500).send({messae:'not updated'})
                }
            

               console.log("user data from profile-service is ",)
                res.status(200).send({ message: 'Profile updated successfully' ,rr});

            }
        )


    } catch (error) {
        
    }




  
})


app.listen(3001,()=>{
    console.log("server listening on localhost 3001")
})