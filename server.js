
    if(process.env.NODE_ENV !== 'production'){
      require('dotenv').config()
    }

    const express = require('express');
    const path = require('path');
    const app = express();
    const session = require('express-session');
    
    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'ejs');

    app.use(express.static(path.join(__dirname,'public')));
    app.use(express.static(path.join(__dirname,'public/uploadimages')));

    app.use(express.urlencoded({extended: true}));
    app.use(express.json());

    app.use(session({
      secret: "xYzUCAchitkara",
      resave: false,
       saveUnintialized: true,
    }))

    const mongoose = require('mongoose');
    const admindb = `mongodb://localhost/${process.env.databasename}`;

    mongoose.connect(admindb);

    mongoose.connection.on('error',(err) => {
      console.log('DB connection Error');
    })

    mongoose.connection.on('connected',(err) => {
      console.log('DB connected');
    })

    app.use('/',require('./Routes/'));

    app.listen(`${process.env.PORT}`,function()
    {
          console.log(`Running on port ${process.env.PORT}`);
    });