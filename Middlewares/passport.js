
    let express = require('express');
    let router = express.Router();
    let path = require('path');

    router.use(express.static(path.join(__dirname,'../public')));

    let passport = require('passport')
    let GitHubStrategy = require('passport-github').Strategy;

    let user = require('../Models/user');

    router.use(passport.initialize());
    router.use(passport.session());

    passport.serializeUser(function(user,done){
        done(null,user);
    });

    passport.deserializeUser(function(user,done){
        done(null,user);
    });

    passport.use(
          new GitHubStrategy({
          clientID: `${process.env.clientID}`,
          clientSecret: `${process.env.clientSecret}`,
          callbackURL: "/auth/github/callback",
          session:true
          },function(accessToken, refreshToken, profile, cb) {
              console.log('###############################');
              console.log('passport callback function fired');
              console.log("-----------profile ka khtm---------------");
              return cb(null,profile);

          })
      );

      router.get('/github',passport.authenticate('github'));

      router.get('/github/callback',passport.authenticate('github', { failureRedirect: 'login.html' }), function (req, res)
      {
          console.log("githubsignin succesful");
          user.find({
            githubid : req.session.passport.user._json.id
          })
          .then(data =>
          {
            if(data.length>0)
            {
              console.log("-----------MIL GEYA---------");
              console.log(data);
              req.session.isLogin = 1;
              var obj = Object();
              obj.isLogin = 1;
              obj.username = data[0].username ;
              obj.city=data[0].city;
              obj.role=data[0].role;
              obj.name=data[0].name;
              obj.status=data[0].status;
              obj.state=data[0].state;
              obj.githubid = data[0].githubid;
              obj.photoname= data[0].photoname;
              if(data[0].gender)
              {
                obj.gender = data[0].gender;
                obj.phone = data[0].phone;
                obj.dob = data[0].dob;
              }
              obj._id=data[0]._id;
              req.session.data=obj;
              console.log('github login successful')
              res.redirect('/home');
            }
            else
            {
              console.log("nahi MILA");
              var obj = {
              name : req.session.passport.user._json.name,
              username : req.session.passport.user._json.email,
              city : req.session.passport.user._json.location,
              status : "pending",
              role : "user",
              githubid : req.session.passport.user._json.id,
              photoname : "/dp.png",
              state : "active",
              }
              user.create(obj,function(error,result)
              {
                if(error)
                throw error;
                else {
                  req.session.data = obj;
                  user.find({
                      githubid : req.session.passport.user._json.id
                  })
                  .then(data =>
                  {
                    console.log("see the result " + result);
                    req.session.data._id = data[0]._id;
                    req.session.isLogin = 1;
                    res.redirect('/home');
                  })
                  .catch(err =>
                  {
                    throw err;
                  })
                }
              })
            }
          })
          .catch(err =>
          {
            res.send(err)
          })
      })

      module.exports = router;