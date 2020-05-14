
  const express = require('express');
  const router = express.Router();
  const path = require('path');
  const checkLogin = require('../../Middlewares/checkLogin');

  router.use(express.static(path.join(__dirname,'../../public')));

  const discussion = require('../../Models/discussion');
  const community = require('../../Models/community');

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
          });
      })

      router.get('/manageCommunity/:pro',checkLogin,function(req,res)
      {
        var id=req.params.pro;
          community.findOne( { "_id" : id },function(err,result)
          {
              if(err)
              throw err;
              else {
                if(result.communityconfirm == false)
                {
                  res.render('notactive',{ message : { msg : "Error: This community is deactivated or may be deleted by superadmin" } });
                }
                else {
                  res.render('manageCommunity',{ obj : req.session.data, commobj : result });
                }             
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
              console.log(result);
              if(result.communityconfirm == false)
              {
                res.render('notactive',{ message : { msg : "Error: This community is deactivated or may be deleted by superadmin" } });
              }
              else {
                res.render('communitydiscussions',{ obj : req.session.data, commobj : result });
              }
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

      router.get('/selecteddiscussion/:communityid/:discussionid',checkLogin,function(req,res)
      {
        community.findOne( { "_id" : req.params.communityid  },function(err,communityreslult)
        {
          if(err)
          throw err;
          else {
            discussion.findOne({ "_id" : req.params.discussionid },function(error,discussionresult){
              if(error)
              throw error;
              else {
                res.render('communityselectdisucssion',{ obj : req.session.data, commobj : communityreslult , discussion : discussionresult });
              }
            })
          }
        })
      })

  module.exports = router;