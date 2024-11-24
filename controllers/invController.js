const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
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

invCont.buildByInvId = async function(req, res, next) {
  const inv_id = req.params.inv_id
  const data = await invModel.getCarByInvId(inv_id)
  let nav = await utilities.getNav()
  const carData = await utilities.buildCarDisplay(data[0])

  res.render('./inventory/detail',{
    title: data[0].inv_make + ' ' + data[0].inv_model,
    nav,
    carData,
  })
}

invCont.buildAdminView = async function(req, res, next){
  let nav = await utilities.getNav()
  let dropDown = await utilities.buildClassificationList();

  if(res.locals.accountData.account_type === 'Admin' || res.locals.accountData.account_type === 'Employee')
  {
  res.render('./inventory/management',{
    title: "Admin View",
    select: dropDown,
    nav,
    errors: null,  
  })
  }else{
    req.flash(
      "notice",
      `access no authorized.`
    )
    res.render('./account/account',{
      title: "Account Management",
      nav,
      errors: null,  
    })
  }
}

invCont.buildAddClassification = async function(req, res, next){
  let nav = await utilities.getNav()

  res.render('./inventory/addClassification',{
    title: "Add Classification",
    nav,
  })
}

/* ****************************************
*  Process Add classification
* *************************************** */
invCont.addClassification = async function(req, res) {
  let nav = await utilities.getNav()
  const { inventory_classification_id } = req.body
  const newClassification = await invModel.addClassification(inventory_classification_id)
  if(newClassification){
    req.flash(
      "notice",
      `Congratulations, you\'re added the category ${inventory_classification_id}.`
    )
    res.status(201).render("inventory/management", {
      title: "Management",
      nav,
    })
  }
  else{
    req.flash("notice", "Sorry, the process failed.")
    res.status(501).render("inventory/addClassification",{
      title: "Add Classification",
      nav,
      errors: null,
    })
  } 
}

invCont.buildAddInventory = async function(req, res, next){
  let nav = await utilities.getNav();
  let dropDown = await utilities.buildClassificationList();
  res.render('inventory/addInventory',{
    select: dropDown,
    title: "Add Vehicle",
    nav,
    errors: null,
  })
}

invCont.addInventory = async function(req, res) {
  
  let nav = await utilities.getNav()
  const {classification_id, inv_make, inv_model,  inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color} = req.body

  const invResult = await invModel.addInventory(inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id);

  if (invResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered a ${inv_make} ${inv_model}. Please log in.`
    )
    res.status(201).render("inventory/management", {
      title: "Management",
      nav,
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("inventory/addInventory", {
      title: "Add to Inventory",
      nav,
      errors: null,
    })
  }
}

module.exports = invCont;