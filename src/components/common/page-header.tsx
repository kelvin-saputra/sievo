import React from "react";

interface BreadcrumbItemProps {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  title: string;
  breadcrumbs?: BreadcrumbItemProps[];
}

const PageHeader = ({ title }: PageHeaderProps) => {
  return (
    <div className="mb-4 pb-2 border-b border-gray-300">
      <h1 className="text-3xl font-bold">{title}</h1>
    </div>
  );
};

export default PageHeader;
