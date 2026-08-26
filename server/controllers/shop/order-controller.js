const paypal = require("../../helpers/paypal");
const Order = require("../../models/Order");
const Cart = require("../../models/Cart");
const Address = require("../../models/Address");

const clientUrl = process.env.CLIENT_ORIGIN || "http://localhost:5173";

const createOrder = async (req, res) => {
  try {
    const userId = String(req.user.id);
    const cart = await Cart.findOne({ userId }).populate("items.productId");
    const address = await Address.findOne({ _id: req.body.addressInfo?.addressId, userId });
    if (!cart?.items?.length) return res.status(400).json({ success: false, message: "Cart is empty" });
    if (!address) return res.status(400).json({ success: false, message: "A valid address is required" });

    const cartItems = cart.items.map(({ productId, quantity }) => {
      if (!productId || productId.totalStock < quantity) throw new Error("One or more products are unavailable");
      const price = productId.salePrice > 0 ? productId.salePrice : productId.price;
      return { productId: String(productId._id), title: productId.title, image: productId.image, price: String(price), quantity };
    });
    const totalAmount = cartItems.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);
    const payment = {
      intent: "sale", payer: { payment_method: "paypal" },
      redirect_urls: { return_url: `${clientUrl}/shop/paypal-return`, cancel_url: `${clientUrl}/shop/checkout` },
      transactions: [{
        item_list: { items: cartItems.map((item) => ({ name: item.title, sku: item.productId, price: Number(item.price).toFixed(2), currency: "USD", quantity: item.quantity })) },
        amount: { currency: "USD", total: totalAmount.toFixed(2) }, description: "Payment for your order",
      }],
    };
    paypal.payment.create(payment, async (error, paymentInfo) => {
      if (error) return res.status(502).json({ success: false, message: "Unable to create PayPal payment" });
      const order = await Order.create({
        userId, cartId: String(cart._id), cartItems,
        addressInfo: { addressId: String(address._id), address: address.address, city: address.city, pincode: address.pincode, phone: address.phone, notes: address.notes },
        orderStatus: "pending", paymentMethod: "paypal", paymentStatus: "pending", totalAmount,
        orderDate: new Date(), orderUpdateDate: new Date(), paymentId: paymentInfo.id,
      });
      const approvalURL = paymentInfo.links.find((link) => link.rel === "approval_url")?.href;
      if (!approvalURL) return res.status(502).json({ success: false, message: "PayPal approval URL missing" });
      return res.status(201).json({ success: true, approvalURL, orderId: order._id });
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message || "Unable to create order" });
  }
};

const capturePayment = async (req, res) => {
  try {
    const { paymentId, payerId, orderId } = req.body;
    const order = await Order.findOne({ _id: orderId, userId: String(req.user.id), paymentId });
    if (!order || !payerId) return res.status(404).json({ success: false, message: "Order not found" });
    if (order.paymentStatus === "paid") return res.status(409).json({ success: false, message: "Order is already paid" });
    paypal.payment.execute(paymentId, { payer_id: payerId }, async (error, paymentInfo) => {
      if (error || paymentInfo?.state !== "approved") return res.status(402).json({ success: false, message: "Payment was not approved" });
      order.paymentStatus = "paid"; order.orderStatus = "confirmed"; order.payerId = payerId; order.orderUpdateDate = new Date();
      await order.save();
      await Cart.deleteOne({ _id: order.cartId, userId: String(req.user.id) });
      return res.status(200).json({ success: true, message: "Order confirmed", data: order });
    });
  } catch (_error) {
    return res.status(500).json({ success: false, message: "Unable to capture payment" });
  }
};

const getOrdersByUser = async (req, res) => {
  const orders = await Order.find({ userId: String(req.user.id) }).sort({ orderDate: -1 });
  res.status(200).json({ success: true, data: orders });
};

const getOrderDetails = async (req, res) => {
  const order = await Order.findOne({ _id: req.params.id, userId: String(req.user.id) });
  if (!order) return res.status(404).json({ success: false, message: "Order not found" });
  return res.status(200).json({ success: true, data: order });
};

module.exports = { createOrder, capturePayment, getOrdersByUser, getOrderDetails };
