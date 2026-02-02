import { TrendingUp, TrendingDown } from 'lucide-react';
import Card from './Card';

interface StatCardProps {
  icon?: string | React.ReactNode;
  label: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  className?: string;
}

export default function StatCard({
  icon,
  label,
  value,
  change,
  changeLabel,
  className = '',
}: StatCardProps) {
  const isPositive = change !== undefined && change >= 0;

  return (
    <Card className={className}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-text-secondary mb-1">{label}</p>
          <p className="text-3xl font-bold text-text-primary">{value}</p>
          {change !== undefined && (
            <div className="flex items-center gap-1 mt-2">
              {isPositive ? (
                <TrendingUp size={14} className="text-green-600" />
              ) : (
                <TrendingDown size={14} className="text-red-600" />
              )}
              <span
                className={`text-sm font-medium ${
                  isPositive ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {isPositive ? '+' : ''}
                {change}%
              </span>
              {changeLabel && (
                <span className="text-xs text-text-muted">{changeLabel}</span>
              )}
            </div>
          )}
        </div>
        {icon && (
          <div className="text-3xl">
            {typeof icon === 'string' ? icon : icon}
          </div>
        )}
      </div>
    </Card>
  );
}
