const community = require('../Models/community');
const user = require('../Models/user');
const discussion = require('../Models/discussion');
const comment = require('../Models/comment');
const reply = require('../Models/reply');

function createcommunity(req)
{
    let cid;
    let obj = req.body;
    console.log(obj);
    let today = new Date()
    let dd = today.getDate();
    let mm = getMonths(today.getMonth());
    let yyyy = today.getFullYear();
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

exports.createcommunity = (req,res) => {
  if(!req.body.communityname)
  {
    res.send("no dataa");
  }
  else {
    console.log(req.body);
    if(req.body.myImage)
    {
      console.log("photo found");
        upload(req,res,(err)=>
        {
          if(err)
          throw err;
          else {
            console.log(photoname);
            req.body.communityimage = photoname;
            console.log("photo uploaded");
              createcommunity(req);
              // res.redirect('/community/switchcreatecommunity');
              res.render('createcommunity',{ obj : req.session.data });
          }
        })
    }
    else 
    {
      createcommunity(req)
      res.render('createcommunity',{ obj : req.session.data });
    }
  }
}

exports.getCommunityList = (req,res) => {
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
        let start=parseInt(req.body.start);
        console.log(start);
        let len=parseInt(req.body.length);
        let mrule=req.body.communitymembershiprule;
        let search=req.body.search.value;
        let getcount=10;
        console.log(req.body.search.value.length);


      let findobj={};
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
          })
        })
      }
}

exports.uploadImage = (req,res) => {
    community.updateOne({ "_id" : req.params.pro }, { $set : { "communityimage" : req.file.secure_url } },function(error,result)
    {
        if(error)
        throw error;
        else {
          res.redirect('/community/editcommunity/'+req.params.pro+'');
        }
    })
}

exports.promteUser = (req,res) => {
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
            req.session.data.manager.push(req.body.commid);
            for(let i=0;i<req.session.data.join.length;i++)
              {
                if(req.session.data.join[i] == req.body.commid)
                {
                  req.session.data.join.splice(i,1);
                  break;
                }
              }
            res.send("DONE");
          }
        })
      }
  })
}

exports.demoteUser = (req,res) => {
    community.updateOne( { "_id" : req.body.commid } , {  $push : { communitymember : req.body.userid } , $pull : { communitymanager : { $in : [req.body.userid] } }  },function(err,result)
    {
        if(err)
        throw err;
        else {
        user.updateOne( { "_id" : req.body.userid } , {  $push : { join : req.body.commid } , $pull : { manager : { $in : [req.body.commid] } }  },function(err,result)
        {
            if(err)
            throw err;
            else 
            {
                req.session.data.join.push(req.body.commid);
                for(let i=0;i<req.session.data.manager.length;i++)
                {
                    if(req.session.data.manager[i] == req.body.commid)
                {
                    req.session.data.manager.splice(i,1);
                    break;
                }
                }
                res.send("DONE");
            }
        })
      }
    })
}

exports.addReply = (req,res) => {
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
}

exports.deleteReply = (req,res) => {
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
}

exports.addComment = (req,res) => {
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
            }
        }
      )
      }
    })
}

exports.deleteComment = (req,res)=> {
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
        })
      }
    })
}

exports.createDiscussion = (req,res) => {
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
}

exports.getDiscussion = (req,res) => {
  let query = [{ path : 'communitydiscussion' , match : { discussiondeleted : { $ne : true } } , select : { 'discussiontitle' : 1 , 'discussiondetail' : 1 , 'discussionownername' : 1 , 'discussionownerid' : 1 , 'discussiondate' : 1 , 'discussioncomments' : 1 , 'commentslength' : 1 , 'discussionfeatured' : 1 , 'discussionglobal' : 1 , 'communityid' : 1 } }];
  community.findOne({ "_id" : req.body.commid }).populate( query ).exec(function(err,result)
  {
    if(err)
    throw err;
    else {
      res.send(result);
    }
  })
}

exports.getDiscussionComments = (req,res) => {
  let query = [{ path : 'reply',match : { flag : { $ne : false } } ,select : { 'replyownerid' : 1 , 'text' : 1 , 'replyowername' : 1 , 'replyownerphotoname' : 1 , 'replydate' : 1 , 'commentid' : 1 } }];
  comment.find({ "discussionid" : req.body.discussionid, "flag" : { $ne : false } }).populate(query).exec(function(error,result)
  {
    if(error)
    throw error;
    else {
      res.send(result);
    }
  })
}

exports.featureDiscussion = (req,res) => {
  discussion.updateOne({ "_id" : req.body.discussionid },{ $set : { discussionfeatured : req.body.value } },function(error,result) {
    if(error)
    throw error;
    else {
      res.send('Discussion Modified');
    }
  })
}

exports.globalDiscussion = (req,res) => {
  discussion.updateOne({ "_id" : req.body.discussionid },{ $set : { discussionglobal : req.body.value } },function(error,result) {
    if(error)
    throw error;
    else {
      res.send('Discussion Modified');
    }
  })
}

exports.deleteDiscussion = (req,res) => {
  let discussionid = req.body.discussionid;
  discussion.updateOne({ "_id" : discussionid },{ $set : { discussiondeleted : true } },function(error,result) {
    if(error)
    throw error;
    else {
      res.send('Discussion Deleted');
    }
  })
}

exports.get = (req,res) => {
    let query = [{path : 'communityownerid' , select : { 'name' : 1 , 'photoname' : 1 } },{path : 'communitymember' , select : { 'name' : 1 , 'photoname' : 1 } },{path : 'communitymanager' , select : { 'name' : 1 , 'photoname' : 1 } }];
    community.findOne({ "_id" : req.body._id }).populate( query ).exec(function (err, person) {
    if (err) throw err;
    // console.log(person);
    res.send(person);
  });
}

exports.removeUser = (req,res) => {
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
            for(let i=0;i<req.session.data.join.length;i++)
              {
                if(req.session.data.join[i] == req.body.commid)
                {
                req.session.data.join.splice(i,1);
                  break;
                }
              }
              for(let i=0;i<req.session.data.manager.length;i++)
              {
                if(req.session.data.manager[i] == req.body.commid)
                {
                req.session.data.manager.splice(i,1);
                  break;
                }
              }
            res.send("DONE");
          }
        })
      }
  })
}

exports.rejectRequest = (req,res) => {
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
            for(let i=0;i<req.session.data.req.length;i++)
              {
                if(req.session.data.req[i] == req.body.commid)
                {
                req.session.data.req.splice(i,1);
                  break;
                }
              }
            res.send("DONE");
          }
        })
      }
  })
}

exports.acceptRequest = (req,res) => {
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
            req.session.data.join.push(req.body.commid);
            res.send("DONE");
          }
        })
      }
  })
}

exports.getMembers = (req,res) => {
  let query = [{path : 'communityownerid' , select : { 'name' : 1 , 'photoname' : 1 } },{path : 'communitymember' , select : { 'name' : 1 , 'photoname' : 1 } },{ path : 'communityrequest' , select : { 'name' : 1 , 'photoname' : 1 } },{ path : 'invitations' , select : { 'name' : 1 , 'photoname' : 1 } },{ path : 'communitymanager' , select : { 'name' : 1 , 'photoname' : 1 } } ];
  community.findOne({ "_id" : req.body._id }).populate( query ).exec(function (err, person) {
  if (err) throw err;
  res.send(person);
  });
}

exports.leaveCommunity = (req,res) => {
  user.updateOne({ "_id" : req.session.data._id },{  $pull : { join : { $in : [ req.body.communityid ] } } , $pull : { manager : { $in : [ req.body.communityid ] } } },function(error,result)
  {
    if(error)
    throw error;
    else {
      community.updateOne({ "_id" : req.body.communityid },{ $pull : { communitymember : { $in : [ req.session.data._id ] } } , $pull : { communitymanager : { $in : [ req.session.data._id ] } } },function(error,result)
      {
        if(error)
        throw error;
        else {
          for(let i=0;i<req.session.data.join.length;i++)
              {
                if(req.session.data.join[i] == req.body.communityid)
                {
                req.session.data.join.splice(i,1);
                  break;
                }
              }
              for(let i=0;i<req.session.data.manager.length;i++)
              {
                if(req.session.data.manager[i] == req.body.communityid)
                {
                req.session.data.manager.splice(i,1);
                  break;
                }
              }
          res.end();
        }
      })
    }
  })
}

exports.cancelRequest = (req,res) => {
  community.updateOne({ "_id" : req.body._id },{ $pull : { communityrequest : { $in : [req.session.data._id]}}} ,function(error,result){
    if(error)
    throw error;
    else {
        user.updateOne({ "_id" : req.session.data._id },{ $pull : { req : { $in : [req.body._id] } } }, function(error,result){
          if(error)
          throw error;
          else {
            for(let i=0;i<req.session.data.req.length;i++)
            {
              if(req.session.data.req[i] == req.body._id)
              {
              req.session.data.req.splice(i,1);
                break;
              }
            }
            res.end();
          }
        })
      }
  })
}

exports.pjoin = (req,res) => {
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
            req.session.data.req.push(req.body._id);
            res.end();
          }
        })
      }
  })
}

exports.djoin = (req,res) => {
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
            req.session.data.join.push(req.body._id);
            res.end();
          }
        })
      }
  })
}

exports.freeCommunities = (req,res) => {
  let start = req.body.start;
  let end = req.body.end;
  let findobj = { $and : [{ communityownerid : { $not : { $eq : req.session.data._id } } },{ communitymember : { $nin : [req.session.data._id] } },{ communityrequest : { $nin : [req.session.data._id] } }] };
  community.find( findobj ).skip(start).limit(end).exec(function(error,result) {
    {
      if(error)
      throw error;
      else {
        res.send(result);
      }
    }
  })
}

exports.updateCommunity = (req,res) => {
  community.updateOne( { "_id" : req.params.pro } , {  $set : req.body }, function(err,result)
  {
    if(err)
    throw err;
    else {
      res.redirect('/community/editcommunity/'+req.params.pro+'');
    }
  })
}

exports.ownedCommunities = (req,res) => {
  community.find( { $or : [{ communityownerid : req.session.data._id },{ communitymember : { $in : [req.session.data._id] } },{ communitymanager : { $in : [req.session.data._id] } },{ communityrequest : { $in : [req.session.data._id] } }] } ).exec(function(error,result) {
    {
       if(error)
       throw error;
       else {
         res.send(result);
       }
     }
   })
}