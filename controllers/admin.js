const Item = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing : false
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  req.user.createItem(
    {
      title : title,
      price : price,
      imageUrl : imageUrl,
      description : description
    }
  )
  // Item.create(
  //   userId : req.user.id
  // })
  .then(result =>{
    console.log(result)
  })
  .catch(err => {
    console.log(err)
  })
  res.redirect('/admin/products');
};
exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if(!editMode){
    return res.redirect('/')
  }
  const prodId = req.params.productId;
  req.user.getItems({where:{id:prodId}})
 // Item.findByPk(prodId)
  .then(items =>{
    const item =items[0]
    if(!item){
      return res.redirect('/');
    }
    res.render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      editing: editMode,
      product : item
    });
  })
  .catch(err =>{
    console.log(err)
  })
 
};

exports.postEditProduct = (req,res,next) =>{
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;
  Item.findByPk(prodId)
  .then(items =>{
    items.title = updatedTitle;
    items.price = updatedPrice;
    items.description = updatedDesc;
    items.imageUrl = updatedImageUrl;
    return items.save();
  })
  .then(result =>{
    console.log('UPDATED PRODUCT')
  })
  .catch(err => console.log(err))
  res.redirect('/admin/products');
}

exports.getProducts = (req, res, next) => {
  req.user.getItems()
  //Item.findAll()
  .then(items=>{
    res.render('admin/products', {
      prods: items,
      pageTitle: 'Admin Products',
      path: '/admin/products'
    });
  })
  .catch(err => console.log(err));
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Item.findByPk(prodId)
  .then(items =>{
   return items.destroy()
})
.then(result =>{
  console.log('PRODUCT DESTROYED')
})
.catch(err => console.log(err));
res.redirect('/admin/products');
 
};

