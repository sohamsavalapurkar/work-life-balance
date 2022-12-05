var express = require("express");
var router = express.Router();
const config = require("config");
var passport = require("passport");
var Account = require("../models/account");

var monk = require("monk");
var db = monk(config.get("mongoURI"));
var userDetails = db.get("userDetails");
var reviews = db.get("reviews")


/* GET home page. */
router.get("/", function (req, res) {
  res.render("index", {});
});

router.get("/work", function (req, res) {
  if (req.user) {
    console.log(req.user.username);
    userDetails.find(
      { username: req.user.username },
      function (err, userDetail) {
        if (err) throw error;
          res.render("work_update", {
            user: req.user,
            data: userDetail[0]
          });
      }
    );
  }
});

router.get("/life", function (req, res) {
  if (req.user) {
    console.log(req.user.username);
    userDetails.find(
      { username: req.user.username },
      function (err, userDetail) {
        if (err) throw error;
          res.render("life_updates", {
            user: req.user,
            data: userDetail[0]
          });
      }
    );
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

router.get("/reviews", function (req, res) {
  if (req.user) {
    console.log(req.user.username);
    userDetails.find(
      { username: req.user.username },
      function (err, userDetail) {
        if (err) throw error;
        reviews.find({username: req.user.username}, function(err, review) {
          console.log(review)
          review.reverse()
          if (err) throw err;
          res.render("reviews", {
            user: req.user,
            userDetails: userDetail[0],
            discussions: review
          });
        })
          
      });
  }
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
        reviews.find({}, function(err, review) {
          review.reverse()
          if (err) throw err;
          res.render("homepage", {
            user: req.user,
            userDetails: userDetail[0],
            discussions: review
          });
        })
          
      });
  }
});


router.post("/addReview", function(req, res){
    console.log(req.body)
    reviews.insert({
      Company : req.body.company,
      Answer : req.body.review,
      username : req.user.username
    }, function(err, account) {
        if (err) throw err;
        res.redirect('/homepage');
    });
});


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
            userDetails: userDetail[0]
          });
      }
    );
  }
});

router.put('/update_details/:id', function(req, res) {
		
		userDetails.update({_id : req.params.id},
			{ $set: {
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
			}}, function(err, details) {
				if (err) throw err;
				//if update is successful it will return update video object
				res.redirect('/homepage');
			  });
	
});
router.delete('/reviews/:id', function(req, res) {
	console.log("hello in delete")
  console.log(req.params.id)
  reviews.findOneAndDelete({_id: req.params.id}, function (err, docs) {
    if(err) console.log(err);
    res.redirect('/reviews')
    console.log("Successful deletion");
  });
 
});

router.post('/reviews/edit', function(req, res) {
  reviews.update({_id: req.body.id},
    { $set: {
      Company : req.body.company,
      Answer : req.body.review,
      username : req.user.username
    }}, function(err, details) {
      if (err) throw err;
      res.redirect('/reviews')
    });
  
});

router.get("/logout", function (req, res) {
  req.logout();
  res.redirect("/");
});

module.exports = router;
