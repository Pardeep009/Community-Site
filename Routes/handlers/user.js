    
    const express = require('express');
    const router = express.Router();
    const path = require('path');

    router.use(express.static(path.join(__dirname,'../../public')));

    const user = require('../../Models/user');

    const userController = require('../../Controllers/user');

    const communityController = require('../../Controllers/community');

    const tagController = require('../../Controllers/tag');

    router.get('/',function(req,res)
    {
      if(req.session.isLogin)
      {
        res.redirect('/home');
      }
      else {
        res.render('login');
      }
    })

    router.get('/home',checkLogin,function(req,res)
    {
        console.log("idhar chla mein");
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

    router.get('/notactive',checkLogin,function(req,res)
    {
      res.render('notactive',{ message : { msg : "Error: Unable to login you are deactivated contact site admin..." } });
    })

    router.get('/changepassword',checkLogin,function(req,res)
    {
      res.render('changepassword',{obj : req.session.data});
    })

    router.get('/profile',checkLogin,function(req,res)
    {
        res.render('profile',{ obj : req.session.data });
    })

    router.get('/editpage',checkLogin,function(req,res)
    {
      res.render('editpage', { obj : req.session.data });
    })

    router.get('/editinfo',checkLogin,function(req,res)
    {   
      res.render('editinfo' , { obj : req.session.data } );
    })

    router.get('/viewprofile/:pro',checkLogin,function(req,res)
    {
      var id = req.params.pro;
      user.findOne({ "_id" : id },function(error,result)
      {
          if(error)
          throw error;
          else {
            res.render('view_profile',{ obj : req.session.data , commo : result });
          }
      })
    })

    router.get('/changeswitch',checkLogin,logger2,function(req,res)
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

    router.get('/switchcommunityhome',checkLogin,function(req,res)
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

    router.get('/logout',function(req,res)
    {
      req.session.isLogin = 0;
      req.session.destroy();
      res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
      res.render('login');
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

    router.post('/login',userController.login);

    router.post('/findEmail',userController.findEmail);

    router.post('/adduser',userController.adduser);

    router.post('/changepassword',userController.changepassword);

    router.post('/sendmail',userController.sendmail);

    router.post('/ul',userController.getUsersList);

    router.post('/cl',communityController.getCommunityList);

    router.post('/tl',tagController.getTags);

    router.post('/upload',userController.upload);

    router.post('/updateuser',userController.updateuser);

    router.post('/addtag',tagController.addtag);

    router.post('/deleteTag',tagController.deleteTag);

    router.post('/edituserinfo',userController.edituserinfo);

    router.post('/createcommunity',communityController.createcommunity);

    router.post('/ownedCommunities',communityController.ownedCommunities);

    router.post('/community/updateCommunity/:pro',communityController.updateCommunity);

    router.post('/community/uploadImage/:pro',communityController.uploadImage);

    router.post('/freeCommunities',communityController.freeCommunities);

    router.post('/djoin',communityController.djoin);

    router.post('/pjoin',communityController.pjoin);

    router.post('/cancelRequest',communityController.cancelRequest);

    router.post('/leaveCommunity',communityController.leaveCommunity);

    router.post('/getMembers',communityController.getMembers);

    router.post('/acceptRequest',communityController.acceptRequest);

    router.post('/rejectRequest',communityController.rejectRequest);

    router.post('/removeUser',communityController.removeUser);

    router.post('/promoteUser',communityController.promteUser);

    router.post('/demoteUser',communityController.demoteUser);

    router.post('/get',communityController.get);

    router.post('/addReply',communityController.addReply);

    router.post('/deleteReply',communityController.deleteReply);

    router.post('/addComment',communityController.addComment);

    router.post('/deleteComment',communityController.deleteComment);

    router.post('/createDiscussion',communityController.createDiscussion);

    router.post('/getDiscussion',communityController.getDiscussion);

    router.post('/getDiscussionComments',communityController.getDiscussionComments);

    router.post('/featureDiscussion',communityController.featureDiscussion);

    router.post('/globalDiscussion',communityController.globalDiscussion);

    router.post('/deleteDiscussion',communityController.deleteDiscussion);

    router.post('/getObj',function(req,res)
    {
      res.send(req.session.data);
    })

    module.exports = router;