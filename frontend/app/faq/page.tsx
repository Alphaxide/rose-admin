import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata = { title: 'FAQ – BeautyByRose' }

const faqs = [
  {
    q: 'Are all products on BeautyByRose authentic?',
    a: 'Yes. We source all products directly from verified brand distributors and authorized retailers. We have a strict anti-counterfeit policy and regularly audit our suppliers.',
  },
  {
    q: 'Do you offer same-day delivery?',
    a: 'Yes! We offer same-day delivery within Nairobi for orders placed before 12:00 PM EAT on weekdays. Delivery within Nairobi typically costs KES 150–200.',
  },
  {
    q: 'Can I pay with M-Pesa?',
    a: 'Absolutely. We accept M-Pesa, credit/debit cards, and cash on delivery for select Nairobi locations.',
  },
  {
    q: 'How do I track my order?',
    a: "Once your order ships, you'll receive an SMS with a tracking link. You can also view your order status in your account under My Orders.",
  },
  {
    q: 'What is your return policy?',
    a: 'We accept returns within 7 days of delivery. Items must be unused and in original packaging. Opened cosmetics are non-returnable unless defective. See our full Returns page for details.',
  },
  {
    q: 'How do I know which skincare products are right for me?',
    a: 'Our product pages include detailed skin type recommendations. You can also contact our beauty consultants via chat or email for personalized advice.',
  },
  {
    q: 'Do you ship outside Kenya?',
    a: "Currently we only ship within Kenya. We're working on expanding to other East African countries soon.",
  },
  {
    q: 'Can I change or cancel my order?',
    a: 'Orders can be changed or cancelled within 1 hour of placing them. After that, the order enters processing and changes may not be possible. Contact us immediately at support@beautybyrose.co.ke.',
  },
  {
    q: 'Do you have a loyalty or rewards program?',
    a: "We're building one! Sign up for our newsletter to be the first to know when our rewards program launches.",
  },
  {
    q: 'How do I contact customer support?',
    a: "You can reach us by email at support@beautybyrose.co.ke or by phone at +254 700 000 000. We're available Monday–Saturday, 8am–6pm EAT.",
  },
]

export default function FAQPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <div className="bg-muted border-b border-border py-12 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold text-foreground mb-3">Frequently Asked Questions</h1>
            <p className="text-muted-foreground">Quick answers to common questions</p>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 py-12">
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-card border border-border rounded-xl p-6">
                <h2 className="font-semibold text-foreground mb-2">{faq.q}</h2>
                <p className="text-muted-foreground text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 bg-primary/5 border border-primary/20 rounded-xl p-6 text-center">
            <h2 className="font-bold text-foreground mb-2">Didn't find your answer?</h2>
            <p className="text-muted-foreground text-sm mb-4">Our support team is happy to help.</p>
            <a
              href="mailto:support@beautybyrose.co.ke"
              className="inline-flex items-center justify-center px-6 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              Contact Support
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
