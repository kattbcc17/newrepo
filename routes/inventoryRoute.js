// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invCont = require("../controllers/invController")

// Route to build inventory by classification view
router.get("/type/:classificationId", invCont.buildByClassificationId);

// Route to build a specific vehicle detail view by vehicle ID
router.get("/detail/:invId", invCont.buildVehicleDetailView);


module.exports = router;