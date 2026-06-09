import { useEffect, useState } from "react";
import { ArrowUpRight, Globe, MoreHorizontal, MoreVertical } from "lucide-react";

export default function InAppBrowserWarning({ children }) {
  const [isInAppBrowser, setIsInAppBrowser] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // 1. Get the user agent
    const ua = navigator.userAgent || navigator.vendor || window.opera;
    
    // 2. Check for common in-app browsers
    const isSocialApp = 
      ua.indexOf("FBAN") > -1 || 
      ua.indexOf("FBAV") > -1 || 
      ua.indexOf("Instagram") > -1 || 
      ua.indexOf("Line") > -1 ||
      ua.indexOf("Twitter") > -1;

    if (isSocialApp) {
      setIsInAppBrowser(true);
    }

    // 3. Check if the device is iOS (iPhone, iPad, iPod)
    const isIOSDevice = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    setIsIOS(isIOSDevice);
    
  }, []);

  // If they are in a normal browser (Chrome/Safari) or the PWA itself, load the app normally.
  if (!isInAppBrowser) {
    return children;
  }

  // If they are stuck in Messenger/FB, show the glassmorphic lock screen
  return (
    <div className="fixed inset-0 z-[9999] bg-[#030305] text-white flex flex-col font-sans overflow-hidden">
      
      {/* Animated Arrow pointing to the top right (where the 3 dots usually are) */}
      <div className="absolute top-6 right-8 animate-bounce">
        <ArrowUpRight className="w-16 h-16 text-[#ec4899] drop-shadow-[0_0_15px_rgba(236,72,153,0.8)]" />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center relative z-10">
        
        {/* Ambient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[radial-gradient(circle,rgba(236,72,153,0.15)_0%,transparent_70%)] pointer-events-none" />

        <div className="w-20 h-20 bg-black/40 border border-white/10 rounded-full flex items-center justify-center mb-6 shadow-inner relative z-10">
          <Globe className="w-10 h-10 text-gray-400" />
        </div>

        <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-wider mb-4">
          You are in a <span className="text-[#ec4899]">Limited</span> Browser
        </h1>
        
        <p className="text-gray-400 text-sm sm:text-base font-bold mb-10 max-w-sm leading-relaxed">
          {isIOS 
            ? "Apple restricts apps from opening via Messenger links. To continue, choose an option below."
            : "Messenger and Facebook block our app from opening automatically. Follow the steps below to enter the arena."}
        </p>

        {/* Instruction Steps - Styled as Glassmorphic Cards */}
        <div className="w-full max-w-sm space-y-3">
          
          {isIOS ? (
            // ==========================================
            // iOS SPECIFIC INSTRUCTIONS
            // ==========================================
            <>
              <div className="flex items-center gap-4 bg-white/5 border border-white/10 p-4 rounded-2xl shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)]">
                <div className="w-8 h-8 rounded-full bg-black/50 border border-white/5 flex items-center justify-center shrink-0 font-black text-[#a855f7]">1</div>
                <p className="text-left text-xs font-bold text-gray-300 uppercase tracking-widest leading-snug">
                  <span className="text-[#a855f7]">Already Installed?</span> Swipe home and open the <span className="text-white">EC App</span> directly from your phone.
                </p>
              </div>

              <div className="flex items-center gap-4 bg-white/5 border border-white/10 p-4 rounded-2xl shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)]">
                <div className="w-8 h-8 rounded-full bg-black/50 border border-white/5 flex items-center justify-center shrink-0 font-black text-[#ec4899]">2</div>
                <p className="text-left text-xs font-bold text-gray-300 uppercase tracking-widest leading-snug">
                  <span className="text-[#ec4899]">Need the App?</span> Tap the <MoreVertical className="w-4 h-4 inline text-white mx-0.5" /> menu and select <span className="text-white">Open in Safari</span> to install.
                </p>
              </div>
            </>
          ) : (
            // ==========================================
            // ANDROID / DEFAULT INSTRUCTIONS
            // ==========================================
            <>
              <div className="flex items-center gap-4 bg-white/5 border border-white/10 p-4 rounded-2xl shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)]">
                <div className="w-8 h-8 rounded-full bg-black/50 border border-white/5 flex items-center justify-center shrink-0 font-black text-[#3b82f6]">1</div>
                <p className="text-left text-xs font-bold text-gray-300 uppercase tracking-widest leading-snug">
                  Tap the <MoreHorizontal className="w-4 h-4 inline text-white mx-1" /> / <MoreVertical className="w-4 h-4 inline text-white mx-1" /> icon in the <span className="text-white">top right corner</span>.
                </p>
              </div>

              <div className="flex items-center gap-4 bg-white/5 border border-white/10 p-4 rounded-2xl shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)]">
                <div className="w-8 h-8 rounded-full bg-black/50 border border-white/5 flex items-center justify-center shrink-0 font-black text-[#ec4899]">2</div>
                <p className="text-left text-xs font-bold text-gray-300 uppercase tracking-widest leading-snug">
                  Select <span className="text-white">"Open in External Browser"</span> or <span className="text-white">"Open in Chrome/Safari"</span>.
                  There you will get the full instruction to install the app and join the eFootball Center community!
                </p>
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
}