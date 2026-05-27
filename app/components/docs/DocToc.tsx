'use client';

import { useEffect, useState } from 'react';

interface TocItem {
  id: string;
  text: string;
  level: number;
}

export function DocToc() {
  const [headings, setHeadings] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    // 提取 h2, h3 标题
    const elements = document.querySelectorAll('article h2, article h3');
    const items: TocItem[] = Array.from(elements).map((el, index) => {
      const id = el.id || `heading-${index}`;
      if (!el.id) el.id = id;
      return {
        id,
        text: el.textContent || '',
        level: el.tagName === 'H2' ? 2 : 3,
      };
    });
    setHeadings(items);

    // 滚动监听
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-100px 0px -60% 0px' }
    );

    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const top = element.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  if (headings.length === 0) return null;

  return (
    <div className="hidden xl:block">
      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
        本页目录
      </h3>
      <nav className="flex flex-col gap-1">
        {headings.map((heading) => (
          <button
            key={heading.id}
            onClick={() => scrollToHeading(heading.id)}
            className={`text-left text-sm py-1 transition-colors ${
              heading.level === 3 ? 'pl-3' : ''
            } ${
              activeId === heading.id
                ? 'text-primary font-medium'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {heading.text}
          </button>
        ))}
      </nav>
    </div>
  );
}
