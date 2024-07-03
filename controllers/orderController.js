const User =require('../models/userModel')
const Product=require('../models/productModel')
const Cart=require('../models/cartModel')
const Address=require('../models/addressModel')
const categoryModel=require('../models/cartModel')
const order=require('../models/orderModel')




  const  loadViewOrder=async(req,res)=>{
    try { 
      const id=req.query.id;
    const findOrder=await order.findById(id )
    console.log(findOrder,"findOrder");
    
    const pdtId = [];

  
    for (let i = 0; i < findOrder.items.length; i++) {
      pdtId.push(findOrder.items[i].productId)
    }
    console.log(pdtId, "iddddddddddddd");
    const pdtData = [];

    for (let i = 0; i < pdtId.length; i++) {
      pdtData.push(await Product.findById({ _id: pdtId[i] }))
    }
    console.log(pdtData, "dataaaaaa");

    const orderDateParts = findOrder.orderDate.split('-');
    const orderDay = parseInt(orderDateParts[0], 10);
    const orderMonth = parseInt(orderDateParts[1], 10) - 1; 
    const orderYear = parseInt(orderDateParts[2], 10);
    const orderDate = new Date(orderYear, orderMonth, orderDay);

    // Calculate expected delivery date
    const expectedDeliveryDate = new Date(orderDate);
    expectedDeliveryDate.setDate(expectedDeliveryDate.getDate() + 7);
    
    // Format expected delivery date to "dd-mm-yyyy" format
    const formattedDeliveryDate = `${expectedDeliveryDate.getDate()}-${expectedDeliveryDate.getMonth() + 1}-${expectedDeliveryDate.getFullYear()}`;

    res.render("orderview", { pdtData, findOrder ,expectedDeliveryDate: formattedDeliveryDate})
    } catch (error) {
      console.error('Error when loading orders:', error.message);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  }



  const cancelOrder = async (req, res) => {
    try {
      console.log("inside cancel order lllllllll");
      const id = req.body.id;
      const findOrder = await order.findById(id);
      console.log(findOrder,"order")
  
      if (!findOrder) {
        return res.status(404).json({ error: "Order not found." });
      }
  
      // Cancel order and update product counts
      await order.findByIdAndUpdate(id, { $set: { status: "Canceled" } });
      for (const item of findOrder.items) {
        await Product.findByIdAndUpdate(item.productId, { $inc: { countInStock: item.quantity } });
      }
  
      // Handle refunds for Razorpay payments
      if (findOrder.orderType === "Razorpay") {
        console.log("rezorpay")
        const findUser = await User.findById({_id :req.session.user}); // Assuming user is stored in session
        const date = new Date(); 
        const transactionId = generateTransactionId(); 
        // You need to define generateTransactionId function
  
        const userWallet = await Wallet.findOne({ userId: findUser._id });
  
        if (userWallet) {
          console.log("if working");
          // Update existing wallet
          await Wallet.findByIdAndUpdate(userWallet._id, {
            $inc: { balance: findOrder.totalAmount },
            $push: {
              transactions: {
                id: transactionId,
                date: date,
                amount: findOrder.totalAmount,
                orderType: 'Razorpay',
                type: 'Credit'
              }
            }
          });
        } else {
          console.log("else working");
          // Create new wallet for the user
          const newWallet = new Wallet({
            userId: findUser._id,
            balance: findOrder.totalAmount,
            transactions: [{
              id: transactionId,
              date: date,
              amount: findOrder.totalAmount,
              orderType: 'Razorpay',
              type: 'Credit'
            }]
          });
          await newWallet.save();
        }
      }
  
      return res.json({ status: true });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal server error." });
    }
  };
  
  
  
  
  
  

  
  module.exports={
    
    loadViewOrder,
    cancelOrder
    
  }