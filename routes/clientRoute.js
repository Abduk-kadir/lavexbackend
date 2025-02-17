let express=require('express')
let router=express.Router()
let Client=require('../modals/clientModal')
const authMidd=require('../middleware/authmiddleware')
const Porfarma=require('../modals/performaModal')
const Invoice=require('../modals/invoiceModal')
const CreditNote=require('../modals/creditNoteModal')
const deliveryChalan = require('../modals/deliveryChalan')
const Logs=require('../modals/logs/logs')
const multer  = require('multer')
const upload = multer({ storage: multer.memoryStorage() })
const xlsx=require('xlsx')
let ItemMaster=require('../modals/store/itemMaster')

router.patch('/blockedClient/:id', async (req, res) => {
    try {
      const updatedClient = await Client.findByIdAndUpdate(
        req.params.id,
        { $set: { blocked: req.body.blocked } },
        { new: true } // Return the updated document
      );
  
      if (updatedClient) {
        res.status(200).send({
          message: "Client block status changed successfully",
          success: true,
        });
      } else {
        res.status(404).send({
          message: "Client not found",
          success: false,
        });
      }
    } catch (err) {
      res.status(500).send({
        message: err.message,
        success: false,
      });
    }
  });
  
router.post('/itemImport/:companyname', upload.single('file'),async(req,res)=>{
   
    try{
      
      if (!req.file) {
       
        res.send({message:"no file uploaded",success:false,})
      }
      else{
        const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const worksheet=workbook.Sheets[sheetName]
        const data = xlsx.utils.sheet_to_json(worksheet);
        console.log('data is:',data)
        let newdata=data.map(elem=>{
          let js={}
          js={...elem,companyname:req.params.companyname}
        
        
          return js
        }
        )
       
        await ItemMaster.insertMany(newdata)
        res.send(
                   {
                    message:"clients are  successfully added",
                    success:true,}
                  )
                
      }



    }
    catch(err){

       res.send(err.message)
    }
   

})


router.post('/clientImport/:companyname', upload.single('file'),async(req,res)=>{
   
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
        let newdata=data.map(elem=>{
            let js={}
            js={...elem,company:req.params.companyname}
          
          
            return js
          }
          )
        await Client.insertMany(newdata)
        res.send({
            message:"clients are  successfully added",
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
        let arr=await Client.find({company:req.params.company},{client:1,Branch:1,_id:0})
        let dropdown=arr.map(elem=>elem.Branch?`${elem.client}(${elem.Branch})`:elem.client)
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
    let body=req.body
    try{
        let p=await Porfarma.findOne({"clientDetail.id":id})
        let d=await deliveryChalan.findOne({"clientDetail.id":id})
        let c=await CreditNote.findOne({"clientDeltail.id":id})
        let i=await Invoice.findOne({"clientDetail.id":id})
        if(p||d||c||i){
            let c=await Client.findById(id)
             console.log(c.client)
             console.log(body.client)
            console.log(c.gstNumber!=body.gstNumber&&c.client!=body.client&&c.grade!=body.grade&&c.panNumber!=body.panNumber&&c.fcAmount!=body.fcAmount&&c.scAmount!=body.scAmount&&c.fcDays!=body.fcDays&&c.scDays!=body.scDays)
            

            if(c.gstNumber!=body.gstNumber||c.client!=body.client||c.grade!=body.grade||c.panNumber!=body.panNumber||c.fcAmount!=body.fcAmount||c.scAmount!=body.scAmount||c.fcDays!=body.fcDays||c.scDays!=body.scDays)
            {
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
        else{
           let c=await Client.findById(req.params.id) 
           let {
            client,
            grade,
            shortCode,
            gstNumber,
            address,
            location,
            area,
            pincode,
            state,
            city,
            panNumber
            ,email,
            contactPerson,
            mobile1,
            accPerson,
            mobile2,
            fcAmount,
            fcDays,
            scAmount,
            scDays,
            shipTo,
            createdAt,
            Branch,
            salesman
            
        }=c
           let str='';
           if(client!=body.client){str+=`client ${client} is changed to ${body.client}  `}
           if(grade!=body.grade){str+=`${grade} is changed to ${body.client}  `}
           if(shortCode!=body.shortCode){str+=`${shortCode} is changed to ${body.shortCode}  `}
           if(gstNumber!=body.gstNumber){str+=`${gstNumber} is changed to ${body.gstNumber}  `}
           if(address!=body.address){str+=`${address} is changed to ${body.address}  `}
           if(location!=body.location){str+=`${location} is changed to ${body.location}  `}
           if(area!=body.area){str+=`${area} is changed to ${body.area}  `}
           if(pincode!=body.pincode){str+=`${pincode} is changed to ${body.pincode}  `}
           if(state!=body.state){str+=`${state} is changed to ${body.state}`}
           if(city!=body.city){str+=`${city} is changed to ${body.city}  `}
           if(panNumber!=body.panNumber){str+=`pan number ${panNumber} is changed to ${body.panNumber}  `}
           if(email!=body.email){str+=`${email} is changed to ${body.email}`}
           if(contactPerson!=body.contactPerson){str+=`contact person ${contactPerson} is changed to ${body.contactPerson}  `}
           if(mobile1!=body.mobile1){str+=`${mobile1} is changed to ${body.mobile1}  `}
           if(accPerson!=body.accPerson){str+=`accountable person ${accPerson} is changed to ${body.accPerson}`}
           if(mobile2!=body.mobile2){str+=`${mobile2} is changed to ${body.mobile2}  `}
           if(fcAmount!=body.fcAmount){str+=`first credit ${fcAmount} is changed to ${body.fcAmount}  `}
           if(fcDays!=body.fcDays){str+=`first Credti Days ${fcAmount} is changed to ${body.fcDays}`}
           if(scAmount!=body.scAmount){str+=`second credit ${scAmount} is changed to ${body.scAmount}  `}
           if(scDays!=body.scDays){str+=`second Credit Days ${scDays} is changed to ${body.scDays}`}
           if(shipTo!=body.shipTo){str+=`shiping ${shipTo} is changed to ${body.shipTo}`}
           if(Branch!=body.Branch){str+=`branch ${Branch} is changed to ${body.Branch}`}
           if(salesman!=body.salesman){str+=`shiping ${salesman} is changed to ${body.salesman}`}
           console.log(c.mov)
           if(str!=''){
           let js={companyname:c.company,itemId:c.mov,actionType:'UPDATE',changedBy:"ABDUL",changeDetails:str,model:"Client"}
           let log=new Logs(js)
           await log.save()
           }
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
         let rs=  await Client.findByIdAndDelete(id);
         console.log(rs)
         let str=`client ${rs.client} is deleted`
         console.log(str)
         let js={companyname:rs.company,itemId:rs.mov,actionType:'DELETE',changedBy:"ABDUL",changeDetails:str,model:"Client"}
         console.log(js)
         let log=new Logs(js) 
             await log.save()
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