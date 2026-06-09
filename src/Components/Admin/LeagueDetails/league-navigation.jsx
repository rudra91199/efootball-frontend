"use client";

import { useState, useRef, useEffect } from "react";
import { X, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";

export default function LeagueNavigation({ tabs, activeTab, setActiveTab }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLeftGradient, setShowLeftGradient] = useState(false);
  const [showRightGradient, setShowRightGradient] = useState(true);
  const scrollContainerRef = useRef(null);
  const activeTabRef = useRef(null);

  const activeTabData = tabs.find((tab) => tab.id === activeTab);
  const activeIndex = tabs.findIndex((tab) => tab.id === activeTab);

  // Navigate to prev/next tab
  const goToPrev = () => {
    if (activeIndex > 0) {
      setActiveTab(tabs[activeIndex - 1].id);
    }
  };

  const goToNext = () => {
    if (activeIndex < tabs.length - 1) {
      setActiveTab(tabs[activeIndex + 1].id);
    }
  };

  // Handle scroll indicators
  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (container) {
      setShowLeftGradient(container.scrollLeft > 10);
      setShowRightGradient(
        container.scrollLeft <
          container.scrollWidth - container.clientWidth - 10
      );
    }
  };

  // Scroll active tab into view
  useEffect(() => {
    if (activeTabRef.current && scrollContainerRef.current) {
      activeTabRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [activeTab]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      handleScroll();
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, []);

  // Close menu on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") setIsMenuOpen(false);
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  return (
    <>
      {/* Desktop & Tablet - Horizontal Scrollable Tabs */}
      <div className="hidden md:block relative">
        <div className="relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-2 overflow-hidden">
          {/* Left gradient fade */}
          <div
            className={`absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none transition-opacity duration-300 ${
              showLeftGradient ? "opacity-100" : "opacity-0"
            }`}
          />

          {/* Right gradient fade */}
          <div
            className={`absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none transition-opacity duration-300 ${
              showRightGradient ? "opacity-100" : "opacity-0"
            }`}
          />

          {/* Scrollable tabs container */}
          <div
            ref={scrollContainerRef}
            className="flex gap-1 overflow-x-auto scroll-smooth"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {tabs.map((tab) => (
              <button
                key={tab.id}
                ref={activeTab === tab.id ? activeTabRef : null}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-2 py-2.5 px-5 rounded-xl font-medium transition-all duration-300 whitespace-nowrap flex-shrink-0 ${
                  activeTab === tab.id
                    ? "text-black"
                    : "text-gray-400 hover:text-white hover:bg-white/10"
                }`}
              >
                {activeTab === tab.id && (
                  <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400 shadow-lg shadow-cyan-500/30" />
                )}
                <span className="relative z-10 text-lg">{tab.icon}</span>
                <span className="relative z-10">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Decorative glow line */}
        <div className="absolute -bottom-px left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden space-y-3 relative">

        <div className="relative mb-4 rounded-2xl border border-white/10 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-indigo-900/10 backdrop-blur-xl overflow-hidden">
          {/* Background glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 via-blue-900/10 to-indigo-950/5" />

          <div className="relative flex items-center">
            {/* Previous button */}
            <button
              onClick={goToPrev}
              disabled={activeIndex === 0}
              className={`flex-shrink-0 p-4 transition-all duration-200 ${
                activeIndex === 0
                  ? "text-gray-700 cursor-not-allowed"
                  : "text-gray-400 hover:text-white active:scale-90"
              }`}
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Current tab display - tappable to open menu */}
            <button
              onClick={() => setIsMenuOpen(true)}
              className="flex-1 flex items-center justify-center  py-4 transition-all duration-200 active:scale-[0.98]"
            >
              <span className="mr-8 flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-pink-600/70 via-black/70 to-indigo-900/90 text-2xl shadow-lg shadow-pink-600/20">
                {activeTabData?.icon}
              </span>
              <div className="text-left w-[60%]">
                <p className="text-[10px] text-gray-500 uppercase tracking-widest font-medium">
                  {activeIndex + 1} of {tabs.length}
                </p>
                <p className="font-bold text-white text-lg">
                  {activeTabData?.label}
                </p>
              </div>
              <ChevronDown className="w-5 h-5 text-gray-500 ml-2" />
            </button>

            {/* Next button */}
            <button
              onClick={goToNext}
              disabled={activeIndex === tabs.length - 1}
              className={`flex-shrink-0 p-4 transition-all duration-200 ${
                activeIndex === tabs.length - 1
                  ? "text-gray-700 cursor-not-allowed"
                  : "text-gray-400 hover:text-white active:scale-90"
              }`}
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Progress bar */}
          <div className="h-1 bg-white/5">
            <div
              className="h-full bg-gradient-to-r from-pink-600/90 via-pink-200 to-indigo-400 transition-all duration-300"
              style={{ width: `${((activeIndex + 1) / tabs.length) * 100}%` }}
            />
          </div>
        </div>

        <div
          className={`fixed inset-0 z-50 transition-all duration-300 ${
            isMenuOpen ? "visible" : "invisible"
          }`}
        >
          {/* Backdrop */}
          <div
            className={`absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity duration-300 ${
              isMenuOpen ? "opacity-100" : "opacity-0"
            }`}
            onClick={() => setIsMenuOpen(false)}
          />

          {/* Menu panel */}
          <div
            className={`absolute liquid-glass-card overflow-hidden bottom-0 left-0 right-0  bg-blue-black border-t border-white/10 rounded-t-3xl transition-transform duration-300 ${
              isMenuOpen ? "translate-y-0" : "translate-y-full"
            }`}
          >
            {/* Handle bar */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-12 h-1.5 rounded-full bg-white/20" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-white/10">
              <h3 className="text-lg font-bold text-white">Navigation</h3>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="p-2 rounded-xl bg-white/30 hover:bg-white/20 transition-colors"
              >
                <X className="w-5 h-5 text-gray-100" />
              </button>
            </div>

            {/* Menu items grid */}
            <div className="p-4  grid grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto">
              {tabs.map((tab, index) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setIsMenuOpen(false);
                  }}
                  className={`relative flex flex-col items-center gap-2 p-4 rounded-2xl transition-all duration-200 ${
                    activeTab === tab.id
                      ? "bg-gradient-to-bl from-red-500/20 via-pink-600/40 to-red-800/20 border-2 border-red-600/10"
                      : "bg-gradient-to-bl from-black/40 via-white/10 to-black/40 border border-white/10 hover:bg-white/10 active:scale-95"
                  }`}
                  style={{ animationDelay: `${index * 30}ms` }}
                >
                  <span
                    className={`flex items-center justify-center w-14 h-14 rounded-2xl text-2xl transition-all ${
                      activeTab === tab.id
                        ? "bg-gradient-to-bl from-red-400 via-pink-600 to-red-800 shadow-lg shadow-pink-500/30"
                        : "bg-red-10"
                    }`}
                  >
                    {tab.icon}
                  </span>
                  <span
                    className={`text-sm font-medium text-center ${
                      activeTab === tab.id ? "text-white" : "text-gray-400"
                    }`}
                  >
                    {tab.label}
                  </span>
                  {activeTab === tab.id && (
                    <span className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse" />
                  )}
                </button>
              ))}
            </div>

            {/* Safe area padding for notched devices */}
            <div className="h-8" />
          </div>
        </div>
      </div>
    </>
  );
}
