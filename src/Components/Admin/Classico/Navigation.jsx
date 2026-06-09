import { useState, useRef, useEffect } from "react";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";

export default function Navigation({ tabs, activeTab, setActiveTab }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showLeftGradient, setShowLeftGradient] = useState(false);
  const [showRightGradient, setShowRightGradient] = useState(true);
  const scrollContainerRef = useRef(null);
  const activeTabRef = useRef(null);
  const dropdownRef = useRef(null); // Ref for click-outside detection

  const activeTabData = tabs.find((tab) => tab.id === activeTab);
  const activeIndex = tabs.findIndex((tab) => tab.id === activeTab);
  const progressPercentage = ((activeIndex + 1) / tabs.length) * 100;

  const goToPrev = () => { if (activeIndex > 0) setActiveTab(tabs[activeIndex - 1].id); };
  const goToNext = () => { if (activeIndex < tabs.length - 1) setActiveTab(tabs[activeIndex + 1].id); };

  // Desktop horizontal scroll gradients
  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (container) {
      setShowLeftGradient(container.scrollLeft > 10);
      setShowRightGradient(container.scrollLeft < container.scrollWidth - container.clientWidth - 10);
    }
  };

  useEffect(() => {
    if (activeTabRef.current && scrollContainerRef.current) {
      activeTabRef.current.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
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

  return (
    <>
      {/* ==============================================
          DESKTOP & TABLET - HORIZONTAL TABS
      ============================================== */}
      <div className="hidden md:block relative font-sans z-20 animate-fade-in">
        <div className="relative rounded-[20px] border border-white/5 bg-[#030305]/60 backdrop-blur-xl p-2 shadow-[0_10px_30px_rgba(0,0,0,0.5)] overflow-hidden">
          
          {/* Scroll Fade Gradients */}
          <div className={`absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-[#030305] to-transparent z-10 pointer-events-none transition-opacity duration-300 ${showLeftGradient ? "opacity-100" : "opacity-0"}`} />
          <div className={`absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[#030305] to-transparent z-10 pointer-events-none transition-opacity duration-300 ${showRightGradient ? "opacity-100" : "opacity-0"}`} />

          <div ref={scrollContainerRef} className="flex gap-2 overflow-x-auto scroll-smooth no-scrollbar" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                ref={activeTab === tab.id ? activeTabRef : null}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-2.5 py-3 px-6 rounded-[14px] transition-all duration-300 whitespace-nowrap flex-shrink-0 uppercase tracking-widest text-[11px] font-black outline-none ${
                  activeTab === tab.id
                    ? "text-white bg-gradient-to-r from-[#e11d48] to-[#ec4899] shadow-[0_0_20px_rgba(236,72,153,0.4)] border-none"
                    : "text-gray-500 border border-transparent hover:text-white hover:bg-white/5"
                }`}
              >
                <span className={`relative z-10 transition-colors ${activeTab === tab.id ? "text-white" : "text-gray-400 group-hover:text-white"}`}>
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
      <div className="md:hidden relative w-full px-1 sm:max-w-md mx-auto font-sans z-50 animate-fade-in" ref={dropdownRef}>
        
        {/* Main Control Bar */}
        <div className="relative bg-[#0a0b10]/90 backdrop-blur-xl border border-white/10 rounded-[24px] shadow-[0_10px_30px_rgba(0,0,0,0.8)] overflow-hidden flex items-center justify-between p-2">
          
          {/* Progress Bar */}
          <div className="absolute bottom-0 left-0 h-1 bg-white/5 w-full">
            <div
              className="h-full bg-gradient-to-r from-[#e11d48] to-[#ec4899] transition-all duration-300 ease-out shadow-[0_0_10px_rgba(236,72,153,0.5)]"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>

          <button onClick={goToPrev} disabled={activeIndex === 0} className={`relative z-10 p-3 sm:p-4 transition-all duration-200 ${activeIndex === 0 ? "text-gray-800 cursor-not-allowed" : "text-gray-400 hover:text-white active:scale-90"}`}>
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2.5} />
          </button>

          <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="relative z-10 flex-1 flex items-center justify-center gap-3 sm:gap-4 py-2 px-2 hover:bg-white/[0.02] rounded-xl transition-colors group outline-none">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-[14px] bg-gradient-to-br from-[#e11d48] to-[#030305] flex items-center justify-center shadow-[inset_0_2px_10px_rgba(236,72,153,0.2),0_0_15px_rgba(236,72,153,0.2)] border border-[#ec4899]/30 group-hover:border-[#ec4899]/60 transition-colors relative shrink-0">
              <div className="absolute inset-0 bg-[#ec4899]/10 blur-md rounded-[14px]" />
              <span className="relative z-10 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]">
                {activeTabData?.icon}
              </span>
            </div>
            <div className="flex flex-col items-start justify-center min-w-0">
              <div className="text-[9px] sm:text-[10px] text-gray-500 font-black tracking-[0.2em] uppercase mb-0.5 flex items-center gap-1.5">
                MODULE {activeIndex + 1} / {tabs.length}
                <ChevronDown size={14} strokeWidth={3} className={`transition-transform duration-300 ${isDropdownOpen ? "rotate-180 text-[#ec4899]" : ""}`} />
              </div>
              <span className="text-sm sm:text-base font-black text-white uppercase tracking-wider leading-none truncate w-full text-left">
                {activeTabData?.label}
              </span>
            </div>
          </button>

          <button onClick={goToNext} disabled={activeIndex === tabs.length - 1} className={`relative z-10 p-3 sm:p-4 transition-all duration-200 ${activeIndex === tabs.length - 1 ? "text-gray-800 cursor-not-allowed" : "text-gray-400 hover:text-white active:scale-90"}`}>
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2.5} />
          </button>
        </div>

        {/* --- DROPDOWN MENU --- */}
        <div className={`absolute top-[calc(100%+12px)] left-0 right-0 z-50 bg-[#030305]/95 backdrop-blur-2xl border border-white/10 rounded-[24px] overflow-hidden transition-all duration-300 transform origin-top shadow-[0_20px_50px_rgba(0,0,0,0.9)] ${isDropdownOpen ? "opacity-100 scale-y-100 translate-y-0 pointer-events-auto" : "opacity-0 scale-y-95 -translate-y-4 pointer-events-none"}`}>
          <div className="relative z-10 grid grid-cols-2 p-2.5 space-y-1 max-h-[60vh] overflow-y-auto custom-scrollbar">
            {tabs.map((tab, index) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => { setActiveTab(tab.id); setIsDropdownOpen(false); }}
                  className={`flex items-center gap-4 py-3 sm:py-3.5 px-4 rounded-xl transition-all duration-200 text-left w-full group outline-none ${isActive ? "bg-white/[0.04] border border-white/5" : "bg-transparent border border-transparent hover:bg-white/[0.02]"}`}
                >
                  <div className={`w-10 h-10 rounded-[12px] flex items-center justify-center transition-all shrink-0 ${isActive ? "bg-gradient-to-br from-[#e11d48] to-[#030305] border border-[#ec4899]/40 shadow-[inset_0_0_10px_rgba(236,72,153,0.2)]" : "bg-[#0a0b10] border border-white/5"}`}>
                    <span className={`${isActive ? "text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]" : "text-gray-500 group-hover:text-gray-300"}`}>
                      {tab.icon}
                    </span>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[8px] sm:text-[9px] text-gray-600 font-black tracking-widest uppercase mb-0.5">
                      MODULE {index + 1}
                    </span>
                    <span className={`font-black tracking-widest text-xs sm:text-sm uppercase truncate ${isActive ? "text-white" : "text-gray-400"}`}>
                      {tab.label}
                    </span>
                  </div>
                  {isActive && (
                    <div className="ml-auto w-2 h-2 rounded-full bg-[#ec4899] shadow-[0_0_8px_#ec4899] animate-pulse shrink-0" />
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