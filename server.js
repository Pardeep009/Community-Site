
    var express = require('express')
    var path = require('path')
    var app = express()
    var ejs = require('ejs')
    var session = require('express-session')
    var nodemailer = require('nodemailer');
    var multer = require('multer');
    var passport = require('passport')
    var GitHubStrategy = require('passport-github').Strategy;

    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'ejs');

    app.use(express.static(path.join(__dirname,'public')));
    app.use(express.static(path.join(__dirname,'public/uploadimages')));

    app.use(express.urlencoded({extended: true}));
    app.use(express.json());

    app.use(session({
      secret: "xYzUCAchitkara",
      resave: false,
       saveUnintialized: true,
    }))

    var mongoose = require('mongoose');
    // var schema = mongoose.Schema;
    var admindb = 'mongodb://localhost/cq';

    mongoose.connect(admindb);

    mongoose.connection.on('error',(err) => {
      console.log('DB connection Error');
    })

    mongoose.connection.on('connected',(err) => {
       useNewUrlParser: true;
      console.log('DB connected');
    })

    var comment = require('./Models/comment');
    var user = require('./Models/user');
    var tag = require('./Models/tag');
    var discussion = require('./Models/discussion');
    var reply = require('./Models/reply');
    var community = require('./Models/community');

    app.use('/community',require('./Routes/community.js'));

    app.use('/admin',require('./Routes/admin.js'));

    // app.use('/',function(req,res,next)
    // {
    //   console.log("helllooooo");
    //     next();
    // })

    var GitHubStrategy = require('passport-github').Strategy;

    app.use(passport.initialize());
    app.use(passport.session());

    passport.serializeUser(function(user,done){
        done(null,user);
    });

    passport.deserializeUser(function(user,done){
        done(null,user);
    });

    passport.use(
          new GitHubStrategy({
          clientID: '366d49e5304204821b3a',
          clientSecret: '8eafc74d1555fd43704a612247364da74ff4632e',
          callbackURL: "/auth/github/callback",
          session:true
          },function(accessToken, refreshToken, profile, cb) {
              console.log('###############################');
              console.log('passport callback function fired');
              // console.log(profile);
              console.log("-----------profile ka khtm---------------");
              return cb(null,profile);

          })
      );

    app.get('/auth/github',passport.authenticate('github'));

    app.get('/auth/github/callback',passport.authenticate('github', { failureRedirect: 'login.html' }), function (req, res)
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
              req.session.islogin = 1;
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
              console.log(obj)
              console.log("------------added--------------");
              res.redirect('/home');
            }
            else
            {
              console.log("nahi MILA==-===-0=-0-=0786789809");
              var obj = {
              name : req.session.passport.user._json.name,
              username : req.session.passport.user._json.email,
              city : req.session.passport.user._json.location,
              status : "pending",
              role : "user",
              githubid : req.session.passport.user._json.id,
              photoname : "dp.png",
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
                    req.session.data._id = data[0]._id;
                  })
                  .catch(err =>
                  {
                    throw err;
                  })
                  res.redirect('/home');
                }
              })
            }
          })
          .catch(err =>
          {
            res.send(err)
          })
      })

    var photoname ;

    var storage = multer.diskStorage({
      destination : './public/uploadimages/',
      filename : function(req, file, callback)
      {
        photoname='/' + file.fieldname + '-' + Date.now() + '@' +path.extname(file.originalname)
        callback(null,photoname);
      }
    })

    var upload = multer({
      storage : storage,
      // limits : {
      //   fileSize : 100000
      // }
    }).single('myImage');

    function getMonths(monthno)
    {
      var month=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
      return month[monthno];
    }

    function getTime()
    {
      var time = new Date()
      var min = time.getMinutes();
      var hrs = time.getHours();
      var format ;
      if(hrs>12)
      {
        hrs = 24-hrs;
        format = 'PM';
      }
      else {
        format = 'AM';
      }
      time = hrs + ':' + min + ' ' + format ;
      console.log(time);
      return time;
    }

    function sendmail(obj)
    {
        var transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: 'yourmail@gmail.com',
            pass: 'yourmailpassword'
          }
        });

        var mailOptions = {
          from: 'yourmail@gmail.com',
          to: obj.username,
          subject: obj.subject,
          html: obj.text
        };

        transporter.sendMail(mailOptions, function(error, info){
          if (error) {
            console.log(error);
          } else {
            console.log('Email sent: ' + info.res);
          }
        });
    }

    app.get('/',function(req,res)
    {
      if(req.session.isLogin)
      {
        res.redirect('/home');
      }
      else {
        res.render('login');
      }
    })

    app.post('/login',function (req,res)
    {

        user.find({
          username: req.body.username,
          password: req.body.password
        })
        .then(data =>
          {
            if(data.length>0)
            {
                 if(req.session.isLogin)
                 {
                   // console.log("Thankyou");
                   res.render(home);
                 }
                 else
                 {
                 // console.log("----------------================="+data[0]);
                   if(data[0].state =="notactive")
                   {
                     res.send("0000");
                   }
                   else
                   {
                     req.session.isLogin = 1;
                     var obj = Object();
                     obj = data[0]
                     req.session.data = obj;
                     // obj.isLogin = 1;
                     // obj.username = data[0].username ;
                     // obj.password = data[0].password;
                     // obj.dob = data[0].dob;
                     // obj.city=data[0].city;
                     // obj.gender=data[0].gender;
                     // obj.phone=data[0].phone;
                     // obj.role=data[0].role;
                     // obj.name=data[0].name;
                     // obj.status=data[0].status;
                     // obj.state=data[0].state;
                     // obj._id=data[0]._id;
                     // obj.switch = data[0].switch;
                     // obj.photoname = data[0].photoname;
                     // console.log(obj);
                     // req.session.data = obj;
                     res.send(data)
                   }
            }
          }
            else
            {
              res.send("0");
            }
        })
        .catch(err => {
          res.send(err)
        })
    })

    app.get('/notactive',logger,function(req,res)
    {
        res.render('notactive');
    })

    app.get('/home',logger,function(req,res)
    {
        //console.log(req.session.data);
        if(req.session.data.status == 'pending')
        {
          res.render('updatefirst',{obj : req.session.data})
        }
        else
        {
            if(req.session.data.role=='admin')
            {
               if(req.session.data.switch=='user') {
                res.redirect('/community/communitypanel');
               }
               else {
                res.render('profile',{obj : req.session.data});
              }
            }
            else if(req.session.data.role=='communitybuilder')
            {
              // console.log("hye---------------");
              res.redirect('/community/communitypanel');
            }
            else if(req.session.data.role=='user') {
              res.render('userprofile',{obj : req.session.data});
            }
            else {
              res.send("No Page For U");
            }
        }
    })

    app.get('/profile',logger,function(req,res)
    {
      res.render('profile',{ obj : req.session.data });
        // if(req.session.data.role=='admin')
        // {
        //   if(req.session.data.switch=='admin')
        //   {
        //     res.render('profile',{ obj : req.session.data });
        //   }
        //   else {
        //       res.render('switcheditpage',{obj : req.session.data})
        //   }
        // }
        // else if(req.session.data.role=='communitybuilder') {
        //   res.render('buildereditpage',{ obj : req.session.data })
        // }
        // else {
        //   res.render('userprofile',{ obj : req.session.data })
        // }
    })

    app.get('/editpage',logger,function(req,res)
    {
      res.render('editpage', { obj : req.session.data });
      // if(req.session.data.switch=="admin")
      //   res.render('editpage', { obj : req.session.data });
      //   else {
      //     res.render('switcheditpage', { obj : req.session.data });
      //   }
    })

    app.get('/editinfo',logger,function(req,res)
    {
      if(req.session.data.role=='admin')
      {
           if(req.session.data.switch=="admin")
           res.render('editinfo' , { obj : req.session.data } );
           else {
            res.render('switcheditinfo' , { obj : req.session.data } );
          }
      }
      else if(req.session.data.role=='communitybuilder')
      {
        res.render('buildereditinfo', { obj : req.session.data });
      }
      else {
        res.render('usereditinfo' , { obj : req.session.data } );
      }
    })

    app.get('/viewprofile/:pro',logger,function(req,res)
    {
      var id = req.params.pro;
      user.findOne({ "_id" : id },function(error,result)
      {
          if(error)
          throw error;
          else {
            res.render('view_profile',{ obj : req.session.data , commo : result });
            // if(req.session.data.role=='admin')
            // {
            //   res.render('switch_view_profile',{ obj : req.session.data , commo : result });
            // }
            // else {
            //   res.render('builder_view_profile',{ obj : req.session.data , commo : result });
            // }
          }
      })
    })

    app.post('/adduser',function(req,res)
    {
        //console.log(req.body);
        var obj = req.body;
        obj.status='pending'
        // if(obj.role=='admin')
        // obj.switch="admin";
        // else {
        //   obj.switch='user'
        // }
        user.create(obj,function(error,result)
        {
            if(error)
            throw err;
            else
            {
                console.log(result);

                var transporter = nodemailer.createTransport({
                  service: 'gmail',
                  auth: {
                    user: 'yourmail@gmail.com',
                    pass: 'yourpassword'
                  }
                });

                var mailOptions = {
                  from: 'yourmail@gmail.com',
                  to: req.body.username,
                  subject: 'Welcome To CQ',
                  text: "Your Username is: " + req.body.username + "\n" + " Password is: " + req.body.password
                };

                transporter.sendMail(mailOptions, function(error, info){
                  if (error) {
                    console.log(error);
                  } else {
                    console.log('Email sent: ' + info.res);
                  }
                });
            }
        })
        res.render('profile',{obj : req.session.data});
      })

    app.get('/changepassword',logger,function(req,res)
    {
      res.render('changepassword',{obj : req.session.data});
    })

    app.post('/changepassword',function (req,res)
    {
          password = req.body;
          if(password.old_password!=req.session.data.password)
          res.send("0")
          else
          {
              user.updateOne( { "_id" : req.session.data._id } , { $set: { "password" : password.new_password } } , function(error,result)
              {
                  if(error)
                  throw error;
                  else
                    req.session.data.password = password.new_password;
              })
                res.send("1")
          }
    })

    app.post('/sendmail',function(req,res)
    {
      console.log(req.body);
      sendmail(req.body);
      res.end();
    })

    app.post('/ul',function (req, res) {
    // console.log(req.body);
    // console.log(req.body.order[0].column);
    console.log("req aayi");
    var count;

    if(req.body.order[0].column==0)
    {
      if(req.body.order[0].dir=="asc")
      getdata("username",1);
      else
      getdata("username",-1);
    }
    else if(req.body.order[0].column==1)
    {
      if(req.body.order[0].dir=="asc")
      getdata("phone",1);
      else
      getdata("phone",-1);
    }
    else if(req.body.order[0].column==2)
    {
      if(req.body.order[0].dir=="asc")
      getdata("city",1);
      else
      getdata("city",-1);
    }
    else if(req.body.order[0].column==3)
    {
      if(req.body.order[0].dir=="asc")
      getdata("status",1);
      else
      getdata("status",-1);
    }
    else if(req.body.order[0].column==4)
    {
      if(req.body.order[0].dir=="asc")
      getdata("role",1);
      else
      getdata("role",-1);
    }

    else {
      getdata("username",1);
    }


    function getdata(colname,sortorder)
    {
        user.countDocuments(function(e,count){
          var start=parseInt(req.body.start);
          var len=parseInt(req.body.length);
          var role=req.body.role;
          var status=req.body.status;
          var search=req.body.search.value;
          var getcount=10;
          // console.log(req.body.search.value.length);


        var findobj={};
          console.log(role,status);
          if(role!="all")
             { findobj.role=role;
             }
          else{
              delete findobj["role"];
          }
          if(status!="all")
              {findobj.status=status;}
          else{
              delete findobj["status"];
          }
          if(search!='')
              findobj["$or"]= [{
              "username":  { '$regex' : search, '$options' : 'i' }
          }, {
              "phone":{ '$regex' : search, '$options' : 'i' }
          },{
              "city": { '$regex' : search, '$options' : 'i' }
          }
          ,{
              "status":  { '$regex' : search, '$options' : 'i' }
          }
          ,{
              "role": { '$regex' : search, '$options' : 'i' }
          }]
          else{
              delete findobj["$or"];
          }


          user.find(findobj).countDocuments(function(e,coun){
          getcount=coun;
        }).catch(err => {
          console.error(err)
          res.send(error);
        })

          user.find(findobj).skip(start).limit(len).sort({[colname] : sortorder})
          .then(data => {
              res.send({"recordsTotal" : count,"recordsFiltered" :getcount,data})
            })
            .catch(err => {
              console.error(err)
            //  res.send(error)
            })
        });
      }
    });

    app.post('/cl',function (req, res) {
      console.log("req aayi");
      var count;
      console.log(req.body);

      if(req.body.order[0].column==0)
      {
        if(req.body.order[0].dir=="asc")
        getdata("communityname",1);
        else
        getdata("communityname",-1);
      }
      else if(req.body.order[0].column==1)
      {
        if(req.body.order[0].dir=="asc")
        getdata("communitymembershiprule",1);
        else
        getdata("communitymembershiprule",-1);
      }
      else if(req.body.order[0].column==2)
      {
        if(req.body.order[0].dir=="asc")
        getdata("communitylocation",1);
        else
        getdata("communitylocation",-1);
      }
      else if(req.body.order[0].column==3)
      {
        if(req.body.order[0].dir=="asc")
        getdata("communityowner",1);
        else
        getdata("communityowner",-1);
      }
      else if(req.body.order[0].column==4)
      {
        if(req.body.order[0].dir=="asc")
        getdata("communitycreatedate",1);
        else
        getdata("communitycreatedate",-1);
      }

      else {
        getdata("communityname",1);
      }


      function getdata(colname,sortorder)
      {

          community.countDocuments(function(e,count){
            var start=parseInt(req.body.start);
            console.log(start);
            var len=parseInt(req.body.length);
            var mrule=req.body.communitymembershiprule;
            var search=req.body.search.value;
            var getcount=10;
            console.log(req.body.search.value.length);


          var findobj={};
            console.log(mrule);
            if(mrule!="all")
               { findobj.communitymembershiprule=mrule;}
            else{
                delete findobj["communitymembershiprule"];
            }
            if(search!='')
                findobj["$or"] = [{
                "communityname":  { '$regex' : search, '$options' : 'i' }
            }, {
                "communitymembershiprule":{ '$regex' : search, '$options' : 'i' }
            },{
                "communitylocation": { '$regex' : search, '$options' : 'i' }
            }
            ,{
                "communityowner":  { '$regex' : search, '$options' : 'i' }
            },
            ,{
                "communitycreatedate": { '$regex' : search, '$options' : 'i' }
            }]
            else
              delete findobj["$or"];

            community.find(findobj).countDocuments(function(e,coun){
            getcount=coun;
          }).catch(err => {
            console.error(err)
            res.send(error)
          })

            community.find(findobj).skip(start).limit(len).sort({[colname] : sortorder})
            .then(data => {
                res.send({"recordsTotal" : count,"recordsFiltered" :getcount,data})
              })
              .catch(err => {
                console.error(err)
              //  res.send(error)
              })
            })
          }
        });

    app.post('/tl',function(req,res)
    {
      // console.log(req);
      let count;

      if(req.body.order[0].column==0)
      {
        if(req.body.order[0].dir=="asc")
        getdata("tagname",1);
        else
        getdata("tagname",-1);
      }
      else if(req.body.order[0].column==1)
      {
        if(req.body.order[0].dir=="asc")
        getdata("tagcreator",1);
        else
        getdata("tagcreator",-1);
      }
      else if(req.body.order[0].column==2)
      {
        if(req.body.order[0].dir=="asc")
        getdata("tagdate",1);
        else
        getdata("tagdate",-1);
      }
      else {
        getdata("tagname",1);
      }


      function getdata(colname,sortorder)
      {
          tag.countDocuments(function(e,count){
            let start=parseInt(req.body.start);
            let len=parseInt(req.body.length);
            let search=req.body.search.value;
            let getcount=10;

          var findobj = {
             tagflag : "1",
          };
            if(search!='')
                findobj["$or"]= [{
                "tagname":  { '$regex' : search, '$options' : 'i' }
            }, {
                "tagcreator":{ '$regex' : search, '$options' : 'i' }
            },{
                "tagdate": { '$regex' : search, '$options' : 'i' }
            }]
            else {
                delete findobj["$or"];
            }


           tag.find(findobj).countDocuments(function(e,coun){
            getcount=coun;
          }).catch(err => {
            console.error(err)
            res.send(error)
          })

            tag.find(findobj).skip(start).limit(len).sort({[colname] : sortorder})
            .then(data => {
                res.send({"recordsTotal" : count,"recordsFiltered" :getcount,data})
              })
              .catch(err => {
                console.error(err);
              })
          });
        }
    })

    app.post('/upload',(req,res) => {
      console.log("req body mein "+req.body);
      upload(req,res,(err)=>{
        if(err)
        {
          throw err;
        }
        else{
          console.log(req.file);
          console.log(photoname);
          console.log(req.session.data._id);

          user.updateOne({ "_id" : req.session.data._id } , { $set : { "photoname" : photoname } }  ,function(error,result)
          {
              console.log(result);
              if(error)
              {
                console.log("error vale mai");
                throw error;
              }
              else
              {
                console.log("update vale mai");
                req.session.data.photoname = photoname;
                if(req.session.data.status == "pending")
                res.render('updatefirst' , { obj : req.session.data } );
                else
                {
                    if(req.session.data.role=='admin')
                    {
                        // if(req.session.data.switch=="admin")
                        res.render('editinfo' , { obj : req.session.data } );
                        // else {
                        //   res.render('switcheditinfo' , { obj : req.session.data } );
                        // }
                    }
                    else {
                        res.render('usereditinfo' , { obj : req.session.data } );
                    }
                }
              }
          })
        }
      })
    });

    app.post('/updateuser',function(req,res)
    {
      console.log(req.body);
      user.updateOne({"_id":req.body._id},{ $set : req.body} ,function(error,result)
      {
        if(error)
        throw error
        else
        {
          res.send("DATA UPDATED SUCCESFULLY")
        }
      })
    })

    app.post('/addtag',function(req,res)
    {
      tag.create(req.body,function(error,result)
      {
        if(error)
        throw error;
        else
        {
          res.end();
        }
      })
    })

    app.post('/deleteTag',function(req,res)
    {
      tag.updateOne({ "_id" : req.body._id },{ $set : { tagflag : "0" } },function(error,result)
      {
        if(error)
        throw error;
        else {
          console.log(result);
          res.end();
        }
      })
    })

    app.post('/edituserinfo',function(req,res)
    {
        var obj = req.body;
        console.log(req.session.data._id);
        user.updateOne({ "_id" : req.session.data._id } , { $set : { "name" : obj.name , "dob" : obj.dob , "gender" : obj.gender , "phone" : obj.phone , "city" : obj.city , "status" : "confirmed" , "interests" : obj.interests , "journey" : obj.journey , "expectations" : obj.expectations  } }  ,function(error,result)
        {
          if(error)
          throw error
          else
          {
            req.session.data.name = obj.name
            req.session.data.dob = obj.dob
            req.session.data.gender = obj.gender
            req.session.data.phone = obj.phone
            req.session.data.city = obj.city
            req.session.data.status = "confirmed"
            if(req.session.data.role=='admin')
            res.render('editpage', { obj : req.session.data });
            // {
            //   if(req.session.data.switch=="admin")
            //      res.render('editpage', { obj : req.session.data });
            //      else {
            //        res.render('switcheditpage', { obj : req.session.data });
            //      }
            // }
            // else if(req.session.data.role == 'communitybuilder')
            // {
            //     res.render('buildereditpage',{ obj : req.session.data });
            // }
            // else {
            //   res.render('userprofile', { obj : req.session.data });
            // }
          }
        })
    })

    app.get('/changeswitch',logger,logger2,function(req,res)
    {
        req.session.data.switch = 'admin'
        user.updateOne({ "_id" : req.session.data._id } , { $set : { "switch" : "admin" } } ,function(error,result)
        {
          if(error)
          throw error;
          else
          res.render('profile' , { obj: req.session.data })
        })
    })

    app.get('/switchcommunityhome',logger,function(req,res)
    {
      if(req.session.data.switch == 'admin')
      {
        req.session.data.switch = 'user'
        user.updateOne({ "_id" : req.session.data._id } , { $set : { "switch" : "user" } } ,function(error,result)
        {
          if(error)
          throw error;
          else
          {
              res.redirect('/community/communitypanel');
          }
        })
      }
      else {
        req.session.data.switch = 'admin'
        user.updateOne({ "_id" : req.session.data._id } , { $set : { "switch" : "admin" } } ,function(error,result)
        {
          if(error)
          throw error;
          else
          {
              res.redirect('/home');
          }
        })
      }
    })

    app.post('/createcommunity',function(req,res)
    {
      console.log(req.body);
      if(!req.body.communityname)
      {
        res.send("no dataa");
      }
      else {
        console.log(req.body);
        if(req.body.myImage)
        {
          console.log("photo haiiiiiiii");
           upload(req,res,(err)=>
           {
             if(err)
             throw err;
             else {
               console.log(photoname);
               req.body.communityimage = photoname;
               console.log("photo   pdgi");
                 createcommunity(req);
                 res.redirect('/community/switchcreatecommunity');
             }
           })
        }
        else 
        {
          createcommunity(req)
          if(req.session.data == 'admin')
          res.render('switchcreatecommunity',{ obj : req.session.data });
          else {
            res.render('communitycreate',{ obj : req.session.data });
          }
        }
      }
    })

    function createcommunity(req)
    {
        var cid;
        var obj = req.body;
        console.log(obj);
        var today = new Date()
        var dd = today.getDate();
        var mm = getMonths(today.getMonth());
        var yyyy = today.getFullYear();
        obj.communitycreatedate = dd + "-" + mm + "-" + yyyy
        obj.communityowner = req.session.data.name;
        obj.communityownerid = req.session.data._id;
        community.create(obj,function(err,result)
        {
            if(err)
            throw err;
            else {
            //  cid = result._id;
              user.updateOne(  { "_id" : req.session.data._id } , { $push : { owned : result._id } } , function(err,result)
              {
                  if(err)
                  throw err;
                  else {
                    console.log(result);
                  }
              })
            }
        })
    }

    app.post('/ownedCommunities',logger,function(req,res)
    {
        community.find( { $or : [{ communityownerid : req.session.data._id },{ communitymember : { $in : [req.session.data._id] } },{ communitymanager : { $in : [req.session.data._id] } },{ communityrequest : { $in : [req.session.data._id] } }] } ).exec(function(error,result) {
         {
            if(error)
            throw error;
            else {
              res.send(result);
            }
          }
        })
    })

    app.post('/updateCommunity',function(req,res)
    {
        community.updateOne( { "_id" : req.body._id } , {  $set : req.body }, function(err,result)
        {
          if(err)
          throw err;
          else {
            res.end();
          }
        })
    })

    app.post('/community/editcommunity/:pro',function(req,res)
    {
      upload(req,res,(err)=>{
        if(err)
        {
          throw err;
        }
        else
        {
          community.updateOne({ "_id" : req.params.pro }, { $set : { "communityimage" : photoname } },function(error,result)
          {
              if(error)
              throw error;
              else {
                console.log("updated");
                res.redirect('/community/editcommunity/'+req.params.pro+'');
                // res.send("DONE");
              }
          })
        }
      })
    })

    app.post('/freeCommunities',function(req,res)
    {
      console.log(req.body);
      let start = req.body.start;
      let end = req.body.end;
      // console.log("------------"+start,end);
      let findobj = { $and : [{ communityownerid : { $not : { $eq : req.session.data._id } } },{ communitymember : { $nin : [req.session.data._id] } },{ communityrequest : { $nin : [req.session.data._id] } }] };
      community.find( findobj ).skip(start).limit(end).exec(function(error,result) {
        {
          if(error)
          throw error;
          else {
            console.log(result);
            res.send(result);
          }
        }
      })
    })

    app.post('/djoin',function(req,res)
    {
      user.updateOne( { "_id" : req.session.data._id } , { $push : { join : req.body._id } } , function(error,result)
      {
          if(error)
          throw error;
          else {
            community.updateOne( { "_id" : req.body._id } , { $push : { communitymember : req.session.data._id } } , function(error,result)
            {
              if(error)
              throw error;
              else {
                console.log("hogyajbkbkjjkbkbkj");
                res.end();
              }
            })
          }
      })
    })

    app.post('/pjoin',function(req,res)
    {
        user.updateOne( { "_id" : req.session.data._id } , { $push : { req : req.body._id } } , function(error,result)
        {
            if(error)
            throw error;
            else {
              community.updateOne( { "_id" : req.body._id } , { $push : { communityrequest : req.session.data._id } } , function(error,result)
              {
                if(error)
                throw error;
                else {
                  console.log("hogyajbkbkjjkbkbkj");
                  res.end();
                }
              })
            }
        })
    })

    app.post('/cancelRequest',function(req,res)
    {
        console.log("aagya");
        community.updateOne({ "_id" : req.body._id },{ $pull : { communityrequest : { $in : [req.session.data._id]}}} ,function(error,result){
         if(error)
         throw error;
         else {
             user.updateOne({ "_id" : req.session.data._id },{ $pull : { req : { $in : [req.body._id] } } }, function(error,result){
               if(error)
               throw error;
               else {
                 res.end();
               }
             })
           }
        })
    })

    app.post('/getMembers',function(req,res)
    {
        var query = [{path : 'communityownerid' , select : { 'name' : 1 , 'photoname' : 1 } },{path : 'communitymember' , select : { 'name' : 1 , 'photoname' : 1 } },{ path : 'communityrequest' , select : { 'name' : 1 , 'photoname' : 1 } },{ path : 'invitations' , select : { 'name' : 1 , 'photoname' : 1 } },{ path : 'communitymanager' , select : { 'name' : 1 , 'photoname' : 1 } } ];
        community.findOne({ "_id" : req.body._id }).populate( query ).exec(function (err, person) {
        if (err) throw err;
        // console.log(person);
        res.send(person);
      });
    });

    app.post('/acceptRequest',function(req,res)
    {
      console.log(req.body);
      community.updateOne( { "_id" : req.body.commid } , {  $push : { communitymember : req.body.userid } , $pull : { communityrequest : { $in : [req.body.userid] } }  },function(err,result)
      {
          if(err)
          throw err;
          else {
            user.updateOne( { "_id" : req.body.userid } , {  $push : { join : req.body.commid } , $pull : { req : { $in : [req.body.commid] } }  },function(err,result)
            {
              if(err)
              throw err;
              else {
                res.send("DONE");
              }
            })
          }
      })
    })

    app.post('/rejectRequest',function(req,res)
    {
      console.log(req.body);
      community.updateOne( { "_id" : req.body.commid } , { $pull : { communityrequest : { $in : [req.body.userid] } }  },function(err,result)
      {
          if(err)
          throw err;
          else {
            user.updateOne( { "_id" : req.body.userid } , { $pull : { req : { $in : [req.body.commid] } }  },function(err,result)
            {
              if(err)
              throw err;
              else {
                res.send("DONE");
              }
            })
          }
      })
    })

    app.post('/removeUser',function(req,res)
    {
      community.updateOne( { "_id" : req.body.commid } , { $pull : { communitymember : { $in : [req.body.userid] } } , $pull : { communitymanager : { $in : [req.body.userid] } } },function(err,result)
      {
          if(err)
          throw err;
          else {
            user.updateOne( { "_id" : req.body.userid } , { $pull : { join : { $in : [req.body.commid] } } ,  $pull : { manager : { $in : [req.body.commid] } } },function(err,result)
            {
              if(err)
              throw err;
              else {
                res.send("DONE");
              }
            })
          }
      })
    })

    app.post('/promoteUser',function(req,res)
    {
      community.updateOne( { "_id" : req.body.commid } , {  $push : { communitymanager : req.body.userid } , $pull : { communitymember : { $in : [req.body.userid] } }  },function(err,result)
      {
          if(err)
          throw err;
          else {
            user.updateOne( { "_id" : req.body.userid } , {  $push : { manager : req.body.commid } , $pull : { join : { $in : [req.body.commid] } }  },function(err,result)
            {
              if(err)
              throw err;
              else {
                res.send("DONE");
              }
            })
          }
      })
    })

    app.post('/getObj',function(req,res)
    {
      res.send(req.session.data);
    })

    app.post('/demoteUser',function(req,res)
    {
      community.updateOne( { "_id" : req.body.commid } , {  $push : { communitymember : req.body.userid } , $pull : { communitymanager : { $in : [req.body.userid] } }  },function(err,result)
      {
          if(err)
          throw err;
          else {
            user.updateOne( { "_id" : req.body.userid } , {  $push : { join : req.body.commid } , $pull : { manager : { $in : [req.body.commid] } }  },function(err,result)
            {
              if(err)
              throw err;
              else {
                res.send("DONE");
              }
            })
          }
      })
    })

    app.post('/get',function(req,res)
    {
        var query = [{path : 'communityownerid' , select : { 'name' : 1 , 'photoname' : 1 } },{path : 'communitymember' , select : { 'name' : 1 , 'photoname' : 1 } },{path : 'communitymanager' , select : { 'name' : 1 , 'photoname' : 1 } }];
        community.findOne({ "_id" : req.body._id }).populate( query ).exec(function (err, person) {
        if (err) throw err;
        // console.log(person);
        res.send(person);
      });
    });

    app.post('/addReply',function(req,res)
    {
      let obj = req.body;
      obj.replyownerid = req.session.data._id;
      obj.replyowername = req.session.data.name;
      obj.replydate = getTime();
      obj.replyownerphotoname = req.session.data.photoname;
      reply.create(obj,function(error,result)
      {
        if(error)
        throw error;
        else {
          comment.updateOne({ "_id" : obj.commentid },{
             $push : { reply : result._id },
             $inc: { replylength : 1 }
            },function(error,result)
          {
            if(error)
            throw error;
            else {
              res.send(obj);
            }
          })
        }
      })
    })

    app.post('/deleteReply',function(req,res)
    {
      reply.updateOne({"_id" : req.body.replyid},{ $set : { flag : false } },function(error,result)
      {
        if(error)
        throw error;
        else {
          comment.updateOne({ "_id" : req.body.commentid },{
            $inc: { replylength : -1 }
           },function(error,result)
           {
            if(error)
            throw error;
            else {
              res.send('Reply Deleted');
            }
           })
        }
      })
    })

    app.post('/addComment',function(req,res)
    {
      let obj = req.body;
      obj.commentownerid = req.session.data._id;
      obj.commentownername = req.session.data.name;
      obj.commentownerphoto = req.session.data.photoname;
      obj.commentdate = getTime();
      obj.reply = [];
      obj.replylength = 0;
      comment.create(obj,function(error,result)
      {
        if(error)
        throw error;
        else {
          discussion.updateOne({ "_id" : obj.discussionid },
          {
              $push : {
              discussioncomments : result._id
            },
            $inc: { commentslength : 1 }
          },function(error,rslt)
          {
            if(error)
              throw error;
              else {
                console.log(rslt);
                obj._id = result._id;
                  res.send(obj);
                  // res.redirect('/discussions/'+id);
              }
          }
        )
        }
      })
    })

    app.post('/deleteComment',function(req,res)
    {
      comment.updateOne({"_id" : req.body.commentid},{ $set : { flag : false } } ,function(error,result)
      {
        if(error)
        throw error;
        else {
          discussion.updateOne({ "_id" : req.body.discussionid },
          {
            $inc: { commentslength : -1 }
          },function(error,rslt)
          {
            if(error)
              throw error;
              else {
                res.send('Reply Deleted');
              }
          }
        )
        }
      })
    })

    app.post('/createDiscussion',function(req,res)
    {
      let obj = req.body;
      obj.discussiondate = getTime();
      obj.discussionownername = req.session.data.name;
      obj.discussionownerid = req.session.data._id;
      obj.discussiondeleted = false;
      obj.discussionfeatured = false;
      obj.discussionglobal = false;
      obj.commentslength = 0;
      discussion.create(obj,function(error,result)
      {
        if(error)
        {
          console.log(error);
        }
        else
        {
          community.updateOne({"_id" : obj.communityid},
          {
              $push : {
                  communitydiscussion : result._id
              }
          },function(error,rslt)
          {
              if(error)
              throw error;
              else {
                obj._id = result._id;
                  res.send(obj);
              }

          })
        }
      })
    })

    app.post('/getDiscussion',function(req,res)
    {
        let query = [{ path : 'communitydiscussion' , match : { discussiondeleted : { $ne : true } } , select : { 'discussiontitle' : 1 , 'discussiondetail' : 1 , 'discussionownername' : 1 , 'discussionownerid' : 1 , 'discussiondate' : 1 , 'discussioncomments' : 1 , 'commentslength' : 1 , 'discussionfeatured' : 1 , 'discussionglobal' : 1 } }];
        community.findOne({ "_id" : req.body.commid }).populate( query ).exec(function(err,result)
        {
          if(err)
          throw err;
          else {
            res.send(result);
          }
        })
    })

    app.post('/getDiscussionComments',function(req,res)
    {
      let query = [{ path : 'reply',match : { flag : { $ne : false } } ,select : { 'replyownerid' : 1 , 'text' : 1 , 'replyowername' : 1 , 'replyownerphotoname' : 1 , 'replydate' : 1 , 'commentid' : 1 } }];
      comment.find({ "discussionid" : req.body.discussionid, "flag" : { $ne : false } }).populate(query).exec(function(error,result)
      {
        if(error)
        throw error;
        else {
          res.send(result);
        }
      })
    })

    app.post('/featureDiscussion',function(req,res)
    {
      discussion.updateOne({ "_id" : req.body.discussionid },{ $set : { discussionfeatured : req.body.value } },function(error,result) {
        if(error)
        throw error;
        else {
          res.send('Discussion Deleted');
        }
      })
    })

    app.post('/globalDiscussion',function(req,res)
    {
      discussion.updateOne({ "_id" : req.body.discussionid },{ $set : { discussionglobal : req.body.value } },function(error,result) {
        if(error)
        throw error;
        else {
          res.send('Discussion Deleted');
        }
      })
    })

    app.post('/deleteDiscussion',function(req,res)
    {
      let discussionid = req.body.discussionid;
      discussion.updateOne({ "_id" : discussionid },{ $set : { discussiondeleted : true } },function(error,result) {
        if(error)
        throw error;
        else {
          res.send('Discussion Deleted');
        }
      })
    })

    app.listen(3000,function()
    {
          console.log("Running on port 3000");
    });

    app.get('/logout',function(req,res)
    {
      req.session.isLogin = 0;
      req.session.destroy();
      res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
      res.render('login');
    })

    function logger(req,res,next)
    {
      if(req.session.isLogin)
      {
        next();
      }
      else {
          res.redirect('/');
      }
    }

    function logger2(req,res,next)
    {
      if(req.session.data.role == 'admin')
      {
        next();
      }
      else {
        res.redirect('/');
      }
    }