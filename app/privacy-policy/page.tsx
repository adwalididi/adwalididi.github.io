import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy and Cookie Policy | Ad Wali Didi',
  description: 'Our privacy and cookie policy outlining how we collect, use, and protect your data.',
}

export default function PrivacyPolicyPage() {
  return (
    <div className="pt-32 pb-24 md:pt-40 md:pb-32 bg-white">
      <div className="container mx-auto px-4 md:px-6 max-w-3xl">
        <h1 className="font-syne text-3xl md:text-5xl font-bold text-near-black mb-6">Privacy and Cookie Policy</h1>
        <p className="font-inter text-neutral-500 mb-12 border-b border-neutral-200 pb-8">
          Effective Date: April 5, 2026
        </p>

        <div className="space-y-8 font-inter text-neutral-600 leading-relaxed">
          <p>
            Welcome to AD wali Didi ("we," "our," or "us"). We are a digital marketing and advertising agency based in Chalisgaon, Maharashtra, India. We respect your privacy and are committed to protecting the personal data you share with us.
          </p>
          <p>
            This policy explains how we collect, use, and safeguard your information when you visit adwalididi.com (the "Website"), as well as your rights regarding that information.
          </p>

          <section className="space-y-4">
            <h2 className="font-syne text-2xl font-bold text-near-black">1. Information We Collect</h2>
            <p>We collect information in two primary ways:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Information You Provide to Us:</strong> When you contact us via email, submit an inquiry form, or request a consultation, we may collect personal details such as your name, email address, phone number, and business details.</li>
              <li><strong>Information Collected Automatically:</strong> When you interact with our Website, we automatically collect certain data about your device, browser, and browsing actions using cookies and similar tracking technologies.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="font-syne text-2xl font-bold text-near-black">2. How We Use Your Information</h2>
            <p>We use the data we collect for the following purposes:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>To respond to your inquiries and provide our digital marketing services.</li>
              <li>To understand how visitors interact with our Website and improve the user experience.</li>
              <li>To deliver targeted advertising and measure the effectiveness of our marketing campaigns.</li>
              <li>To maintain the security and performance of our Website.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="font-syne text-2xl font-bold text-near-black">3. Cookie Policy & Tracking Technologies</h2>
            <p>Our Website uses cookies (small text files placed on your device) and similar tracking scripts to function effectively and provide analytics and marketing data.</p>
            <p>We utilize a Consent Management Platform to ensure no non-essential cookies are placed on your device without your explicit consent.</p>
            <p>The specific tracking tools we use include:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Google Analytics 4 (GA4):</strong> Used to analyze website traffic, track page views, and understand user behavior. This helps us see which content is most valuable to our visitors.</li>
              <li><strong>Microsoft Clarity:</strong> Used to capture behavioral metrics, heatmaps, and session replays. This helps us identify how users navigate our site and where we can improve the layout and user experience.</li>
              <li><strong>Meta Pixel:</strong> Used to track visitor actions on our site so we can build targeted audiences and deliver relevant advertising to you across Facebook and Instagram.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="font-syne text-2xl font-bold text-near-black">4. How to Manage Your Cookies</h2>
            <p>You have full control over the cookies placed on your device:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Consent Banner:</strong> When you first visit our Website, you are presented with a cookie consent banner. You can choose to accept all cookies, reject non-essential cookies, or customize your preferences for analytics and advertising tracking.</li>
              <li><strong>Browser Settings:</strong> Most web browsers allow you to control cookies through their settings preferences. You can set your browser to refuse all or some browser cookies, or to alert you when websites set or access cookies.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="font-syne text-2xl font-bold text-near-black">5. Sharing Your Information</h2>
            <p>We do not sell, rent, or trade your personal information to third parties. We only share information with trusted third-party service providers (such as Google, Microsoft, and Meta) exclusively to facilitate the analytics and advertising features mentioned above. These providers are bound by strict data privacy agreements.</p>
          </section>

          <section className="space-y-4">
            <h2 className="font-syne text-2xl font-bold text-near-black">6. Your Data Rights</h2>
            <p>Depending on your location and applicable data protection laws, you may have the right to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Request access to the personal data we hold about you.</li>
              <li>Request corrections to any inaccurate or incomplete data.</li>
              <li>Request the deletion of your personal data.</li>
              <li>Withdraw your consent for cookie tracking at any time via our consent banner.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="font-syne text-2xl font-bold text-near-black">7. Third-Party Links</h2>
            <p>Our Website may contain links to third-party websites or client portfolios. We are not responsible for the privacy practices or content of those external sites. We encourage you to read the privacy policies of any site you visit.</p>
          </section>

          <section className="space-y-4">
            <h2 className="font-syne text-2xl font-bold text-near-black">8. Updates to This Policy</h2>
            <p>We may update this Privacy and Cookie Policy periodically to reflect changes in our practices, technology, or legal requirements. We will post the updated policy on this page with a revised "Effective Date."</p>
          </section>

          <section className="space-y-4">
            <h2 className="font-syne text-2xl font-bold text-near-black">9. Contact Us</h2>
            <p>If you have any questions or concerns about this Privacy and Cookie Policy or how we handle your data, please contact us at:</p>
            <div className="bg-neutral-50 p-6 rounded-xl border border-neutral-100 not-italic">
              <strong className="block text-near-black mb-2">AD wali Didi</strong>
              <p>Location: Chalisgaon, Maharashtra, India</p>
              <p>Email: <a href="mailto:adwalididi@gmail.com" className="text-teal-600 hover:underline">adwalididi@gmail.com</a></p>
              <p>Phone: <a href="tel:+917558617172" className="text-teal-600 hover:underline">+91 7558617172</a></p>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
