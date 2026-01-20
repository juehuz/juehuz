import React, { useState, Suspense } from 'react';
import { Layout } from './components/Layout';
import { AppRoute } from './types';
import { LanguageProvider } from './contexts/LanguageContext';

// Lazy Load Components
const lazyLoad = <T extends Record<string, any>, K extends keyof T>(
  factory: () => Promise<T>,
  componentName: K
) => React.lazy(() => factory().then((module) => ({ default: module[componentName] })));

const TranslationPanel = lazyLoad(() => import('./components/TranslationPanel'), 'TranslationPanel');
const DocumentProcessor = lazyLoad(() => import('./components/DocumentProcessor'), 'DocumentProcessor');
const AdminConsole = lazyLoad(() => import('./components/AdminConsole'), 'AdminConsole');
const ImageARTranslator = lazyLoad(() => import('./components/ImageARTranslator'), 'ImageARTranslator');

const AppContent: React.FC = () => {
  const [currentRoute, setCurrentRoute] = useState<AppRoute>(AppRoute.TRANSLATE);

  const renderContent = () => {
    switch (currentRoute) {
      case AppRoute.TRANSLATE:
        return <TranslationPanel />;
      case AppRoute.IMAGE_AR:
        return <ImageARTranslator />;
      case AppRoute.DOC_PROCESSOR:
        return <DocumentProcessor />;
      case AppRoute.ADMIN_CONSOLE:
        return <AdminConsole />;
      default:
        return <TranslationPanel />;
    }
  };

  return (
    <Layout currentRoute={currentRoute} onNavigate={setCurrentRoute}>
      <Suspense fallback={
        <div className="h-full w-full flex items-center justify-center text-slate-500 space-x-2">
           <svg className="animate-spin h-5 w-5 text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
           </svg>
           <span>Loading Module...</span>
        </div>
      }>
        {renderContent()}
      </Suspense>
    </Layout>
  );
};

const App: React.FC = () => {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
};

export default App;