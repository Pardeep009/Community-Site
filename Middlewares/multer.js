const path = require('path')
const multer = require('multer');

let photoname ;

const storage = multer.diskStorage({
    destination : './public/uploadimages/',
    filename : function(req, file, callback)
    {
        photoname ='/' + file.fieldname + '-' + Date.now() + '@' +path.extname(file.originalname);
        callback(null,photoname);
    }
})

exports.upload = multer({
    storage : storage,
    photoname : photoname,
    // limits : {
    //   fileSize : 100000
    // }
}).single('myImage');

