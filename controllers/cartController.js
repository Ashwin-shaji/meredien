const User=require('../models/userModel');
const product=require('../models/productModel');
const categoryModel=require('../models/categoryModel')
const Cart=require('../models/cartModel')


const loadCart = async (req, res) => {
    try {
        const userId = req.session.user;
        console.log(userId);
        let userCart = await Cart.findOne({ userId: userId }).populate({ path: 'items.productId', model: 'products' }) || null;

        console.log(userCart);
        if (userCart !== null) {
            if (userCart.items.length > 0) {
                
                const validItems = userCart.items.filter(item => item.productId.countInStock > 0);

                
                if (validItems.length === 0) {
                    return res.send('<script>alert("All items in your cart are currently out of stock."); window.location.href = "/cart";</script>');
                }

                
                userCart.items = validItems;
            }
        } else {
            
            userCart = { items: [] };
        }
        
        
        res.render('cart', { cartData: userCart });

    } catch (error) {
        console.log(error.message);
    }
}


module.exports={
    loadCart
}

