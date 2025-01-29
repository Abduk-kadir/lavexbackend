const express=require('express')
const jsonwebToken=require('jsonwebtoken')
const router=express.Router()
const Registration=require('../modals/registrationModal')
const bcrypt = require('bcryptjs');

router.delete('/deleteuser/:id',async(req,res)=>{
    try{
    let user=await Registration.findById(req.params.id)
    if(!user){
        res.send({
            message:'this is not registered user',
            success:false, 
        })
    }
    else{
        let f=await Registration.findByIdAndDelete(req.params.id)
        res.send({
            message:'user is deleted',
            success:true, 
        })

    }
}
catch(err){
    res.send({
        message:err,
        success:false, 
    })

}
})

router.get('/allUsers',async(req,res)=>{
    try{
         let data=await Registration.find()
         res.send({
            message:'all users fetched successfull',
            success:true,
            data:data
           
        })
        
    }
    catch(err){
        res.send({
            message:err.message,
            success:false,
           
        })

    }
})

router.patch('/givePermission/:id',async(req,res)=>{
   let {body}=req;
   let {permission}=body
   let id=req.params.id
   let f= await Registration.findOne({_id:id})
   if(f){
      await Registration.updateOne({_id:id},{$set:{permission:permission}})
      res.send({
        message:'permission is given successfully',
        success:true,
       
    })
   }
   else{
    res.send({
        message:'permission is not set successfully',
        success:false,
       
    })

   }


})

router.patch('/updatePassword',async(req,res)=>{
    let {body}=req;
   let {password,email}=body
    try{
     let user=await Registration.findOne({email:email});
     console.log('user:',user.email)
     if(!user){
        res.send({
            message:'please register first',
            success:false,
            data:null
        })
     }
     else{
        let hassPassword=await bcrypt.hash(password,10)
        let f = await Registration.findOneAndUpdate(
            { email: email },  // make sure to use an object filter with the id field
            { $set: { password: hassPassword } },  // make sure you set the hashed password
            { runValidators: true, new: true }    // `new: true` will return the updated document
          );
        console.log(f)
        res.send({
            message:'user password is successfully updated',
            success:true,
            data:body

        })

     }

    }
    catch(err){
        res.send({
            merrage:err.message,
            success:false,
            data:null
        })

    }
        
})






router.post('/register',async(req,res)=>{
    let {body}=req;
   let {email,password}=body
    try{
     let user=await Registration.findOne({email:req.body.email});
     if(user){
        res.send({
            message:'user is already register',
            success:false,
            data:null
        })
     }
     else{
        let hassPassword=await bcrypt.hash(password,10)
        body.password=hassPassword;
        let newUser=new Registration(body)
        await newUser.save()
        res.send({
            message:'user is register successfully',
            success:true,
            data:body

        })

     }

    }
    catch(err){
        res.send({
            merrage:err.message,
            success:false,
            data:null
        })

    }
        
})

router.post('/login',async(req,res)=>{
    try{
    let user=await Registration.findOne({email:req.body.email})
    if(user){
        let u = await Registration.findOne({'email':req.body.email,"permission.companyname":""});
        if(u){
            return(res.send({message:"it have not any company access",success:false}))
        }
    }
   
    if(user){
     let fpass=await bcrypt.compare(req.body.password,user.password)
     if(fpass){
     let token=jsonwebToken.sign({role:user.isAdmin,permission:user.permission},process.env.secretKey,{expiresIn:'1w'})
     console.log('token is:',token)
     let u=await Registration.findOneAndUpdate({email:req.body.email},{token:token})
        res.send({
            message:'user is successfully login',
            success:true,
            details:{
                token:token,
                user:user.id,
                permission:user.permission,
                isAdmin:user.isAdmin

            }
        })
   
     }
     else{
      
        res.send({
            message:"please fill correct password",
            success:false,
            data:null

        })

     }



      
    }
    else{
       res.send({
          message:'please go to register page',
          success:false,
          data:null
       }) 
    }

}
catch(err){
    res.send({
        message:err.message,
        success:false,
        data:null
        
    })

}
})




module.exports=router