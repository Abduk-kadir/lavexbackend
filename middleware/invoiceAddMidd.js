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
                
                let permission=data.permission.find((elem)=>elem.companyname==req.params.companyname)
                let page=permission.pages.find(elem=>elem=='invoice')
                console.log(permission.access)
                let access=permission.access.find(elem=>elem=='post')
                console.log(page,access)
                if(page){
                   if(access){
                    console.log(access)
                    next()
                   }
                   else{
                    res.send({
                        message:"you have not access to add invoice",
                        success:false
                      })

                   }
                }
                else{
                    res.send({
                        message:"you have access to this page",
                        success:false
                      })
                };
                
            }
        })
    }
 
}
