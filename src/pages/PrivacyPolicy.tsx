import React from 'react';
import Layout from "@/components/layout/Layout";

const PrivacyPolicy = () => {
  return (
    <Layout>
      <div className="bg-gray-50 py-6 sm:py-12">
        <div className="container-custom px-2 sm:px-3">
          <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-left uppercase">PRIVACY POLICY</h1>
          
          <div className="bg-white p-6 sm:p-8 rounded-lg shadow-sm">
            <div className="prose max-w-none text-left">
              <p className="text-gray-600 mb-6 font-light italic">Last updated: {new Date().toLocaleDateString()}</p>
              
              <p className="mb-6">
                Welcome to Ecovluu! We are committed to protecting your privacy and ensuring that your personal data 
                is handled securely. This Privacy Policy explains how we collect, use, share, and protect your 
                information when you visit our website <a href="https://www.ecovluu.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">www.ecovluu.com</a> or make a purchase from us.
              </p>

              <hr className="my-8 border-gray-100" />

              <section className="mb-8">
                <h2 className="text-xl font-bold mb-4 italic underline decoration-primary decoration-2 underline-offset-8">Information We Collect</h2>
                <p className="mb-4">
                  We collect various types of information to provide you with a seamless shopping experience. This includes:
                </p>
                <ul className="list-disc pl-6 mb-6 space-y-2">
                  <li>Personal information (name, email address, billing and shipping addresses, phone number)</li>
                  <li>Payment details when you make a purchase</li>
                  <li>Technical data (IP address, device type, browser version)</li>
                  <li>Information collected through cookies</li>
                </ul>
              </section>

              <hr className="my-8 border-gray-100" />

              <section className="mb-8">
                <h2 className="text-xl font-bold mb-4">How We Use Your Information</h2>
                <p className="mb-4 font-medium text-gray-700">We use your personal information to:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                  {[
                    "Process your orders & payments",
                    "Provide customer support",
                    "Communicate order updates",
                    "Send promotional emails",
                    "Improve site performance",
                    "Tailor product recommendations"
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2 p-3 bg-gray-50 rounded border border-gray-100 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                      {item}
                    </div>
                  ))}
                </div>
              </section>

              <hr className="my-8 border-gray-100" />

              <section className="mb-8 font-light leading-relaxed">
                <h2 className="text-xl font-bold mb-4">Sharing Your Information</h2>
                <p className="mb-4">
                  We may share your personal data with trusted third-party service providers, such as payment processors (e.g., Stripe) and shipping companies.
                </p>
                <p className="mb-4 p-4 bg-primary/5 border-l-4 border-primary rounded-r-lg font-medium">
                  We do not sell or rent your data to any third parties. All partners are required to protect your data and comply with GDPR.
                </p>
              </section>

              <hr className="my-8 border-gray-100" />

              <section className="mb-8">
                <h2 className="text-xl font-bold mb-4">Cookies & Tracking</h2>
                <p className="mb-4">
                  Our website uses cookies to improve your browsing experience and analyze website performance. Cookies help us remember your preferences and analyze site usage.
                </p>
                <p className="mb-4 italic text-sm text-gray-500">
                  You can control your cookie preferences in your browser settings. However, please note that disabling cookies may affect certain features of our website.
                </p>
              </section>

              <hr className="my-8 border-gray-100" />

              <section className="mb-8">
                <h2 className="text-xl font-bold mb-4">Your Rights Under GDPR</h2>
                <p className="mb-4">As a resident of the EU, you have specific rights regarding your personal data:</p>
                <ul className="list-disc pl-6 mb-6 space-y-2 font-medium text-gray-800">
                  <li>Access your personal data</li>
                  <li>Correct inaccurate data</li>
                  <li>Delete your data (Right to be forgotten)</li>
                  <li>Restrict the use of your data</li>
                  <li>Request a copy of your data in a portable format</li>
                  <li>Object to processing your data for marketing purposes</li>
                </ul>
                <p className="mt-4 p-3 bg-gray-50 border border-dashed border-gray-300 text-center rounded">
                  To exercise any of these rights, contact: <span className="font-bold text-primary">info@ecovluu.com</span>
                </p>
              </section>

              <hr className="my-8 border-gray-100" />

              <section className="mb-8">
                <h2 className="text-xl font-bold mb-4">Legal Basis for Processing</h2>
                <div className="space-y-4">
                  <div className="p-4 border border-gray-100 rounded shadow-sm">
                    <p className="font-bold text-primary mb-1">Contractual Necessity</p>
                    <p className="text-sm">To process orders, facilitate payments, deliver products, and provide support.</p>
                  </div>
                  <div className="p-4 border border-gray-100 rounded shadow-sm">
                    <p className="font-bold text-primary mb-1">Consent</p>
                    <p className="text-sm">For marketing communications and non-essential cookies.</p>
                  </div>
                  <div className="p-4 border border-gray-100 rounded shadow-sm">
                    <p className="font-bold text-primary mb-1">Legitimate Interests & Legal Obligations</p>
                    <p className="text-sm">For website improvement, fraud prevention, and compliance with applicable laws.</p>
                  </div>
                </div>
              </section>

              <hr className="my-8 border-gray-100" />

              <section className="mb-8">
                <h2 className="text-xl font-bold mb-4">Data Retention</h2>
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border p-2 text-left">Data Type</th>
                      <th className="border p-2 text-left">Retention Period</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr><td className="border p-2">Transaction Data</td><td className="border p-2">6 years</td></tr>
                    <tr><td className="border p-2">Marketing Data</td><td className="border p-2">Until unsubscribe</td></tr>
                    <tr><td className="border p-2">Technical Data</td><td className="border p-2">12 months</td></tr>
                    <tr><td className="border p-2">Support Data</td><td className="border p-2">2 years</td></tr>
                  </tbody>
                </table>
              </section>

              <hr className="my-8 border-gray-100" />

              <section className="mb-8">
                <h2 className="text-xl font-bold mb-4">Data Security</h2>
                <p className="mb-4">
                  We are committed to keeping your data secure through SSL encryption, secure server storage, and regular system monitoring.
                </p>
              </section>

              <hr className="my-8 border-gray-100" />

              <section className="mb-8">
                <h2 className="text-xl font-bold mb-4">Supervisory Authority</h2>
                <p className="mb-4">
                  You have the right to lodge a complaint with Ireland's Data Protection Commission (DPC):
                </p>
                <div className="bg-gray-50 p-4 rounded-lg text-sm">
                  <p><span className="font-bold">Website:</span> <a href="https://www.dataprotection.ie" className="text-primary hover:underline">www.dataprotection.ie</a></p>
                  <p><span className="font-bold">Address:</span> 21 Fitzwilliam Square South, Dublin 2, D02 RD28, Ireland</p>
                  <p><span className="font-bold">Phone:</span> +353 578 684 800</p>
                </div>
              </section>

              <hr className="my-8 border-gray-100" />

              <section className="mb-8 py-6 px-8 bg-primary/5 rounded-xl border border-primary/10">
                <h2 className="text-xl font-bold mb-4 uppercase tracking-tighter">Contact Us</h2>
                <p className="mb-4 font-medium">
                  For any questions about this Privacy Policy, please contact us:
                </p>
                <p className="font-bold text-primary text-2xl">info@ecovluu.com</p>
                <p className="text-gray-600 text-sm mt-2">
                  A6, Block A, Santry Business Park, Swords Road, Santry, Dublin 9, Ireland
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PrivacyPolicy;