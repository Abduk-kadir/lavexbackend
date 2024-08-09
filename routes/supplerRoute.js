let express=require('express')
let router=express.Router()
let Supplier=require('../modals/supplierModal')

router.post('/addSupplier',async(req,res)=>{
    try{

        let data=await Supplier.findOne({supplier:req.body.supplier})
        if(!data){
        let body=req.body;    
        let supplier=new Supplier(body);
        await supplier.save();
        res.send({
           message:"data is successfully added",
           success:true,
          
       
        })
       }
       else{

        res.send({
            message:"this supplier is already exist",
            success:false,
         
        
         })

       }    
   
       }
       catch(err){
           res.send({
               message:err.message,
               success:false,
             
   
   
           })
   
       }

})

router.get('/suplier/:id',async(req,res)=>{
    try{
        let data=await Supplier.findById(req.params.id)
        res.send({
            message:"data is successfully fectced",
            success:true,
            data:data
        })
    }
    catch(err){
        res.send({
            message:err.message,
            success:true,
            data:null
        })

    }
    
})
   
/*
router.delete('/deleteSupplier/:id',async(req,res)=>{
    let {id}=req.params
    
    try{

        let rs=await Supplier.findByIdAndDelete(id);
        if(rs){
            res.send({
                message:"client deleted is successfully",
                data:rs,
                success:true
            })

        }
        else{
            res.send({
                message:"please fill correct id",
                data:null,
                success:false
            })
        }
       

    }
    catch(err){
        res.send({
            message:err.message,
            data:null,
            success:false
        })

    }

})
*/
router.get('/allSupplier',async(req,res)=>{
    try{

        let arr= await Supplier.find()
        res.send({
            message:"data is fetched successfully",
            data:arr,
            success:true
        })

    }
    catch(err){
        res.send({
            message:err.message,
            data:null,
            success:fasle
        })
    }
   
})

router.get('/suplierDropdown',async(req,res)=>{
    try{
        let arr= await Supplier.find({},{supplier:1})
        res.send({
            message:"all suplier is successfully fetched",
            data:arr,
            success:true
        })
    }
    catch(err){
        res.send({
            message:err.message,
            data:null,
            success:fasle
        })
    }
   
})






module.exports=router