import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../LanguageContext';
import Sidebar from './SidebarOffcanvas';
import { Bars3Icon, ArrowLeftIcon, XMarkIcon } from '@heroicons/react/24/outline';

function Layout({ 
  children, 
  title, 
  subtitle, 
  showBackButton = false, 
  backButtonPath = "/vosfermes",
  className = "bg-gray-50" 
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const { language } = useLanguage();

  return (
    <div className={`flex h-screen ${className}`}>
      {/* Mobile and tablet sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 xl:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <div className="fixed inset-0 bg-neutral-700 opacity-50" />
        </div>
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out
        xl:relative xl:translate-x-0 xl:flex-shrink-0 xl:w-64
        ${sidebarOpen ? 'translate-x-0 w-full lg:w-64' : '-translate-x-full w-64'}
      `}>
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden xl:ml-0">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              <div className="flex items-center">
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="text-gray-500 hover:text-gray-700 xl:hidden p-2"
                >
                  <Bars3Icon className="h-6 w-6" />
                </button>
                
                {showBackButton && (
                  <button
                    onClick={() => navigate(backButtonPath)}
                    className="ml-4 xl:ml-0 flex items-center text-gray-500 hover:text-gray-700"
                  >
                    <ArrowLeftIcon className="h-5 w-5 mr-2" />
                    <span className="text-sm font-medium">
                      {language === "fr" ? "Retour" : "عودة"}
                    </span>
                  </button>
                )}
                
                <div className={`${showBackButton ? 'ml-4' : 'ml-4 xl:ml-0'}`}>
                  <h1 className="text-xl font-semibold text-gray-900">
                    {title}
                  </h1>
                  {subtitle && (
                    <p className="text-sm text-gray-500 mt-1">
                      {subtitle}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main content area */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

export default Layout;
