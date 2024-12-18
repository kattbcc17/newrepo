const express = require('express');
const router = new express.Router();
const accountController = require('../controllers/accountController');
const utilities = require('../utilities/');
const regValidate = require('../utilities/account-validation');

// Route to build login view
router.get('/login', utilities.handleErrors(accountController.buildLogin));

// Account routes
router.get(
  '/register',
  utilities.handleErrors(accountController.buildRegister)
);

// Process the registration data
router.post(
  '/register',
  regValidate.registationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
);

// Process the login attempt
router.post(
  '/login',
  // regValidate.loginRules(),
  // regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
);

// Process the logout attempt
router.get('/logout', utilities.handleErrors(accountController.logout));

// Route to build account view
router.get("/", utilities.handleErrors(accountController.buildAccount))
router.get("/update", utilities.handleErrors(accountController.buildUpdate))

router.post("/updateAccount", 
regValidate.updateAccountRules(),
regValidate.checkUpdateData,
utilities.handleErrors(accountController.updateAccount))


router.post("/updatePassword", 
regValidate.updatePasswordRules(),
regValidate.checkUpdatePassword,
utilities.handleErrors(accountController.updatePassword))




module.exports = router;
