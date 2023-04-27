const Item = require('../models/product');
const Cart = require('../models/cart')
exports.getProducts = (req, res, next) => {
  Item.findAll()
  .then(items=>{
    res.render('shop/product-list', {
      prods: items,
      pageTitle: 'All Products',
      path: '/products'
    });
  })
  .catch((err)=>{
    console.log(err)
  })
};
exports.getProduct=(req,res,next) =>{
  const prodId=req.params.productId;
  Item.findAll({where : {id : prodId}})
 .then(items=>{
    res.render('shop/product-detail',{
      product:items[0],
      pageTitle:items[0].title,
      path:'/products'
      })
  })
  .catch(err => console.log(err))
  }
exports.getIndex = (req, res, next) => {
  Item.findAll()
  .then(items =>{
    res.render('shop/index', {
      prods: items,
      pageTitle: 'Shop',
      path: '/'
    });
  })
  .catch(err =>{
    console.log(err)
  })
};

exports.getCart = (req, res, next) => {
  req.user.getCart()
  .then(cart=>{
   return cart.getItems()
   .then(items=>{
    res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products:items
      });
   })
  })
  .catch(err=>console.log(err))
  // res.render('shop/cart', {
  //   path: '/cart',
  //   pageTitle: 'Your Cart'
  // });
};

exports.postCart = (req,res,next) => {
  const prodId = req.body.productId;
  let fetchedCart;
  let newQuantity = 1;
  req.user
    .getCart()
    .then(cart => {
      fetchedCart = cart;
      return cart.getItems({ where: { id: prodId } });
    })
    .then(products => {
      let product;
      if (products.length > 0) {
        product = products[0];
      }

      if (product) {
        const oldQuantity = product.cartItem.quantity;
        newQuantity = oldQuantity + 1;
        return product;
      }
      return Item.findByPk(prodId);
    })
    .then(product => {
      return fetchedCart.addItem(product, {
        through: { quantity: newQuantity }
      });
    })
    .then(() => {
      res.redirect('/cart');
    })
    .catch(err => console.log(err));
}
exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user
    .getCart()
    .then(cart => {
      return cart.getItems({ where: { id: prodId } });
    })
    .then(products => {
      const product = products[0];
      return product.cartItem.destroy();
    })
    .then(result => {
      res.redirect('/cart');
    })
    .catch(err => console.log(err));
};


exports.getOrders = (req, res, next) => {
  res.render('shop/orders', {
    path: '/orders',
    pageTitle: 'Your Orders'
  });
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout'
  });
};
