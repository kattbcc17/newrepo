const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, _) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

/* ***************************
 *  Build vehicle detail view by vehicle ID
 * ************************** */
invCont.buildVehicleDetailView = async function (req, res, _) {
  const inv_id = req.params.invId;
  const data = await invModel.getVehicleById(inv_id);
  const grid = await utilities.buildVehicleDetailGrid(data)
  let nav = await utilities.getNav();
  res.render("./inventory/detail", {
    title: data[0].inv_make + " " + data[0].inv_model,
    nav,
    grid,
  })
}


module.exports = invCont