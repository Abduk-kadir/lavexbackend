const express = require("express");
const SisterOrder = require("express");
const router = express.Router();

router.get("/Orderbycompany/:companyname", async (req, res) => {
  try {
    let data = await SupplierOrder.findOne({
      companyname: req.params.companyname,
    });
    res.send({
      message: "data is successfully attached",
      success: true,
      data: data,
    });
  } catch (err) {
    res.send({
      message: "data is successfully attached",
      success: true,
      data: data,
    });
  }
});

router.post("/makeMasterOrder", async (req, res) => {
  try {
    let data = new SisterOrder(req.body);
    await data.save();
    res.send({
      message: "order is successfully send to master company",
      success: true,
    });
  } catch (err) {
    res.send({
      message: err.message,
      success: false,
    });
  }
});

module.exports = router;
