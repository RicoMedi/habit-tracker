"use client";

import { useState, useEffect } from "react";

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export default function Drawer({
  isOpen,
  onClose,
  title,
  children,
}: DrawerProps) {
  const [isVisible, setIsVisible] = useState(false);

  // Handle animation states
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      // Delay hiding the drawer to allow for animation
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isVisible && !isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden pointer-events-none">
      {/* Invisible backdrop - only for click handling, no visual effect */}
      <div
        className={`fixed inset-0 transition-opacity duration-300 pointer-events-auto ${
          isOpen ? "bg-opacity-0" : "bg-opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Drawer panel */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pointer-events-auto">
        <div
          className={`transform transition-transform duration-300 ease-in-out w-screen max-w-md ${
            isOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="h-full flex flex-col bg-white dark:bg-gray-800 shadow-xl">
            <div className="px-4 py-6 sm:px-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-start justify-between">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                  {title}
                </h2>
                <div className="ml-3 h-7 flex items-center">
                  <button
                    type="button"
                    className="bg-white dark:bg-gray-800 rounded-md text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onClick={onClose}
                  >
                    <span className="sr-only">Close panel</span>
                    <svg
                      className="h-6 w-6"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-6">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
