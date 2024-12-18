const utilities = require("../utilities/")
const jwt = require('jsonwebtoken');
const baseController = {}

baseController.buildHome = async function(req, res){
  const nav = await utilities.getNav()
  res.render("index", 
  {title: "Home", 
  nav,
  })
}

module.exports = baseController