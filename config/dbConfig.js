const mongoose=require("mongoose")
require('dotenv').config()

mongoose.connect(process.env.databaseUrl);

let db=mongoose.connection
db.on('connected',()=>{
    console.log('database is connected')
})
db.on('error',()=>{
    console.log('connection is failed')
})
