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

router.get("/addInventory", invController.buildAddInventory)
router.post("/addInventory", 
inventoryValidate.inventoryRules(),
inventoryValidate.checkInventoryData,
utilities.handleErrors(invController.addInventory))
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))
router.get("/edit/:inv_id", utilities.handleErrors(invController.editInventoryView))

router.post("/update/", 
inventoryValidate.inventoryRules(),
inventoryValidate.checkUpdateData,
invController.updateInventory)

router.get("/delete/:inv_id", utilities.handleErrors(invController.buildDeleteInventory))
router.post("/delete/", utilities.handleErrors(invController.deleteInventory))


module.exports = router;