import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Use | Ad Wali Didi',
  description: 'Terms of Use governing your access to and use of adwalididi.com.',
}

export default function TermsOfUsePage() {
  return (
    <div className="pt-32 pb-24 md:pt-40 md:pb-32 bg-white">
      <div className="container mx-auto px-4 md:px-6 max-w-3xl">
        <h1 className="font-syne text-3xl md:text-5xl font-bold text-near-black mb-6">Terms of Use</h1>
        <p className="font-inter text-neutral-500 mb-12 border-b border-neutral-200 pb-8">
          Effective Date: April 5, 2026
        </p>

        <div className="space-y-8 font-inter text-neutral-600 leading-relaxed">
          <p>
            Welcome to AD wali Didi ("we," "our," or "us"). These Terms of Use ("Terms") govern your access to and use of adwalididi.com (the "Website") and the digital marketing services, resources, and content available through it.
          </p>
          <p>
            By accessing or using our Website, you agree to be bound by these Terms. If you do not agree with any part of these Terms, you must not use our Website.
          </p>

          <section className="space-y-4">
            <h2 className="font-syne text-2xl font-bold text-near-black">1. Description of Services</h2>
            <p>
              AD wali Didi is a digital marketing agency providing services such as digital advertising, search engine optimization (SEO), social media marketing, brand strategy, and copywriting. Information provided on this Website is for general informational purposes and does not constitute a binding client agreement until a formal contract or statement of work is signed.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-syne text-2xl font-bold text-near-black">2. No Guarantee of Results</h2>
            <p>
              While we utilize industry best practices, data-driven strategies, and professional expertise to execute our marketing campaigns, digital advertising involves unpredictable variables (including third-party algorithm changes, market behavior, and platform rules). Therefore, we do not guarantee specific outcomes, traffic volume, lead generation numbers, or return on investment (ROI) from the use of our services or the implementation of strategies discussed on this Website.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-syne text-2xl font-bold text-near-black">3. Intellectual Property Rights</h2>
            <p>All content, design elements, graphics, text, logos, brand slogans, and case studies on this Website are the exclusive intellectual property of AD wali Didi, unless otherwise stated.</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>You may view, download, and print content for personal, non-commercial use only.</li>
              <li>You may not reproduce, distribute, modify, or create derivative works from our content for commercial purposes without our express written consent.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="font-syne text-2xl font-bold text-near-black">4. User Conduct</h2>
            <p>By using this Website, you agree not to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Use the Website in any way that violates applicable laws or regulations.</li>
              <li>Attempt to gain unauthorized access to our Website's servers, network, or databases.</li>
              <li>Use any automated systems (such as bots or scrapers) to extract data from our Website.</li>
              <li>Submit false, misleading, or malicious information through our contact forms.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="font-syne text-2xl font-bold text-near-black">5. Third-Party Links and Tools</h2>
            <p>
              Our Website may contain links to third-party websites, tools, or client portfolios. We do not control and are not responsible for the content, privacy policies, or practices of any third-party sites. Accessing these links is at your own risk.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-syne text-2xl font-bold text-near-black">6. Disclaimer of Warranties</h2>
            <p>
              Your use of the Website is at your sole risk. The Website and its content are provided on an "as is" and "as available" basis without any warranties of any kind, either express or implied, including but not limited to warranties of merchantability, fitness for a particular purpose, or non-infringement. We do not warrant that the Website will be uninterrupted, error-free, or free of viruses or other harmful components.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-syne text-2xl font-bold text-near-black">7. Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by law, AD wali Didi, its founders, employees, and affiliates shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, use, or goodwill, arising out of or in connection with your access to or use of the Website or our services.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-syne text-2xl font-bold text-near-black">8. Indemnification</h2>
            <p>
              You agree to indemnify, defend, and hold harmless AD wali Didi from and against any claims, liabilities, damages, judgments, awards, losses, costs, or expenses (including reasonable attorneys' fees) arising out of your violation of these Terms or your use of the Website.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-syne text-2xl font-bold text-near-black">9. Governing Law and Jurisdiction</h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of India. Any disputes arising under or in connection with these Terms shall be subject to the exclusive jurisdiction of the courts located in Chalisgaon, Maharashtra, India.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-syne text-2xl font-bold text-near-black">10. Changes to These Terms</h2>
            <p>
              We reserve the right to modify or replace these Terms at any time at our sole discretion. We will indicate any updates by changing the "Effective Date" at the top of this page. Your continued use of the Website after any changes constitutes your acceptance of the new Terms.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-syne text-2xl font-bold text-near-black">11. Contact Information</h2>
            <p>If you have any questions about these Terms, please contact us at:</p>
            <div className="bg-neutral-50 p-6 rounded-xl border border-neutral-100 not-italic">
              <strong className="block text-near-black mb-2">AD wali Didi</strong>
              <p>Location: Chalisgaon, Maharashtra, India</p>
              <p>Email: <a href="mailto:hello@adwalididi.com" className="text-teal-600 hover:underline">hello@adwalididi.com</a></p>
              <p>Phone: <a href="tel:+917558617172" className="text-teal-600 hover:underline">+91 7558617172</a></p>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
