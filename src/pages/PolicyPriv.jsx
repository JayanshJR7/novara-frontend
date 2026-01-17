import React from 'react';

const PolicyPriv = () => {
  return (
    <div className="policy-container">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

        .policy-container {
          max-width: 1000px;
          margin: 0 auto;
          padding: 60px 24px;
          font-family: 'Poppins', sans-serif;
        }

        .policy-header {
          margin-bottom: 32px;
        }

        .icon-privacy {
          width: 48px;
          height: 48px;
          background: linear-gradient(135deg, #d97706 0%, #b45309 100%);
          border-radius: 12px;
          margin-bottom: 16px;
          position: relative;
        }

        .icon-privacy::before {
          content: '🔒';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-size: 24px;
        }

        .policy-header h1 {
          font-size: 2.5rem;
          font-weight: 700;
          color: #111827;
          margin: 0 0 8px 0;
        }

        .last-updated {
          color: #6b7280;
          font-size: 0.95rem;
          margin: 0;
        }

        .intro-text {
          font-size: 1.125rem;
          font-weight: 500;
          color: #111827;
          margin-bottom: 24px;
        }

        .policy-content {
          color: #374151;
          line-height: 1.8;
        }

        .policy-section {
          margin-bottom: 32px;
        }

        .policy-section h2 {
          font-size: 1.5rem;
          font-weight: 600;
          color: #111827;
          margin-bottom: 16px;
        }

        .policy-section h3 {
          font-size: 1.25rem;
          font-weight: 600;
          color: #111827;
          margin: 20px 0 12px 0;
        }

        .policy-section p {
          margin-bottom: 12px;
          font-size: 1rem;
        }

        .policy-section ul {
          margin: 16px 0;
          padding-left: 24px;
        }

        .policy-section li {
          margin-bottom: 12px;
          line-height: 1.8;
        }

        .policy-section li strong,
        .policy-section p strong {
          color: #111827;
          font-weight: 600;
        }

        .highlight-section {
          background: #fef3c7;
          padding: 24px;
          border-radius: 8px;
          border-left: 4px solid #d97706;
        }

        .info-section {
          background: #dbeafe;
          padding: 24px;
          border-radius: 8px;
          border-left: 4px solid #2563eb;
        }

        @media (max-width: 768px) {
          .policy-container {
            padding: 40px 20px;
          }

          .policy-header h1 {
            font-size: 2rem;
          }

          .policy-section h2 {
            font-size: 1.25rem;
          }

          .highlight-section,
          .info-section {
            padding: 16px;
          }
        }
      `}</style>

      <div className="policy-header">
        <div className="icon-privacy"></div>
        <h1>Privacy Policy</h1>
        <p className="last-updated">Last Updated: January 9, 2026</p>
      </div>

      <div className="policy-content">
        <p className="intro-text">Your privacy is critically important to us.</p>

        <p>
          It is Novara Jewels' policy to respect your privacy regarding any information we may collect while operating our website. This Privacy Policy applies to <a href="https://novarajewels.in/" target="_blank" rel="noopener noreferrer">https://novarajewels.in/</a> (hereinafter, "us", "we", or "Novara Jewels"). We respect your privacy and are committed to protecting personally identifiable information you may provide us through the Website. We have adopted this privacy policy ("Privacy Policy") to explain what information may be collected on our Website, how we use this information, and under what circumstances we may disclose the information to third parties. This Privacy Policy applies only to information we collect through the Website and does not apply to our collection of information from other sources.
        </p>

        <p>
          This Privacy Policy, together with the Terms and Conditions posted on our Website, set forth the general rules and policies governing your use of our Website. Depending on your activities when visiting our Website, you may be required to agree to additional terms and conditions.
        </p>

        <section className="policy-section">
          <h2>1. Website Visitors</h2>
          <p>
            Like most website operators, Novara Jewels collects non-personally-identifying information of the sort that web browsers and servers typically make available, such as the browser type, language preference, referring site, and the date and time of each visitor request. Novara Jewels' purpose in collecting non-personally identifying information is to better understand how our visitors use the website. From time to time, we may release non-personally-identifying information in the aggregate, for example, by publishing a report on trends in the usage of our website.
          </p>
          <p>
            Novara Jewels also collects potentially personally-identifying information like Internet Protocol (IP) addresses for logged in users and for users leaving comments on our blog posts. We only disclose logged in user and commenter IP addresses under the same circumstances that we use and disclose personally-identifying information as described below.
          </p>
        </section>

        <section className="policy-section">
          <h2>2. Gathering of Personally-Identifying Information</h2>
          <p>
            Certain visitors to Novara Jewels' website choose to interact with us in ways that require us to gather personally-identifying information. The amount and type of information that we gather depends on the nature of the interaction. For example, we ask visitors who sign up for our newsletter to provide their name and email address. Those who engage in transactions with us are asked to provide additional information, including as necessary the personal and financial information required to process those transactions.
          </p>
          <p>
            The information we collect may include:
          </p>
          <ul>
            <li><strong>Contact Information:</strong> Name, email address, phone number</li>
            <li><strong>Shipping Information:</strong> Delivery address, city, state, PIN code</li>
            <li><strong>Payment Information:</strong> Payment method details (processed securely through payment gateways)</li>
            <li><strong>Order Information:</strong> Purchase history, product preferences</li>
            <li><strong>Account Information:</strong> Username, password (encrypted)</li>
          </ul>
        </section>

        <section className="policy-section">
          <h2>3. How We Use Your Information</h2>
          <p>We use the information we collect for the following purposes:</p>
          <ul>
            <li>Processing and fulfilling your orders</li>
            <li>Communicating with you about your orders, deliveries, and account</li>
            <li>Providing customer support and responding to your inquiries</li>
            <li>Sending promotional emails about new products, special offers, or other information (you can opt-out anytime)</li>
            <li>Improving our website, products, and services</li>
            <li>Preventing fraud and enhancing security</li>
            <li>Complying with legal obligations</li>
          </ul>
        </section>

        <section className="policy-section highlight-section">
          <h2>4. Security</h2>
          <p>
            The security of your Personal Information is important to us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Information, we cannot guarantee its absolute security.
          </p>
          <p>We implement security measures including:</p>
          <ul>
            <li>Secure Socket Layer (SSL) encryption for data transmission</li>
            <li>Secure storage of sensitive information</li>
            <li>Regular security audits and updates</li>
            <li>Limited access to personal information by authorized personnel only</li>
            <li>Payment information is processed through secure, PCI-compliant payment gateways</li>
          </ul>
        </section>

        <section className="policy-section">
          <h2>5. Cookies</h2>
          <p>
            To enrich and perfect your online experience, Novara Jewels uses "Cookies", similar technologies and services provided by others to display personalized content, appropriate advertising and store your preferences on your computer.
          </p>
          <p>
            A cookie is a string of information that a website stores on a visitor's computer, and that the visitor's browser provides to the website each time the visitor returns. Novara Jewels uses cookies to help us identify and track visitors, their usage of our website, and their website access preferences.
          </p>
          <p>
            Visitors who do not wish to have cookies placed on their computers should set their browsers to refuse cookies before using our website, with the drawback that certain features of our website may not function properly without the aid of cookies.
          </p>
          <p>
            By continuing to navigate our website without changing your cookie settings, you hereby acknowledge and agree to Novara Jewels' use of cookies.
          </p>
        </section>

        <section className="policy-section">
          <h2>6. Protection of Personally-Identifying Information</h2>
          <p>
            Novara Jewels discloses potentially personally-identifying and personally-identifying information only to those of its employees, contractors and affiliated organizations that:
          </p>
          <ul>
            <li>Need to know that information in order to process it on our behalf or to provide services available on our website</li>
            <li>Have agreed not to disclose it to others</li>
          </ul>
          <p>
            Some of those employees, contractors and affiliated organizations may be located outside of your home country; by using our website, you consent to the transfer of such information to them.
          </p>
          <p>
            <strong>Novara Jewels will not rent or sell potentially personally-identifying and personally-identifying information to anyone.</strong>
          </p>
          <p>
            Other than to its employees, contractors and affiliated organizations, as described above, Novara Jewels discloses potentially personally-identifying and personally-identifying information only in response to a subpoena, court order or other governmental request, or when we believe in good faith that disclosure is reasonably necessary to protect our property or rights, third parties or the public at large.
          </p>
        </section>

        <section className="policy-section">
          <h2>7. Marketing Communications</h2>
          <p>
            If you are a registered user of Novara Jewels and have supplied your email address, we may occasionally send you an email to tell you about new features, solicit your feedback, or just keep you up to date with what's going on with Novara Jewels and our products.
          </p>
          <p>
            We primarily use our blog and social media to communicate this type of information, so we expect to keep promotional emails to a minimum. You can unsubscribe from marketing emails at any time by clicking the "unsubscribe" link at the bottom of any promotional email.
          </p>
        </section>

        <section className="policy-section">
          <h2>8. Third-Party Services</h2>
          <p>We may use third-party service providers to help us operate our business and website or administer activities on our behalf, such as:</p>
          <ul>
            <li><strong>Payment Processors:</strong> To process payments securely</li>
            <li><strong>Shipping Partners:</strong> To deliver your orders</li>
            <li><strong>Email Service Providers:</strong> To send newsletters and updates</li>
            <li><strong>Analytics Services:</strong> To understand website usage and improve our services</li>
            <li><strong>Marketing Platforms:</strong> For advertising and remarketing</li>
          </ul>
          <p>
            These third parties have access to your personal information only to perform specific tasks on our behalf and are obligated not to disclose or use it for any other purpose.
          </p>
        </section>

        <section className="policy-section">
          <h2>9. Advertisements and Remarketing</h2>
          <p>
            Ads appearing on our website may be delivered to users by advertising partners, who may set cookies. These cookies allow the ad server to recognize your computer each time they send you an online advertisement to compile information about you or others who use your computer. This information allows ad networks to deliver targeted advertisements that they believe will be of most interest to you.
          </p>
          <h3>Google AdWords Remarketing</h3>
          <p>
            Novara Jewels uses remarketing services to advertise on third party websites (including Google) to previous visitors to our site. We may advertise to previous visitors who haven't completed a task on our site, for example using the contact form to make an enquiry. This could be in the form of an advertisement on the Google search results page or a site in the Google Display Network.
          </p>
          <p>
            Third-party vendors, including Google, use cookies to serve ads based on someone's past visits to our website. Any data collected will be used in accordance with our own privacy policy and Google's privacy policy.
          </p>
          <p>
            You can set preferences for how Google advertises to you using the <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer">Google Ad Preferences page</a>, and if you want to, you can opt-out of interest-based advertising entirely by cookie settings or permanently using a browser plugin.
          </p>
        </section>

        <section className="policy-section">
          <h2>10. Links to External Sites</h2>
          <p>
            Our Service may contain links to external sites that are not operated by us. If you click on a third party link, you will be directed to that third party's site. We strongly advise you to review the Privacy Policy and terms and conditions of every site you visit.
          </p>
          <p>
            We have no control over and assume no responsibility for the content, privacy policies or practices of any third party sites, products or services.
          </p>
        </section>

        <section className="policy-section">
          <h2>11. Aggregated Statistics</h2>
          <p>
            Novara Jewels may collect statistics about the behavior of visitors to our website. We may display this information publicly or provide it to others. However, we do not disclose your personally-identifying information.
          </p>
        </section>

        <section className="policy-section info-section">
          <h2>12. Your Rights and Choices</h2>
          <p>You have the following rights regarding your personal information:</p>
          <ul>
            <li><strong>Access:</strong> You can request access to the personal information we hold about you</li>
            <li><strong>Correction:</strong> You can update or correct your personal information</li>
            <li><strong>Deletion:</strong> You can request deletion of your personal information (subject to legal obligations)</li>
            <li><strong>Opt-Out:</strong> You can opt-out of marketing communications at any time</li>
            <li><strong>Data Portability:</strong> You can request a copy of your data in a portable format</li>
          </ul>
          <p>
            To exercise any of these rights, please contact us using the contact information provided at the end of this policy.
          </p>
        </section>

        <section className="policy-section">
          <h2>13. Children's Privacy</h2>
          <p>
            Our website is not intended for children under the age of 18. We do not knowingly collect personally identifiable information from children under 18. If you are a parent or guardian and you are aware that your child has provided us with personal information, please contact us so that we can take necessary actions.
          </p>
        </section>

        <section className="policy-section">
          <h2>14. Data Retention</h2>
          <p>
            We retain your personal information for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law. When we no longer need your information, we will securely delete or anonymize it.
          </p>
        </section>

        <section className="policy-section">
          <h2>15. Privacy Policy Changes</h2>
          <p>
            Although most changes are likely to be minor, Novara Jewels may change its Privacy Policy from time to time, and in our sole discretion. We encourage visitors to frequently check this page for any changes to our Privacy Policy. Your continued use of this site after any change in this Privacy Policy will constitute your acceptance of such change.
          </p>
          <p>
            If we make material changes to this policy, we will notify you by email or by posting a prominent notice on our website prior to the change becoming effective.
          </p>
        </section>

        <section className="policy-section highlight-section">
          <h2>16. Contact Information</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us:
          </p>
          <ul>
            <li><strong>Website:</strong> <a href="https://novarajewels.in/" target="_blank" rel="noopener noreferrer">https://novarajewels.in/</a></li>
            <li><strong>Email:</strong> thenovarajewels@gmail.com</li>
          </ul>
        </section>

        <section className="policy-section">
          <h2>17. Consent</h2>
          <p>
            By using our website and services, you hereby consent to our Privacy Policy and agree to its terms.
          </p>
        </section>
      </div>
    </div>
  );
};

export default PolicyPriv;