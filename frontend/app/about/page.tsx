import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata = { title: 'About Us – BeautyByRose' }

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <div className="bg-muted border-b border-border py-12 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold text-foreground mb-3">About BeautyByRose</h1>
            <p className="text-muted-foreground">Nairobi's premier beauty destination</p>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 py-12 space-y-10">
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">Our Story</h2>
            <p className="text-muted-foreground leading-relaxed">
              BeautyByRose was founded in Nairobi with a simple mission: make premium beauty products
              accessible to everyone. We started as a small boutique in Westlands and have grown
              into one of Kenya's most trusted online beauty retailers, serving thousands of happy
              customers across the country.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">Our Mission</h2>
            <p className="text-muted-foreground leading-relaxed">
              We believe beauty is for everyone. Our curated selection of skincare, makeup, haircare,
              and fragrance products spans every budget, skin type, and beauty goal. We partner only
              with trusted brands and authentic suppliers to ensure every product you receive is
              100% genuine.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">Why Choose Us</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { title: 'Authenticity Guaranteed', desc: 'Every product is sourced directly from verified brand distributors.' },
                { title: 'Fast Delivery', desc: 'Same-day delivery within Nairobi; nationwide shipping in 2–5 days.' },
                { title: 'Expert Support', desc: 'Our beauty consultants are here to help you find the right products.' },
              ].map((item) => (
                <div key={item.title} className="bg-card border border-border rounded-xl p-6">
                  <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                  <p className="text-muted-foreground text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">Our Team</h2>
            <p className="text-muted-foreground leading-relaxed">
              We're a passionate team of beauty enthusiasts, tech lovers, and customer-care
              champions based in Nairobi. We're committed to continuously improving your shopping
              experience and bringing you the latest beauty trends from around the world.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}
