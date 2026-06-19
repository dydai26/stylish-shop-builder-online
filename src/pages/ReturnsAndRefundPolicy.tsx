import React from 'react';
import Layout from "@/components/layout/Layout";

const ReturnsAndRefundPolicy = () => {
  return (
    <Layout>
      <div className="bg-gray-50 py-6 sm:py-12">
        <div className="container-custom px-2 sm:px-3">
          <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">RETURN & REFUND POLICY</h1>
          
          <div className="bg-white p-6 sm:p-8 rounded-lg shadow-sm">
            <div className="prose max-w-none text-left">
              <p className="text-gray-600 mb-6">Last updated: {new Date().toLocaleDateString()}</p>
              
              <section className="mb-8">
                <h2 className="text-xl font-bold mb-4">1. Right of Withdrawal (EU Consumers)</h2>
                <p className="mb-4">
                  If you are a consumer residing in the European Union, you have the right to withdraw from your purchase within 14 calendar days without giving any reason.
                </p>
                <p className="mb-4">
                  The withdrawal period expires 14 days after the day on which you, or a third party indicated by you (other than the carrier), acquire physical possession of the goods.
                </p>
                <p className="mb-4">
                  To exercise your right of withdrawal, you must inform us of your decision by sending a clear statement by email to:
                </p>
                <p className="font-medium text-primary mb-4">Email: info@ecovluu.com</p>
                <p className="mb-4 text-sm text-gray-500 italic">
                  You may use the model withdrawal form provided below, but it is not mandatory.
                </p>
              </section>

              <hr className="my-8 border-gray-100" />

              <section className="mb-8">
                <h2 className="text-xl font-bold mb-4">2. Effects of Withdrawal</h2>
                <p className="mb-4">
                  If you withdraw from this contract, we will reimburse all payments received from you, including the cost of standard delivery (excluding supplementary costs resulting from your choice of a delivery method other than the least expensive standard delivery offered by us).
                </p>
                <p className="mb-4">
                  We may withhold reimbursement until we have received the goods back or you have supplied evidence of having sent back the goods, whichever is earlier.
                </p>
                <p className="mb-4">
                  Refunds will be made using the same means of payment as you used for the initial transaction, unless expressly agreed otherwise.
                </p>
                <p className="mb-4">
                  Reimbursement will be made no later than 14 days from the day we are informed about your decision to withdraw.
                </p>
              </section>

              <hr className="my-8 border-gray-100" />

              <section className="mb-8">
                <h2 className="text-xl font-bold mb-4">3. Conditions for Returns</h2>
                <p className="mb-4">
                  You must send back the goods within 14 days from the date on which you communicated your withdrawal.
                </p>
                <p className="mb-4 font-semibold">Returned items must:</p>
                <ul className="list-disc pl-6 mb-6 space-y-2">
                  <li>Be unused</li>
                  <li>Be unopened</li>
                  <li>Have intact safety seals (if applicable)</li>
                  <li>Be in original packaging</li>
                  <li>Be in resalable condition</li>
                </ul>
                <p className="mb-4">
                  You are only liable for any diminished value of the goods resulting from handling other than what is necessary to establish the nature, characteristics, and functioning of the goods.
                </p>
              </section>

              <hr className="my-8 border-gray-100" />

              <section className="mb-8">
                <h2 className="text-xl font-bold mb-4">4. Hygiene & Safety Exception (Cosmetic Products)</h2>
                <p className="mb-4 italic text-gray-600">
                  In accordance with Article 16(e) of Directive 2011/83/EU, the right of withdrawal does not apply to:
                </p>
                <p className="mb-4 border-l-4 border-primary pl-4 py-2 bg-gray-50">
                  Sealed goods which are not suitable for return due to health protection or hygiene reasons, if they were unsealed after delivery.
                </p>
                <p className="mb-4 font-medium">
                  Hair care and cosmetic products that have been opened, unsealed, or used cannot be returned for hygiene and safety reasons.
                </p>
              </section>

              <hr className="my-8 border-gray-100" />

              <section className="mb-8">
                <h2 className="text-xl font-bold mb-4">5. Return Shipping Costs</h2>
                <p className="mb-4">
                  Unless the goods are defective, damaged, or incorrect, the customer is responsible for return shipping costs.
                </p>
                <p className="mb-4">
                  If the product is defective, damaged, or incorrect, Ecovluu will bear the return shipping costs.
                </p>
                <p className="mb-4">
                  We recommend using a tracked shipping service. We are not responsible for items lost during return shipment.
                </p>
              </section>

              <hr className="my-8 border-gray-100" />

              <section className="mb-8">
                <h2 className="text-xl font-bold mb-4">6. Defective or Incorrect Products</h2>
                <p className="mb-4">
                  If you receive a defective, damaged, or incorrect item, please contact us within 48 hours of delivery and provide:
                </p>
                <ul className="list-disc pl-6 mb-4 space-y-1">
                  <li>Order number</li>
                  <li>Description of the issue</li>
                  <li>Clear photographs of the product and packaging</li>
                </ul>
                <p className="mb-4">
                  We will offer a replacement or a full refund, including shipping costs where applicable.
                </p>
              </section>

              <hr className="my-8 border-gray-100" />

              <section className="mb-8">
                <h2 className="text-xl font-bold mb-4">7. Exchanges</h2>
                <p className="mb-4">
                  We do not offer direct exchanges.
                  If you wish to replace an item, please return the original item and place a new order.
                </p>
              </section>

              <hr className="my-8 border-gray-100" />

              <section className="mb-8">
                <h2 className="text-xl font-bold mb-4">8. How to Return an Item</h2>
                <p className="mb-4">To initiate a return, please contact:</p>
                <p className="font-medium text-primary mb-4">Email: info@ecovluu.com</p>
                <p className="mb-4 underline underline-offset-4 decoration-primary">
                  You will receive return instructions once your request has been reviewed.
                </p>
              </section>

              <hr className="my-8 border-gray-100" />

              <section className="mb-8 bg-gray-50 p-6 rounded-lg border border-dashed border-gray-300">
                <h2 className="text-xl font-bold mb-4">9. Model Withdrawal Form (Optional)</h2>
                <p className="text-sm mb-4">To: Ecovluu</p>
                <p className="text-sm mb-4">Email: info@ecovluu.com</p>
                <p className="text-sm mb-6 underline underline-offset-4 decoration-gray-300">
                  I hereby give notice that I withdraw from my contract of sale of the following goods:
                </p>
                
                <div className="space-y-4 text-sm mt-6">
                  <div className="border-b border-gray-200 pb-1">Order number:</div>
                  <div className="border-b border-gray-200 pb-1">Ordered on / received on:</div>
                  <div className="border-b border-gray-200 pb-1">Name of consumer:</div>
                  <div className="border-b border-gray-200 pb-1">Address of consumer:</div>
                  <div className="border-b border-gray-200 pb-1 h-8">Signature (only if submitted on paper):</div>
                  <div className="border-b border-gray-200 pb-1">Date:</div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ReturnsAndRefundPolicy; 