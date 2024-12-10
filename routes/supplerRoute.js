let express=require('express')
let router=express.Router()
let Supplier=require('../modals/supplierModal')
let Logs=require('../modals/logs/logs')
let Inward=require('../modals/store/inwardModal')
let DebitNote=require('../modals/debitNodeModal')
const multer  = require('multer')
const upload = multer({ storage: multer.memoryStorage() })
const xlsx=require('xlsx')

router.post('/supplierImport', upload.single('file'),async(req,res)=>{
   
    try{
      if (!req.file) {
        res.send({message:"no file uploaded",success:false,})
      }
      else{
        const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
        console.log(workbook)
        const sheetName = workbook.SheetNames[0];
        const worksheet=workbook.Sheets[sheetName]
        const data = xlsx.utils.sheet_to_json(worksheet);
        await Supplier.insertMany(data)
        res.send({
            message:"suppliers are  successfully added",
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

router.post('/addSupplier/:companyname',async(req,res)=>{
    try{
        let body=req.body; 
        body.companyname=req.params.companyname 
        let data=await Supplier.find()
        let max = data.reduce((acc, curr) => curr.mov > acc ? curr.mov : acc, 0)
        max = max + 1;
        body.mov=max
        let supplier=new Supplier(body);
        await supplier.save();
        let str=`supplier ${body.supplier} is created`
        let js={companyname:req.params.companyname,itemId:max,actionType:'CREATE',changedBy:"ABDUL",changeDetails:str,model:"Supplier"}
        let log=new Logs(js)
        await log.save()
        res.send({
           message:"data is successfully added",
           success:true
        })
       }    
       catch(err){
           res.send({
               message:err.message,
               success:false,
           })
   
       }

})

/*router.get('/suplier/:companyname/:id',async(req,res)=>{
    try{
        let data=await Supplier.findOne({companyname:req.params.companyname,_id:req.params.id})
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
    
})*/
router.put('/updateSupplier/:id',async(req,res)=>{
    let {id}=req.params
    let body=req.body
        
        try{
            let d=await DebitNote.findOne({"clientDetail.id":id})
            let i=await Inward.findOne({"sid":id})
            if(d||i){
                res.send({
                    message:"client can not update it is used in inwards or debitnote",
                    success:false
                })
    
            }
            else{
              let c=await Supplier.findById(req.params.id)
               let rs= await Supplier.findByIdAndUpdate(id,req.body,{runValidators: true });
                let {
                    supplier,
                    gstNumber,
                    address,
                    area,
                    pincode,
                    state,
                    city,
                    panNumber
                    ,email,
                    contactPerson,
                    mobile,
                    stateCode,
                    mobile2,   
                }=c
                let str='';
                if(supplier!=body.supplier){str+=`supplier ${supplier} is changed to ${body.supplier}  `}
                //if(shortCode!=body.shortCode){str+=`$short {shortCode} is changed to ${body.shortCode}  `}
                if(gstNumber!=body.gstNumber){str+=`gstnumber ${gstNumber} is changed to ${body.gstNumber}  `}
                if(address!=body.address){str+=`address ${address} is changed to ${body.address}  `}
                if(area!=body.area){str+=`area ${area} is changed to ${body.area}  `}
                if(pincode!=body.pincode){str+=`pincode ${pincode} is changed to ${body.pincode}  `}
                if(state!=body.state){str+=`state ${state} is changed to ${body.state}`}
                if(city!=body.city){str+=`city ${city} is changed to ${body.city}  `}
                if(panNumber!=body.panNumber){str+=`pannumber pan number ${panNumber} is changed to ${body.panNumber}  `}
                if(email!=body.email){str+=`email ${email} is changed to ${body.email}`}
                if(contactPerson!=body.contactPerson){str+=`contact person ${contactPerson} is changed to ${body.contactPerson}  `}
                if(mobile!=body.mobile){str+=`mobile ${mobile} is changed to ${body.mobile}  `}
               
                if(mobile2!=body.mobile2){str+=`'mobile ${mobile2} is changed to ${body.mobile2}  `}
               
              
                console.log(str)
                if(str!=''){
                    
                let js={companyname:rs.companyname,itemId:rs.mov,actionType:'UPDATE',changedBy:"ABDUL",changeDetails:str,model:"Supplier"}
                let log=new Logs(js)
                await log.save()
                }



                res.send({
                    message:"supplier is successfully deleted",
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

   
router.delete('/deleteSupplier/:id',async(req,res)=>{
    let {id}=req.params
        
        try{
            let d=await DebitNote.findOne({"clientDetail.id":id})
            let i=await Inward.findOne({"sid":id})
            if(d||i){
                res.send({
                    message:"supplier can not delete it is used inwards or debitnote",
                    success:false
                })
    
            }
            else{
               let rs=await Supplier.findByIdAndDelete(id);
                let str=`supplier ${rs.supplier} is deleted`
               let js={companyname:rs.companyname,itemId:rs.mov,actionType:'DELETE',changedBy:"ABDUL",changeDetails:str,model:"Supplier"}
               console.log(js)
               let log=new Logs(js) 
                   await log.save()
                res.send({
                    message:"supplier is successfully deleted",
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

router.get('/allSupplier/:companyname',async(req,res)=>{
    try{

        let arr= await Supplier.find({companyname:req.params.companyname})
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