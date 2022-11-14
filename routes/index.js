var express = require("express");
var router = express.Router();
const config = require("config");
var passport = require("passport");
var Account = require("../models/account");

var monk = require("monk");
var db = monk(config.get("mongoURI"));
var userDetails = db.get("userDetails");

//var accountDetails = db.get('accountDetails');
var discussions = [
  "BAC is very good company",
  "Must work at GAC",
  "HKI Company has good balance but my team is very bad",
  "FHD has horrible WFL",
  "OPJ is a great place to work for",
];
//var cart = db.get('cart');
//var orderedItems = db.get('orderedItems');
const fs = require("fs");

/* GET home page. */
router.get("/", function (req, res) {
  res.render("index", {});
});

router.get("/work", function(req, res) {
  if(req.user) {
    res.render("work", {user:req.user});
  }
});

router.get("/signup", function (req, res) {
  res.render("signup", {});
});

router.post("/work", function (req, res) {
  res.render("work", { data: req.body });
});

router.post("/life", function (req, res) {
  res.render("life", { data: req.body });
});
router.get("/forgot", function (req, res) {
  res.render("forgot", {});
});

router.post("/insertData", function (req, res) {
  Account.register(
    new Account({ username: req.body.username }),
    req.body.password,
    function (err, account) {
      if (err) {
        return res.render("work", { account: account });
      }
      userDetails.insert(
        {
          username: req.body.username,
          name: req.body.name,
          profession: req.body.profession,
          screentime: req.body.screentime,
          familydetails: req.body.familydetails,
          leisuretime: req.body.leisuretime,
          kids: req.body.kids,
          sleeptime: req.body.sleeptime,
          hobbies: req.body.hobbies,
          comments_life: req.body.comments_life,
          company: req.body.company,
          breaktime: req.body.breaktime,
          position: req.body.position,
          worktime: req.body.worktime,
          techs: req.body.techs,
          comments_works: req.body.comments_works,
        },
        function (err, account) {
          passport.authenticate("local")(req, res, function () {
            res.redirect("/homepage");
          });
        }
      )
    }
  );
});

router.get("/homepage", function (req, res) {
  if (req.user) {
    console.log(req.user.username);
    userDetails.find(
      { username: req.user.username },
      function (err, userDetail) {
        if (err) throw error;
        fs.readFile("routes/discussions.json", (err, data) => {
          if (err) throw err;
          let discussions = JSON.parse(data);
          console.log(discussions);
          console.log(userDetail[0]);
          res.render("homepage", {
            user: req.user,
            userDetails: userDetail[0],
            discussions: discussions,
          });
        });
      }
    );
  }
});

router.post("/signup", function (req, res) {});

// router.post('/login', passport.authenticate('local', {
//   successRedirect: '/homepage',
//   failureRedirect: '/', // see text
//   failureFlash: true // optional, see text as well
// }));
router.post("/login", passport.authenticate("local"), function (req, res) {
  res.redirect("/homepage");
});
router.get("/planner", function (req, res) {
  if (req.user) {
    console.log(req.user.username);
    userDetails.find(
      { username: req.user.username },
      function (err, userDetail) {
        if (err) throw error;
          res.render("planner", {
            user: req.user,
            userDetails: userDetail[0],
            discussions: discussions,
          });
      }
    );
  }
});
router.get("/logout", function (req, res) {
  req.logout();
  res.redirect("/");
});

module.exports = router;
