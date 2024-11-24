// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const inventoryValidate = require('../utilities/inventory-validation')


// Route to build inventory by classification view
router.get("/")
router.get("/type/:classificationId", invController.buildByClassificationId);
router.get("/detail/:inv_id", invController.buildByInvId)
router.get("/",utilities.handleErrors(invController.buildAdminView))
router.get("/addClassification", utilities.handleErrors(invController.buildAddClassification))

router.post("/addClassification",
inventoryValidate.classificationRules(),
inventoryValidate.checkClassificationData,
utilities.handleErrors(invController.addClassification))

router.get("/add-inventory", invController.buildAddInventory)
router.post("/add-inventory", utilities.handleErrors(invController.addInventory))


module.exports = router;