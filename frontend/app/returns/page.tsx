import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata = { title: 'Returns & Refunds – BeautyByRose' }

export default function ReturnsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <div className="bg-muted border-b border-border py-12 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold text-foreground mb-3">Returns & Refunds</h1>
            <p className="text-muted-foreground">Shop with confidence – hassle-free returns</p>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 py-12 space-y-8">
          <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { label: 'Return Window', value: '7 Days', desc: 'From date of delivery' },
              { label: 'Refund Time', value: '3–5 Days', desc: 'After return is received' },
              { label: 'Exchange', value: 'Free', desc: 'For defective items' },
            ].map((stat) => (
              <div key={stat.label} className="bg-card border border-border rounded-xl p-6 text-center">
                <p className="text-3xl font-bold text-primary mb-1">{stat.value}</p>
                <p className="font-semibold text-foreground text-sm">{stat.label}</p>
                <p className="text-muted-foreground text-xs mt-1">{stat.desc}</p>
              </div>
            ))}
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">Return Policy</h2>
            <p className="text-muted-foreground leading-relaxed">
              We want you to love every product you buy from us. If you're not satisfied for any reason,
              you may return eligible items within <strong className="text-foreground">7 days</strong> of delivery.
            </p>
            <ul className="space-y-2 text-muted-foreground text-sm list-disc pl-5">
              <li>Items must be unused, unopened, and in original packaging.</li>
              <li>Proof of purchase (order number or receipt) is required.</li>
              <li>For hygiene reasons, opened cosmetics and skincare products are non-returnable unless defective.</li>
              <li>Fragrances must be sealed and untested.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">How to Return</h2>
            <ol className="space-y-4">
              {[
                { step: '1', text: 'Contact our support team at support@beautybyrose.co.ke with your order number and reason for return.' },
                { step: '2', text: 'Our team will review your request and provide a return authorization within 1 business day.' },
                { step: '3', text: 'Pack the item securely in its original packaging and drop it off at our Westlands office or schedule a pickup.' },
                { step: '4', text: 'Once we receive and inspect the item, your refund will be processed within 3–5 business days.' },
              ].map((item) => (
                <div key={item.step} className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm flex-shrink-0">
                    {item.step}
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed pt-1">{item.text}</p>
                </div>
              ))}
            </ol>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">Refund Methods</h2>
            <p className="text-muted-foreground leading-relaxed">
              Refunds are issued to the original payment method — M-Pesa, card, or store credit.
              M-Pesa refunds typically arrive within 24 hours once approved.
            </p>
          </section>

          <div className="bg-card border border-border rounded-xl p-6 text-center">
            <p className="text-muted-foreground text-sm">
              Need help with a return?{' '}
              <a href="mailto:support@beautybyrose.co.ke" className="text-primary hover:underline">
                support@beautybyrose.co.ke
              </a>{' '}
              · <a href="tel:+254700000000" className="text-primary hover:underline">+254 700 000 000</a>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
