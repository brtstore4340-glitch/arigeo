import { newsArticles } from '@/lib/siteData';

export default function NewsStories() {
  return (
    <section id="news" className="py-20 px-6 bg-white">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex justify-between items-end mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">News & Stories</h2>
          <a
            href="#news"
            className="text-primary font-semibold hover:underline hidden sm:inline-block"
          >
            View All News
          </a>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {newsArticles.map((article) => (
            <article key={article.id} className="group cursor-pointer">
              <div className="aspect-[4/3] overflow-hidden rounded-xl mb-4">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <span className="text-primary text-sm font-semibold uppercase tracking-wide">
                {article.category}
              </span>
              <p className="text-xs text-muted-foreground mt-1 mb-2">{article.date}</p>
              <h3 className="font-semibold leading-snug group-hover:text-primary transition-colors">
                {article.title}
              </h3>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}