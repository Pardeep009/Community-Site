const tag = require('../Models/tag');

exports.getTags = (req,res) => {

    if(req.body.order[0].column==0)
    {
        if(req.body.order[0].dir=="asc")
        getdata("tagname",1);
        else
        getdata("tagname",-1);
    }
    else if(req.body.order[0].column==1)
    {
        if(req.body.order[0].dir=="asc")
        getdata("tagcreator",1);
        else
        getdata("tagcreator",-1);
    }
    else if(req.body.order[0].column==2)
    {
        if(req.body.order[0].dir=="asc")
        getdata("tagdate",1);
        else
        getdata("tagdate",-1);
    }
    else {
        getdata("tagname",1);
    }


    function getdata(colname,sortorder)
    {
        tag.countDocuments(function(e,count){
        let start=parseInt(req.body.start);
        let len=parseInt(req.body.length);
        let search=req.body.search.value;
        let getcount=10;

        var findobj = {
            tagflag : "1",
        };
        if(search!='')
            findobj["$or"]= [{
            "tagname":  { '$regex' : search, '$options' : 'i' }
        }, {
            "tagcreator":{ '$regex' : search, '$options' : 'i' }
        },{
            "tagdate": { '$regex' : search, '$options' : 'i' }
        }]
        else {
            delete findobj["$or"];
        }


        tag.find(findobj).countDocuments(function(e,coun){
        getcount=coun;
        }).catch(err => {
        console.error(err)
        res.send(error)
        })

        tag.find(findobj).skip(start).limit(len).sort({[colname] : sortorder})
        .then(data => {
            res.send({"recordsTotal" : count,"recordsFiltered" :getcount,data})
            })
            .catch(err => {
            console.error(err);
            })
        });
    }
}

exports.addtag = (req,res) => {
    tag.create(req.body,function(error,result)
    {
        if(error)
            throw error;
        else
        {
            res.end();
        }
    })
}

exports.deleteTag = (req,res) => {
    tag.updateOne({ "_id" : req.body._id },{ $set : { tagflag : "0" } },function(error,result)
    {
        if(error)
            throw error;
        else {
            res.end();
        }
    })
}