import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";

export default function Navigation({
  tabs,
  activeTab,
  setActiveTab,
  navTheme = {},
  isSevenBlades,
}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showLeftGradient, setShowLeftGradient] = useState(false);
  const [showRightGradient, setShowRightGradient] = useState(true);
  const scrollContainerRef = useRef(null);
  const activeTabRef = useRef(null);
  const dropdownRef = useRef(null);

  const theme = {
    ...navTheme,
  };

  const activeTabData = tabs.find((tab) => tab.id === activeTab);
  const activeIndex = tabs.findIndex((tab) => tab.id === activeTab);
  const progressPercentage = ((activeIndex + 1) / tabs.length) * 100;

  const goToPrev = () => {
    if (activeIndex > 0) setActiveTab(tabs[activeIndex - 1].id);
  };
  const goToNext = () => {
    if (activeIndex < tabs.length - 1) setActiveTab(tabs[activeIndex + 1].id);
  };

  // Desktop horizontal scroll gradients
  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (container) {
      setShowLeftGradient(container.scrollLeft > 10);
      setShowRightGradient(
        container.scrollLeft <
          container.scrollWidth - container.clientWidth - 10,
      );
    }
  };

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

  // Click outside detection for the dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fallbacks in case theme properties are missing
  const panelBg = theme.panelBg || "bg-[#030305]/80";
  const border = theme.border || "border-white/10";
  const progressActive = theme.progressActive || "bg-blue-500";
  const accentText = theme.accentText || "text-blue-400";
  const badge = theme.badge || "bg-gray-800 text-white border border-gray-600";
  const shadow = theme.shadow || "shadow-[0_0_15px_rgba(255,255,255,0.2)]";

  if (isSevenBlades) {
    theme.mainBg = "bg-[#09090b]";
    theme.panelBg =
      "bg-gradient-to-br from-black/90 to-black/60 backdrop-blur-2xl";
    theme.gradientText = "from-[#e4e4e7] via-[#991b1b] to-[#e4e4e7]";
    theme.border =
      "border-[#a1a1aa]/70 ";
    theme.accentText = "text-red-700";
    theme.normalText = "text-[hsl(0,80%,80%)] font-black tracking-widest";
    theme.progressActive = "bg-gradient-to-r from-[#a1a1aa] to-[#991b1b]";
    theme.shadow = "shadow-[0px_0px_rgba(220,38,38,0.8)]";
    theme.beforeShadow =
      "before:shadow-[inset_0_0_8px_0px_rgba(161,161,170,0.9)]";
  }

  return (
    <>
      <div className="hidden md:block relative font-sans z-20 animate-fade-in">
        <div
          className={`relative ${theme.panelBg} liquid-glass-card ${theme.shadow} ${theme.beforeShadow} rounded-[24px] before:rounded-[24px] backdrop-blur-sm p-2.5 shadow-2xl overflow-hidden`}
        >
          {/* Scroll Fade Gradients */}
          <div
            className={`absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-black/80 to-transparent z-10 pointer-events-none transition-opacity duration-300 ${showLeftGradient ? "opacity-100" : "opacity-0"}`}
          />
          <div
            className={`absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-black/80 to-transparent z-10 pointer-events-none transition-opacity duration-300 ${showRightGradient ? "opacity-100" : "opacity-0"}`}
          />

          <div
            ref={scrollContainerRef}
            className="flex gap-2 overflow-x-auto scroll-smooth no-scrollbar relative z-0"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {tabs.map((tab) => (
              <button
                key={tab.id}
                ref={activeTab === tab.id ? activeTabRef : null}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-2.5 py-3 px-6 rounded-xl transition-all duration-300 whitespace-nowrap flex-shrink-0 uppercase tracking-widest text-[11px] font-black outline-none ${
                  activeTab === tab.id
                    ? `text-white ${progressActive} ${shadow} border-none`
                    : "text-gray-400 border border-transparent hover:text-white hover:bg-white/5"
                }`}
              >
                <span
                  className={`relative z-10 transition-colors ${activeTab === tab.id ? "text-white" : "text-gray-500 group-hover:text-white"}`}
                >
                  {tab.icon}
                </span>
                <span className="relative z-10">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ==============================================
          MOBILE NAVIGATION (Dropdown Style)
      ============================================== */}
      <div
        className="md:hidden  relative w-full  sm:max-w-md mx-auto font-sans z-50 animate-fade-in"
        ref={dropdownRef}
      >
        {/* Main Control Bar */}
        <div
          className={`relative ${theme.panelBg} liquid-glass-card low ${theme.shadow} rounded-[16px] before:rounded-[16px] backdrop-blur-sm  overflow-hidden flex items-center justify-between pt-2 pb-3`}
        >
          {/* Progress Bar */}
          <div className="absolute bottom-0 left-0 h-1 bg-white/5 w-full">
            <div
              className={`h-full ${progressActive} transition-all duration-300 ease-out ${shadow}`}
              style={{ width: `${progressPercentage}%` }}
            />
          </div>

          <button
            onClick={goToPrev}
            disabled={activeIndex === 0}
            className={`relative z-10 pl-8 sm:p-4 transition-all duration-200 ${activeIndex === 0 ? `${theme.prevButtonDisabled} cursor-not-allowed` : `${theme.prevButton} hover:text-white active:scale-90`}`}
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2.5} />
          </button>

          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="relative z-10 flex-1 flex items-center justify-center gap-3 sm:gap-4 py-1 px-2 hover:bg-white/[0.03] rounded-xl transition-colors group outline-none"
          >
            <div
              className={`w-8 h-8 sm:w-12 sm:h-12 rounded-[14px] flex items-center justify-center shadow-lg transition-transform group-hover:scale-105 shrink-0 ${badge}`}
            >
              {/* --- HERE IS THE TRICK --- */}
              <span className="relative z-10">
                {activeTabData?.icon && React.cloneElement(activeTabData.icon, {
                  className: "w-4 h-4 sm:w-5 sm:h-5" 
                })}
              </span>
            </div>
            <div className="flex flex-col items-start justify-center min-w-0">
              <div
                className={`text-[7px] ${theme?.normalText ? theme.normalText : "text-gray-300"} font-bold uppercase mb-0.5 flex items-center gap-1.5`}
              >
                MODULE {activeIndex + 1} / {tabs.length}
                <ChevronDown
                  size={14}
                  strokeWidth={3}
                  className={`transition-transform duration-300 ${isDropdownOpen ? `rotate-180 ${accentText}` : ""}`}
                />
              </div>
              <span className="text-xs sm:text-base font-black text-white uppercase tracking-wider leading-none truncate w-full text-left">
                {activeTabData?.label}
              </span>
            </div>
          </button>

          <button
            onClick={goToNext}
            disabled={activeIndex === tabs.length - 1}
            className={`relative z-10 pr-8 sm:p-4 transition-all duration-200 ${activeIndex === tabs.length - 1 ? `${theme.nextButtonDisabled} cursor-not-allowed` : `${theme.nextButton} hover:text-white active:scale-90`}`}
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 rounded-md" strokeWidth={4} />
          </button>
        </div>

        {/* --- DROPDOWN MENU --- */}
        <div
          className={`absolute top-[calc(100%+6px)] liquid-glass-card  left-0 right-0 z-50 ${theme.panelBg} rounded-[16px] overflow-hidden transition-all duration-300 transform origin-top shadow-[0_20px_50px_rgba(0,0,0,0.9)] ${isDropdownOpen ? "opacity-100 scale-y-100 translate-y-0 pointer-events-auto" : "opacity-0 scale-y-95 -translate-y-4 pointer-events-none"}`}
          style={{ backdropFilter: "blur(20px)" }}
        >
          <div className="relative z-10 grid grid-cols-2 p-2.5 space-y-1 max-h-[60vh] backdrop-blur-2xl overflow-y-auto custom-scrollbar">
            {tabs.map((tab, index) => {
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setIsDropdownOpen(false);
                  }}
                  className={`flex flex-col justify-center items-center gap-1 py-2 sm:py-3.5 px-4 rounded-xl transition-all duration-200 text-left w-full group outline-none ${isActive ? "bg-white/[0.1] border border-white/10" : "bg-transparent border border-transparent hover:bg-white/[0.03]"}`}
                >
                  <div
                    className={`w-8 h-8 rounded-[6px] flex items-center justify-center transition-all shrink-0 ${isActive ? badge : "bg-black/40 border border-white/5"}`}
                  >
                    <span
                      className={`${isActive ? "" : "text-gray-500 group-hover:text-gray-300"}`}
                    >
                      {React.cloneElement(tab.icon, { size: 16 })}
                    </span>
                  </div>
                  <div className="flex flex-col items-center min-w-0">
                    <span className={`text-[7px] sm:text-[9px] ${theme.normalText || "text-gray-500"} font-black tracking-widest uppercase mb-0.5`}>
                      MODULE {index + 1}
                    </span>
                    <span
                      className={`font-black tracking-widest text-[10px] sm:text-sm uppercase truncate ${isActive ? "text-white" : "text-gray-400 group-hover:text-gray-200"}`}
                    >
                      {tab.label}
                    </span>
                  </div>

                  {/* Themed Active Indicator Dot */}
                  {isActive && (
                    <div
                      className={`ml-auto flex items-center justify-center shrink-0 ${accentText}`}
                    >
                      <div className="w-2 h-2 rounded-full bg-current shadow-[0_0_10px_currentColor] animate-pulse" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}