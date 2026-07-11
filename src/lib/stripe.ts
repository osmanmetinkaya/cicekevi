import Stripe from "stripe";

let client: Stripe | null = null;

/**
 * Lazily construct the Stripe client. Constructing at module load with an
 * empty key throws, which would crash any route that merely imports this file
 * — so we defer until a key is actually needed.
 */
export function getStripe(): Stripe {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY is not configured");
  }
  if (!client) {
    client = new Stripe(process.env.STRIPE_SECRET_KEY, {
      // Pin the API version so behaviour can't drift under us.
      apiVersion: "2026-06-24.dahlia",
      appInfo: { name: "cicek-co" },
    });
  }
  return client;
}
