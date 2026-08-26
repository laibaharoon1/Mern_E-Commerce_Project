const Order = require("../../models/Order");

// FIX 1: Rename this to match what the Route is importing
const getAllOrdersForAdmin = async (req, res) => {
  try {
    const orders = await Order.find({});
    res.status(200).json({ success: true, data: orders });
  } catch (e) {
    res.status(500).json({ success: false, message: "Error fetching orders" });
  }
};

// FIX 2: Add the missing "details" function that your Route file is calling
const getOrderDetailsForAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);

    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    res.status(200).json({ success: true, data: order });
  } catch (e) {
    res.status(500).json({ success: false, message: "Error fetching order details" });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { orderStatus } = req.body;

    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    order.orderStatus = orderStatus;
    await order.save();

    res.status(200).json({ success: true, message: "Status updated!" });
  } catch (e) {
    res.status(500).json({ success: false, message: "Update failed" });
  }
};

// FIX 3: Export them with the names the Route expects
module.exports = { 
  getAllOrdersForAdmin, 
  getOrderDetailsForAdmin, 
  updateOrderStatus 
};