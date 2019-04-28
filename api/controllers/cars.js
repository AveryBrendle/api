const Car = require('../models/cars');

exports.cars_get_all = (req, res, next) => {
    Car.find()
        .select('model make price carImage')
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                cars: docs.map(doc => {
                    return {
                        make: doc.make,
                        model: doc.model,
                        price: doc.price,
                        id: doc._id,
                        carImage: doc.carImage, 
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/cars/' + doc._id
                        }
                    }
                })
            }
            res.status(200).json(response);
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                error: err
            });
        });
}