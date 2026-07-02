import React from 'react';
import { Helmet } from 'react-helmet-async';
import Layout from "@/components/layout/Layout";

const TermsAndConditions = () => {
  return (
    <Layout>
      <Helmet>
        <title>Terms & Conditions | ECOVLUU</title>
        <meta name="description" content="Read the Terms & Conditions of ECOVLUU. These terms govern your use of our website and the purchase of our natural hair care products." />
        <link rel="canonical" href="https://www.ecovluu.com/terms" />
      </Helmet>
      <div className="bg-gray-50 py-6 sm:py-12">
        <div className="container-custom px-2 sm:px-3">
          <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-left uppercase">TERMS & CONDITIONS</h1>
          
          <div className="bg-white p-6 sm:p-8 rounded-lg shadow-sm">
            <div className="prose max-w-none text-left">
              <p className="text-gray-600 mb-6 font-light italic">Last updated: {new Date().toLocaleDateString()}</p>
              
              <p className="mb-6">
                These Terms & Conditions govern your use of the website <a href="https://www.ecovluu.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">www.ecovluu.com</a> and the purchase of products from Ecovluu. By accessing this website or placing an order, you agree to be bound by these Terms.
              </p>

              <hr className="my-8 border-gray-100" />

              <section className="mb-8">
                <h2 className="text-xl font-bold mb-4">1. Company Information</h2>
                <div className="space-y-4">
                  <div>
                    <p className="font-bold text-primary text-lg">Ecovluu</p>
                    <p className="flex items-center gap-2">
                       <span className="font-semibold">Email:</span> 
                       <a href="mailto:info@ecovluu.com" className="hover:text-primary transition-colors">info@ecovluu.com</a>
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <div>
                      <p className="font-semibold text-gray-500 uppercase text-xs mb-1">Legal Entity Name</p>
                      <p className="font-medium">Lab Organic Cosmetics Ltd/T.A Ecovluu</p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-500 uppercase text-xs mb-1">Company Registration Number</p>
                      <p className="font-medium">699199</p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-500 uppercase text-xs mb-1">Registered Address</p>
                      <p>Santry Business Park</p>
                      <p>Swords Road,</p>
                      <p>Santry, Dublin 9</p>
                      <p className="text-gray-400 italic">D09X651</p>
                    </div>
                  </div>
                </div>
              </section>

              <hr className="my-8 border-gray-100" />

              <section className="mb-8">
                <h2 className="text-xl font-bold mb-4">2. Scope of Application</h2>
                <p className="mb-4">
                  These Terms apply to all orders placed by consumers through this website.
                </p>
                <p className="mb-4 italic text-gray-600 border-l-4 border-primary pl-4 py-2 bg-gray-50 rounded-r-lg">
                  Nothing in these Terms affects your statutory consumer rights under applicable EU or Irish law.
                </p>
              </section>

              <hr className="my-8 border-gray-100" />

              <section className="mb-8">
                <h2 className="text-xl font-bold mb-4">3. Products</h2>
                <p className="mb-4">
                  Ecovluu sells hair care products via its online store.
                </p>
                <p className="mb-4">
                  Product descriptions, images, and specifications are provided as accurately as possible. Minor variations in packaging or presentation may occur.
                </p>
                <p className="mb-4 font-medium p-4 bg-brand-orange/10 text-[#4A3F3B] rounded border border-brand-orange/20 italic">
                  Information provided on this website does not constitute medical advice.
                </p>
              </section>

              <hr className="my-8 border-gray-100" />

              <section className="mb-8">
                <h2 className="text-xl font-bold mb-4">4. Prices and Payment</h2>
                <p className="mb-4">
                  All prices are displayed in EUR (€) and include VAT where applicable.
                </p>
                <p className="mb-4">
                  Shipping costs are calculated separately and clearly displayed at checkout before payment is completed.
                </p>
                <p className="mb-4">
                  We reserve the right to change prices at any time; however, the price applicable to your order will be the price displayed at the time of purchase.
                </p>
                <p className="mb-4 font-bold text-primary">
                  Payment must be made in full at checkout using the available payment methods.
                </p>
              </section>

              <hr className="my-8 border-gray-100" />

              <section className="mb-8">
                <h2 className="text-xl font-bold mb-4">5. Order Process & Contract Formation</h2>
                <p className="mb-4">
                  By placing an order, you make an offer to purchase the selected products.
                </p>
                <p className="mb-4">
                  A contract is concluded once you receive an order confirmation email from Ecovluu.
                </p>
                <div className="bg-gray-50 p-5 rounded-lg border border-gray-200 mb-4">
                  <p className="mb-3 font-semibold">We reserve the right to refuse or cancel an order in cases of:</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Product unavailability</li>
                    <li>Pricing errors</li>
                    <li>Suspected fraudulent activity</li>
                  </ul>
                </div>
                <p className="mb-4 underline underline-offset-4 decoration-primary font-medium">
                  If payment has been taken for a cancelled order, a full refund will be issued.
                </p>
              </section>

              <hr className="my-8 border-gray-100" />

              <section className="mb-8">
                <h2 className="text-xl font-bold mb-4">6. Shipping & Delivery</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="border border-gray-100 p-4 rounded bg-white shadow-sm">
                    <h3 className="font-bold text-primary mb-3 uppercase tracking-wider text-sm border-b pb-2">Ireland</h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex justify-between"><span>Standard shipping:</span> <span className="font-bold">€12.05</span></li>
                      <li className="flex justify-between"><span>Delivery time:</span> <span className="font-bold">2–5 business days</span></li>
                    </ul>
                  </div>
                  <div className="border border-gray-100 p-4 rounded bg-white shadow-sm">
                    <h3 className="font-bold text-primary mb-3 uppercase tracking-wider text-sm border-b pb-2">European Union</h3>
                    <p className="text-sm mb-2 font-medium">Standard Shipping: €23.12</p>
                    <p className="text-xs text-gray-500 mb-2 italic">Destinations are calculated at checkout based on individual rates.</p>
                    <ul className="space-y-2 text-sm">
                      <li className="flex justify-between"><span>Delivery time:</span> <span className="font-bold">5–10 business days</span></li>
                    </ul>
                  </div>
                </div>
                <p className="mb-4 italic text-sm text-gray-600">
                  Delivery times are estimates and may vary due to circumstances beyond our control.
                </p>
                <p className="mb-4 p-4 bg-gray-50 rounded text-sm leading-relaxed">
                  Customers are responsible for providing accurate shipping information. Ecovluu is not liable for delays caused by incorrect or incomplete address details.
                </p>
                <p className="mb-4 font-medium text-sm">
                  For full details, please refer to our <a href="/shipping-policy" className="text-primary hover:underline">Shipping & Delivery Policy</a>.
                </p>
              </section>

              <hr className="my-8 border-gray-100" />

              <section className="mb-8">
                <h2 className="text-xl font-bold mb-4">7. Right of Withdrawal (EU Consumers)</h2>
                <p className="mb-4">
                  If you are a consumer residing in the European Union, you have the right to withdraw from your purchase within 14 calendar days without giving any reason.
                </p>
                <p className="mb-4">
                  The withdrawal period expires 14 days after the day you acquire physical possession of the goods.
                </p>
                <p className="mb-2">To exercise your right of withdrawal, contact:</p>
                <div className="bg-primary/5 p-4 rounded-lg border border-primary/10 mb-4 inline-block">
                  <p className="font-bold text-primary text-lg">info@ecovluu.com</p>
                </div>
                <p className="mb-4">
                  Refunds will be processed within 14 days of receiving the returned goods or proof of return, whichever occurs first.
                </p>
              </section>

              <hr className="my-8 border-gray-100" />

              <section className="mb-8">
                <h2 className="text-xl font-bold mb-4">8. Conditions for Returns</h2>
                <p className="mb-3 font-semibold">Returned items must:</p>
                <ul className="list-disc pl-6 mb-6 space-y-2">
                  <li>Be unused</li>
                  <li>Be unopened</li>
                  <li>Have intact safety seals (if applicable)</li>
                  <li>Be in original packaging</li>
                  <li>Be in resalable condition</li>
                </ul>
                <p className="mb-4 font-medium border-t pt-4">
                  Unless the product is defective or incorrect, customers are responsible for return shipping costs.
                </p>
              </section>

              <hr className="my-8 border-gray-100" />

              <section className="mb-8">
                <h2 className="text-xl font-bold mb-4">9. Hygiene Exception (Cosmetic Products)</h2>
                <p className="mb-4 text-gray-600 italic">
                  In accordance with Article 16(e) of Directive 2011/83/EU, the right of withdrawal does not apply to sealed goods that are not suitable for return due to health protection or hygiene reasons if they have been unsealed after delivery.
                </p>
                <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg">
                  <p className="font-bold text-red-700 uppercase text-sm tracking-wide">Important Hygiene Notice</p>
                  <p className="text-red-800 font-medium">
                    Hair care and cosmetic products that have been opened, unsealed, or used cannot be returned.
                  </p>
                </div>
              </section>

              <hr className="my-8 border-gray-100" />

              <section className="mb-8">
                <h2 className="text-xl font-bold mb-4">10. Defective or Incorrect Products</h2>
                <p className="mb-4">
                  If you receive a defective, damaged, or incorrect item, please contact us within 48 hours of delivery at:
                </p>
                <p className="font-bold text-primary text-xl mb-4">info@ecovluu.com</p>
                <p className="mb-4 underline underline-offset-4 decoration-primary decoration-2">
                  We will offer a replacement or full refund, including applicable shipping costs.
                </p>
              </section>

              <hr className="my-8 border-gray-100" />

              <section className="mb-8">
                <h2 className="text-xl font-bold mb-4">11. Legal Guarantee</h2>
                <p className="mb-4">
                  Consumers benefit from a minimum 2-year legal guarantee under EU consumer protection laws for goods that are faulty or not as described.
                </p>
                <p className="mb-4 text-sm text-gray-500 italic">
                  This guarantee applies independently of any commercial warranty.
                </p>
              </section>

              <hr className="my-8 border-gray-100" />

              <section className="mb-8">
                <h2 className="text-xl font-bold mb-4">12. Limitation of Liability</h2>
                <p className="mb-4">
                  Ecovluu shall not be liable for indirect, incidental, or consequential damages arising from the use of products purchased via the website.
                </p>
                <p className="mb-4 font-light text-gray-600">
                  Nothing in these Terms limits liability where such limitation is not permitted under applicable law.
                </p>
              </section>

              <hr className="my-8 border-gray-100" />

              <section className="mb-8">
                <h2 className="text-xl font-bold mb-4">13. Intellectual Property</h2>
                <p className="mb-4">
                  All content on this website, including text, graphics, branding, and images, is the property of Ecovluu and may not be reproduced without prior written consent.
                </p>
              </section>

              <hr className="my-8 border-gray-100" />

              <section className="mb-8">
                <h2 className="text-xl font-bold mb-4">14. Force Majeure</h2>
                <p className="mb-4 leading-relaxed">
                  Ecovluu shall not be held liable for delays or failure to perform obligations due to events beyond reasonable control, including but not limited to natural disasters, strikes, transportation disruptions, or governmental actions.
                </p>
              </section>

              <hr className="my-8 border-gray-100" />

              <section className="mb-8">
                <h2 className="text-xl font-bold mb-4">15. Severability</h2>
                <p className="mb-4">
                  If any provision of these Terms is found to be invalid or unenforceable, the remaining provisions shall remain in full force and effect.
                </p>
              </section>

              <hr className="my-8 border-gray-100" />

              <section className="mb-8">
                <h2 className="text-xl font-bold mb-4">16. Amendments</h2>
                <p className="mb-4">
                  We reserve the right to update or modify these Terms & Conditions at any time. The version published on the website at the time of purchase shall apply to your order.
                </p>
              </section>

              <hr className="my-8 border-gray-100" />

              <section className="mb-8">
                <h2 className="text-xl font-bold mb-4">17. Governing Law & Jurisdiction</h2>
                <div className="space-y-4">
                  <p>
                    These Terms are governed by the laws of Ireland and applicable European Union legislation.
                  </p>
                  <p>
                    Any disputes shall be subject to the jurisdiction of the Irish courts.
                  </p>
                  <p className="p-3 bg-gray-50 border border-gray-200 rounded text-sm italic">
                    Consumers may also use the EU Online Dispute Resolution platform where applicable.
                  </p>
                </div>
              </section>

              <hr className="my-8 border-gray-100" />

              <section className="mb-8 py-6 px-8 bg-primary/5 rounded-xl border border-primary/10">
                <h2 className="text-xl font-bold mb-4">18. Contact</h2>
                <p className="mb-4 font-medium">
                  For questions regarding these Terms & Conditions, please contact:
                </p>
                <p className="font-bold text-primary text-2xl tracking-tight">info@ecovluu.com</p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TermsAndConditions;