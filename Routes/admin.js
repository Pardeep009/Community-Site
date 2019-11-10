let express = require('express');
let router = express.Router();
let path = require('path');

router.use(express.static(path.join(__dirname,'../public')));

var mongoose = require('mongoose')

var product = mongoose.model('admins');
var tag = mongoose.model('tags');
var community = mongoose.model('communitys');

router.get('/adduser',logger,logger2,function(req,res)
{
    console.log("admin.js");
    res.render('adduser',{obj : req.session.data});
})

router.get('/userslist',logger,logger2,function(req,res)
{
    console.log("admin.js");
    res.render('userslist',{obj : req.session.data});
})

router.get('/communitylist',logger,logger2,function(req,res)
{
    console.log("admin.js");
    res.render('communitylist',{ obj: req.session.data });
})

router.get('/tagpanel',logger,logger2,function(req,res)
{
    console.log("admin.js");
    res.render('tagpanel',{obj : req.session.data})
})

router.get('/showtaglist',logger,logger2,function(req,res)
{
    console.log("admin.js");
    res.render('showtaglist',{obj : req.session.data})
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

module.exports = router;