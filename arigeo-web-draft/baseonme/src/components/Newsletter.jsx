import { useState } from 'react';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section id="contact" className="py-20 px-6 bg-white">
      <div className="max-w-[1400px] mx-auto bg-secondary rounded-2xl p-12 text-center">
        {submitted ? (
          <>
            <h2 className="text-3xl md:text-4xl font-bold mb-3 text-primary">
              Thank you for subscribing!
            </h2>
            <p className="text-muted-foreground">
              You'll receive our latest news and updates soon.
            </p>
          </>
        ) : (
          <>
            <h2 className="text-3xl md:text-4xl font-bold mb-3">Stay Updated with ARIGEO</h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              Subscribe to our newsletter for the latest news, product launches, and stories.
            </p>
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row max-w-md mx-auto gap-3">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="flex-1 px-4 py-3 rounded-lg border border-border bg-white focus:outline-none focus:border-primary transition-colors"
              />
              <button
                type="submit"
                className="bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
              >
                Subscribe
              </button>
            </form>
          </>
        )}
      </div>
    </section>
  );
}