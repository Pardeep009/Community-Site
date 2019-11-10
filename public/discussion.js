
  let id;
  let comments;
  let personid = $('#personid').html();
  window.onload = function()
  {
    id = document.getElementById("id").textContent;
    let obj = Object();
    obj.commid = id;
    let request = new XMLHttpRequest();
    request.open('POST','/getDiscussion');
    request.setRequestHeader("Content-Type","application/json");
    request.send(JSON.stringify(obj));
    request.onload = function()
    {
      var data = JSON.parse(request.responseText);
      console.log(data);

      for(let i in data.communitydiscussion)
      {
        addtoDiscussionsDOM(data.communitydiscussion[i]);
      }
      $('.comment-panel').hide();
      $('.all-comments-box').hide();
    }
  }

  function addtoDiscussionsDOM(obj)
  {
    console.log(obj);
    let div = '<div class="container discussion-container" id="discussion'+obj._id+'">'
                +'<div class="panel panel-default allSidesSoft" style="background:white; padding-bottom: 15px;">'
          if(obj.discussionownerid == personid)
          {
            div = div + '<div class="dropup">'
              +'<a class="discussion-dropdown-menu" data-toggle="dropdown" style="float:right !important" aria-expanded="false"><i class="fa fa-ellipsis-h"></i></a>'
                + '<span class="badge featured-label" id="featured'+obj._id+'"'
                if(obj.discussionfeatured == true)
                {
                  div = div + 'style="display : block;">'
                }
                else
                {
                  div = div + 'style="display : none;">'
                }
                div = div + 'Featured</span>'
                + '<span class="badge global-label" id="publish'+obj._id+'"'
                if(obj.discussionglobal == true)
                {
                  div = div + 'style="display : block;">'
                }
                else
                {
                  div = div + 'style="display : none;">'
                }
                div = div + 'Global</span>'
                + '<ul class="dropdown-menu dropdown-menu-right dropdown-menu-discussion">'
                + '<li><a class="request-dropdown-options" onclick=deleteDiscussion("'+obj._id+'")>Delete</a></li>'
                + '<li id=""><a class="request-dropdown-options" onclick=toggleDiscussionfeature("'+obj._id+'") id="featureDiscussion'+obj._id+'">'
                if(obj.discussionfeatured == true)
                {
                  div = div + 'UnFeature'
                }
                else
                {
                  div = div + 'Feature'
                }
                div = div + '</a></li>'
                +'<li id=""><a class="request-dropdown-options" onclick=toggleDiscussionpublish("'+obj._id+'") id="publishDiscussion'+obj._id+'">'
                if(obj.discussionglobal == true)
                {
                  div = div + 'UnPublish'
                }
                else
                {
                  div = div + 'Publish To CQ'
                }
                div = div + '</a></li>'
              +'</ul>'
            +'</div>'
          }
        div = div +'<div class="panel-body" style="padding:0; padding-top:10px;">'
                    +'<div class="col-sm-12 col-xs-12 col-lg-12 col-md-12 discussion-title">'
                      +'<a class="discussion-title" href="#" target="">'+obj.discussiontitle+'</a>'
                    +'</div>'
                    +'<div class="col-sm-12 col-xs-12 col-lg-12 col-md-12 discussion-head"> posted by <a href="/viewprofile/'+obj.discussionownerid+'">'+obj.discussionownername+'</a> at '+obj.discussiondate+'</div>'
                  +'</div>'
                  +'<div class="panel-body" style="padding:0;padding-top:10px;">'
                    +'<div class="col-sm-12 col-xs-12 col-lg-12 col-md-12 discussion-content" style="font-size:16px">'+obj.discussiondetail+'</div>'
                  +'</div>'
                  +'<div class="panel-body" style="padding:0;padding-top:10px;">'
                    +'<div class="col-sm-4 col-md-3 col-lg-2 col-xs-8">'
                      +'<a class="comment-btn-discussion" style="cursor : pointer;" onclick=showComments("'+obj._id+'") id="">'
                        +'<i class="fa fa-comment-alt" id="comments-count'+obj._id+'">'+obj.commentslength+'</i> Comments' 
                      +'</a>'
                      +'<a class="show-comment-btn show-hide-comments comment-btn-discussion" onclick=hideComments("'+obj._id+'") id="hide-comments'+obj._id+'">Hide</a>'
                      +'<a class="show-comment-btn show-hide-comments comment-btn-discussion" onclick=showComments("'+obj._id+'") id="show-comments'+obj._id+'">Show</a>'
                    +'</div>'
                  +'</div>'
                  +'<ul class="panel-body all-comments-box" id="allCommentsContainer'+obj._id+'" style="display: block;"></ul>'
                  +'<div class="panel-body comment-panel" id="comment-panel'+obj._id+'" style="border:0;padding:0">'
                    +'<div class="col-sm-12 col-xs-12 col-lg-12 col-md-12 comment-box comment-compose-div-css" style="border-top: 1px solid rgb(223, 223, 223); display: inline;" id="">'
                      +'<div class="col-sm-1 col-md-1 col-xs-2">'
                        +'<img src="'+$('#dpimage').attr('src')+'" class="discussion-comment-user">'
                      +'</div>'              
                      +'<div class="col-sm-11 col-md-11 col-xs-10">'        
                        +'<div class="input-group reply-input">'
                          +'<textarea type="text" autocomplete="off" class="form-control input-md comment-textarea" id="comment'+obj._id+'" placeholder="reply to this discussion..." rows="1" maxlength="1500"></textarea>'
                          +'<span class="input-group-btn" style="padding-left:5px">'
                            +'<button class="btn btn-warning btn-md post-discussion-btn" onclick=addComment("'+obj._id+'")>Post</button>'
                          +'</span>'                    
                        +'</div>'
                      +'</div>'
                    +'</div>'
                  +'</div>'
                +'</div>'
              +'</div>'
    $('#discussionsList').append(div);
  }

  function addCommentstoDom(obj,id)
  {
    console.log(obj);
    let li = '<li class="col-sm-12 col-xs-12 comment-li comment-box" id="commentLi'+obj._id+'">'
              +'<div class="col-sm-1 col-xs-2">'
                +'<img src="'+obj.commentownerphoto+'" class="comment-by-pic">'
              +'</div>'
              +'<div class="col-sm-10 col-xs-10">'
                +'<div class="comment-container">'
                  +'<a style="display : inline; color: #337ab7;" href="/viewprofile/'+obj.commentownerid+'" class="comment-by-user-name">'+obj.commentownername+'</a>'
                  +'<span class="dis-comment-time">'+obj.commentdate+'</span>'
          if(obj.commentownerid == personid)
          {
            li = li +'<i class="fa fa-trash commentOptionButton delComOwner" onclick=deleteComment("'+obj._id+'","'+obj.discussionid+'")></i>' 
          }
          li = li +'<a class="show-reply-btn fa fa-reply commentOptionButton" onclick=showReplyInput("'+obj._id+'") id="reply-count'+obj._id+'"> '+obj.replylength+'</a>'
                  +'<p class="comment-div">'+obj.text+'</p>'
                +'</div>'
              +'</div>'
              +'<div class="col-sm-8 col-xs-10 col-sm-push-1 col-xs-push-2" id="allReplyContainer'+obj._id+'"></div>'
                +'<div class="col-sm-8 col-xs-8 col-sm-push-2 col-xs-push-3 input-group child-reply-input" id="child-reply-input'+obj._id+'">'
                  +'<div class="col-sm-12">'
                    +'<textarea type="text" autocomplete="off" class="form-control input-sm comment-textarea" id="reply'+obj._id+'" placeholder="reply to this comment..." maxlength="1500" style="width:100%"></textarea>'
                  +'</div>'
                  +'<div class="col-sm-12 center-all">'
                    +'<button class="btn btn-primary btn-sm post-discussion-btn" onclick=addReply("'+obj._id+'") style="border-radius:0;margin-top:2px;width:100%">Reply</button>'
                  +'</div>'
                +'</div>'
              +'</li>'
    $('#allCommentsContainer'+id).append(li);
    for(let i in obj.reply)
    {
      addReplytoDom(obj.reply[i],obj._id);
    }
  }

  function addReplytoDom(obj,id)
  {
    console.log(obj);
    let div = '<li class="col-sm-12 col-xs-12 comment-child-li comment-box child" id="replyLi'+obj._id+'">'
                +'<div class="col-sm-1 col-xs-2">'
                  +'<img src="'+obj.replyownerphotoname+'" class="comment-by-pic-child">'
                +'</div>'
                +'<div class="col-sm-10 col-xs-10">'
                  +'<div class="comment-container">'
                    +'<a style="display : inline; color: #337ab7;" href="/viewprofile/'+obj.replyownerid+'" class="comment-by-user-name">'+obj.replyowername+'</a>'
                    +'<span class="dis-comment-time">'+obj.replydate+'</span>'
       if(obj.replyownerid == personid)
       {
         div = div+'<i class="fa fa-trash commentOptionButton delComOwner" onclick=deleteReply("'+obj._id+'","'+obj.commentid+'")></i>'
       }  
        div = div +'<p class="comment-div-child">'+obj.text+'</p>'
                  +'</div>'
                +'</div>'
              +'</li>'
    $('#allReplyContainer'+id).append(div);
  }

  function showComments(id)
  {
    if($('#allCommentsContainer'+id+' li').length == 0)
    {
      let obj = {
        discussionid : id
      }
      let request = new XMLHttpRequest();
      request.open('POST','/getDiscussionComments');
      request.setRequestHeader("Content-Type","application/json");
      request.send(JSON.stringify(obj));
      request.onload = function()
      {
        var data = JSON.parse(request.responseText);
        for(let i in data)
        {
          addCommentstoDom(data[i],id);
        }
      }
    }
    $('#comment-panel' + id).show();
    $('#allCommentsContainer'+id).show();
    $('#hide-comments' + id).show();
    $('#show-comments'+id).hide();
  }

  function hideComments(id)
  {
    $('#comment-panel' + id).hide();
    $('#allCommentsContainer'+id).hide();
    $('#show-comments'+id).show();
    $('#hide-comments' + id).hide();
  }

  function addComment(id)
  {
    let obj = {
      text : $('#comment' + id).val(),
      discussionid : id,
    }
  let request = new XMLHttpRequest();
  request.open('POST','/addComment');
  request.setRequestHeader("Content-Type","application/json");
  request.send(JSON.stringify(obj));
  request.onload = function()
  {
    addCommentstoDom(JSON.parse(request.responseText),id);
    $('#comment' + id).val("");
    let count = $('#comments-count'+id).html();
    console.log(count);
    $('#comments-count'+id).html(parseInt(count)+1);
  }
}

function addReply(id)
{
  let reply = $('#reply'+id).val();
  if(reply == "")
  return;
  let obj = {
    commentid : id,
    text : $('#reply'+id).val()
  }
  let request = new XMLHttpRequest();
  request.open('POST','/addReply');
  request.setRequestHeader("Content-Type","application/json");
  request.send(JSON.stringify(obj));
  request.onload = function()
  {
    addReplytoDom(JSON.parse(request.responseText),id);
    $('#reply' + id).val("");
    let count = $('#reply-count'+id).html();
    $('#reply-count'+id).html(parseInt(count)+1);
  }
}

function deleteReply(replyid,commentid)
{
    $.confirm({
     title: 'Delete Reply',
     content: 'Are you sure you want to delete this reply',
     draggable: true,
     buttons: {
      Yes: {
           btnClass: 'btn-success',
            action: function ()
            {
              let obj = {
                replyid : replyid,
                commentid : commentid
              }
              let request = new XMLHttpRequest();
              request.open('POST','/deleteReply');
              request.setRequestHeader("Content-Type","application/json");
              request.send(JSON.stringify(obj));
              request.onload = function()
              {
                let count = $('#reply-count'+commentid).html();
                $('#replyLi'+replyid).remove();
                $('#reply-count'+commentid).html(parseInt(count)-1);
          
              }
            }
     },
      No: {
          btnClass: 'btn-danger',
           action: function () {}
     },
    }
    });
  }

function deleteComment(commentid,discussionid)
{
  $.confirm({
    title: 'Delete Comment',
    content: 'Are you sure you want to delete this comment',
    draggable: true,
     buttons: {
      Yes: {
           btnClass: 'btn-success',
            action: function ()
            {
              let obj = {
                commentid : commentid,
                discussionid : discussionid
              }
              let request = new XMLHttpRequest();
              request.open('POST','/deleteComment');
              request.setRequestHeader("Content-Type","application/json");
              request.send(JSON.stringify(obj));
              request.onload =() => {
                let count = $('#comments-count'+discussionid).html();
                $('#commentLi'+commentid).remove();
                $('#comments-count'+discussionid).html(parseInt(count)-1);
              }
            }
     },
      No: {
          btnClass: 'btn-danger',
           action: function () {}
     },
    }
  });
}

function toggleDiscussionfeature(discussionid)
{
  let value;
  if($('#featured'+discussionid).css('display') == 'none')
  {
    value = true;
  }
  else
  {
    value = false;
  }
  console.log(value);

  let obj = {
    discussionid : discussionid,
    value : value
  }
  let request = new XMLHttpRequest();
  request.open('POST','/featureDiscussion');
  request.setRequestHeader("Content-Type","application/json");
  request.send(JSON.stringify(obj));
  request.onload =() => {
      if(value == false)
      {
        $('#featured'+discussionid).css('display','none')
        $('#featureDiscussion'+discussionid).html("Feature")
      }
      else 
      {
        $('#featured'+discussionid).css('display','block')
        $('#featureDiscussion'+discussionid).html("UnFeature")
      }
  }
}

function toggleDiscussionpublish(discussionid)
{
  
  let value;
  if($('#publish'+discussionid).css('display') == 'none')
  {
    value = true;
  }
  else
  {
    value = false;
  }
  console.log(value);
  
  let obj = {
    discussionid : discussionid,
    value : value
  }
  let request = new XMLHttpRequest();
  request.open('POST','/globalDiscussion');
  request.setRequestHeader("Content-Type","application/json");
  request.send(JSON.stringify(obj));
  request.onload =() => {
    if(value == false)
      {
        $('#publish'+discussionid).css('display','none')
        $('#publishDiscussion'+discussionid).html('Publish To CQ')

      }
      else 
      {
        $('#publish'+discussionid).css('display','block')
        $('#publishDiscussion'+discussionid).html('UnPublish')
      }
  }
}

function deleteDiscussion(discussionid)
{
  $.confirm({
    title: 'Delete Discussion',
    content: 'Are you sure you want to delete this discussion',
    draggable: true,
     buttons: {
      Yes: {
           btnClass: 'btn-success',
            action: function ()
            {
              let obj = {
                discussionid : discussionid
              }
              let request = new XMLHttpRequest();
              request.open('POST','/deleteDiscussion');
              request.setRequestHeader("Content-Type","application/json");
              request.send(JSON.stringify(obj));
              request.onload =() => {
                $('#discussion'+discussionid).remove();
              }
            }
     },
      No: {
          btnClass: 'btn-danger',
           action: function () {}
     },
    }
  });
}

function showReplyInput(replyid)
{
  $('#child-reply-input' + replyid).show();
}

  function serializeObject(obj)
  {
    let o = new Object();
    let name,val;
    for(let i=0 ;i<obj.length;i++)
    {
      name = obj[i].name;
      val = obj[i].value;
      o[name] = val;
    }
    return o;
  }

  $('#createDiscussionForm').submit(function()
  {
    event.preventDefault();
    let obj = $('form').serializeArray();
    console.log(obj);
    obj = serializeObject(obj);
    obj.communityid = id;
    console.log(obj);
    
    let request = new XMLHttpRequest();
    request.open('POST','/createDiscussion');
    request.setRequestHeader("Content-Type","application/json");
    request.send(JSON.stringify(obj));
    request.onload = function()
    {
      obj = JSON.parse(request.responseText);
      obj.discussioncomments = [];
      addtoDiscussionsDOM(obj);
      $('.comment-panel').hide();
      $('.all-comments-box').hide();
    }
  })

  // <span class="badge global-label" id="global5dbdae061ebbf74254c65c17" style="display: block;">Global</span>
  // <span class="badge featured-label" id="featured5dbdae061ebbf74254c65c17" style="display: block;">Featured</span>