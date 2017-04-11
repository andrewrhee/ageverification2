var router = require('express').Router();
var User = require('../models/user');
var Product = require('../models/product');
var Cart = require('../models/cart');

var stripe = require('stripe')('sk_test_793ajoRzV7wTxWoCtiub4gmo');



router.get('/', function(req, res) {
  res.render('main/home');
});

router.get('/age-verification', function(req, res) {
  res.render('age-verification');
});

router.get('/about', function(req, res) {
  res.render('main/about');
});

router.get('/products/:id', function(req, res, next) {
  Product
    .find({ category: req.params.id })
    .populate('category')
    .exec(function(err, products) {
      if (err) return next(err);
      res.render('main/category', {
        products: products
      });
    });
});

router.get('/product/:id', function(req, res, next) {
  Product
    .findById({ _id: req.params.id })
    .exec(function(err, product) {
      if (err) return next(err);
      res.render('main/product', {
        product: product
      });
    });
});

router.post('/product/:product_id', function(req, res, next) {
  Cart.findOne({ owner: req.user._id }, function(err, cart) {
    console.log('req.body.product_id >>>>> ', req.body.product_id);
    console.log('req.body.priceHidden >>>>> ', req.body.priceHidden);
    console.log('req.body.quantity >>>>> ', req.body.quantity);
    cart.items.push({
      item: req.body.product_id,
      price: parseFloat(req.body.priceHidden),
      quantity: parseInt(req.body.quantity)
    });

    cart.total = (cart.total + parseFloat(req.body.priceHidden)).toFixed(2);

    cart.save(function(err) {
      if (err) return next(err);
      return res.redirect('/cart');
    });
  });
});

router.post('/payment', function(req, res, next) {

  var stripeToken = req.body.stripeToken;
  var currentCharges = Math.round(req.body.stripeMoney * 100);
  stripe.customers.create({
    source: stripeToken,
  }).then(function(customer) {
    return stripe.charges.create({
      amount: currentCharges,
      currency: 'usd',
      customer: customer.id
    });
  });
});

router.get('/cart', function(req, res, next) {
  Cart
    .findOne({ owner: req.user._id })
    .populate('items.item')
    .exec(function(err, foundCart) {
      if (err) return next(err);
      res.render('main/cart', {
        foundCart: foundCart,
        message: req.flash('remove')
      });
    });
});

router.post('/remove', function(req, res, next) {
  Cart.findOne({ owner: req.user._id }, function(err, foundCart) {
    foundCart.items.pull(String(req.body.item));

    foundCart.total = (foundCart.total - parseFloat(req.body.price).toFixed(2));
    foundCart.save(function(err, found) {
      if (err) return next(err);
      req.flash('remove', 'Successfully removed');
      res.redirect('/cart');
    });
  });
});

module.exports = router;
