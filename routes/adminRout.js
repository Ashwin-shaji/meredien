const express=require('express');
const adminRoute=express();
const multer=require('multer');

adminRoute.set('view engine', 'ejs');
adminRoute.set('views', './views/admin');

const adminController = require('../controllers/adminController'); 
const category=require('../controllers/categoryController');
const bodyparser=require('body-parser');
const  Product = require('../controllers/productController');
adminRoute.use(bodyparser.json());
adminRoute.use(bodyparser.urlencoded({extended:true}));

adminRoute.use(express.static('public'));

const storage=multer.diskStorage({
    destination:function(req,file,cb){
      cb(null,'./uploads/productImages');
    
    },
    filename:function(req,file,cb){
     
      cb(null,file.originalname);
    }
    });
  
const upload=multer({storage:storage}).array('images', 3);

//login

adminRoute.get('/login',adminController.loadLogin);
adminRoute.post('/login',adminController.verifyLogin);


adminRoute.get('/logout',adminController.loadLogout);


adminRoute.get('/dashboard',adminController.loadDashboard)


adminRoute.get('/category',category.loadCategory)
adminRoute.post('/category',category.createCategory);

adminRoute.get('/edit-cate', category.editCategoryLoad);
adminRoute.post('/edit-cate',category.updateCategory)

adminRoute.get('/delete-cate',category.deleteCategory);

adminRoute.get('/userlist',adminController.userlist);












adminRoute.get('/product',Product.loadProduct);
adminRoute.get('/addproduct',Product.loadAddProduct);
adminRoute.post('/addproduct',upload,Product.addProduct);


adminRoute.get('/active',Product.activeStatus);

adminRoute.get('/edit-product',Product.loadEdit);
adminRoute.post('/edit-product',upload,Product.editProduct);






// adminRoute.get('/product',Product.loadProduct)



adminRoute.get('/block-user',adminController.blockUser);
adminRoute.get('/unblock-user',adminController.unblockUser);


// adminRoute.get('/edit-product',Product.editProduct)

// adminRoute.get('/userlist',adminController.userlist)

module.exports=adminRoute;

