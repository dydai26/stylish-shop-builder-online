import React from 'react';
import { Helmet } from 'react-helmet-async';
import Layout from "@/components/layout/Layout";

const ShippingAndDeliveryPolicy = () => {
  return (
    <Layout>
      <Helmet>
        <title>Shipping & Delivery Policy | ECOVLUU</title>
        <meta name="description" content="Read the Shipping & Delivery Policy of ECOVLUU. Learn about order processing, shipping costs for Ireland and EU, and delivery terms." />
        <link rel="canonical" href="https://www.ecovluu.com/shipping-policy" />
      </Helmet>
      <div className="bg-gray-50 py-6 sm:py-12">
        <div className="container-custom px-2 sm:px-3">
          <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-left uppercase">SHIPPING & DELIVERY POLICY</h1>
          
          <div className="bg-white p-6 sm:p-8 rounded-lg shadow-sm">
            <div className="prose max-w-none text-left">
              <p className="text-gray-600 mb-6 font-light italic">Last updated: {new Date().toLocaleDateString()}</p>
              
              <section className="mb-8">
                <h2 className="text-xl font-bold mb-4">1. Order Processing</h2>
                <p className="mb-4">
                  All orders are processed within 1–2 business days (Monday–Friday, excluding public holidays).
                </p>
                <p className="mb-4">
                  Once your order has been dispatched, you will receive a confirmation email. Tracking information will be provided where applicable.
                </p>
              </section>

              <hr className="my-8 border-gray-100" />

              <section className="mb-8">
                <h2 className="text-xl font-bold mb-4">2. Shipping Costs</h2>
                
                <div className="mb-6">
                  <h3 className="font-semibold mb-2">Ireland</h3>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Standard shipping: €12.05 per order</li>
                    <li>Estimated delivery time: 2–5 business days</li>
                  </ul>
                </div>

                <div className="mb-6">
                  <h3 className="font-semibold mb-2">European Union</h3>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Standard shipping: €23.12</li>
                    <li>Estimated delivery time: 5–10 business days</li>
                  </ul>
                </div>

                <p className="mb-4">
                  Shipping costs are calculated and clearly displayed at checkout before payment is completed.
                </p>
                <p className="mb-4 font-medium">
                  Shipping fees are non-refundable, except in cases where the product is defective or incorrect.
                </p>
              </section>

              <hr className="my-8 border-gray-100" />

              <section className="mb-8">
                <h2 className="text-xl font-bold mb-4">3. Delivery Times</h2>
                <p className="mb-4">
                  Delivery times are estimates and may vary due to circumstances beyond our control, including carrier delays, peak seasons, or unforeseen events.
                </p>
                <p className="mb-4 italic text-gray-600">
                  Ecovluu is not responsible for delays caused by courier services once the order has been dispatched.
                </p>
              </section>

              <hr className="my-8 border-gray-100" />

              <section className="mb-8">
                <h2 className="text-xl font-bold mb-4">4. Shipping Responsibility</h2>
                <p className="mb-4">
                  Customers are responsible for providing accurate and complete shipping information at checkout.
                </p>
                <p className="mb-4 bg-gray-50 p-4 border-l-4 border-primary">
                  Ecovluu is not responsible for additional shipping costs resulting from incorrect or incomplete address details.
                </p>
                <p className="mb-4">
                  If a parcel is returned due to incorrect address information, additional shipping charges may apply for reshipment.
                </p>
              </section>

              <hr className="my-8 border-gray-100" />

              <section className="mb-8">
                <h2 className="text-xl font-bold mb-4">5. Damaged or Lost Shipments</h2>
                <p className="mb-4">
                  If your order arrives damaged or does not arrive within the estimated delivery timeframe, please contact us at:
                </p>
                <p className="font-medium text-primary mb-6">info@ecovluu.com</p>
                
                <p className="mb-2 font-semibold">Please include:</p>
                <ul className="list-disc pl-6 mb-6 space-y-1">
                  <li>Your order number</li>
                  <li>A description of the issue</li>
                  <li>Clear photos (if applicable)</li>
                </ul>
                
                <p className="mb-4 underline underline-offset-4 decoration-primary">
                  We will assist you in resolving the issue as quickly as possible.
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ShippingAndDeliveryPolicy;
