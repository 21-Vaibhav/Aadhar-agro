const functions = require("firebase-functions");
const Razorpay = require("razorpay");
const cors = require("cors")({origin: true});
const admin = require("firebase-admin");

admin.initializeApp();

const razorpay = new Razorpay({
  key_id: "YOUR_RAZORPAY_TEST_API_KEY",
  key_secret: "YOUR_RAZORPAY_TEST_API_SECRET",
});

exports.createOrder = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    if (req.method !== "POST") {
      return res.status(405).send({message: "Only POST requests are allowed"});
    }

    const amount = req.body.amount;

    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    try {
      const order = await razorpay.orders.create(options);
      res.status(200).json({orderId: order.id});
    } catch (error) {
      console.error(error);
      res.status(500).send({error: "Failed to create order"});
    }
  });
});
