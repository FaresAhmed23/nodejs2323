import Stripe from "stripe";
import dotenv from "dotenv";

// Make sure to load environment variables
dotenv.config();

console.log(
  "🔍 Checking Stripe key:",
  process.env.STRIPE_SECRET_KEY ? "Found" : "Not found"
);

if (!process.env.STRIPE_SECRET_KEY) {
  console.error("❌ STRIPE_SECRET_KEY is not set in environment variables");
  console.log("Current working directory:", process.cwd());
  console.log("Looking for .env file...");
  process.exit(1);
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createPaymentIntent = async (amount, currency = "usd") => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return paymentIntent;
  } catch (error) {
    console.error("Error creating payment intent:", error);
    throw error;
  }
};

export const confirmPayment = async (paymentIntentId) => {
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    return paymentIntent;
  } catch (error) {
    console.error("Error confirming payment:", error);
    throw error;
  }
};

export default stripe;
