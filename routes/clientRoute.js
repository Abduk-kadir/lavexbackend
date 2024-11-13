let express=require('express')
let router=express.Router()
let Client=require('../modals/clientModal')
const authMidd=require('../middleware/authmiddleware')
const Porfarma=require('../modals/performaModal')
const Invoice=require('../modals/invoiceModal')
const CreditNote=require('../modals/creditNoteModal')
const deliveryChalan = require('../modals/deliveryChalan')
const Logs=require('../modals/logs/logs')

router.post('/addClient',async(req,res)=>{
    let company=req.query.company
   
    try{
        let body=req.body;
        body.company=company
        let data=await Client.find()
        let max = data.reduce((acc, curr) => curr.mov > acc ? curr.mov : acc, 0)
        max = max + 1;
        body.mov=max
        let client=new Client(body);
        await client.save();
        let str=`client ${body.client} is created`
        let js={companyname:company,itemId:max,actionType:'CREATE',changedBy:"ABDUL",changeDetails:str,model:"Client"}
        let log=new Logs(js)
        await log.save()
        res.send({
           message:"data is successfully added",
           success:true,
        })
       }
       catch(err){
           res.send({
               message:err.message,
               success:false,
           })
       }
})


router.get('/detailforInvoice',async(req,res)=>{
    let {type}=req.query
    let result=await Client.findOne({client:type})
    res.send(result)
})

router.get('/clientdropdown/:company',async(req,res)=>{
    try{

        let arr= await Client.find({company:req.params.company},{client:1,_id:0})
        let dropdown=arr.map(elem=>elem.client)
        res.send({
            message:"data is fetched successfully",
            data:dropdown,
            success:true
        })

    }
    catch(err){
        res.send({
            message:err.message,
            data:null,
            success:false
        })
    }
   


})

router.put('/updateClient/:id',async(req,res)=>{
    let {id}=req.params
    try{
        let p=await Porfarma.findOne({"clientDetail.id":id})
        let d=await deliveryChalan.findOne({"clientDetail.id":id})
        let c=await CreditNote.findOne({"clientDeltail.id":id})
        let i=await Invoice.findOne({"clientDetail.id":id})
        if(p||d||c||i){
            res.send({
                message:"client can not update it is used invoices",
                success:false
            })

        }
        else{
           await Client.findByIdAndUpdate(id,req.body,{runValidators: true });
            res.send({
                message:"client is successfully updated",
                success:true
            })
        }
       

    }
    catch(err){
        res.send({
            message:err.message,
            success:false
        })

    }


})



router.delete('/deleteClient/:id',async(req,res)=>{
    let {id}=req.params
    
    try{
        let p=await Porfarma.findOne({"clientDetail.id":id})
        let d=await deliveryChalan.findOne({"clientDetail.id":id})
        let c=await CreditNote.findOne({"clientDeltail.id":id})
        let i=await Invoice.findOne({"clientDetail.id":id})
        if(p||d||c||i){
            res.send({
                message:"client can not delete it is used invoices",
                success:false
            })

        }
        else{
           await Client.findByIdAndDelete(id);
            res.send({
                message:"client is successfully deleted",
                success:true
            })
        }
       

    }
    catch(err){
        res.send({
            message:err.message,
            success:false
        })

    }


})

router.get('/allClient/:company',async(req,res)=>{
    try{
        let arr= await Client.find({company:req.params.company})
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




module.exports=router