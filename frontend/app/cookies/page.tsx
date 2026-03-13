import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata = { title: 'Cookie Policy – BeautyByRose' }

const cookieTypes = [
  {
    name: 'Essential Cookies',
    required: true,
    desc: 'These cookies are necessary for the website to function. They enable core features like your shopping cart, account login, and checkout. These cannot be disabled.',
  },
  {
    name: 'Analytics Cookies',
    required: false,
    desc: 'These cookies help us understand how visitors interact with our website. We use this data to improve pages, identify popular products, and fix errors. All data is anonymised.',
  },
  {
    name: 'Marketing Cookies',
    required: false,
    desc: 'These cookies track your visits across websites to show you relevant adverts. We may share this data with trusted advertising partners. You can opt out at any time.',
  },
  {
    name: 'Preference Cookies',
    required: false,
    desc: 'These cookies remember your choices, such as your preferred language or region, so we can personalise your experience on return visits.',
  },
]

export default function CookiesPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <div className="bg-muted border-b border-border py-12 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold text-foreground mb-3">Cookie Policy</h1>
            <p className="text-muted-foreground">Last updated: January 2024</p>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 py-12 space-y-8 text-sm leading-relaxed">
          <p className="text-muted-foreground">
            BeautyByRose uses cookies and similar technologies to provide a better experience on our website.
            This Cookie Policy explains what cookies are, which cookies we use, and how you can control them.
          </p>

          <section>
            <h2 className="text-lg font-bold text-foreground mb-3">What Are Cookies?</h2>
            <p className="text-muted-foreground">
              Cookies are small text files stored on your device when you visit a website. They help the
              website remember your preferences and understand how you interact with the site. Cookies are
              safe and do not contain executable code or personal information like passwords.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-foreground mb-4">Cookies We Use</h2>
            <div className="space-y-4">
              {cookieTypes.map((cookie) => (
                <div key={cookie.name} className="bg-card border border-border rounded-xl p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-foreground">{cookie.name}</h3>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      cookie.required
                        ? 'bg-green-100 text-green-700'
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {cookie.required ? 'Always Active' : 'Optional'}
                    </span>
                  </div>
                  <p className="text-muted-foreground text-sm">{cookie.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-lg font-bold text-foreground mb-3">Managing Cookies</h2>
            <p className="text-muted-foreground">
              You can control cookies through your browser settings. Most browsers allow you to block or
              delete cookies. Note that disabling certain cookies may affect website functionality. You can
              also opt out of analytics tracking by visiting the opt-out pages of our analytics providers.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-foreground mb-3">Contact</h2>
            <p className="text-muted-foreground">
              If you have questions about our use of cookies, contact us at{' '}
              <a href="mailto:privacy@beautybyrose.co.ke" className="text-primary hover:underline">
                privacy@beautybyrose.co.ke
              </a>
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}
