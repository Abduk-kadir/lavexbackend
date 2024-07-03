const express=require('express')
const jsonwebToken=require('jsonwebtoken')
require('dotenv').config()
require('./config/dbConfig')
let userRoute=require('./routes/userRoute')
let invoiceRouter=require('./routes/invoiceRoute')
let porfarmaRouter=require('./routes/porformaRoute')
const app=express()
app.use(express.json())
app.use(function(req,res,next){
    res.header("Access-Control-Allow-Origin","*")
    res.header(
        "Access-Control-Allow-Methods",
        "GET, POST, OPTIONS, PUT, PATCH, DELETE, HEAD"

    );
    res.header(
        "Access-Control-Allow-Headers",
        "Origin,X-Requested-With ,Content-Type, Accept"

    );
    next();

   
});

const port =process.env.port||5000
app.listen(port,()=>console.log(`app is listining is port ${port}`))

app.use('/api/user',userRoute)
app.use('/api/invoice',invoiceRouter)
app.use('/api/porfarma',porfarmaRouter)
