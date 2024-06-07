const productModel = require("../models/productModel");
const categoryModel = require('../models/categoryModel');
const userModel = require('../models/userModel');

const loadProduct = async (req, res) => {
    try {

        const productdetails = await productModel.find({}).populate('category');
        const categorydetails = await categoryModel.find();
        console.log(productdetails,"detailspdt");
        res.render('product', { product: productdetails, category: categorydetails, message: null });
    } catch (error) {
        console.log(error.message)
    }
}; 

const loadAddProduct=async(req,res)=>{
    try{
        const category=await categoryModel.find({})
        res.render('addProduct',{category})
    }
    catch(err){
        console.log(err.message);

    }
}

const addProduct = async (req, res) => {
    try {
        const images = [];
        console.log(req.files);
        if (req.files && req.files.length > 0) {
            for (let i = 0; i < req.files.length; i++) {
                images.push(req.files[i].filename);
            }
        } else {
            console.log('No files were uploaded');    
        }

        console.log(req.body.name,
            req.body.description,
            images,   
            req.body.stock,
            req.body.category,
            req.body.price,
        req.body.discountPrice);
       
        let product = {};
        product = new productModel({
            name: req.body.name,
            description: req.body.description,
            images: images,
            countInStock: req.body.stock,
            category: req.body.category,
            price: req.body.price,
            discountPrice:req.body.discountPrice
        });
        const savedProduct = await product.save();
        if (savedProduct) {
            return res.redirect('/admin/product');
        } 
    } catch (error) {
        console.error('Error saving product:', error.message);
      
    }
};


const activeStatus = async (req, res) => {
    try {
        const { id, action } = req.query;
        if (action === 'Activate') { 
            await productModel.findByIdAndUpdate(id, { is_deleted: false });
        } else if (action === 'Deactivate') {
            await productModel.findByIdAndUpdate(id, { is_deleted: true });
        } else {
        
            return res.status(400).json({ message: 'Invalid action' });
        }
        res.redirect('/admin/product');
    } catch (error) {
        console.error('Error updating product status:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};


const loadEdit = async (req, res) => {
    try {
     
        const id = req.query.id;
        const proData = await productModel.findById(id);
        const catData = await categoryModel.find({});
        const imageToDelete = req.query.delete;
        
        if (imageToDelete) {
            const index = proData.images.indexOf(imageToDelete);
            if (index > -1) {
                proData.images.splice(index, 1);
                await productModel.findByIdAndUpdate(id, { images: proData.images });
                console.log("Image deleted successfully.");
            } else {
                console.log("Image not found in the array.");
            }
        }
        res.render("editProduct", { cate: catData, product: proData });
    } catch (error) {
        console.log(error.message);
        res.status(500).send('Internal Server Error');
    }
};

  

const editProduct = async (req, res) => {
    try {
        let existingImages = [];
        const existingProduct = await productModel.findById(req.query.id);
        const category = await categoryModel.find({});

        if (existingProduct && existingProduct.images && Array.isArray(existingProduct.images)) {
            existingImages = existingProduct.images;
        }

        let newImages = [];
        if (req.files && Array.isArray(req.files)) {
            newImages = req.files.map(file => file.filename);
        }

        const allImages = existingImages.concat(newImages);
        
        // if (allImages.length > 3) {
        //     res.render('editProduct', { cate: categorydetails, product: existingProduct, message: 'Maximum 3 images per product' });
        // }


            await productModel.findByIdAndUpdate(req.query.id, {
                $set: {
                    name: req.body.name,
                    description: req.body.description,
                    images: allImages,
                    category: req.body.category,
                    price: req.body.price,
                    countInStock: req.body.stock,
                    discountPrice: category.discountPrice || 0
                }
            });
        
            res.redirect('/admin/product');
        
    } catch (error) {
        console.log('Update product:', error.message);
        res.status(500).send('An error occurred while updating the product.');
    }
};






module.exports = {
    loadProduct,
    editProduct,
    addProduct,
    activeStatus,
    loadEdit,
    loadAddProduct
    
}