import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata = { title: 'Privacy Policy – BeautyByRose' }

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <div className="bg-muted border-b border-border py-12 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold text-foreground mb-3">Privacy Policy</h1>
            <p className="text-muted-foreground">Last updated: January 2024</p>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 py-12 space-y-8 text-sm leading-relaxed">
          <p className="text-muted-foreground">
            BeautyByRose ("we", "our", "us") is committed to protecting your personal information. This
            Privacy Policy explains how we collect, use, and safeguard your data when you use our website
            and services.
          </p>

          {[
            {
              title: '1. Information We Collect',
              content: `We collect information you provide directly, such as your name, email address, phone number, and delivery address when you create an account or place an order. We also collect information automatically, including your IP address, browser type, pages visited, and purchase history, to improve our services.`,
            },
            {
              title: '2. How We Use Your Information',
              content: `We use your information to process orders and payments, deliver products to your address, send order confirmations and shipping updates, provide customer support, send promotional emails (with your consent), and improve our website and services.`,
            },
            {
              title: '3. Sharing Your Information',
              content: `We do not sell, trade, or rent your personal information to third parties. We may share your data with trusted service providers (e.g., delivery companies, payment processors) solely to fulfill your orders. These partners are bound by confidentiality agreements.`,
            },
            {
              title: '4. Data Security',
              content: `We implement industry-standard security measures including SSL encryption and secure payment processing to protect your personal information. However, no transmission over the internet is 100% secure, and we cannot guarantee absolute security.`,
            },
            {
              title: '5. Cookies',
              content: `We use cookies to enhance your browsing experience, remember your preferences, and analyze website traffic. You can control cookie settings through your browser. See our Cookie Policy for more details.`,
            },
            {
              title: '6. Your Rights',
              content: `You have the right to access, correct, or delete your personal information at any time. To exercise these rights, contact us at privacy@beautybyrose.co.ke. You may also unsubscribe from marketing emails using the link at the bottom of any email.`,
            },
            {
              title: '7. Changes to This Policy',
              content: `We may update this Privacy Policy from time to time. We'll notify you of significant changes via email or a notice on our website. Continued use of our services after changes constitutes acceptance of the updated policy.`,
            },
            {
              title: '8. Contact Us',
              content: `If you have questions about this Privacy Policy, please contact us at privacy@beautybyrose.co.ke or write to us at BeautyByRose, Westlands, Nairobi, Kenya.`,
            },
          ].map((section) => (
            <section key={section.title}>
              <h2 className="text-lg font-bold text-foreground mb-3">{section.title}</h2>
              <p className="text-muted-foreground">{section.content}</p>
            </section>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  )
}
