const Category=require('../models/categoryModel');

const loadCategory=async(req,res)=>{
    try {
        const category=await Category.find({});
        res.render('category',{category,message:null})
        
    } catch (error) {
        console.log(error.message);
        
    }
}





const  createCategory=async(req,res)=>{
    try {
        const name =req.body.name;
        const dis=req.body.description;
        const existingcategory= await Category.findOne({
            name:name.toLowerCase()
        });
        if(existingcategory){
            const categorydetails=await Category.find();
                res.render('category',{category:categorydetails,message:'name is already entered'})
        }else{
            //creating a new category odject 
            const cat =new Category({
                name:name.toLowerCase(),
                description:dis
            });
              // Save the new category to the database
        const catData = await cat.save();
        // Respond with a success status
         res.redirect('/admin/category');
  }

    } catch (error) {
        console.log(error.message);
    }
}


const editCategoryLoad = async (req, res) => {
    try {
        const id = req.query.id;
        
    
        const category = await Category.findById(id);

        if (category) {
            res.render('editcategory', { cate:category ,message:null});
        } else {
            res.redirect('/admin/category');
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).send('Internal Server Error');
    }
};


const updateCategory=async(req,res)=>{
    
        try{
          const Data=await Category.findByIdAndUpdate({_id:req.body.id},{$set:{ name:req.body.name,description:req.body.description}});
         
          if(Data){
            res.redirect('/admin/category');
          }
          
        }
        catch(error){
          console.log('update cate',error.message);
          const categorydetails=await categoryModel.findById({_id:req.body.id});
          if (error.code === 11000) {
        
            res.render('admin-edit-cate', {cate:categorydetails,message: 'Duplicate category found' });
          } else {
            res.render('admin-edit-cate',{cate:categorydetails, message: 'Failed to load categories' });
          }
        }
      };


const deleteCategory=async (req,res)=>{
    try {
        const id=req.query.id;
        const category=await Category.findById(id);
        if(category.is_active){
            await Category.findByIdAndUpdate(id,{is_active:false});
            res.redirect('/admin/category')
        }else{
            await Category.findByIdAndUpdate(id,{is_active:true});
              res.redirect('/admin/category')
        }
    } catch (error) {
        console.log(error.message);
        
    }
}



module.exports={
    loadCategory,
    createCategory,
    editCategoryLoad,
    updateCategory,
    deleteCategory
}