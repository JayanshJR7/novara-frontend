import React from 'react';

const ShippingPolicy = () => {
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

        .icon-shipping {
          width: 48px;
          height: 48px;
          background: linear-gradient(135deg, #d97706 0%, #b45309 100%);
          border-radius: 12px;
          margin-bottom: 16px;
          position: relative;
        }

        .icon-shipping::before {
          content: '📦';
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

        .alert-box {
          background: #fef3c7;
          border-left: 4px solid #d97706;
          padding: 24px;
          margin-bottom: 32px;
          border-radius: 4px;
        }

        .alert-title {
          font-size: 1.125rem;
          font-weight: 600;
          color: #111827;
          margin: 0 0 8px 0;
        }

        .alert-text {
          color: #374151;
          margin: 0;
          line-height: 1.7;
        }

        .alert-text strong {
          color: #111827;
          font-weight: 600;
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

        .contact-placeholder {
          background: #f3f4f6;
          padding: 4px 8px;
          border-radius: 4px;
          color: #6b7280;
          font-family: monospace;
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

          .alert-box,
          .highlight-section,
          .info-section {
            padding: 16px;
          }
        }
      `}</style>

      <div className="policy-header">
        <div className="icon-shipping"></div>
        <h1>Shipping & Delivery Policy</h1>
        <p className="last-updated">Last Updated: January 9, 2026</p>
      </div>

      <div className="alert-box">
        <p className="alert-title">Domestic Shipping Only</p>
        <p className="alert-text">We currently ship <strong>within India only</strong>. All orders are processed and dispatched within 2-5 business days.</p>
      </div>

      <div className="policy-content">
        <section className="policy-section">
          <h2>1. Shipping Within India</h2>
          <p>We offer shipping to all serviceable locations across India through our trusted courier partners.</p>
          <ul>
            <li><strong>Processing Time:</strong> 2-5 business days (Monday to Saturday)</li>
            <li><strong>Delivery Time:</strong> 5-7 business days for metro cities, 7-10 business days for non-metro areas</li>
            <li><strong>Courier Partners:</strong> Delhivery, Blue Dart, India Post, or other reliable services</li>
            <li><strong>Working Days:</strong> Monday to Saturday (excluding Sundays and national holidays)</li>
          </ul>
        </section>

        <section className="policy-section">
          <h2>2. Shipping Charges</h2>
          <p>Shipping charges vary based on order value and location:</p>
          <ul>
            <li><strong>Free Shipping:</strong> Orders above ₹2,000</li>
            <li><strong>Standard Shipping:</strong> ₹99 for orders below ₹2,000 (metro cities)</li>
            <li><strong>Remote Areas:</strong> ₹149 for non-metro and remote locations</li>
            <li>Shipping charges are calculated automatically at checkout based on delivery location</li>
          </ul>
        </section>

        <section className="policy-section">
          <h2>3. Order Processing</h2>
          <p>Once your order is confirmed:</p>
          <ul>
            <li>You will receive an order confirmation email within 24 hours</li>
            <li>Orders are processed within 2-5 business days</li>
            <li>A shipping confirmation with tracking details will be sent once dispatched</li>
            <li>Custom or personalized items may require additional processing time (7-10 business days)</li>
            <li>Orders placed on weekends or holidays will be processed on the next working day</li>
          </ul>
        </section>

        <section className="policy-section highlight-section">
          <h2>4. Delivery Timeline</h2>
          <p><strong>Standard Delivery Times:</strong></p>
          <ul>
            <li><strong>Metro Cities</strong> (Mumbai, Delhi, Bangalore, Chennai, Kolkata, Hyderabad, Pune, Ahmedabad): 5-7 business days</li>
            <li><strong>Tier 2 Cities:</strong> 7-10 business days</li>
            <li><strong>Remote/Rural Areas:</strong> 10-15 business days</li>
            <li>Delivery times are estimated and may vary due to unforeseen circumstances</li>
          </ul>
        </section>

        <section className="policy-section">
          <h2>5. Packaging & Handling</h2>
          <p>We take special care in packaging your jewellery:</p>
          <ul>
            <li>All items are carefully wrapped in protective packaging</li>
            <li>Jewellery pieces are placed in elegant boxes with cushioning</li>
            <li>Packages are sealed with tamper-proof tape</li>
            <li>Each package includes an invoice and authenticity certificate (if applicable)</li>
            <li>Discreet packaging is used to ensure privacy and security</li>
          </ul>
        </section>

        <section className="policy-section">
          <h2>6. Delivery Address</h2>
          <p>Please ensure your delivery address is correct:</p>
          <ul>
            <li>Provide complete address with landmark, city, state, and PIN code</li>
            <li>Ensure contact number is active and reachable</li>
            <li>Address changes are not possible once the order is dispatched</li>
            <li>We are not responsible for delays due to incorrect address provided by customer</li>
            <li>PO Box addresses may not be serviceable by all courier partners</li>
          </ul>
        </section>

        <section className="policy-section">
          <h2>7. Delivery Attempts</h2>
          <p>Our courier partners will make delivery attempts as follows:</p>
          <ul>
            <li><strong>First Attempt:</strong> Delivery to provided address</li>
            <li><strong>Second Attempt:</strong> If first attempt fails, second attempt within 24-48 hours</li>
            <li><strong>Third Attempt:</strong> Final delivery attempt before return to origin</li>
            <li>You will receive calls/SMS from courier partner before delivery</li>
            <li>Packages not accepted after 3 attempts will be returned to us</li>
            <li>Return shipping charges will be deducted from refund for undelivered orders</li>
          </ul>
        </section>

        <section className="policy-section info-section">
          <h2>8. Undeliverable Packages</h2>
          <p>If a package cannot be delivered due to customer unavailability or incorrect address:</p>
          <ul>
            <li>The package will be returned to our warehouse</li>
            <li>Return shipping charges (₹150-₹200) will be deducted from the refund</li>
            <li>Refund will be processed within 7-10 business days after receiving returned package</li>
            <li>Customers may choose to place a new order with correct details</li>
          </ul>
        </section>

        <section className="policy-section">
          <h2>9. Shipping Delays</h2>
          <p>While we strive for timely delivery, delays may occur due to:</p>
          <ul>
            <li>Natural disasters, weather conditions, or force majeure events</li>
            <li>Political unrest, strikes, or lockdowns</li>
            <li>Courier partner operational issues</li>
            <li>Government restrictions or customs clearance (if applicable)</li>
            <li>Remote or difficult-to-access locations</li>
            <li>Festival season or peak sale periods</li>
          </ul>
          <p><strong>Note:</strong> Novara Jewels is not liable for delays caused by circumstances beyond our control.</p>
        </section>

        <section className="policy-section">
          <h2>10. Receiving Your Order</h2>
          <p><strong>IMPORTANT:</strong> Please follow these steps when receiving your order:</p>
          <ul>
            <li><strong>Verify Package Condition:</strong> Check for any visible damage to the package</li>
            <li><strong>Record Unboxing Video:</strong> We strongly recommend recording a video while opening your package</li>
            <li><strong>Check Contents:</strong> Verify all items match your order confirmation</li>
            <li><strong>Inspect for Damage:</strong> Check jewellery for any damage or defects</li>
            <li><strong>Report Issues Immediately:</strong> Contact us within 48 hours if there are any issues</li>
            <li>Unboxing video serves as proof of product condition and may be required for damage claims</li>
          </ul>
        </section>

        <section className="policy-section">
          <h2>11. Lost or Damaged in Transit</h2>
          <p>If your package is lost or damaged during shipping:</p>
          <ul>
            <li>Contact us immediately at <span className="contact-placeholder">[YOUR_EMAIL]</span></li>
            <li>Provide order number and tracking details</li>
            <li>For damaged packages, provide photographs and unboxing video</li>
            <li>We will coordinate with courier partner for investigation</li>
            <li>Replacement or refund will be provided after verification</li>
            <li>Claims must be raised within 48 hours of delivery</li>
          </ul>
        </section>

        <section className="policy-section">
          <h2>12. Non-Serviceable Areas</h2>
          <p>Some remote locations may not be serviceable by our courier partners:</p>
          <ul>
            <li>You will be notified during checkout if your PIN code is non-serviceable</li>
            <li>We will attempt to find alternative courier options</li>
            <li>Additional charges may apply for special delivery arrangements</li>
            <li>Orders to non-serviceable areas may be cancelled with full refund</li>
          </ul>
        </section>

        <section className="policy-section highlight-section">
          <h2>13. Contact Information</h2>
          <p>For shipping-related queries, contact us:</p>
          <ul>
            <li><strong>Email:</strong> <span className="contact-placeholder">thenovarajewels@gmail.com</span></li>
            <li><strong>Phone:</strong> <span className="contact-placeholder">+91 9950053900</span></li>
            <li><strong>WhatsApp:</strong> <span className="contact-placeholder">+91 8209845088</span></li>
            <li><strong>Business Hours:</strong> Monday to Saturday, 10:00 AM - 6:00 PM IST</li>
          </ul>
        </section>

        <section className="policy-section">
          <h2>14. Terms & Conditions</h2>
          <ul>
            <li>All shipping timelines are estimates and not guaranteed</li>
            <li>Novara Jewels is not responsible for delays by courier partners</li>
            <li>Customer must provide accurate delivery information</li>
            <li>Refusal to accept delivery will result in return shipping charges</li>
            <li>We reserve the right to change shipping partners or charges without prior notice</li>
            <li>This policy is subject to change; latest version will be on our website</li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default ShippingPolicy;