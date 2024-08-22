import Stripe from "stripe";
import paymentRepository from "../repositories/paymentRepository"

class PaymentService {
  async createPaymentIntent(stripe: Stripe, amount: number): Promise<Stripe.PaymentIntent> {
    try {
      return await paymentRepository.createPaymentIntent(stripe, amount);
    } catch (error) {
      throw new Error("Failed to create payment intent.");
    }
  }

  verifyPayment(paymentIntent: Stripe.PaymentIntent): boolean {
    return paymentRepository.verifyPayment(paymentIntent);
  }
}

export default new PaymentService();
