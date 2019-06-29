
  var table;
   function getdata() {
     // document.getElementById("users-table").innerHTML=""
     // console.log(role);
     // console.log(status);
     // status="confirmed"
     console.log("hello");
    $.fn.dataTable.ext.errMode = 'none';
    table = $('#community-table').DataTable({        // users-table   table ki id hai naa ki tbody ki
      "processing" : true,
      "serverSide" : true,
      "rowId" : "_id",
      "ajax": {
        "url":"/cl",
        "type":"POST",
        "data" : function(d) {
          d.communitymembershiprule= $('#membership-select').val();
        }
      },
      "columns": [
      {
        "data" : "communityname",
        // id : "_id",
      },
      {
        "data" : "communitymembershiprule",
         "sorting" : "false"
      },
      {
        "data" : "communitylocation"
      },
      {
        "data" : "communityowner",
        // "sorting" : "false",
      },
      {
        "data" : "communitycreatedate",
        // "sorting" : "false",
      },
      {
        "data" : null,
        "sorting" : "false"
      },
      {
        "data" : null,
        "sorting" : "false"
      },
    ],
    "columnDefs": [{
            "targets": 6,

            "render": function (data, type, row, meta) {
              // console.log("0");
                data ='<img src="'+row.communityimage+'" style="width:80px; height:80px;'
                if(row.communityconfirm === 'Active')
                data = data + 'border:4px solid green;"></img>'
                else {
                  data = data + 'border:4px solid red;"></img>'
                }
               return data;
            }

        },{
          "targets" : 5,

          "render" : function (data,type,row,meta) {
            data = '<center><a class="btn btn-sm editbtn actionbtns" data-target="#updateCommunity" data-toggle="modal" onclick=editCommunity("'+row.communitycreatedate+'","'+row.communityowner+'","' + encodeURIComponent(row.communityname) + '","' + encodeURIComponent(row.communityconfirm) + '","'+row._id+'") style="margin-top:35px;background-color: #2D312C;color: #fff"><span class="fa fa-edit"></span></a><a class="btn btn-sm infobtn actionbtns" data-toggle="modal" data-target="#CommunityInfo"  onlcick=showComminfo("' + encodeURIComponent(row.communityname) + '", "' + row.communityimage + '" ,"' + encodeURIComponent(row.communitydescription) + '") style="margin-top:35px;background-color: #2D312C;color: #fff"><span class="fa fa-info"></span></a></center>'
            return data;
          }
        }],
    })

    $('#membership-select').on('change', function () {
	    table.ajax.reload(null, false);
  	});

    $('#refresh').on('change', function () {
	    table.ajax.reload(null, false);
  	});

  	}

  $(document).ready(function() {
    console.log("1");
    getdata()
  })

  function editCommunity(obj,commo,commn,comms,_id)
  {
      commn = decodeURIComponent(commn)
      comms = decodeURIComponent(comms)
      $('#CommunityNamePop').html("Update " + commn);
      $('#CommunityAdminPop').html("Created by " + commo + "," + obj);
      $('#CommuityName').val(commn);
      $('#communityStatus').val(comms);
      $('#editsubmit').off('click').on('click', function() {
        var obj = Object();
        obj._id = _id;
        obj.communityname = $('#CommuityName').val();
        obj.communityconfirm = $('#communityStatus').val();
        var request = new XMLHttpRequest()
        request.open('POST','/updateCommunity')
        request.setRequestHeader("Content-Type","application/json");
        request.send(JSON.stringify(obj));
        request.onload = function ()
        {
          alert('UPDATED');
          table.ajax.reload(null,false);
        }
      });
  }

  function showComminfo(commn,i,commd)
  {
    console.log("32");
    console.log("644343");
    commn = decodeURIComponent(commn)
    commd = decodeURIComponent(commd)
    // $('#CommunityProfilePic').attr("src",image);
  }
