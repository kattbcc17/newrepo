/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/

/* ***********************
 * Require Statements
 *************************/
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const dotenv = require("dotenv").config();
const app = express();
const staticRoutes = require("./routes/static");

/* ***********************
 * Middleware Setup
 *************************/
app.set("view engine", "ejs");  // Set EJS as the templating engine
app.use(expressLayouts);         // Use EJS layouts
app.set("layout", "./layouts/layout"); // Set the layout file
app.use(staticRoutes);           // Use static routes

// Index route
app.get("/", (req, res) => {
  res.render("index", { title: "Home" }); // Render index page with title
});

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT || 3000; // Default to port 3000 if not specified
const host = process.env.HOST || "localhost"; // Default host

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`App listening at http://${host}:${port}`); // Log server info
});
