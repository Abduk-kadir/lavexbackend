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
                console.log('data is:',data)
                 let id=req.query.type
                let permission=data.permission.find((elem)=>elem.companyname==id)
                console.log('permission:',permission)
                if(permission){
                    let page=permission.pages.find(elem=>elem.pagename.toLowerCase()=='Create Invoice'.toLowerCase())
                    console.log('page is:',page)
                    if(page){
                        let accessarr=page.access
                        let access=accessarr.find(elem=>elem.toLowerCase()=='post'.toLowerCase())
                       if(access){
                        console.log(access)
                         next()
                       }
                       else{
                        res.send({
                            message:"you have not access to add",
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
                       message:"user is not access to this company " ,
                       success:false
                    })

                }
                
                
            }
        })
    }
 
}
