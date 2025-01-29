const jsonwebToken=require('jsonwebtoken')
require('dotenv').config()
const Company=require('../modals/companyModal')
module.exports=(req,res,next)=>{
    let token=req.headers.authorization
    if(!token){
        res.send({
            message:"login first",
            success:false,
        })
    }
    else{
        jsonwebToken.verify(token,process.env.secretKey,async(err,data)=>{
            if(err){
               res.send({
                  message:"authentication failed login first",
                  success:false
               })
            }
            else{
                console.log(console.log('token is:',data.role))
                let allcompany=data.role==true?await Company.find():data.permission.map(elem=>elem.companyname)
                req.com=allcompany
                
               next()
                
                
                
            }
        })
    }
 
}
