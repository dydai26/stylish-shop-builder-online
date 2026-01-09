import React from 'react';
import Layout from "@/components/layout/Layout";

const ReturnsAndRefundPolicy = () => {
  return (
    <Layout>
      <div className="bg-gray-50 py-6 sm:py-12">
        <div className="container-custom px-2 sm:px-3">
          <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">Returns & Refunds</h1>
          
          <div className="bg-white p-6 sm:p-8 rounded-lg shadow-sm">
            <div className="prose max-w-none">
              <p className="text-gray-600 mb-6">Last updated: {new Date().toLocaleDateString()}</p>
              
              <div className="mb-8">
                <p className="mb-4">
                  At Ecovluu, we are committed to providing high-quality hair care products and ensuring your satisfaction. 
                  If you are not entirely satisfied with your purchase, we are here to help. Please read our Return and 
                  Refund Policy below to understand your rights and how to proceed with a return or refund.
                </p>
              </div>

              <h2 className="text-xl font-bold mb-4">Terms of Return</h2>
              <p className="mb-4">
                You have the right to return products purchased on our website within 14 days of receiving your order. 
                Returns must be initiated within this period to qualify for a refund or exchange. Any returns received 
                after this period will not be accepted.
              </p>

              <h2 className="text-xl font-bold mb-4">State of Return</h2>
              <p className="mb-4">To be eligible for a return, products must be:</p>
              <ul className="list-disc pl-6 mb-6 space-y-2 text-left">
                <li>Unused, unopened, and in the original packaging.</li>
                <li>In the same condition as when you received them, with all seals and labels intact.</li>
                <li>Free from any signs of wear, tampering, or damage not caused by shipping.</li>
              </ul>
              <p className="mb-4 text-left">
                Please note that for hygiene reasons, we cannot accept returns of products that have been opened or used.
              </p>

              <h2 className="text-xl font-bold mb-4">Reasons for Return</h2>
              <p className="mb-4">We accept returns for the following reasons:</p>
              <ul className="list-disc pl-6 mb-6 space-y-2 text-left">
                <li>Damaged or Defective Product: If the product is damaged or defective upon arrival, please contact us immediately.</li>
                <li>Incorrect or Wrong Product: If you received the wrong product, we will correct the issue promptly.</li>
                <li>Unwanted or Changed Mind: If you decide you no longer want the product, it must remain unopened and in its original condition.</li>
              </ul>

              <h2 className="text-xl font-bold mb-4">Process for Return</h2>
              <p className="mb-4">To initiate a return, follow these steps:</p>
              <ol className="list-decimal pl-6 mb-6 space-y-2 text-left">
                <li>Contact Us: Email us at info@ecovluu.com with your order number, reason for return, and any supporting photos (if applicable).</li>
                <li>Approval: Once your return request is approved, we will provide instructions on where to send the product.</li>
                <li>Shipping: Return shipping costs are your responsibility, except in cases where the product was damaged, defective, or incorrect. Please use a trackable shipping service and keep proof of postage.</li>
              </ol>

              <h2 className="text-xl font-bold mb-4">Process of Refund</h2>
              <p className="mb-4">
                Once we receive and inspect your returned product, we will notify you of the approval or rejection of your refund. If approved:
              </p>
              <ul className="list-disc pl-6 mb-6 space-y-2 text-left">
                <li>Refunds will be issued to your original method of payment.</li>
                <li>The refund process may take up to 14 business days to appear on your account, depending on your payment provider.</li>
                <li>If your return is rejected, we will notify you with the reason for rejection and offer to return the product to you at your expense.</li>
              </ul>

              <h2 className="text-xl font-bold mb-4">Terms of Refund</h2>
              <p className="mb-4">Refunds will be processed under the following conditions:</p>
              <ul className="list-disc pl-6 mb-6 space-y-2 text-left">
                <li>Products returned due to damage, defects, or incorrect orders will receive a full refund, including the original shipping cost.</li>
                <li>For returns due to a change of mind, only the product price will be refunded. Original shipping costs are non-refundable.</li>
                <li>We reserve the right to refuse returns that do not meet the conditions stated in this policy.</li>
              </ul>

              <h2 className="text-xl font-bold mb-4">Contact Details</h2>
              <p className="mb-4">
                If you have any questions or concerns about this Privacy Policy or how we handle your data, please contact us:
              </p>
              <p className="mb-4">
                Email: info@ecovluu.com<br />
                Address: A6, Block A, Santry Business Park, Swords Road, Santry, Dublin 9, Ireland.
              </p>

              <h2 className="text-xl font-bold mb-4">Additional Notes</h2>
              <ul className="list-disc pl-6 mb-6 space-y-2 text-left">
                <li>Please ensure that the returned products are securely packaged to avoid any damage during transit.</li>
                <li>We recommend using a trackable shipping service, as we cannot be held responsible for returns lost in transit.</li>
                <li>We reserve the right to update or modify this policy at any time. Changes will be posted on our website and will apply to orders placed after the update.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ReturnsAndRefundPolicy; 