var router = require('express').Router();

// auth Login
router.get('/login',(req,res) =>
{

})


app.post('/users' , function (req , res)
{
    // console.log("\n\n\n" + req.body.search.value + "\n\n\n");
    if(req.body.role === 'All' && req.body.status === 'All')
    {
        Login.find({} , {} , {skip : parseInt(req.body.start) , limit : parseInt(req.body.length) } , function (err , data)
        {
            if(err)
            {
                console.log(err);
                return;
            }
            else
                console.log(data);
                Login.countDocuments(function(err , count)
                {
                    if(err)
                    {
                        console.log(err);
                    }
                    else
                    {
                        if (req.body.search.value)
                        {
                            data = data.filter((value) => {
                                return value.email.includes(req.body.search.value)
                            })
                        }
                        res.send({"recordsTotal": count, "recordsFiltered": data.length, data});
                    }
                });
        })
    }
    else if(req.body.role === 'All' && req.body.status !== 'All')
    {
        Login.find({status: req.body.status} , {} , {skip : parseInt(req.body.start) , limit : parseInt(req.body.length) } , function (err , data)
        {
            if(err)
            {
                console.log(err);
                return;
            }
            else
                console.log(data);
            Login.countDocuments(function(err , count)
            {
                if(err)
                {
                    console.log(err);
                }
                else
                {
                    if (req.body.search.value)
                    {
                        data = data.filter((value) => {
                            return value.email.includes(req.body.search.value)
                        })
                    }
                    res.send({"recordsTotal": count, "recordsFiltered": data.length, data});
                }
            });
        })
    }
    else if(req.body.role !== 'All' && req.body.status === 'All')
    {
        Login.find({adminType: req.body.role} , {} , {skip : parseInt(req.body.start) , limit : parseInt(req.body.length) } , function (err , data)
        {
            if(err)
            {
                console.log(err);
                return;
            }
            else
                console.log(data);
            Login.countDocuments(function(err , count)
            {
                if(err)
                {
                    console.log(err);
                }
                else
                {
                    if (req.body.search.value)
                    {
                        data = data.filter((value) => {
                            return value.email.includes(req.body.search.value)
                        })
                    }
                    res.send({"recordsTotal": count, "recordsFiltered": data.length, data});
                }
            });
        })
    }
    else
    {
        Login.find({adminType: req.body.role, status: req.body.status} , {} , {skip : parseInt(req.body.start) ,
            limit : parseInt(req.body.length) } , function (err , data)
        {
            if(err)
            {
                console.log(err);
                return;
            }
            else
                console.log(data);
            Login.countDocuments(function(err , count)
            {
                if(err)
                {
                    console.log(err);
                }
                else
                {
                    if (req.body.search.value)
                    {
                        data = data.filter((value) => {
                            return value.email.includes(req.body.search.value)
                        })
                    }
                    res.send({"recordsTotal": count, "recordsFiltered": data.length, data});
                }
            });
        })
    }
});
