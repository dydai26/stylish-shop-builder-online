import React from 'react';
import Layout from "@/components/layout/Layout";

const TermsAndConditions = () => {
  return (
    <Layout>
      <div className="bg-gray-50 py-6 sm:py-12">
        <div className="container-custom px-2 sm:px-3">
          <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">Terms & Conditions</h1>
          
          <div className="bg-white p-6 sm:p-8 rounded-lg shadow-sm">
            <div className="prose max-w-none">
              <p className="text-gray-600 mb-6">Last updated: {new Date().toLocaleDateString()}</p>
              
              <div className="mb-8">
                <p className="mb-4">
                  Welcome to Ecovluu! By accessing our website, purchasing our products, or using our services, 
                  you agree to comply with the following Terms and Conditions. Please read these terms carefully 
                  before using our website or placing an order. These Terms constitute a legally binding agreement 
                  between Ecovluu and our customers. If you do not agree to these Terms, please refrain from using our Site.
                </p>
              </div>

              <h2 className="text-xl font-bold mb-4">Definitions</h2>
              <ul className="list-disc pl-6 mb-6 space-y-2 text-left">
                <li>"Ecovluu": Refers to Lab Organic Cosmetics LtdT/A Ecovluu including its officers, directors, employees, and affiliates.</li>
                <li>"Customer": Any person accessing, browsing, or using the Site or purchasing products.</li>
                <li>"Site": The website located at www.ecovluu.com.</li>
                <li>"Products": Goods offered for sale on the Site.</li>
              </ul>

              <h2 className="text-xl font-bold mb-4">General Information</h2>
              <p className="mb-4 text-left">
                Ecovluu ("we", "us", "our") operates the website www.ecovluu.com ("Site"). These Terms and Conditions 
                govern your use of the Site, including all related services and purchases. By using our Site, you agree 
                to these Terms. We reserve the right to modify these Terms at any time. Updated Terms will take effect 
                immediately upon posting. Your continued use of our Site indicates acceptance of any changes. If you have 
                questions, please contact us at info@ecovluu.com.
              </p>

              <h2 className="text-xl font-bold mb-4">Business Information</h2>
              <p className="mb-4">
                Ecovluu is a registered business operating under the following details:
              </p>
              <ul className="list-none pl-6 mb-6 space-y-2">
                <li>Business Name: Lab Organic Cosmetics Ltd T/A Ecovluu</li>
                <li>Registered Address: A6, Block A, Santry Business Park, Swords Road, Santry, Dublin 9, Ireland</li>
                <li>Registration Number: 699199</li>
                <li>Contact Email: info@ecovluu.com</li>
              </ul>

              <h2 className="text-xl font-bold mb-4">Ordering Process</h2>
              <ul className="list-disc pl-6 mb-6 space-y-2 text-left">
                <li>All orders are subject to acceptance and availability.</li>
                <li>After placing an order, you will receive an email confirmation. This confirmation does not constitute acceptance of your order.</li>
                <li>A contract is formed when your order is dispatched. If there are any issues, such as stock shortages, we will notify you promptly to arrange an alternative or a refund.</li>
              </ul>

              <h2 className="text-xl font-bold mb-4">Right of Withdrawal (EU Customers)</h2>
              <p className="mb-4">
                As a customer in the EU, you have the right to cancel your order within 14 days of receiving your products 
                without providing a reason. To exercise this right, please contact us at info@ecovluu.com with your order details.
              </p>

              <h2 className="text-xl font-bold mb-4">Conditions for Withdrawal</h2>
              <ul className="list-disc pl-6 mb-6 space-y-2 text-left">
                <li>Returned products must be unused, in their original packaging, and in resalable condition.</li>
                <li>The right of withdrawal does not apply to:
                  <ul className="list-disc pl-6 mt-2 space-y-1 text-left">
                    <li>Opened or used personal care products for hygiene reasons.</li>
                    <li>Products that have been customized or made to order.</li>
                    <li>Gift cards or promotional items.</li>
                  </ul>
                </li>
              </ul>

              <h2 className="text-xl font-bold mb-4">Refund Process</h2>
              <ul className="list-disc pl-6 mb-6 space-y-2 text-left">
                <li>Refunds will include the original delivery cost but exclude return shipping costs unless the product is defective.</li>
                <li>Refunds will be processed within 14 days of receiving the returned items and will be credited to your original payment method.</li>
              </ul>

              <h2 className="text-xl font-bold mb-4">Returns and Refunds</h2>
              <p className="mb-4">
                If you are not satisfied with your purchase, you can return the product within 30 days for a refund or exchange.
              </p>
              <p className="mb-4">To initiate a return:</p>
              <ul className="list-disc pl-6 mb-6 space-y-2 text-left">
                <li>Contact us at info@ecovluu.com with your order details and reason for the return.</li>
                <li>Ship the product back to the address provided in our confirmation email.</li>
              </ul>

              <h2 className="text-xl font-bold mb-4">Conditions for Returns</h2>
              <ul className="list-disc pl-6 mb-6 space-y-2 text-left">
                <li>Products must be unused and in their original condition.</li>
                <li>Returns for opened or used hair care products will only be accepted if the item is defective.</li>
                <li>Customers are responsible for return shipping costs unless the product is defective or incorrect.</li>
              </ul>

              <h2 className="text-xl font-bold mb-4">Pricing and Payments</h2>
              <ul className="list-disc pl-6 mb-6 space-y-2 text-left">
                <li>All prices are displayed in EUR (€) and include VAT where applicable.</li>
                <li>Payments are processed securely via trusted third-party providers like Stripe.</li>
                <li>We reserve the right to adjust prices and correct errors without prior notice.</li>
                <li>Discounts or coupon codes cannot be combined or applied retroactively.</li>
              </ul>

              <h2 className="text-xl font-bold mb-4">Warranty and Defects</h2>
              <h3 className="text-lg font-semibold mb-3">Statutory Warranty</h3>
              <ul className="list-disc pl-6 mb-6 space-y-2 text-left">
                <li>All Ecovluu products are covered by a two-year statutory warranty under EU law.</li>
                <li>The warranty applies only to products used within their stated expiration date or shelf life.</li>
              </ul>

              <h3 className="text-lg font-semibold mb-3">Warranty Coverage</h3>
              <ul className="list-disc pl-6 mb-6 space-y-2 text-left">
                <li>Products that are defective due to manufacturing faults or damage during shipping.</li>
                <li>Products that do not comply with safety standards or contain incorrect labeling.</li>
                <li>Adverse effects or unexpected reactions caused by a defective product.</li>
              </ul>

              <h3 className="text-lg font-semibold mb-3">Warranty Exclusions</h3>
              <ul className="list-disc pl-6 mb-6 space-y-2 text-left">
                <li>Products used after their expiration date or outside their stated shelf life.</li>
                <li>Individual allergic reactions or sensitivities, unless caused by a defect or incorrect labeling.</li>
                <li>Damage resulting from improper storage, misuse, or failure to follow usage instructions.</li>
                <li>Natural variations in product texture, color, or scent, as indicated on the product description.</li>
              </ul>

              <h2 className="text-xl font-bold mb-4">Customer Responsibilities</h2>
              <p className="mb-4">To ensure safe use of our products, customers are responsible for:</p>
              <ul className="list-disc pl-6 mb-6 space-y-2 text-left">
                <li>Reading and Following Instructions: Carefully follow usage instructions provided on the product packaging or our website.</li>
                <li>Conducting a Patch Test: Perform a patch test before full use to check for potential allergic reactions.</li>
                <li>Reviewing Ingredient Lists: Ensure you are not allergic or sensitive to any of the listed ingredients.</li>
              </ul>

              <h2 className="text-xl font-bold mb-4">Reporting a Defect or Adverse Reaction</h2>
              <p className="mb-4">If you believe a product is defective or has caused an unexpected reaction due to a manufacturing issue:</p>
              <ul className="list-disc pl-6 mb-6 space-y-2 text-left">
                <li>Discontinue Use Immediately: Stop using the product and ensure it is safely stored.</li>
                <li>Contact Us: Notify us at info@ecovluu.com within 14 days of receiving the product, providing:
                  <ul className="list-disc pl-6 mt-2 space-y-1 text-left">
                    <li>Your order number.</li>
                    <li>A detailed description of the issue or reaction.</li>
                    <li>The product's batch number (found on the packaging).</li>
                  </ul>
                </li>
                <li>Product Inspection: We may request the return of the defective product for further investigation.</li>
              </ul>

              <h2 className="text-xl font-bold mb-4">Resolution Options</h2>
              <p className="mb-4">If a product is confirmed to be defective, you are entitled to one of the following remedies:</p>
              <ul className="list-disc pl-6 mb-6 space-y-2 text-left">
                <li>Replacement: A new product of the same type will be sent to you.</li>
                <li>Refund: A refund will be issued to your original payment method.</li>
                <li>Additional Remedies: Any other rights provided under applicable EU consumer protection laws.</li>
              </ul>

              <h2 className="text-xl font-bold mb-4">Limitation of Liability</h2>
              <ul className="list-disc pl-6 mb-6 space-y-2 text-left">
                <li>While our products are designed and tested for safety, individual sensitivities or allergic reactions may still occur.</li>
                <li>Ecovluu is not liable for adverse effects caused by individual sensitivities, unless the product is proven to be defective or improperly labeled.</li>
                <li>If you have known allergies or pre-existing conditions, consult a healthcare professional before use.</li>
              </ul>

              <h2 className="text-xl font-bold mb-4">Delivery Times and Delays</h2>
              <p className="mb-4">We aim to process and ship orders within 1-3 business days. Estimated delivery times are:</p>
              <ul className="list-disc pl-6 mb-6 space-y-2 text-left">
                <li>Ireland: 3-5 business days.</li>
                <li>EU Countries: 5-10 business days.</li>
                <li>Rest of the World: 10-15 business days.</li>
              </ul>

              <h2 className="text-xl font-bold mb-4">Cookie Policy</h2>
              <p className="mb-4">Our website uses cookies to enhance your browsing experience. These include:</p>
              <ul className="list-disc pl-6 mb-6 space-y-2 text-left">
                <li>Essential Cookies: Necessary for website functionality, such as processing payments and maintaining security.</li>
                <li>Analytics Cookies: To analyze site traffic and improve our services.</li>
                <li>Advertising Cookies: To deliver personalized ads and promotions.</li>
              </ul>

              <h2 className="text-xl font-bold mb-4">Dispute Resolution</h2>
              <p className="mb-4">
                In the event of a dispute, you may contact us at info@ecovluu.com. If we are unable to resolve your concern, 
                you can use the EU Online Dispute Resolution (ODR) platform to submit your complaint:
                <a href="https://ec.europa.eu/odr" className="text-blue-600 hover:underline ml-1">
                  https://ec.europa.eu/odr
                </a>
              </p>

              <h2 className="text-xl font-bold mb-4">Contact Information</h2>
              <p className="mb-4">
                For any questions or concerns about these Terms and Conditions, please contact us at:
              </p>
              <p className="mb-4">
                Email: info@ecovluu.com<br />
                Address: A6, Block A, Santry Business Park, Swords Road, Santry, Dublin 9, Ireland
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TermsAndConditions; 