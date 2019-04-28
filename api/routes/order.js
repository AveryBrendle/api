const express = require('express');
const router = express.Router();


//handle incoming GET requests to /orders
router.get('/', (req, res, next) => {
    res.status(200).json ({
        message: 'Orders were fetched'
    });
});

router.post('/', (req, res, next) => {
    const order = {
        productId: req.body.productId,
        //needs to be changed to fit lloyds needs
        quantity: req.body.quantity
    }
    res.status(201).json ({
        message: 'Orders were created',
        order: order
    });
});

router.get('/:orderID', (req, res, next) => {
    res.status(200).json ({
        message: 'Order detail',
        orderID: req.params.orderID
    });
});

router.delete('/:orderID', (req, res, next) => {
    res.status(200).json ({
        message: 'Order deleted',
        orderID: req.params.orderID
    });
});


module.exports = router;