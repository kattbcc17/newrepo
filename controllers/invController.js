const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const myCookie = req.cookies.sessionId;
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

  res.render('./inventory/carSingleView',{
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

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

/* ***************************
 *  builtEdit inventory view 
 * ************************** */
invCont.buildEditInventory = async function(req, res, next){
  let nav = await utilities.getNav();
  let dropDown = await utilities.buildClassificationList();
  res.render('inventory/addInventory',{
    select: dropDown,
    title: "Add Vehicle",
    nav,
    errors: null,
  })
}


/* ***************************
 *  Build edit inventory view
 * ************************** */
invCont.editInventoryView = async function(req, res, next){
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav();
  const carInfo = await invModel.getCarByInvId(inv_id)
  const itemData = carInfo[0]
  console.log(itemData.classification_id)
  let dropDown = await utilities.buildClassificationList(itemData.classification_id);
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  res.render('inventory/editInventory',{
    title: "Edit " + itemName,
    select: dropDown,
    nav,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id
  })
}

/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  let classifications = await invModel.getClassifications()
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body
  const updateResult = await invModel.updateInventory(
    inv_id,  
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  )
  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash("notice", `The ${itemName} was successfully updated.`)
    res.redirect("/inv/")
  } else {
    const classificationSelect = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("inventory/editInventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
    })
  }
}

/* ***************************
 *  Deliver view to confirm delete
 * ************************** */
invCont.buildDeleteInventory = async function(req, res, next){
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav();
  const carInfo = await invModel.getCarByInvId(inv_id)
  const itemData = carInfo[0]
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  res.render('inventory/deleteConfirm',{
    title: "Delete " + itemName,
    nav,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_price: itemData.inv_price,
  })
}


/* ***************************
 *  Delete Inventory Data
 * ************************** */
invCont.deleteInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body
  const updateResult = await invModel.deleteInventoryItem(inv_id,)

  if (updateResult) {
    req.flash("notice", `The item was successfully deleted.`)
    res.redirect("/inv/")
  } else {
    const classificationSelect = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the Deletion failed.")
    res.status(501).render("inventory/deleteConfirm", {
    title: "Delete " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
    })
  }
}

module.exports = invCont;