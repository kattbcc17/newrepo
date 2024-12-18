const utilities = require(".")
const inventoryModel = require("../models/inventory-model")
const { body, validationResult } = require("express-validator")
const validate = {}

/*  **********************************
 *  Add classification data Validation Rules
 * ********************************* */
validate.classificationRules = () => {
    return [
      // firstName is required and must be string
      body("inventory_classification_id")
        .trim()
        .isLength({ min: 3 })
        .withMessage("Please provide a name with at least 3 characters."), // on error this message is sent.
    ]
  }

/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
  validate.checkClassificationData = async (req, res, next) => {
    const {inventory_classification_id} = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      res.render("inventory/addClassification", {
        errors,
        title: "Add Classification",
        nav,
        inventory_classification_id
      })
      return
    }
    next()
  }
  
  validate.inventoryRules = () => {
    return [
    
        body("inv_make")
        .trim()
        .isLength({ min: 3 })
        .withMessage("Make must be at least 3 characters."),

        body("inv_model")
        .trim()
        .isLength({ min: 3 })
        .withMessage("Model must be at least 3 characters."),

        body("inv_description")
        .trim()
        .isLength({ min: 10 })
        .withMessage("Description must be at least 10 characters."),

        // body("inv_image")
        // .trim()
        // .isLength({ min: 10 })
        // .withMessage("Image path must be provided.")
        // .custom((value, { req }) => {
        //   // Check if the image path ends with the specified extensions
        //   const validExtensions = [".jpg", ".jpeg", ".png", ".webp"];
        //   if (!validExtensions.some(ext => value.toLowerCase().endsWith(ext))) {
        //     throw new Error("Invalid image file format.");
        //   }
        //   return true;
        // }),

        // body("inv_thumbnail")
        // .trim()
        // .isLength({ min: 10 })
        // .withMessage("Image path must be provided.")
        // .custom((value, { req }) => {
        //   // Check if the image path ends with the specified extensions
        //   const validExtensions = [".jpg", ".jpeg", ".png", ".webp"];
        //   if (!validExtensions.some(ext => value.toLowerCase().endsWith(ext))) {
        //     throw new Error("Invalid image file format.");
        //   }
        //   return true;
        // }),

        body("inv_price")
        .trim()
        .isNumeric()
        .withMessage("Price must be a number."),

        body("inv_year")
        .trim()
        .isInt({min: 1000, max: 9999})
        .withMessage("Year must be a 4 digit number."),

        body("inv_miles")
        .trim()
        .isNumeric()
        .withMessage("miles must be a number."),

        body("inv_color")
        .trim()
        .isLength({ min: 3 })
        .withMessage("Model must be at least 3 characters."),      
    ];
      
  }

/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
  validate.checkInventoryData = async (req, res, next) => {
    const {classification_id, inv_make, inv_model,  inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color} = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      let select = await utilities.buildClassificationList(classification_id)
      res.render("inventory/addInventory", {
        errors,
        title: "Add New Car",
        nav,
        select,
        classification_id,
        inv_make,
        inv_model,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_year,
        inv_miles,
        inv_color,
      })
      return
    }
    next()
  }


/* ******************************
 * Check data and return errors to edit view or continue to update car
 * ***************************** */
validate.checkUpdateData = async (req, res, next) => {
  const {inv_id, classification_id, inv_make, inv_model,  inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color} = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    let classification = parseInt(classification_id)
    let dropDown = await utilities.buildClassificationList(classification)
    res.render("inventory/editInventory", {
      errors,
      title: "Edit" + inv_make + " " + inv_model,
      nav,
      select:dropDown,
      classification_id,
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      inv_id,
    })
    return
  }
  next()
}
module.exports = validate




