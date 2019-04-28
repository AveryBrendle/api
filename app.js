const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const carRoutes = require('./api/routes/cars');
const orderRoutes = require('./api/routes/order');
const userRoutes = require('./api/routes/users')

mongoose.connect('mongodb+srv://admin:' + process.env.MONGO_ATLAS_PW + '@lloydsauto-36jmn.mongodb.net/test?retryWrites=true',
{
    useNewUrlParser: true
});

app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'))
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


//CORS Errors
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers", 
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
        );
        if (req.method === 'OPTIONS') {
            res.header('Accces-Control-Allow-Methods', 'PUT, POST, PATCH, DELTE, GET')
            return res.status(200).json({});
        }
        next();
})

//Routes which should handle requests
app.use('/cars', carRoutes);
app.use('/orders', orderRoutes);
app.use('/user', userRoutes);

app.use((req, res, next) => {
    const error = new Error('Not found')
    error.status = 404;
    next(error);
})

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;