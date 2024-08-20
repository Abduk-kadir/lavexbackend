let express=require('express')
let router=express.Router()
let Client=require('../modals/clientModal')
const authMidd=require('../middleware/authmiddleware')
router.post('/addClient',async(req,res)=>{
    try{
        let data=await Client.findOne({client:req.body.client})
        if(data){
            res.send({
                message:"client is already exist",
                success:false, 
             })

        }
        else{
        let body=req.body;
        let client=new Client(body);
        await client.save();
        res.send({
           message:"data is successfully added",
           success:true,
       
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


router.get('/detailforInvoice',async(req,res)=>{
    let {type}=req.query
    let result=await Client.findOne({client:type})
    res.send(result)
})

router.get('/clientdropdown',async(req,res)=>{
    try{

        let arr= await Client.find({},{client:1,_id:0})
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

/*router.delete('/deleteClient/:id',async(req,res)=>{
    let {id}=req.params
    
    try{

        let rs=await Client.findByIdAndDelete(id);
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
router.get('/allClient',async(req,res)=>{
    try{

        let arr= await Client.find()
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