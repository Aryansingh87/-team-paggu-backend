import crypto from "crypto";
import razorpay from "../config/razorpay.js";
import Payment from "../models/Payment.js";
import MembershipPlan from "../models/MembershipPlan.js";
import User from "../models/User.js";

export async function createOrder(req, res) {
  if (!process.env.RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID.includes("your_")) {
    return res.status(500).json({
      message: "Razorpay test keys aren't set up yet. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to your .env file — see the backend README for how to get test keys.",
    });
  }

  const { plan } = req.body;
  const planDoc = await MembershipPlan.findOne({ key: plan });

  if (!planDoc) {
    return res.status(400).json({ message: "Unknown membership plan." });
  }

  const amountInPaise = planDoc.price * 100;

  const order = await razorpay.orders.create({
    amount: amountInPaise,
    currency: "INR",
    receipt: `receipt_${req.user._id}_${Date.now()}`,
  });

  await Payment.create({
    user: req.user._id,
    plan,
    amount: amountInPaise,
    razorpayOrderId: order.id,
    status: "created",
  });

  res.json({ order, keyId: process.env.RAZORPAY_KEY_ID });
}

export async function verifyPayment(req, res) {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  const isValid = expectedSignature === razorpay_signature;

  const payment = await Payment.findOne({ razorpayOrderId: razorpay_order_id });
  if (!payment) {
    return res.status(404).json({ message: "Payment record not found." });
  }

  if (!isValid) {
    payment.status = "failed";
    await payment.save();
    return res.status(400).json({ message: "Payment signature verification failed." });
  }

  payment.status = "paid";
  payment.razorpayPaymentId = razorpay_payment_id;
  payment.razorpaySignature = razorpay_signature;
  await payment.save();

  // Look up the actual plan to get its real duration, instead of assuming 1 month
  const planDoc = await MembershipPlan.findOne({ key: payment.plan });
  const durationMonths = planDoc?.durationMonths || 1;

  const expiryDate = new Date();
  expiryDate.setMonth(expiryDate.getMonth() + durationMonths);

  await User.findByIdAndUpdate(payment.user, {
    membership: {
      plan: payment.plan,
      status: "active",
      startDate: new Date(),
      expiryDate,
    },
  });

  res.json({ message: "Payment verified, membership activated.", payment });
}