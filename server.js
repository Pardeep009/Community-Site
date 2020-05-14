
    if(process.env.NODE_ENV !== 'production'){
      require('dotenv').config()
    }

    const express = require('express');
    const app = express();
    const session = require('express-session');

    const path = require('path');

    app.use(express.static(path.join(__dirname,'../public')));
    app.use(express.static(path.join(__dirname,'../public/uploadimages')));

    // view engine setup
    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'ejs');

    app.use(express.urlencoded({extended: true}));
    app.use(express.json());

    app.use(session({
       saveUnintialized: true,
       secret: `${process.env.secret}`,
    }))

    const mongoose = require('mongoose');
    const db_url = process.env.db_url;

    mongoose.connect(db_url);

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