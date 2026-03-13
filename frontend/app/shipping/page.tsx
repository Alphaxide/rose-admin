import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata = { title: 'Shipping Info – BeautyByRose' }

export default function ShippingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <div className="bg-muted border-b border-border py-12 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold text-foreground mb-3">Shipping Information</h1>
            <p className="text-muted-foreground">Everything you need to know about delivery</p>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 py-12 space-y-8">
          <div className="overflow-hidden rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead className="bg-muted">
                <tr>
                  <th className="text-left px-6 py-3 font-semibold text-foreground">Delivery Zone</th>
                  <th className="text-left px-6 py-3 font-semibold text-foreground">Estimated Time</th>
                  <th className="text-left px-6 py-3 font-semibold text-foreground">Cost</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-card">
                {[
                  { zone: 'Nairobi (CBD & Westlands)', time: 'Same day (order before 12pm)', cost: 'KES 150' },
                  { zone: 'Nairobi Suburbs', time: '1–2 business days', cost: 'KES 200' },
                  { zone: 'Mombasa', time: '2–3 business days', cost: 'KES 350' },
                  { zone: 'Kisumu & Nakuru', time: '2–3 business days', cost: 'KES 300' },
                  { zone: 'Rest of Kenya', time: '3–5 business days', cost: 'KES 400' },
                  { zone: 'Orders over KES 5,000', time: 'Same as above', cost: 'FREE' },
                ].map((row) => (
                  <tr key={row.zone}>
                    <td className="px-6 py-4 text-foreground">{row.zone}</td>
                    <td className="px-6 py-4 text-muted-foreground">{row.time}</td>
                    <td className={`px-6 py-4 font-medium ${row.cost === 'FREE' ? 'text-green-600' : 'text-foreground'}`}>{row.cost}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">How We Ship</h2>
            <p className="text-muted-foreground leading-relaxed">
              All orders are carefully packed and handed to our trusted delivery partners. You'll receive
              an SMS confirmation with tracking details once your order is dispatched.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">Order Cut-off Times</h2>
            <p className="text-muted-foreground leading-relaxed">
              Orders placed before <strong className="text-foreground">12:00 PM EAT</strong> on weekdays are processed the same day.
              Orders placed after 12pm or on weekends are processed the next business day.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">Tracking Your Order</h2>
            <p className="text-muted-foreground leading-relaxed">
              Once your order ships, you'll receive an SMS with a tracking link. You can also check your
              order status by logging into your account and visiting the <strong className="text-foreground">My Orders</strong> section.
            </p>
          </section>

          <div className="bg-card border border-border rounded-xl p-6 text-center">
            <p className="text-muted-foreground text-sm">
              Questions about your delivery? Contact us at{' '}
              <a href="mailto:support@beautybyrose.co.ke" className="text-primary hover:underline">
                support@beautybyrose.co.ke
              </a>{' '}
              or call <a href="tel:+254700000000" className="text-primary hover:underline">+254 700 000 000</a>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
