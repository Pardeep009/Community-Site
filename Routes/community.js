
  let express = require('express');
  let router = express.Router();
  let path = require('path');

  router.use(express.static(path.join(__dirname,'../public')));

  var mongoose = require('mongoose')

  // var user = mongoose.model('admins');
  // var tag = mongoose.model('tags');
  var community = mongoose.model('communitys');

  router.get('/switchcreatecommunity',checkLogin,function(req,res)
  {
    res.render('createcommunity',{ obj : req.session.data })
  })


  router.get('/communitypanel',checkLogin,function(req,res)
  {
    res.render('communityhome',{ obj : req.session.data });
  })

  router.get('/list',checkLogin,function(req,res)
  {
      res.render('communitysearch',{ obj : req.session.data });
  })

  router.get('/communityprofile/:pro',checkLogin,function(req,res)
      {
          var id = req.params.pro;
          console.log(id);
          var query = [{path : 'communityownerid' , select : { 'name' : 1 , 'photoname' : 1 } },{path : 'communitymember' , select : { 'name' : 1 , 'photoname' : 1 } },{ path : 'communitymanager' , select : { 'name' : 1 , 'photoname' : 1 } } ];
          community.findOne({ "_id" : id }).populate( query ).exec(function (err, person) {
              if (err) throw err;
              console.log(person);
              res.render('communityprofile',{ obj: req.session.data, commobj: person });
              // res.send(person);
          });
          // req.session.data.communityid = id;
          // res.render('communityprofile',{ obj : req.session.data });
          // community.findOne( { "_id" : id } , function(error,result)
          // {
          //     if(error)
          //     throw error;
          //     else {
          //       // console.log(result);
          //       if(req.session.data.role == 'admin')
          //       {
          //         // console.log("hye");
          //           res.render('switchcommunityprofile',{ obj: req.session.data, commobj: result });
          //       }
          //       else {
          //         // console.log("h");
          //           res.render('communityprofile',{ obj: req.session.data, commobj: result });
          //       }
          //     }
          // })
      })

      router.get('/manageCommunity/:pro',checkLogin,function(req,res)
      {
        var id=req.params.pro;
          community.findOne( { "_id" : id },function(err,result)
          {
              if(err)
              throw err;
              else {
                res.render('manageCommunity',{ obj : req.session.data, commobj : result });
                
              }
          })
      })

      router.get('/discussions/:pro',checkLogin,function(req,res)
      {
          var id = req.params.pro;
          community.findOne( { "_id" : id  },function(err,result)
          {
            if(err)
            throw err;
            else {
              res.render('communitydiscussions',{ obj : req.session.data, commobj : result });
            }
          })
      })

      router.get('/communitymembers/:pro',checkLogin,function(req,res)
      {
        community.findOne( { "_id" : req.params.pro  },function(err,result)
        {
          if(err)
          throw err;
          else {
            res.render('communitymembers',{ obj : req.session.data, commobj : result });
          }
        })
      })

      router.get('/editcommunity/:pro',checkLogin,function(req,res)
      {
        community.findOne( { "_id" : req.params.pro  },function(err,result)
        {
          if(err)
          throw err;
          else {
            res.render('editCommunity',{ obj : req.session.data, commobj : result });
          }
        })
      })

  function checkLogin(req,res,next)
  {
      if(req.session.isLogin)
      {
          next();
      }
      else{
          res.redirect('/');
      }
  }

  module.exports = router;