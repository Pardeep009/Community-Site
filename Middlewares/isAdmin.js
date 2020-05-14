
module.exports = function(req,res,next)
{
    if(req.session.data.role == 'admin')
    {
        next();
    }
    else {
        res.redirect('/');
    }
}