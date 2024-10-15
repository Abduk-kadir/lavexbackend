const express=require('express')
const jsonwebToken=require('jsonwebtoken')
require('dotenv').config()
require('./config/dbConfig')
let userRoute=require('./routes/userRoute')
let invoiceRouter=require('./routes/invoiceRoute')
let porfarmaRouter=require('./routes/porformaRoute')
let devitNoteRouter=require('./routes/debitNoteRoute')
let creditNoteRouter=require('./routes/creditNoteRoute')
let myInvoicRouter=require('./routes/myInvoices')
let clientRouter=require('./routes/clientRoute')
let SupplierRouter=require('./routes/supplerRoute')
let DeliveryChalanRouter=require('./routes/deliveryChalanRoute')
let invardRouter=require('./routes/storeallRoute/inwardRoute')
let ProductionRouter=require('./routes/storeallRoute/productionRoute')
let ItemMasterRouter=require('./routes/storeallRoute/itemMasterRoute')
let BomRouter=require('./routes/storeallRoute/bomRoute')

let CompanyRouter=require('./routes/companyRoute')
let SupplerPayRouter=require('./routes/suppallPayRoute/supplerPayment')
let CleintPayRouter=require('./routes/clientAllPayRoute/clientpayment')
let ManufecturerRouter=require('./routes/manufacturerRoute')
let DropdownRouter=require('./routes/dropdownRoute')
let SisterRouter=require('./routes/sisterStoreRoute')

const app=express()
app.use(express.json())
app.use(function(req,res,next){
    res.header("Access-Control-Allow-Origin","*")
    res.header(
        "Access-Control-Allow-Methods",
        "GET, POST, OPTIONS, PUT, PATCH, DELETE, HEAD"

    );
    res.header("Access-Control-Expose-Headers","Authorization,X-Auth-Token")
    res.header(
        "Access-Control-Allow-Headers",
        "Origin,X-Requested-With ,Content-Type, Accept,Authorization"

    );
    next();

   
});

const port =process.env.port||5000
app.listen(port,()=>console.log(`app is listining is port ${port}`))

app.use('/api/user',userRoute)
app.use('/api/invoice',invoiceRouter)
app.use('/api/porfarma',porfarmaRouter)
app.use('/api/debitnote',devitNoteRouter)
app.use('/api/creditnote',creditNoteRouter)
app.use('/api/client',clientRouter)
app.use('/api/supplier',SupplierRouter)
app.use('/api/delivery',DeliveryChalanRouter)


app.use('/api/company',CompanyRouter);

app.use('/api/inward',invardRouter)
app.use('/api/itemMaster',ItemMasterRouter)
app.use('/api/bom',BomRouter)
app.use('/api/production',ProductionRouter)
app.use('/api/supPayment',SupplerPayRouter)

app.use('/api/clientPayment',CleintPayRouter)
app.use('/api',DropdownRouter)
app.use('/api/manufecturer',ManufecturerRouter)
app.use('/api/sister',SisterRouter)


/*searching all type of invoices*/
 app.use('/api/invoices',myInvoicRouter);
 
