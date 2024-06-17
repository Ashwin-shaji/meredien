
const User = require('../models/userModel');
const product =require('../models/productModel')
const Cart=require('../models/cartModel')
const Order=require('../models/orderModel')
const Address=require('../models/addressModel')

const loadCheckout = async (req, res) => {
    try {
        // Check if user session is available
        if (!req.session.user) {
            return res.status(401).json({ error: 'User not logged in' });
        }

        // Find the user by session ID
        const userData = await User.findById(req.session.user);
        if (!userData) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Find the cart data and populate the product details
        const cartData = await Cart.findOne({ userId: userData._id }).populate({ path: 'items.productId', model: 'product' });
        if (!cartData) {
            return res.status(404).json({ error: 'Cart not found' });
        }

        // Filter cart items based on stock availability and ensure productId is populated
        const cartItems = cartData.items.filter(item => item.productId && item.productId.countInStock >= 0);

        // Find user addresses
        const address = await Address.find({ userId: userData._id });
        if (!address) {
            return res.status(404).json({ error: 'Address not found' });
        }

        // Render the checkout page with cart items, cart data, and address
        res.render('checkout', { cartItems, cartData, address });
    } catch (error) {
        console.log(error.message);
        res.status(500).send('Server error');
    }
};

module.exports={
    loadCheckout
}