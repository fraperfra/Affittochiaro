import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

type Props = {
  items: BreadcrumbItem[];
};

export function Breadcrumb({ items }: Props) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center flex-wrap gap-1 text-sm text-text-muted py-3">
      {items.map((item, i) => {
        const isLast = i === items.length - 1;
        return (
          <span key={i} className="flex items-center gap-1">
            {i > 0 && <ChevronRight size={14} className="text-text-muted/60 shrink-0" />}
            {item.href && !isLast ? (
              <Link
                to={item.href}
                className="hover:text-primary-600 transition-colors truncate max-w-[140px] md:max-w-none"
              >
                {item.label}
              </Link>
            ) : (
              <span
                className={isLast ? 'text-text-primary font-medium truncate max-w-[180px] md:max-w-none' : ''}
              >
                {item.label}
              </span>
            )}
          </span>
        );
      })}
    </nav>
  );
}
