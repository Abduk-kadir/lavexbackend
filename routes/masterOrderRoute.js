const express = require("express");
const SupplierOrder=require('../modals/supplierOrderModal')
const router = express.Router();
const PDFDocument = require("pdfkit");
const fs = require("fs");
const Company=require('../modals/companyModal')
const nodemailer = require("nodemailer");

// Create a transporter using Gmail SMTP
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",  // SMTP server address for Gmail
  port: 587,  // SMTP port (587 for TLS, 465 for SSL)
  secure: false,  // `true` for SSL, `false` for TLS
  auth: {
      user: "organic.lavex@gmail.com",
      pass: "qtrn rkjk ysuy oqaf"
  }
});


router.post("/makeSupplierOrder", async (req, res) => {
  try {
    let { item, email,dateCreated,name,address,companyname} = req.body;
    let company=await Company.findById(companyname)
    let order=new SupplierOrder(req.body)
              await  order.save()
    let doc = new PDFDocument();
    let filepath = "order.pdf";
    doc.pipe(fs.createWriteStream(filepath));
    const tableTop = 150;
    const col1 = 50; // Product column position
    const col2 = 400; // Quantity column position
    const col3 = 550; // Total Price column position
    doc.fontSize(12).text(`${name}`, col1, tableTop-95);
    doc.fontSize(10).text(`${address}`, col1, tableTop-75);
    doc.fontSize(10).text(`We have ordered for following items`, col1, tableTop-55);

    doc.fontSize(11).text(`Order Date ${dateCreated}`, col1, tableTop-25);
   
    doc
    .moveTo(50, tableTop - 10) // Draw line under headers
    .lineTo(600, tableTop -10)
    .stroke();

    doc.fontSize(10).text("Product", col1, tableTop);
    doc.text("Quantity", col2, tableTop);
    doc.text("Total Price", col3, tableTop);

    doc
      .moveTo(50, tableTop + 20) // Draw line under headers
      .lineTo(600, tableTop + 20)
      .stroke();
    let ypos=tableTop+30  
     item.forEach((item,index)=>{
      doc.text(item.name,col1,ypos)
      doc.text(item.quantity.toString(),col2,ypos)
      doc.text(item.quantity*item.price.toString(),col3,ypos)
      ypos=ypos+20
     })

     doc
     .moveTo(50, ypos + 10) // Draw line under headers
     .lineTo(600, ypos + 10)
     .stroke();
     doc.fontSize(12).text(`Billing address`,col1,ypos+20)
     doc.fontSize(10).text(`Company name - ${company.company}`,col1,ypos+35)
     doc.fontSize(10).text(`contact person  - ${company.contactPerson}`,col1,ypos+45)
     doc.fontSize(10).text(`mobile no - ${company.mobile1}  ${company.mobile1}`,col1,ypos+55)
     doc.fontSize(10).text(`area  - ${company.area}`,col1,ypos+65)
     doc.fontSize(10).text(`address - ${company.address}`,col1,ypos+75)
     doc.fontSize(10).text(`pincode - ${company.pincode}`,col1,ypos+85)
     doc.fontSize(10).text(`city - ${company.city}`,col1,ypos+95)
     doc.end();

     const mailOptions = {
      from: '"purchase.lavex.in" <organic.lavex@gmail.com>',   // Sender's email
      to: "ak8871639@gmail.com",    // Recipient's email
      subject: "New purchase order",
      text: "just to let you know we have placed an order for item which is in describe in attached file",
      attachments: [
        {
          filename: "order.pdf",
          path: filepath, // Attach the generated PDF
          contentType: "application/pdf"
        }
      ]
     };

     transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          res.send({
            message:error.message,
            success:false
          })
      } else {
        res.send({
          message:'email is sent to supplier',
          success:true
        })
          
      }
  });

    
   
  } catch (err) {
    res.send(err);
  }
});

module.exports = router;
