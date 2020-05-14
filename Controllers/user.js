const user = require('../Models/user');
// const multer = require('../Middlewares/multer');
// const { upload } = require('../Middlewares/multer');
const nodemailer = require('../Middlewares/nodemailer');

exports.login = (req,res) => {
    user.findOne({
        username: req.body.username,
        password: req.body.password
      })
      .then(data =>
        {
          if(data)
          {
               if(req.session.isLogin)
               {
                 res.render(home);
               }
               else
               {
                 if(data.state =="notactive")
                 {
                   res.send("0000");
                 }
                 else
                 {
                   req.session.isLogin = 1;
                   let obj = Object();
                   obj = data
                   req.session.data = obj;
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
}

exports.findEmail = (req,res) => {
    let username = req.body.username;
    user.findOne({ "username" : username },function(error,result)
    {
        if(error)
        throw error;
    else if(result)
    {
        res.send("1");       // username already exist
    }
    else {
        res.send("0");       // username does not exist
    }
 })
}

exports.adduser = (req,res) => {
    console.log('add user');
    let obj = req.body;
    obj.status='pending'
    if(obj.role=='admin')
    obj.switch="admin";
    user.create(obj,function(error,result)
    {
        if(error)
        throw err;
        else
        {
            console.log(result);
            let mailOptions = {
                from: req.session.data.username,
                to: req.body.username,
                subject: 'Welcome To CQ',
                text: "Your Username is: " + req.body.username + "\n" + " Password is: " + req.body.password
            };
            nodemailer.sendMail(mailOptions,function(error,result) {
                if(error)
                throw error;
                else {
                    console.log(result);
                    res.redirect('/home');
                }
            })
        }
    })
}

exports.sendmail = (req,res) => {
    let mailOptions = {
        from: req.session.data.username,
        to: req.body.username,
        subject: req.body.subject,
        html: req.body.text,
    };
    nodemailer.sendMail(mailOptions,function(error,result) {
        if(error)
        throw error;
        else {
            console.log(result);
            res.end();
        }
    })
}

exports.changepassword = (req,res) => {
    password = req.body;
    if(password.old_password!=req.session.data.password)
    {
       res.send("0");       // previous password dosen't match
    }
    else
    {
        user.updateOne( { "_id" : req.session.data._id } , { $set: { "password" : password.new_password } } , function(error,result)
        {
            if(error)
            throw error;
            else
            req.session.data.password = password.new_password;
            res.send("1");
        })
    }
}

exports.getUsersList = (req,res) => {
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
        let start=parseInt(req.body.start);
        let len=parseInt(req.body.length);
        let role=req.body.role;
        let status=req.body.status;
        let search=req.body.search.value;
        let getcount=10;


    let findobj={};
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
        })
    });
    }
}

exports.updateuser = (req,res) => {
    console.log(req.body);
    user.updateOne({"_id":req.body._id},{ $set : req.body} ,function(error,result)
    {
        if(error)
        throw error
        else
        {
            res.send("DATA UPDATED SUCCESFULLY");
        }
    })
}

exports.upload = (req,res) => {

    user.updateOne({ "_id" : req.session.data._id } , { $set : { "photoname" : req.file.secure_url } }  ,function(error,result)
    {
        if(error)
        {
            throw error;
        }
        else
        {
            console.log(req.session.data);
            req.session.data.photoname = req.file.secure_url;
            if(req.session.data.status == "pending")
            {
                res.render('updatefirst' , { obj : req.session.data } );
            }
            else
            {
                res.render('editinfo' , { obj : req.session.data } );
            }
        }
    })
}

exports.edituserinfo = (req,res) => {
    let obj = req.body;
    console.log(obj);
    console.log(req.session.data._id);
    user.updateOne({ "_id" : req.session.data._id } , { $set : { "name" : obj.name , "dob" : obj.dob , "gender" : obj.gender , "phone" : obj.phone , "city" : obj.city , "status" : "confirmed" , "interests" : obj.interests , "journey" : obj.journey , "expectations" : obj.expectations  } }  ,function(error,result)
    {
        if(error)
        throw error;
        else
        {
            console.log('hiiiiii');
            req.session.data.name = obj.name
            req.session.data.dob = obj.dob
            req.session.data.gender = obj.gender
            req.session.data.phone = obj.phone
            req.session.data.city = obj.city
            req.session.data.status = "confirmed"
            res.render('editpage', { obj : req.session.data });
        }
    })
}