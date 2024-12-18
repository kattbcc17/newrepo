const invModel = require("../models/inventory-model")
const jwt = require("jsonwebtoken")
require("dotenv").config()
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = `<ul class="menu">`
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li class="carCard">'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

Util.buildCarDisplay  = async function(data) {
  let display;

  display = '<section class="carBlock">'
  display += '<div>'
  display += '<img class="carPicture" src=' + data.inv_image 
  +' alt="' + data.inv_make + ' ' + data.inv_model 
  +' on CSE Motors" />'
  display += '</div>'
  display += '<div class="CarDetails">'
  display += '<h3 class="carTitle">' + data.inv_year + '</h3>'
  let formattedprice =  Number(data.inv_price).toLocaleString("en-US")
  display += '<p class="price">Price: $' + formattedprice + '</p>'
  let formattedMiles = data.inv_miles.toLocaleString("en-US")
  display += '<p class="miles">Miles: ' + formattedMiles  + '</p>'
  display += '<p class="color">Color: ' + data.inv_color  + '</p>'
  display += '<p class ="description"> Description: ' + data.inv_description + '</p>'
  display += '</div>'
  display += '</section>'
  
  return display
}

Util. buildClassificationList = async function(classification_id) {
  let data = await invModel.getClassifications();
  // let className =''
  // for(item of data.rows){
  //   if(item.classification_id === classification_id){
  //     className = item.classification_name
  //   }
  // }
  let classificationList = `
    <select name="classification_id" id="classificationList">
      <option>Choose a Classification</option>
      ${data.rows.map(row => `
        <option value="${row.classification_id}" ${classification_id !== null && row.classification_id === classification_id ? "selected" : ""}>
          ${row.classification_name}
        </option>
      `).join('')}
    </select>
  `;
  return classificationList;
  
  // let data = await invModel.getClassifications();
  // let classificationList ='<select name="classification_id" id="classificationList">'
  // classificationList += "<option> Choose a Classification</option>"
  // data.row.forEach((row)=>{
  //   classificationList += '<option value="' + row.classification_id + '"'
  //   if(
  //     classification_id != null &&
  //     row.classification_id == classification_id
  //   ){
  //     classificationList += "selected"
  //   }
  //   classificationList += ">" + row.classification_name + "</option>"
  // })
  // classificationList += "</select>"
  // return classificationList
}

/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
   jwt.verify(
    req.cookies.jwt,
    process.env.ACCESS_TOKEN_SECRET,
    function (err, accountData) {
     if (err) {
      req.flash("Please log in")
      res.clearCookie("jwt")
      return res.redirect("/account/login")
     }
     res.locals.accountData = accountData
     res.locals.loggedin = 1
     next()
    })
  } else {
   next()
  }
 }

/* ****************************************
 *  Check Login
 * ************************************ */
Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
 }


module.exports = Util