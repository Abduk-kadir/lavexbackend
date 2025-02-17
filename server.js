const express=require('express')
const jsonwebToken=require('jsonwebtoken')
const cors = require('cors');
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
let LedgerRouter=require('./routes/ledgerRoute')
let CashInvoiceRouter=require('./routes/cashRoutes/cashInvoiceRoute')
let CashDebitRouter=require('./routes/cashRoutes/cashDebitNoteRoute')
let CashCreditRouter=require('./routes/cashRoutes/cashCreditNoteRoute')
let CashDeliveryRouter=require('./routes/cashRoutes/cashDeliveryChalanRoute')
let CashPerformRouter=require('./routes/cashRoutes/cashPorformaRoute')
let CashClientPaymentRouter=require('./routes/cashRoutes/cashClientpayment');
let CashMyInvoicesRouter=require('./routes/cashRoutes/myCashInvoices')
let CashLedgerRouter=require('./routes/cashRoutes/cashLedgerRoute')
let LogRouter=require('./routes/logs')
let MakeOrderRouter=require('./routes/masterOrderRoute')
let SisterOrderRouter=require('./routes/sisterOrderRoute')
let checkPermission=require('./middleware/checkPermissionChange')
const app=express()
//app.use(express.json())
app.use(express.json({ limit: '10mb' }));  // Adjust limit as needed (e.g., '10mb', '50mb', etc.)
app.use(checkPermission)

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
app.use('/api/ledger',LedgerRouter)

app.use('/api/cashInvoice',CashInvoiceRouter)
app.use('/api/cashCredit',CashCreditRouter)
app.use('/api/cashDebit',CashDebitRouter)
app.use('/api/cashDelivery',CashDeliveryRouter)
app.use('/api/cashPerforma',CashPerformRouter)
app.use('/api/cashClientPayment',CashClientPaymentRouter)
app.use('/api/cashMyInvoices',CashMyInvoicesRouter)
app.use('/api/cashLedger',CashLedgerRouter)
app.use('/api/order',MakeOrderRouter)
app.use('/api/sisorder',SisterOrderRouter)

/*searching all type of invoices*/
app.use('/api/invoices',myInvoicRouter);
app.use('/api',LogRouter)
 
 
