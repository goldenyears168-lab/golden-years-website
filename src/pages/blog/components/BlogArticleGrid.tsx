import { Link } from 'react-router-dom';
import { blogCategories } from '@/mocks/blog';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import LazyImage from '@/components/base/LazyImage';

type BlogArticle = (typeof blogCategories)[number]['articles'][number];

const cardClassName =
  'group bg-white rounded-lg overflow-hidden border border-brand-navy/5 hover:border-brand-navy/15 hover:-translate-y-1 hover:shadow-sm transition-all duration-300 sr-fade-up sr-fast block';

function BlogArticleCard({
  article,
  index,
  gridVisible,
}: {
  article: BlogArticle;
  index: number;
  gridVisible: boolean;
}) {
  const style = { transitionDelay: gridVisible ? `${index * 100}ms` : '0ms' };
  const content = (
    <>
      <div className="overflow-hidden aspect-square">
        <LazyImage
          src={article.image}
          alt={`好時有影${article.title}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          skeletonClassName="min-h-[200px]"
          width={400}
          height={400}
        />
      </div>
      <div className="p-5 md:p-6">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-xs text-brand-gold font-medium">{article.date}</span>
        </div>
        <h3 className="font-serif text-base md:text-lg font-semibold text-brand-navy mb-2 group-hover:text-brand-gold transition-colors">
          {article.title}
        </h3>
        <p className="text-sm text-brand-muted leading-relaxed line-clamp-3">
          {article.excerpt}
        </p>
      </div>
    </>
  );

  if ('href' in article && article.href) {
    return (
      <Link
        to={article.href}
        className={`${cardClassName} ${gridVisible ? 'sr-visible' : ''}`}
        style={style}
      >
        {content}
      </Link>
    );
  }

  return (
    <div
      className={`${cardClassName} ${gridVisible ? 'sr-visible' : ''}`}
      style={style}
    >
      {content}
    </div>
  );
}

export default function BlogArticleGrid() {
  return (
    <div className="space-y-16 md:space-y-24">
      {blogCategories.map((category) => (
        <BlogCategorySection key={category.id} category={category} />
      ))}
    </div>
  );
}

function BlogCategorySection({ category }: { category: typeof blogCategories[0] }) {
  const [headerRef, headerVisible] = useScrollReveal<HTMLDivElement>();
  const [gridRef, gridVisible] = useScrollReveal<HTMLDivElement>();

  return (
    <section key={category.id} id={category.id} className="scroll-mt-28">
      <div className="max-w-6xl mx-auto">
        {/* Category Header */}
        <div
          ref={headerRef}
          className={`mb-8 md:mb-10 sr-fade-up ${headerVisible ? "sr-visible" : ""}`}
        >
          <span className="inline-block font-serif-en text-xs tracking-[0.2em] uppercase text-brand-gold mb-2">
            {category.subtitle}
          </span>
          <h2 className="font-serif text-xl md:text-2xl lg:text-3xl font-semibold text-brand-navy">
            {category.title}
          </h2>
        </div>

        {/* Articles Grid */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
        >
          {category.articles.map((article, index) => (
            <BlogArticleCard
              key={article.id}
              article={article}
              index={index}
              gridVisible={gridVisible}
            />
          ))}
        </div>
      </div>
    </section>
  );
}