export const createFakePayment = async (amount, currency = "usd") => {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return {
    id: `fake_pi_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    amount: Math.round(amount * 100),
    currency,
    status: "succeeded",
    created: Math.floor(Date.now() / 1000),
  };
};

export const confirmFakePayment = async (paymentId) => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  return {
    id: paymentId,
    status: "succeeded",
    amount: 0,
  };
};
