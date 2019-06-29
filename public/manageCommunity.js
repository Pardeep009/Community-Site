  var data;

  function hello()
  {
    console.log("hello");
  }

  function showUsers()
  {
    // document.getElementsByClassName('manageCommunity-btn-active').classList.remove('manageCommunity-btn-active');
    // $('this').addClass("manageCommunity-btn-active");
   // document.getElementsByClassName('manageCommunity-btn-active').classList.remove('manageCommunity-btn-active');
   // $('#UsersShowBtn').addClass("manageCommunity-btn-active");
   $('#userlist').show();
   $('#invitationlist').hide();
   $('#requestlist').hide();
   $('#managerlist').hide();
  }

  function showManager()
  {
    // document.getElementsByClassName('manageCommunity-btn-active').classList.remove('manageCommunity-btn-active');
    // $('#AdminsShowBtn').addClass("manageCommunity-btn-active");
    $('#userlist').hide();
    $('#invitationlist').hide();
    $('#requestlist').hide();
    $('#managerlist').show();
  }

  function showRequest()
  {
    // document.getElementsByClassName('manageCommunity-btn-active').classList.remove('manageCommunity-btn-active');
    // $('#requestedUserShowBtn').addClass("manageCommunity-btn-active");
    $('#userlist').hide();
    $('#invitationlist').hide();
    $('#requestlist').show();
    $('#managerlist').hide();
  }

  function showInvitation()
  {
    // document.getElementsByClassName('manageCommunity-btn-active').classList.remove('manageCommunity-btn-active');
    // $('#invitedUserShowBtn').addClass("manageCommunity-btn-active");
    $('#userlist').hide();
    $('#invitationlist').show();
    $('#requestlist').hide();
    $('#managerlist').hide();
  }

  window.onload= function()
  {
     // $('#userlist').hide();
    $('#invitationlist').hide();
     $('#requestlist').hide();
    $('#managerlist').hide();
    var id = $('#id').html();
    var obj = Object();
    obj._id = id;
    var request = new XMLHttpRequest()
    request.open('POST','/getMembers')
    request.setRequestHeader("Content-Type","application/json");
    request.send(JSON.stringify(obj));
    request.onload = function()
    {
      data = JSON.parse(request.responseText);
      console.log(data);
      for(i=0;i<data.communitymember.length;i++)
      {
        addtoDOM1(data.communitymember[i],id);
      }
      for(i=0;i<data.communityrequest.length;i++)
      {
        addtoDOM2(data.communityrequest[i]);
      }
      for(i=0;i<data.invitations.length;i++)
      {
        addtoDOM3(data.invitations[i]);
      }
         addtoDOM4(data.communityownerid);
        // console.log(data.communityownerid.length);
    }
  }

  function addtoDOM1(obj,id)
  {
    // console.log(obj);
    var div = '<div class="col-sm-12 col-xs-12 allcoms community-user-div" id="'+obj._id+'" style="margin-top:5px;"><div class="col-sm-2 col-xs-3" style="padding:5px;"><a href="/viewprofile/'+obj._id+'"><img src="'+obj.photoname+'" class="community-member-pic"></a></div><div class="col-sm-8 col-xs-6 scrollable"><a class="comusername" href="/viewprofile/'+obj._id+'">'+obj.name+'</a></div><div class="col-sm-2 col-xs-3"><a class="community-user-short-btn" onclick="" style="float:left"><i class="fa fa-chevron-up"></i></a><a class="community-user-short-btn" style="float:right" onclick="removeUser('+obj._id+','+id+')"><i class="fa fa-times"></i></a></div></div>'
    $("#userlist").append(div);
  }

  function addtoDOM2(obj)
  {
    // console.log(obj);
    var div = '<div class="col-sm-12 col-xs-12 allcoms community-user-div" id="'+obj._id+'" style="margin-top:5px;"><div class="col-sm-2 col-xs-3" style="padding:5px;"><a href="/viewprofile/'+obj._id+'"><img src="'+obj.photoname+'" class="community-member-pic"></a></div><div class="col-sm-8 col-xs-6 scrollable"><a class="comusername" href="/viewprofile/'+obj._id+'">'+obj.name+'</a></div><div class="col-sm-2 col-xs-3"><div class="dropdown"><div class="dropup request-btn-dropdown"><button class="btn btn-default dropdown-toggle" type="button" data-toggle="dropdown" style="float:right !important">Option</button> <ul class="dropdown-menu dropdown-menu-right"><li><a class="request-dropdown-options" onclick=acceptRequest("'+obj._id+'")>Accept</a></li><li><a class="request-dropdown-options" onclick=rejectRequest("'+obj._id+'")>Reject</a></li></ul></div></div></div></div>'
    $("#requestlist").append(div);
  }

  function addtoDOM3(obj)
  {
    // console.log(obj);
    var div = '<div class="col-sm-12 col-xs-12 allcoms community-user-div" style="margin-top:5px;"><div class="col-sm-2 col-xs-3" style="padding:5px;"><a href="/viewprofile/'+obj._id+'"><img src="'+obj.photoname+'" class="community-member-pic"></a></div><div class="col-sm-8 col-xs-6 scrollable"><a class="comusername" href="/viewprofile/'+obj._id+'">'+obj.name+'</a></div><div class="col-sm-2 col-xs-3"><a class="community-user-short-btn" onclick="" style="float:right"><i class="fa fa-times"></i></a></div></div>'
    $("#invitationlist").append(div);
  }

  function addtoDOM4(obj)
  {
    // console.log(obj);
    var div = '<div class="col-sm-12 col-xs-12 allcoms community-user-div" style="margin-top:5px;"><div class="col-sm-2 col-xs-3" style="padding:5px;"><a href="/viewprofile/'+obj._id+'"><img src="'+obj.photoname+'" class="community-member-pic"></a></div><div class="col-sm-8 col-xs-6 scrollable"><a class="comusername" href="/viewprofile/'+obj._id+'">'+obj.name+'</a></div><div class="col-sm-2 col-xs-3"><span class="label label-success" style="margin-top:25px;float:right">Owner</span></div></div>'
    $("#managerlist").append(div);
  }

  function acceptRequest(userid)
  {
    console.log(userid);
    var obj = Object();
    obj.userid = userid;
    obj.commid = data._id;
    var request = new XMLHttpRequest();
    request.open('POST','/acceptRequest')
    request.setRequestHeader("Content-Type","application/json");
    request.send(JSON.stringify(obj));
    request.onload = function()
    {
      $("#"+userid.toString()).remove();
    }
  }

  function rejectRequest(userid)
  {
    console.log(userid);
    var obj = Object();
    obj.userid = userid;
    obj.commid = data._id;
    var request = new XMLHttpRequest();
    request.open('POST','/rejectRequest')
    request.setRequestHeader("Content-Type","application/json");
    request.send(JSON.stringify(obj));
    request.onload = function()
    {
      var p = document.getElementById(userid.toString());
      p.parentNode.removeChild(p);
    }
  }

  function removeUser(userid,commid)
  {
    $.confirm({
        title: 'Really want remove ?',
        content: 'Do you really want remove this user?',
        draggable: true,
        buttons: {
          Yes: {
               btnClass: 'btn-success',
                action: function ()
                {
                  var obj = Object();
                  obj.userid = userid;
                  obj.commid = commid;
                  var request = new XMLHttpRequest();
                  request.open('POST','/removeUser')
                  request.setRequestHeader('Content-type',"application/json")
                  request.send(JSON.stringify(obj))
                  request.onload = function()
                  {
                    $('#' + userid).remove();
                  }
                   // window.location = '/switchcommunityhome'
                }
        },
          No: {
              btnClass: 'btn-danger',
               action: function () {}
        },
        }
      });
  }
