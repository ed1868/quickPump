// AUTH.JS CONFIG
const express = require("express");
const bcrypt = require("bcrypt");
const path = require("path");

const bcryptSalt = 10;
const passportRouter = express.Router();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const nodemailer = require("nodemailer");
const ensureLogin = require("connect-ensure-login");
const User = require("../models/User");
const uploadCloud = require("../public/javascripts/cloudinary");

const router = express.Router();
let confirmationUrl;

const login = (req, user) =>
  new Promise((resolve, reject) => {
    req.login(user, err => {
      console.log(user);
      if (err) {
        reject(new Error("Something went wrong"));
      } else {
        resolve(user);
      }
    });
  });

// NODEMAILER TRANSPORTER

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },

});

/////////////////////////////////////////////// USER PROFILE ROUTE////////////////////////////////////////////////////////////////////

router.get("/user-profile", ensureLogin.ensureLoggedIn(), (req, res) => {
  const userID = req.user.id;
  const username = req.user.username;

  console.log("CURRENT USER ID - ", userID);
  console.log("CURRENT USERNAME - ", username);
  User.find({}).then(users => {
    // res.render('auth/userProfile', {
    //   users,  userId : req.user.id, username : req.user.username,
    // });
  });
});

// USER EDIT ROUTES

router.get(
  "/user-profile/:id/edit",
  ensureLogin.ensureLoggedIn(),
  (req, res) => {
    const id = req.params;
    const userID = req.user.id;
    res.render("auth/userEdit", { id: req.params });
  }
);

// router.post('/user-profile', [ensureLogin.ensureLoggedIn(), uploadCloud.single('url')], (req, res) => {
//   const username = req.body.username;
//   const imgName   = req.body.imgName;
//   const url       = req.file ? req.file.url : '';

//   User.findByIdAndUpdate(req.user.id, { username : req.body.username, imgName: req.body.imgName, url:url.replace(' ', '') }).then((user) => {
//     res.redirect('/auth/user-profile');
//   });
// });

///////////////////////////////////////////////LOGIN ROUTE FOR BACK END ///////////////////////////////////////////

router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.json({ message: "Unautharized " });
    }
    req.logIn(user, err => {
      if (err) {
        return res.status(500).json({ message: "Error login" });
      }
      return res.status(200).json(user);
    });
  })(req, res, next);
});

///////////////////////////////////////////////// USER SIGN UP ROUTES WITH EMAIL CONFIRMATION////////////////////////////////////////////
router.post("/signup", (req, res, next) => {
  if (!req.body) {
    res.redirect("/signup");
  }

  const characters =
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let token = "";
  for (let i = 0; i < 25; i++) {
    token += characters[Math.floor(Math.random() * characters.length)];
  }

  const { username, password, email } = req.body;

  const confirmationCode = token;

  if (username === "" || password === "") {
    res.render("auth/signup", { message: "Indicate username and password" });
    return;
  }

  User.findOne({ username }, "username", (err, user) => {

    if (user !== null) {
      console.log('THAT USERNAME ALREADY EXISTS');
      res.render("auth/signup", { message: "The username already exists" });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = new User({
      username,
      password: hashPass,
      email,
      confirmationCode
    });
    confirmationUrl = `http://localhost:3000/auth/confirm/${confirmationCode}`;
    newUser
      .save()
      .then(user => {
        console.log(user);
        transporter.sendMail({
          from: '"Quick Pump Wants You To Confirm Your Email" <myawesome@project.com>',
          to: email,
          subject: 'Email Confirmation',
          text: 'Go to this link to confirm',
          html: `<!doctype html><html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office"><head><title></title><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta http-equiv="Content-Type" content="text/html; charset=UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style type="text/css">#outlook a{padding:0;}.ReadMsgBody{width:100%;}.ExternalClass{width:100%;}.ExternalClass *{line-height:100%;}body{margin:0;padding:0;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;}table, td{border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;}img{border:0;height:auto;line-height:100%; outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;}p{display:block;margin:13px 0;}</style><style type="text/css">@media only screen and (max-width:480px){@-ms-viewport{width:320px;}@viewport{width:320px;}}</style><!--[if mso]> <xml> <o:OfficeDocumentSettings> <o:AllowPNG/> <o:PixelsPerInch>96</o:PixelsPerInch> </o:OfficeDocumentSettings> </xml><![endif]--><!--[if lte mso 11]> <style type="text/css"> .outlook-group-fix{width:100% !important;}</style><![endif]--><link href="https://fonts.googleapis.com/css?family=Ubuntu:300,400,500,700" rel="stylesheet" type="text/css"><style type="text/css">@import url(https://fonts.googleapis.com/css?family=Ubuntu:300,400,500,700);</style><style type="text/css">@media only screen and (min-width:480px){.mj-column-per-66{width:66.66666666666666% !important; max-width: 66.66666666666666%;}.mj-column-per-33{width:33.33333333333333% !important; max-width: 33.33333333333333%;}.mj-column-per-100{width:100% !important; max-width: 100%;}}</style><style type="text/css">@media only screen and (max-width:480px){table.full-width-mobile{width: 100% !important;}td.full-width-mobile{width: auto !important;}}</style></head><body style="background-color:#d6dde5;"><div style="background-color:#d6dde5;"><div style="Margin:0px auto;max-width:600px;"><table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;"><tbody><tr><td style="direction:ltr;font-size:0px;padding:20px 0;padding-bottom:20px;padding-top:20;text-align:center;vertical-align:top;"><div class="mj-column-per-66 outlook-group-fix" style="font-size:13px;text-align:left;direction:ltr;display:inline-block;vertical-align:middle;width:100%;"><table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:middle;" width="100%"><tr><td align="left" style="font-size:0px;padding:10px 25px;padding-top:0;padding-right:25px;padding-bottom:0px;padding-left:25px;word-break:break-word;"><div style="font-family:Ubuntu, Helvetica, Arial, sans-serif, Helvetica, Arial, sans-serif;font-size:11px;line-height:1;text-align:left;color:#000000;"><span style="font-size: 11px">BabyMap Email Confirmation</span></div></td></tr></table></div><div class="mj-column-per-33 outlook-group-fix" style="font-size:13px;text-align:left;direction:ltr;display:inline-block;vertical-align:middle;width:100%;"><table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:middle;" width="100%"><tr><td align="right" style="font-size:0px;padding:10px 25px;padding-top:0;padding-right:25px;padding-bottom:0px;padding-left:25px;word-break:break-word;"><div style="font-family:Ubuntu, Helvetica, Arial, sans-serif, Helvetica, Arial, sans-serif;font-size:11px;line-height:1;text-align:right;color:#000000;"><span style="font-size: 11px"><a href="https://mjml.io" style="text-decoration: none; color: inherit;">Eduardo | Sergio</a></span></div></td></tr></table></div></td></tr></tbody></table></div><div style="background:#ffffff;background-color:#ffffff;Margin:0px auto;max-width:600px;"><table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#ffffff;background-color:#ffffff;width:100%;"><tbody><tr><td style="direction:ltr;font-size:0px;padding:20px 0;padding-bottom:20px;padding-top:20;text-align:center;vertical-align:top;"><div class="mj-column-per-100 outlook-group-fix" style="font-size:13px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;"><table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%"><tr><td align="center" style="font-size:0px;padding:10px 25px;padding-top:0;padding-right:0px;padding-bottom:0px;padding-left:0px;word-break:break-word;"><table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;border-spacing:0px;"><tbody><tr><td style="width:182px;"><a href="https://mjml.io" target="_blank"><img alt="Amario logo" height="auto" src="https://66.media.tumblr.com/c3ac478be4b883b31877fcb89dfc6543/tumblr_piuouhQf3a1vp5j01o1_1280.jpg" style="border:none;display:block;outline:none;text-decoration:none;height:auto;width:100%;" width="182"></a></td></tr></tbody></table></td></tr></table></div></td></tr></tbody></table></div><div style="background:#ffffff url(http://191n.mj.am/img/191n/3s/xm6.jpg) top center / auto repeat;Margin:0px auto;max-width:600px;"><div style="line-height:0;font-size:0;"><table align="center" background="http://191n.mj.am/img/191n/3s/xm6.jpg" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#ffffff url(http://191n.mj.am/img/191n/3s/xm6.jpg) top center / auto repeat;width:100%;"><tbody><tr><td style="direction:ltr;font-size:0px;padding:20px 0;padding-bottom:27px;padding-top:0;text-align:center;vertical-align:top;"><div class="mj-column-per-100 outlook-group-fix" style="font-size:13px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;"><table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%"><tr><td align="center" style="font-size:0px;padding:10px 25px;padding-top:0;padding-right:25px;padding-bottom:0px;padding-left:25px;word-break:break-word;"><div style="font-family:Ubuntu, Helvetica, Arial, sans-serif, Helvetica, Arial, sans-serif;font-size:13px;line-height:1;text-align:center;color:#000000;"><p><span style="font-size: 16px;"><a href="https://mjml.io" style="text-decoration: none; color: inherit;"><span style="font-weight: bold;"><span style="color: rgb(255, 255, 255);">Home</span></span> </a><span style="font-weight: bold;"><span style="color: rgb(255, 255, 255);">/ </span></span><a href="https://mjml.io" style="text-decoration: none; color: inherit;"><span style="font-weight: bold;"><span style="color: rgb(255, 255, 255);">Login</span></span></a></span></p><p><span style="font-weight: bold;"><span style="color: rgb(255, 255, 255);"><span style="font-size: 16px;"><br></span></span></span></p><p><span style="font-size: 27px;"><a href=${confirmationUrl} style="text-decoration: none; color: inherit;"><span style="font-weight: bold;"><span style="color: rgb(255, 255, 255);">Confirm Email</span></span></a></span></p><p><span style="font-weight: bold;"><span style="color: rgb(255, 255, 255);"><span style="font-size: 27px;">Helping Parents Find Establishments That will Accomodate their babys Needs</span></span></span></p></div></td></tr></table></div></td></tr></tbody></table></div></div></div></body></html>`,
        })
          .then(info => res.redirect('/'))
          .catch(error => console.log(error));
      })
      .catch(err => {
        console.log(err);
      });
  });
});

router.get("/confirm/:confirmCode", (req, res) => {
  const { confirmCode } = req.params;
  console.log('THE USER CONFIRMATION CODE IS -----',confirmCode);
  User.findOneAndUpdate(
    { confirmationCode: confirmCode },
    { status: "Active" },
    { new: true }
  )
    .then(user => {
      console.log(user);
      res.redirect("https://www.youtube.com/watch?v=Wt88GMJmVk0");
    })
    .catch(err => {
      console.log(err);
    });
});

//////////////////////////////////////////////////////USER LOG OUT ROUTE//////////////////////////////////////////
router.get("/logout", (req, res) => {
  req.logout();
  res.status(200).json({ message: "You Logged Out Sucessfully" });
});

module.exports = router;
