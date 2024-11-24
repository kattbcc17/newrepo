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
  
module.exports = validate