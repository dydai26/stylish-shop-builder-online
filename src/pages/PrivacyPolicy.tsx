import React from 'react';
import Layout from "@/components/layout/Layout";

const PrivacyPolicy = () => {
  return (
    <Layout>
      <div className="bg-gray-50 py-6 sm:py-12">
        <div className="container-custom px-2 sm:px-3">
          <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">Privacy Policy</h1>
          
          <div className="bg-white p-6 sm:p-8 rounded-lg shadow-sm">
            <div className="prose max-w-none">
              <p className="text-gray-600 mb-6">Last updated: {new Date().toLocaleDateString()}</p>
              
              <div className="mb-8">
                <p className="mb-4">
                  Welcome to Ecovluu! We are committed to protecting your privacy and ensuring that your personal data 
                  is handled securely. This Privacy Policy explains how we collect, use, share, and protect your 
                  information when you visit our website www.ecovluu.com or make a purchase from us.
                </p>
              </div>

              <h2 className="text-xl font-bold mb-4">Information We Collect</h2>
              <p className="mb-4 ">
                We collect various types of information to provide you with a seamless shopping experience. This includes:
              </p>
              <ul className="list-disc pl-6 mb-6 space-y-2 text-left">
                <li>Personal information (name, email address, billing and shipping addresses, phone number)</li>
                <li>Payment details when you make a purchase</li>
                <li>Technical data (IP address, device type, browser version)</li>
                <li>Information collected through cookies</li>
              </ul>

              <h2 className="text-xl font-bold mb-4">How We Use Your Information</h2>
              <p className="mb-4">We use your personal information to:</p>
              <ul className="list-disc pl-6 mb-6 space-y-2 text-left">
                <li>Process your orders and facilitate payments</li>
                <li>Provide customer support</li>
                <li>Communicate about your orders</li>
                <li>Send promotional emails (with your consent)</li>
                <li>Improve our website's performance</li>
                <li>Tailor product recommendations to your preferences</li>
              </ul>

              <h2 className="text-xl font-bold mb-4">Sharing Your Information with Third Parties</h2>
              <p className="mb-4">
                We may share your personal data with trusted third-party service providers, such as:
              </p>
              <ul className="list-disc pl-6 mb-6 space-y-2 text-left">
                <li>Payment processors (e.g., Stripe)</li>
                <li>Shipping companies</li>
                <li>Marketing platforms (with your consent)</li>
              </ul>
              <p className="mb-4 text-left">
                We do not sell or rent your data to any third parties. All partners are required to protect your data 
                and comply with GDPR.
              </p>

              <h2 className="text-xl font-bold mb-4">Cookies and Tracking Technologies</h2>
              <p className="mb-4">
                Our website uses cookies to improve your browsing experience and analyze website performance. Cookies help us:
              </p>
              <ul className="list-disc pl-6 mb-6 space-y-2 text-left">
                <li>Remember your preferences</li>
                <li>Analyze site usage</li>
                <li>Deliver personalized content and advertisements</li>
              </ul>
              <p className="mb-4 text-left">
                You can control your cookie preferences in your browser settings. However, please note that disabling 
                cookies may affect certain features of our website. We obtain your consent before using non-essential cookies.
              </p>

              <h2 className="text-xl font-bold mb-4">Your Rights Under GDPR</h2>
              <p className="mb-4">As a resident of the EU, you have specific rights regarding your personal data:</p>
              <ul className="list-disc pl-6 mb-6 space-y-2 text-left">
                <li>Access your personal data</li>
                <li>Correct inaccurate data</li>
                <li>Delete your data</li>
                <li>Restrict the use of your data</li>
                <li>Request a copy of your data in a portable format</li>
                <li>Object to processing your data for marketing purposes</li>
              </ul>
              <p className="mb-4 text-left">
                To exercise any of these rights, please contact us at info@ecovluu.com.
              </p>

              <h2 className="text-xl font-bold mb-4">Legal Basis for Processing Data</h2>
              <p className="mb-4">We process your personal data based on the following legal grounds under GDPR:</p>
              <ul className="list-disc pl-6 mb-6 space-y-2 text-left">
                <li>Contractual Necessity: To process orders, facilitate payments, deliver products, and provide support</li>
                <li>Consent: For marketing communications and non-essential cookies</li>
                <li>Legitimate Interests: For website improvement and fraud prevention</li>
                <li>Legal Obligations: To comply with applicable laws</li>
              </ul>

              <h2 className="text-xl font-bold mb-4">Data Retention</h2>
              <p className="mb-4">We retain your personal data for the following periods:</p>
              <ul className="list-disc pl-6 mb-6 space-y-2 text-left">
                <li>Order and Transaction Data: 6 years for tax and accounting compliance</li>
                <li>Marketing Data: Until you withdraw consent or unsubscribe</li>
                <li>Technical Data: 12 months for website analysis</li>
                <li>Customer Support Data: 2 years for dispute resolution</li>
              </ul>

              <h2 className="text-xl font-bold mb-4">Data Security</h2>
              <p className="mb-4">
                We are committed to keeping your data secure through:
              </p>
              <ul className="list-disc pl-6 mb-6 space-y-2 text-left">
                <li>SSL encryption for data transmission</li>
                <li>Secure server storage</li>
                <li>Regular system updates</li>
                <li>Access controls and monitoring</li>
              </ul>

              <h2 className="text-xl font-bold mb-4">Children's Data</h2>
              <p className="mb-4">
                Our website is not intended for individuals under the age of 16. We do not knowingly collect personal 
                data from children. If you believe your child has provided us with personal data, please contact us 
                at info@ecovluu.com, and we will delete the information.
              </p>

              <h2 className="text-xl font-bold mb-4">Supervisory Authority</h2>
              <p className="mb-4">
                If you have concerns about how we process your personal data, you have the right to lodge a complaint 
                with Ireland's Data Protection Commission (DPC):
              </p>
              <ul className="list-none pl-6 mb-6 space-y-2">
                <li>Website: <a href="https://www.dataprotection.ie" className="text-blue-600 hover:underline">https://www.dataprotection.ie</a></li>
                <li>Address: 21 Fitzwilliam Square South, Dublin 2, D02 RD28, Ireland</li>
                <li>Phone: +353 578 684 800</li>
              </ul>

              <h2 className="text-xl font-bold mb-4">Contact Us</h2>
              <p className="mb-4">
                If you have any questions or concerns about this Privacy Policy or how we handle your data, 
                please contact us:
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

export default PrivacyPolicy; 