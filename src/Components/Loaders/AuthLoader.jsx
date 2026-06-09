import { ShieldAlert } from "lucide-react";

export default function AuthLoader() {
  return (
    <div className="absolute inset-0 bg-[#05050a] flex items-center justify-center  overflow-hidden">
      {/* Loading Radar Animation */}
      <div className="relative w-32 h-32 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full border-2 border-indigo-500/20"></div>
        <div className="absolute inset-0 rounded-full border-2 border-t-pink-500 border-r-indigo-500 border-b-transparent border-l-transparent animate-spin"></div>
        <div className="absolute inset-2 rounded-full border-2 border-t-transparent border-r-transparent border-b-indigo-400 border-l-pink-400 animate-[spin_2s_linear_infinite_reverse]"></div>
        <ShieldAlert className="w-8 h-8 text-white/50 animate-pulse" />
      </div>
    </div>
  );
}
