const jsonwebToken=require('jsonwebtoken')
require('dotenv').config()
module.exports=(req,res,next)=>{
    let token=req.headers.authorization
    if(!token){
        res.send({
            message:"login first",
            success:false,
        })
    }
    else{
        jsonwebToken.verify(token,process.env.secretKey,(err,data)=>{
            if(err){
               res.send({
                  message:"authentication failed login first",
                  success:false
                  
               })
            }
            else{
                let allcompany=data.map(elem=>elem.companyname)
                req.com=allcompany
                next()
                
                
                
            }
        })
    }
 
}
