import React, { useState } from 'react';
import PageContainer from '../components/layout/PageContainer';
import AppList from '../components/common/AppList';
import CategoryFilter from '../components/common/CategoryFilter';
import { useAppStore } from '../store/store';
import { useNavigate } from 'react-router-dom';

export function Apps() {
  const { apps, categories, toggleAppStatus } = useAppStore();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const navigate = useNavigate();
  
  const filteredApps = selectedCategory
    ? apps.filter(app => app.category.toLowerCase() === selectedCategory)
    : apps;

  return (
    <PageContainer
      title="Applications"
      description="Manage internet access for all applications"
    >
      <CategoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />
      
      <AppList
        apps={filteredApps}
        onToggleStatus={toggleAppStatus}
        onAppClick={(appId) => navigate(`/apps/${appId}`)}
        emptyMessage={
          selectedCategory
            ? `No applications found in the ${selectedCategory} category.`
            : 'No applications found.'
        }
      />
    </PageContainer>
  );
}

export default Apps;