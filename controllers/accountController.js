const utilities = require('../utilities/');
const accountModel = require('../models/account-model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

/* ****************************************
 *  Deliver login view
 * *************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav();
  res.render('account/login', {
    title: 'Login',
    nav,
    errors: null,
  });
}

/* ****************************************
 *  Deliver registration view
 * *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav();
  res.render('account/register', {
    title: 'Register',
    nav,
    errors: null,
  });
}

/* ****************************************
 *  Process Registration
 * *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav();
  const {
    account_firstname,
    account_lastname,
    account_email,
    account_password,
  } = req.body;

  // Hash the password before storing
  let hashedPassword;
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10);
  } catch (error) {
    req.flash(
      'notice',
      'Sorry, there was an error processing the registration.'
    );
    res.status(500).render('account/register', {
      title: 'Registration',
      nav,
      errors: null,
    });
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  );

  if (regResult) {
    req.flash(
      'notice',
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    );
    res.status(201).render('account/login', {
      title: 'Login',
      nav,
    });
  } else {
    req.flash('notice', 'Sorry, the registration failed.');
    res.status(501).render('account/register', {
      title: 'Registration',
      nav,
    });
  }
}

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav();
  const { account_email, account_password } = req.body;
  const accountData = await accountModel.getAccountByEmail(account_email);
  if (!accountData) {
    req.flash('notice', 'Please check your credentials and try again.');
    res.status(400).render('account/login', {
      title: 'Login',
      nav,
      errors: null,
      account_email,
    });
    return;
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password;
      const accessToken = jwt.sign(
        accountData,
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: 3600 * 1000 }
      );
      res.cookie('jwt', accessToken, { httpOnly: true, maxAge: 3600 * 1000 });
      return res.redirect('/account/');
    }
    else {
      req.flash('notice', 'Please check your credentials and try again.');
      res.status(400).render('account/login', {
        title: 'Login',
        nav,
        errors: null,
        account_email,
      });
      return;
    }
  } catch (error) {
    return new Error('Access Forbidden');
  }
}


/* ****************************************
 *  Process login request
 * ************************************ */
async function logout(req,res, next){
  
  delete res.locals.accountData
  res.clearCookie('jwt');
  
  req.flash("notice", "You have been logged out.")
  res.redirect('/')
}


/* ****************************************
*  Deliver account view
* *************************************** */
async function buildAccount(req, res, next) {
  let nav = await utilities.getNav()
  if(res.locals.loggedin == 1){
    res.render("account/account", {
      title: "Account Management",
      nav,
      errors: null,
    })
  }else{
    res.render("account/login", {
      title: "Login",
      nav,
      errors: null,
    })
  }
  
}

async function buildUpdate (req, res, next) {
  const account_id = res.locals.accountData.account_id
  let nav = await utilities.getNav()
  res.render('account/update',{
    title : 'Update Account',
    nav,
    errors: null,
  })
}

async function updateAccount (req, res, next) {
  let nav = await utilities.getNav()
  const account_id = res.locals.accountData.account_id
  const {
    account_firstname,
    account_lastname,
    account_email,
  } = req.body;
  console.log("here got it");
  const accountData = await accountModel.modelUpdateAccount(account_id, account_firstname, account_lastname, account_email)
  if (accountData) {
    req.flash(
      'notice',
      `The profile was updates successfully.`
    );

    //Update teh token
    const accessToken = jwt.sign(
      accountData,
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: 3600 * 1000 }
    );
    res.cookie('jwt', accessToken, { httpOnly: true, maxAge: 3600 * 1000 });
    // res.status(201).render('account/account', {
    //   title: 'Account Management',
    //   nav,
    // });
  
    res.status(201).redirect('/account/')
  }
  else {
    req.flash("notice", "Sorry, the Deletion failed.")
    res.status(501).render('account/update', {
      title: 'Update Account',
      nav,
    });
  }
}

async function updatePassword (req, res, next) {
  let nav = await utilities.getNav()
  const account_id = res.locals.accountData.account_id
  const account_password = req.body.account_password
  let hashedPassword;
  hashedPassword = await bcrypt.hashSync(account_password, 10);
  const updateResult = await accountModel.updatePassword(hashedPassword, account_id,)
  if(updateResult){
    req.flash(
      'notice',
      `The password was updated successfully.`
    );
    res.status(201).render('account/account', {
      title: 'Account Management',
      nav,
    });
  }

}

module.exports = { buildLogin, buildRegister, registerAccount, accountLogin, buildAccount, logout ,buildUpdate, updateAccount, updatePassword};
