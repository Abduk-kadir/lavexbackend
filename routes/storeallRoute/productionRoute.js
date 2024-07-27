let express=require('express')
let router=express.Router()
const Production= require('../../modals/store/production');
const PurchaseStore=require('../../modals/store/purchaseStore')
const ProductionStore=require('../../modals/store/productionStore');



router.put('/changestatus/:id/',async(req,res)=>{
    let parr=[]
    try{
      let status=req.body.status
      let prod=await Production.findOne({_id:req.params.id})
      let result=await Production.updateOne({_id:req.params.id},{$set:{status:req.body.status}})
      
      let preStatus=prod.status
      console.log('previsous status:',preStatus)
      console.log('current status',status)
      
      if(status=='canceled'){
        if(preStatus=='pending'){
            await Production.deleteOne({_id:req.params.id})
            console.log('in pending')
        }
        else if(preStatus=='confirmed'){
            let {raw,readyStock}=prod;
            //here updating purchase store
            for(let i=0;i<raw.length;i++){
              let {name,brand,quantity,price,gst}=raw[i]  
              let f=await PurchaseStore.updateOne( { item: { $elemMatch: { name: name, brand:brand } } }, { $inc: { "item.$[elem].quantity": -quantity } }, { arrayFilters: [ { "elem.name": name, "elem.brand": brand }]})
              }

              for(let i=0;i<readyStock.length;i++){
                let {name,brand,qty}=readyStock[i]   
                let f=await ProductionStore.updateOne( { readyStock: { $elemMatch: { name: name, brand:brand } } }, { $inc: { "readyStock.$[elem].qty": -qty } }, { arrayFilters: [ { "elem.name": name, "elem.brand": brand }]})
                 if(f.matchedCount==0){
                     let elem=readyStock[i]
                     parr.push(elem)
                 }
                } 
            await Production.deleteOne({_id:req.params.id}) 

        }
      }
 


      if(status=='pending'&&preStatus=='confirmed'){
        let {raw,readyStock}=prod;
        //here updating purchase store
        for(let i=0;i<raw.length;i++){
          let {name,brand,quantity,price,gst}=raw[i]  
          let f=await PurchaseStore.updateOne( { item: { $elemMatch: { name: name, brand:brand } } }, { $inc: { "item.$[elem].quantity": quantity } }, { arrayFilters: [ { "elem.name": name, "elem.brand": brand }]})
          }
         //ending

         //updating production store
         for(let i=0;i<readyStock.length;i++){
            let {name,brand,qty}=readyStock[i]   
            let f=await ProductionStore.updateOne( { readyStock: { $elemMatch: { name: name, brand:brand } } }, { $inc: { "readyStock.$[elem].qty": -qty } }, { arrayFilters: [ { "elem.name": name, "elem.brand": brand }]})
             if(f.matchedCount==0){
                 let elem=readyStock[i]
                 parr.push(elem)
             }
            }
        //ending

      }







      if(status=='confirmed'&&preStatus!='confirmed'){
       let {raw,readyStock}=prod;
      //here updating purchase store
      for(let i=0;i<raw.length;i++){
        let {name,brand,quantity,price,gst}=raw[i]  
        let f=await PurchaseStore.updateOne( { item: { $elemMatch: { name: name, brand:brand } } }, { $inc: { "item.$[elem].quantity": -quantity } }, { arrayFilters: [ { "elem.name": name, "elem.brand": brand }]})
        }
       //ending
     
     //updating production store
     for(let i=0;i<readyStock.length;i++){
        let {name,brand,qty}=readyStock[i]   
        let f=await ProductionStore.updateOne( { readyStock: { $elemMatch: { name: name, brand:brand } } }, { $inc: { "readyStock.$[elem].qty": qty } }, { arrayFilters: [ { "elem.name": name, "elem.brand": brand }]})
         if(f.matchedCount==0){
             let elem=readyStock[i]
             parr.push(elem)
         }
        }
        if(parr.length>0){
          console.log('hit') 
          let product=new ProductionStore({readyStock:parr})
          await product.save()
        }
     //ending
      }
      res.send({
         message:'status is successfully update',
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
 




router.post('/addProduction2',async(req,res)=>{
    let body=req.body
    try{
        let data=await Production.find()
        let val=data.reduce((acc,curr)=>curr.prodNum>acc?curr.prodNum:acc,0)
        console.log('val before :',val)
        val=val+1
        console.log(val)
        let production= Production({...body,prodNum:val})
         await production.save()
        res.send({
            message:"data is added success fully added",
            success:true,
        })

    }
    catch(err){
        res.send({
            message:err.message,
            success:false
        })

    }

})

router.get('/allProduction',async(req,res)=>{
    try
    {
      let result=await Production.find()
      res.send({
        message:'all prodution is successfully fetched',
        success:true,
        data:result
       })
    }
    catch(err){
        res.send({
            message:err.message,
            success:false,
            data:null
           })
    }
})

router.get('/prod/statuswithprev/:id',async(req,res)=>{
    let arr=[];
    try{
     let prod=await Production.findOne({_id:req.params.id})
     let {readyStock}=prod;
     let allProduction=await productionStore.find()
     allProduction.map(elem=>{
      elem.readyStock.map(elem=>{
        arr.push(elem)
      })
     })
     let prevarr=arr.filter(elem=>readyStock.find(elem2=>elem2.name==elem.name&&elem2.brand==elem.brand))
     let js1={prev:prevarr}
     let js2={now:readyStock}
     let finalarr=[js1,js2]
     
     
     res.send({
        message:'data is successfully fetched',
        success:true,
        data:finalarr
       })
    }
    catch(err){
        res.send({
            message:err.message,
            success:false,
           })

    }
})

router.get('/prod/status/:id',async(req,res)=>{
    console.log(req.params.id)
  try{
   let prod=await Production.aggregate([{$project:{readyStock:{$map:{input:"$readyStock",as: "item",
    in:{
        name: "$$item.name",
        brand: "$$item.brand",
        qty: "$$item.qty",
        gst: "$$item.gst",
        price: "$$item.price",
        total:{$multiply:['$$item.price','$$item.qty',{ $add: [1, { $divide: ["$$item.gst", 100] }] }]}}
   }}}}])
   res.send({
      message:'data is successfully',
      success:true,
      data:prod
     })
  }
  catch(err){
      res.send({
          message:err.message,
          success:false,
          data:null
         })

  }
})

router.get('/allStock',async(req,res)=>{
    try{
    let porArr=await ProductionStore.find({},{_id:0})
    let purArr=await PurchaseStore.find({},{_id:0})
    console.log('prodcution arr:',porArr)
    let finalarr=[];
    for(let i=0;i<purArr.length;i++){
            for(j=0;j<purArr[i].item.length;j++){
             finalarr.push(purArr[i].item[j])
            }
              
    }
    for(let i=0;i<porArr.length;i++){
        for(j=0;j<porArr[i].readyStock.length;j++){
         finalarr.push(porArr[i].readyStock[j])
        }
          
     }
     res.send({
        message:"all stock is successfully fetched",
        success:true,
        data:finalarr
     })
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