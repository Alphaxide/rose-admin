import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata = { title: 'Terms of Service – BeautyByRose' }

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <div className="bg-muted border-b border-border py-12 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold text-foreground mb-3">Terms of Service</h1>
            <p className="text-muted-foreground">Last updated: January 2024</p>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 py-12 space-y-8 text-sm leading-relaxed">
          <p className="text-muted-foreground">
            By accessing or using the BeautyByRose website and services, you agree to be bound by these
            Terms of Service. Please read them carefully before making a purchase.
          </p>

          {[
            {
              title: '1. Use of Our Website',
              content: `You must be at least 18 years old to create an account and place orders. You are responsible for maintaining the confidentiality of your account credentials. BeautyByRose reserves the right to suspend or terminate accounts that violate these terms.`,
            },
            {
              title: '2. Products & Pricing',
              content: `All prices are listed in Kenyan Shillings (KES) and are inclusive of applicable taxes. We reserve the right to change prices at any time without notice. Product images are for illustration purposes; the actual product may vary slightly in appearance.`,
            },
            {
              title: '3. Orders & Payment',
              content: `An order confirmation email does not constitute acceptance of your order. We reserve the right to cancel any order due to stock unavailability, pricing errors, or suspected fraud. Payment is due at the time of order placement.`,
            },
            {
              title: '4. Delivery',
              content: `Delivery times are estimates and not guarantees. BeautyByRose is not liable for delays caused by third-party couriers, adverse weather, or other factors beyond our control. Risk of loss passes to you upon delivery.`,
            },
            {
              title: '5. Returns & Refunds',
              content: `Returns are subject to our Returns Policy. Refunds will be issued to the original payment method within 3–5 business days after the returned item is received and inspected.`,
            },
            {
              title: '6. Intellectual Property',
              content: `All content on this website, including text, images, logos, and designs, is the property of BeautyByRose or its licensors and is protected by copyright law. You may not reproduce, distribute, or use our content without written permission.`,
            },
            {
              title: '7. Limitation of Liability',
              content: `To the maximum extent permitted by law, BeautyByRose shall not be liable for any indirect, incidental, or consequential damages arising from the use of our website or products. Our total liability shall not exceed the amount paid for the relevant order.`,
            },
            {
              title: '8. Governing Law',
              content: `These terms are governed by the laws of Kenya. Any disputes shall be resolved in the courts of Nairobi, Kenya.`,
            },
            {
              title: '9. Contact',
              content: `For questions about these Terms, contact us at legal@beautybyrose.co.ke.`,
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
