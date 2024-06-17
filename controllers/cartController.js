const User=require('../models/userModel');
const product=require('../models/productModel');
const categoryModel=require('../models/categoryModel')
const Cart=require('../models/cartModel');
const productModel = require('../models/productModel');



const loadCart = async (req, res) => {
    
    try {
        
        const userId = req.session.user;
        console.log(userId);
        let userCart = await Cart.findOne({ userId: userId }).populate({ path: 'items.productId', model: 'product' }) || null;

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

const add_to_cart=async(req,res)=>{
    try {
        
        const userId=req.session.user
        const productId=req.body.id;

        const product=await productModel.findById(productId)
        if(!product){

            return res.status(404).json({ message: 'Product not found' });
        }

        let userCart=await Cart.findOne({userId:userId})

        if(!userCart){
            userCart=new Cart({
                userId:userId,
                items:[{ 
                    productId:product._id,
                    subTotal:product.price,
                    quantity:1
                }],
                total:product.price
            })
            await userCart.save();
            return res.json({status:true});
        }else{
            const existingCartItem=userCart.items.find(item => item.productId.toString()=== productId);

            
            if (existingCartItem) {
                // Check if quantity is less than the maximum allowed and less than 5
                if (existingCartItem.quantity < product.countInStock && existingCartItem.quantity < 5) {
                    existingCartItem.quantity += 1;
                    existingCartItem.subTotal = existingCartItem.quantity * product.price;
                } else {
                    return res.status(400).json({ message: 'Maximum quantity per person reached' });
                }
            } else {
                userCart.items.push({
                    productId: productId,
                    quantity: 1,
                    subTotal: product.price,
                });
            }

            userCart.total = userCart.items.reduce((total, item) => total + item.subTotal, 0);
            await userCart.save();
            return res.redirect('/cart');
        }


    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: 'Internal server error' });
    }
}



const increment = async (req, res) => {
    try {
        console.log("User ID:", req.session.user); // Log session user ID
        const { pdtId, qty } = req.body;
        const quantity = parseInt(qty);
        const pdtData = await productModel.findById(pdtId); 
       
        const stock = pdtData.countInStock;
        const prices = pdtData.price; 

        const filter = { userId: req.session.user, 'items.productId': pdtData._id };
        console.log("Filter:", filter); // Log filter object

        const findCart = await Cart.findOne({ userId: req.session.user });
        console.log("Cart:", findCart); // Log findCart object

        if (!findCart) {
            return res.status(404).json({ error: "Cart not found" });
        }

        if (stock > quantity) {
            if (quantity < 5) {
                const update = { 
                    $inc: { 
                        "items.$.quantity": 1, 
                        "items.$.subTotal": prices, 
                        "total": prices // Increment total by the price of the product
                    } 
                };
                
                const updatedCart = await Cart.findOneAndUpdate(filter, update, { new: true });
                res.json({ status: true, total: updatedCart.total });
            } else {
                res.json({ status: "minimum" });
            }
        } else {
            res.json({ status: "stock" });
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: error.message }); // Sending error response
    }
}


const decrement = async (req, res) => {
    try {
        console.log("User ID:", req.session.user); // Log session user ID
        const { pdtId, qty } = req.body;
        const pdtIdString = pdtId.toString();
        const quantity = parseInt(qty);
        const pdtData = await productModel.findById(pdtIdString); 
        const prices = pdtData.price;

        const filter = { userId: req.session.user, 'items.productId': pdtIdString };
        console.log("Filter:", filter); // Log filter object

        const findCart = await Cart.findOne({ userId: req.session.user });
        console.log("Cart:", findCart); // Log findCart object

        if (!findCart) {
            return res.status(404).json({ error: "Cart not found" });
        }

        if (quantity > 1) {
            const update = {
                $inc: { "items.$.quantity": -1, "items.$.subTotal": -prices, "total": -prices }
            };

            const updatedCart = await Cart.findOneAndUpdate(filter, update, { new: true });
            res.json({ status: true, total: updatedCart.total });
        } else {
            res.json({ status: "minimum" });
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: error.message });
    }
}

const removeCart = async (req, res) => {
    try {
        const id = req.body.id;
        const sbt = parseFloat(req.body.sbt);

        if (!req.session.user) {
            return res.status(401).json({ error: "User not authenticated" });
        }

        const userId = req.session.user;

        // Find and update the cart, pulling the item with the productId and decrementing total
        const delePro = await Cart.findOneAndUpdate(
            { userId: userId },
            {
                $pull: { items: { productId: id } },
                $inc: { total: -sbt }
            },
            { new: true } // Return the updated document
        );
        
        // If no cart is found for the user, return 404
        if (!delePro) {
            return res.status(404).json({ error: "Cart not found" });
        }

        // Respond with success and the updated total
        res.json({ status: true, total: delePro.total.toFixed(2) }); // Ensure total is formatted as fixed decimal
    } catch (error) {
        console.error("Error removing product from cart:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};





module.exports={
    loadCart,
    add_to_cart,
    increment,
    decrement,
    removeCart
}

