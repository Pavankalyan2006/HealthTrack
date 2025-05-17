
import React, { ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface DashboardCardProps {
  title: string;
  icon: ReactNode;
  value: string | number | ReactNode;
  description?: string;
  link: string;
  color?: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  icon,
  value,
  description,
  link,
  color = 'bg-gradient-to-br from-health-500/10 to-health-600/5',
}) => {
  return (
    <Link to={link} className="block">
      <div className={`health-card hover:scale-[1.02] flex flex-col ${color}`}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">{title}</h3>
          <div className="text-primary">{icon}</div>
        </div>
        <div className="text-3xl font-bold mb-2">{value}</div>
        {description && (
          <div className="text-sm text-muted-foreground">{description}</div>
        )}
      </div>
    </Link>
  );
};

export default DashboardCard;
