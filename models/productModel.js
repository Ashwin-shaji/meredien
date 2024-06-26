const mongoose=require('mongoose')

const productSchema=new mongoose.Schema({

    name:{
        type:String,
        requied:true
    },
    description:{
        type:String,
        required:true
    },
    images:[{
        type:String
    }],
    // category: {
    //     type: String, // Example: Assuming category is of type String
    //     required: true // Example: If category is required
    // },

    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'category',
        required:true
    },
    price:{
        type:Number,
        required:true,
        default:0,
    },
    discountPrice:{
       type: Number,
       default: 0,
    },
    countInStock: {
       type: Number,
       required: true,
       min: 0,
       max: 100
    },
    rating: {
       type: Number,
       default: 0,
    },
    isFeatured: {
      type: Boolean,
      default: true
   },
   is_deleted:{
      type:Boolean,
      default: true
   }
});



module.exports = mongoose.model('product', productSchema);
