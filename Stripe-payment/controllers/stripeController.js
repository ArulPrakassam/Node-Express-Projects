const stripe = require("stripe")(process.env.STRIPE_KEY);
const stripeController = async (req, res) => {
  const { purchase, total_amount, shipping_fee } = req.body;

  const calculateOrderAmount = () => {
    //communicate with database and check prices
    return total_amount + shipping_fee;
  };
  const paymentIntent = await stripe.paymentIntents.create({
    amount: calculateOrderAmount(),
    currency: "inr",
  });
  res.json({ clientSecret: paymentIntent.client_secret });
};

module.exports = stripeController;
