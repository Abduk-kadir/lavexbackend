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
                console.log('data:',data)
                let permission=data.permission.find((elem)=>elem.companyname==req.params.companyname)
                console.log('permission:',permission)
                if(permission){
                    let page=permission.pages.find(elem=>elem.pagename.toLowerCase()=='My Invoice'.toLowerCase())
                    console.log('page is:',page)
                    if(page){
                        let accessarr=page.access
                        let access=accessarr.find(elem=>elem.toLowerCase()=='put'.toLowerCase())
                       if(access){
                        console.log(access)
                         next()
                       }
                       else{
                        res.send({
                            message:"you have not access to update",
                            success:false
                          })
    
                       }
                    }
                    else{
                        res.send({
                            message:"you have not access to this page",
                            success:false
                          })
                    };

                }
                else{

                    res.send({
                       message:"user is not access to this company denied" ,
                       success:false
                    })

                }
                
                
            }
        })
    }
 
}
