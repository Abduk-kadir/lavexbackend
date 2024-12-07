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
                console.log(data)
                let permission=data.permission.find((elem)=>elem.companyname==req.params.companyname)
                let page=permission.pages.find(elem=>elem.pagename=='invoice')
                let accessarr=page.access
                let access=accessarr.find(elem=>elem=='delete')
               
                console.log(page)
                if(page){
                    console.log(access)
                   if(access){
                    next()
                   }
                   else{
                    res.send({
                        message:"you have not access to delete",
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
