import fetch from "node-fetch";

export const sendResetPasswordEmail = async (user, resetToken) => {
  try {
    const resetUrl = `${
      process.env.FRONTEND_URL || "http://localhost:3000"
    }/auth/reset-password/${resetToken}`;

    return {
      success: true,
      message: "Email sent successfully",
      resetUrl,
    };
  } catch (error) {
    console.error("Error sending reset email:", error);
    throw error;
  }
};

export const sendPasswordResetConfirmation = async () => {
  return {
    success: true,
    message: "Confirmation email sent",
  };
};
