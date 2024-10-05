/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/

/* ***********************
 * Require Statements
 *************************/
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const env = require("dotenv").config();
const app = express();
const static = require("./routes/static");

/* ***********************
 * Middleware Setup
 *************************/
app.set("view engine", "ejs");  
app.use(expressLayouts);         
app.set("layout", "./layouts/layout"); // not at views root
         

/* ***********************
 * Routes
 *************************/
app.use("/", static);

// Index Route
app.get("/", (_, res) => {
  res.render("index", { title: "Home" });
});

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT || 3000; 
const host = process.env.HOST || "localhost"; 

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`App listening at http://${host}:${port}`); // Log server info
});
