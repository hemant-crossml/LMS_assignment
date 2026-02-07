import React from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, description, action }) => {
  return (
    <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-8 px-4 sm:px-6 lg:px-8 mb-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold">{title}</h1>
            {description && (
              <p className="mt-2 text-primary-100">{description}</p>
            )}
          </div>
          {action && <div className="mt-4 sm:mt-0">{action}</div>}
        </div>
      </div>
    </div>
  );
};
