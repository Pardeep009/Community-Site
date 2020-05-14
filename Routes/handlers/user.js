    
    const express = require('express');
    const router = express.Router();
    const path = require('path');
    const checkLogin = require('../../Middlewares/checkLogin');
    const { upload } = require('../../Middlewares/multer');
    const isAdmin  = require('../../Middlewares/isAdmin');

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
        if(req.session.data.status === 'pending')
        {
          res.render('updatefirst',{obj : req.session.data})
        }
        else
        {
            if(req.session.data.role==='admin')
            {
               if(req.session.data.switch=='user') {
                res.redirect('/community/communitypanel');
               }
               else {
                res.render('profile',{obj : req.session.data});
              }
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

    router.get('/logout',checkLogin,function(req,res)
    {
      req.session.isLogin = 0;
      req.session.destroy();
      res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
      res.render('login');
    })

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

    router.post('/findEmail',checkLogin,userController.findEmail);

    router.post('/adduser',checkLogin,isAdmin,userController.adduser);

    router.post('/changepassword',checkLogin,userController.changepassword);

    router.post('/sendmail',checkLogin,isAdmin,userController.sendmail);

    router.post('/ul',checkLogin,isAdmin,userController.getUsersList);

    router.post('/cl',checkLogin,isAdmin,communityController.getCommunityList);

    router.post('/tl',checkLogin,isAdmin,tagController.getTags);

    // router.post('/upload',checkLogin,,userController.upload);
    router.post('/upload',checkLogin,upload.single('myImage'),userController.upload);

    router.post('/updateuser',checkLogin,userController.updateuser);

    router.post('/addtag',checkLogin,tagController.addtag);

    router.post('/deleteTag',checkLogin,isAdmin,tagController.deleteTag);

    router.post('/edituserinfo',checkLogin,userController.edituserinfo);

    router.post('/createcommunity',checkLogin,isAdmin,communityController.createcommunity);

    router.post('/ownedCommunities',checkLogin,communityController.ownedCommunities);

    router.post('/community/updateCommunity/:pro',checkLogin,isAdmin,communityController.updateCommunity);

    router.post('/community/uploadImage/:pro',checkLogin,isAdmin,upload.single('myImage'),communityController.uploadImage);

    router.post('/freeCommunities',checkLogin,communityController.freeCommunities);

    router.post('/djoin',checkLogin,communityController.djoin);

    router.post('/pjoin',checkLogin,communityController.pjoin);

    router.post('/cancelRequest',checkLogin,communityController.cancelRequest);

    router.post('/leaveCommunity',checkLogin,communityController.leaveCommunity);

    router.post('/getMembers',checkLogin,communityController.getMembers);

    router.post('/acceptRequest',checkLogin,communityController.acceptRequest);

    router.post('/rejectRequest',checkLogin,communityController.rejectRequest);

    router.post('/removeUser',checkLogin,communityController.removeUser);

    router.post('/promoteUser',checkLogin,communityController.promteUser);

    router.post('/demoteUser',checkLogin,communityController.demoteUser);

    router.post('/get',checkLogin,communityController.get);

    router.post('/addReply',checkLogin,communityController.addReply);

    router.post('/deleteReply',checkLogin,communityController.deleteReply);

    router.post('/addComment',checkLogin,communityController.addComment);

    router.post('/deleteComment',checkLogin,communityController.deleteComment);

    router.post('/createDiscussion',checkLogin,communityController.createDiscussion);

    router.post('/getDiscussion',checkLogin,communityController.getDiscussion);

    router.post('/getDiscussionComments',checkLogin,communityController.getDiscussionComments);

    router.post('/featureDiscussion',checkLogin,communityController.featureDiscussion);

    router.post('/globalDiscussion',checkLogin,communityController.globalDiscussion);

    router.post('/deleteDiscussion',checkLogin,communityController.deleteDiscussion);

    router.post('/getObj',checkLogin,function(req,res)    // get data of user in session
    {
      res.send(req.session.data);
    })

    module.exports = router;