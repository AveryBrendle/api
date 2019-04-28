const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');

const CarController = require('../controllers/cars');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads');
    },
    filename: function(req, file, cb){
        cb(null, Date.now() + file.originalname)
    }
});

const fileFilter = (req, file, cb) => {
    //reject file
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
        cb(null, true);
    } else{
        cb(null, false);
    }
    
};
const upload = multer({
    storage: storage, 
    limits: {
     fileSize: 1024 * 1024 * 7
    },
    fileFilter: fileFilter
});

const Car = require('../models/cars');

router.get('/', CarController.cars_get_all);

router.post("/", checkAuth, upload.single('carImage'), (req, res, next) => {
    console.log(req.file);
    const car = new Car({
        _id: new mongoose.Types.ObjectId(),
        make: req.body.make,
        model: req.body.model,
        price: req.body.price,
        carImage: req.file.path
    });
    car
        .save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: 'Handling POST requests to /cars',
                createdCar: {
                    make: result.make,
                    model: result.model,
                    price: result.price,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/cars/' + result._id
                    }
                },
            });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        })
    });
});

router.get('/:carID', (req, res, next) => {
    const id = req.params.carID;
    Car.findById(id)
        .select('make model price')
        .exec()
        .then(doc => {
            console.log("From database", doc);
            if (doc) {
                res.status(200).json({
                    product: doc,
                    request : {
                        type: 'GET',
                        url: 'http://localhost:3000/cars/'
                    }
                });
            } else {
                res.status(404).json({message: 'No valid entry found for provided ID'});
            }
            
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: err})
        });

});

router.patch('/:carID', checkAuth, (req, res, next) => {
    const id = req.params.carID;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Car.update({_id: id}, { $set: updateOps })
        .exec()
        .then(result => {
            console.log(result);
            res.status(200).json({
                message: 'Product Updated',
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/cars' + id
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

router.delete('/:carID', checkAuth, (req, res, next) => {
    const id = req.params.carID;
    const name = req.params.model;
    Car.remove({_id: id})
    .exec()
    .then(result => {
        res.status(200).json({
            message: 'Car Deleted', 
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

module.exports = router;