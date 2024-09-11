const express = require('express')
const cors = require('cors')
const bodyparser = require('body-parser')
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const proxy = require('express-http-proxy');

const app = express()
const {createProxyMiddleware} = require('http-proxy-middleware')
app.use(bodyparser.json())

app.use(cors({

    origin:'http://localhost:4200',
    
}))



app.use('/auth-service' ,proxy('http://auth-service:3002'))
app.use('/profile-service' ,proxy('http://profile-service:3001'))





app.listen(3000,()=>{
    console.log("api gateway listening on port 3000")
})