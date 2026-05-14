import { useState } from 'react';
import { blogCategories } from '@/mocks/blog';

export default function BlogCategoryNav() {
  const [active, setActive] = useState(blogCategories[0].id);

  const handleClick = (id: string) => {
    setActive(id);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section className="sticky top-[72px] z-40 bg-brand-cream/95 backdrop-blur-sm border-b border-brand-navy/5">
      <div className="w-full px-4 md:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto py-3">
          <div className="flex items-center gap-2 md:gap-3 overflow-x-auto pb-1 scrollbar-hide">
            {blogCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleClick(cat.id)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-serif transition-all duration-300 cursor-pointer whitespace-nowrap ${
                  active === cat.id
                    ? 'bg-brand-navy text-white'
                    : 'bg-white text-brand-charcoal border border-brand-navy/10 hover:border-brand-navy/30'
                }`}
              >
                {cat.title}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}