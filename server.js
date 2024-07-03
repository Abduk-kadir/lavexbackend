const express=require('express')
const jsonwebToken=require('jsonwebtoken')
require('dotenv').config()
require('./config/dbConfig')
let userRoute=require('./routes/userRoute')
let invoiceRouter=require('./routes/invoiceRoute')
const app=express()
app.use(express.json())
const port =process.env.port||5000
app.listen(port,()=>console.log(`app is listining is port ${port}`))

app.use('/api/user',userRoute)
app.use('/api/invoice',invoiceRouter)
