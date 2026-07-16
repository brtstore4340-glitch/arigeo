import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact Us | Captain Maid',
  description: 'Get in touch with Captain Maid. Email, phone, or fill out our contact form for questions.',
  openGraph: {
    title: 'Contact Us | Captain Maid',
    description: 'We\'d love to hear from you',
    type: 'website',
  },
}

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-captain-cream dark:bg-captain-cream-dark pt-24">
      <div className="container-safe">
        {/* Page Header */}
        <div className="mb-2xl py-xl text-center">
          <h1 className="text-5xl font-serif font-bold mb-md text-captain-blue">Get in Touch</h1>
          <p className="text-xl text-captain-neutral max-prose mx-auto">
            Have questions or feedback? We'd love to hear from you. Reach out using any method below.
          </p>
        </div>

        {/* Contact Methods */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-lg mb-2xl">
          {/* Email */}
          <div className="bg-captain-light rounded-sm p-lg text-center">
            <div className="text-5xl mb-md">📧</div>
            <h3 className="text-xl font-serif font-bold mb-md text-captain-text">Email</h3>
            <p className="text-captain-neutral mb-md">For general inquiries and support</p>
            <a
              href="mailto:support@captain-maid.com"
              className="text-captain-blue font-semibold hover:text-captain-blue-dark break-all"
            >
              support@captain-maid.com
            </a>
            <p className="text-sm text-captain-neutral mt-md">Response time: 24 hours</p>
          </div>

          {/* Phone */}
          <div className="bg-captain-light rounded-sm p-lg text-center">
            <div className="text-5xl mb-md">📱</div>
            <h3 className="text-xl font-serif font-bold mb-md text-captain-text">Phone</h3>
            <p className="text-captain-neutral mb-md">Call our customer service team</p>
            <a
              href="tel:+66850000000"
              className="text-captain-blue font-semibold hover:text-captain-blue-dark text-lg"
            >
              +66 (0) 85-000-0000
            </a>
            <p className="text-sm text-captain-neutral mt-md">Mon–Fri, 9am–6pm</p>
          </div>

          {/* Office */}
          <div className="bg-captain-light rounded-sm p-lg text-center">
            <div className="text-5xl mb-md">🏢</div>
            <h3 className="text-xl font-serif font-bold mb-md text-captain-text">Office</h3>
            <p className="text-captain-neutral mb-md">Visit our Bangkok headquarters</p>
            <p className="text-captain-text font-semibold">123 Rama Road, Bangkok</p>
            <p className="text-sm text-captain-neutral mt-md">By appointment</p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2xl mb-2xl">
          {/* Form */}
          <div className="bg-captain-light rounded-sm p-2xl">
            <h2 className="text-2xl font-serif font-bold mb-lg text-captain-text">Send us a Message</h2>
            <form className="space-y-md">
              <div>
                <label className="block text-sm font-semibold text-captain-text mb-sm">Name</label>
                <input
                  type="text"
                  placeholder="Your name"
                  className="w-full px-md py-sm border border-captain-neutral rounded-sm focus:outline-none focus:ring-2 focus:ring-captain-blue"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-captain-text mb-sm">Email</label>
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="w-full px-md py-sm border border-captain-neutral rounded-sm focus:outline-none focus:ring-2 focus:ring-captain-blue"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-captain-text mb-sm">Subject</label>
                <select className="w-full px-md py-sm border border-captain-neutral rounded-sm focus:outline-none focus:ring-2 focus:ring-captain-blue">
                  <option>General Inquiry</option>
                  <option>Product Question</option>
                  <option>Bug Report</option>
                  <option>Feedback</option>
                  <option>Partnership</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-captain-text mb-sm">Message</label>
                <textarea
                  placeholder="Tell us what's on your mind..."
                  rows={6}
                  className="w-full px-md py-sm border border-captain-neutral rounded-sm focus:outline-none focus:ring-2 focus:ring-captain-blue resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full px-lg py-md bg-captain-yellow text-captain-text rounded-sm font-semibold hover:bg-captain-blue hover:text-white transition-all"
              >
                Send Message
              </button>
            </form>
          </div>

          {/* Information */}
          <div className="space-y-lg">
            {/* Business Hours */}
            <div className="bg-captain-light rounded-sm p-lg">
              <h3 className="text-xl font-serif font-bold mb-md text-captain-text">Business Hours</h3>
              <div className="space-y-sm text-captain-neutral">
                <div className="flex justify-between">
                  <span>Monday – Friday</span>
                  <span className="font-semibold">9:00 AM – 6:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Saturday</span>
                  <span className="font-semibold">10:00 AM – 4:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Sunday</span>
                  <span className="font-semibold">Closed</span>
                </div>
              </div>
            </div>

            {/* Follow Us */}
            <div className="bg-captain-light rounded-sm p-lg">
              <h3 className="text-xl font-serif font-bold mb-md text-captain-text">Follow Us</h3>
              <div className="flex gap-md">
                <a href="https://facebook.com/captainmaid" className="text-2xl hover:opacity-70">
                  f
                </a>
                <a href="https://instagram.com/captainmaid" className="text-2xl hover:opacity-70">
                  📷
                </a>
                <a href="https://twitter.com/captainmaid" className="text-2xl hover:opacity-70">
                  𝕏
                </a>
                <a href="https://youtube.com/captainmaid" className="text-2xl hover:opacity-70">
                  ▶️
                </a>
              </div>
            </div>

            {/* Newsletter */}
            <div className="bg-captain-blue text-white rounded-sm p-lg">
              <h3 className="text-xl font-serif font-bold mb-md">Newsletter</h3>
              <p className="text-white/90 mb-lg">Get weekly cleaning tips and exclusive offers.</p>
              <div className="flex gap-sm">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-md py-sm rounded-sm text-captain-text focus:outline-none"
                />
                <button className="px-md py-sm bg-captain-yellow text-captain-text rounded-sm font-semibold hover:bg-white transition-all">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'Captain Maid',
            url: 'https://captain-maid.vercel.app',
            email: 'support@captain-maid.com',
            telephone: '+66-85-000-0000',
            address: {
              '@type': 'PostalAddress',
              streetAddress: '123 Rama Road',
              addressLocality: 'Bangkok',
              addressCountry: 'TH',
            },
            contactPoint: {
              '@type': 'ContactPoint',
              telephone: '+66-85-000-0000',
              contactType: 'Customer Service',
              hoursAvailable: 'Mo,Tu,We,Th,Fr 09:00-18:00',
            },
          }),
        }}
      />
    </div>
  )
}
