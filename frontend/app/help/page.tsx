import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata = { title: 'Help Center – BeautyByRose' }

const topics = [
  {
    title: 'Orders & Delivery',
    items: [
      'How do I track my order?',
      'What are the delivery times and costs?',
      'Can I change or cancel my order?',
      'What happens if my order is delayed?',
    ],
  },
  {
    title: 'Returns & Refunds',
    items: [
      'What is your return policy?',
      'How do I return a product?',
      'How long does a refund take?',
      'Can I exchange a product?',
    ],
  },
  {
    title: 'Payments',
    items: [
      'What payment methods do you accept?',
      'Is my payment information secure?',
      'Can I pay on delivery?',
      'Do you accept M-Pesa?',
    ],
  },
  {
    title: 'Account & Orders',
    items: [
      'How do I create an account?',
      'How do I reset my password?',
      'How do I view my order history?',
      'How do I update my delivery address?',
    ],
  },
]

export default function HelpPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <div className="bg-muted border-b border-border py-12 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-bold text-foreground mb-3">Help Center</h1>
            <p className="text-muted-foreground">Find answers to your questions</p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-12 space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {topics.map((topic) => (
              <div key={topic.title} className="bg-card border border-border rounded-xl p-6">
                <h2 className="font-bold text-foreground mb-4">{topic.title}</h2>
                <ul className="space-y-2">
                  {topic.items.map((item) => (
                    <li key={item} className="text-sm text-muted-foreground hover:text-primary cursor-pointer transition-colors flex items-start gap-2">
                      <span className="text-primary mt-0.5">›</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="bg-primary/5 border border-primary/20 rounded-xl p-8 text-center">
            <h2 className="text-xl font-bold text-foreground mb-2">Still need help?</h2>
            <p className="text-muted-foreground text-sm mb-6">Our support team is available Monday – Saturday, 8am – 6pm EAT.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="mailto:support@beautybyrose.co.ke"
                className="inline-flex items-center gap-2 px-6 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                Email Support
              </a>
              <a
                href="tel:+254700000000"
                className="inline-flex items-center gap-2 px-6 py-2 border border-border bg-card text-foreground rounded-lg text-sm font-medium hover:bg-muted transition-colors"
              >
                Call Us: +254 700 000 000
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
