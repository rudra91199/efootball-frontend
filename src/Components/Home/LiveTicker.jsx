import { useQuery } from "@tanstack/react-query";
import { Flame, RadioTower, AlertTriangle, Zap } from "lucide-react";
import { API } from "../../axios";

export default function LiveTicker() {
  const { data: { data: { data: tickerItems } = {} } = {}, isLoading } =
    useQuery({
      queryKey: ["live-ticker"],
      queryFn: () =>
        API.get("/broadcast-ticker/ticker-data", {
          headers: { Authorization: localStorage.getItem("authToken") },
        }),
      refetchInterval: 30000,
    });

  const getIcon = (type) => {
    switch (type) {
      case "Warning":
        return <AlertTriangle className="w-5 h-5 text-[#e11d48]" />;
      case "Hype":
        return <Flame className="w-5 h-5 text-[#eab308]" />;
      default:
        return <RadioTower className="w-5 h-5 text-[#14b8a6]" />;
    }
  };

  if (isLoading || !tickerItems) return null;

  // ONLY keep non-CombatLog items for the ticker
  const infoItems = tickerItems.filter((item) => item.type !== "CombatLog");

  if (infoItems.length === 0) return null;

  return (
    <div className="relative w-full bg-[#030305] border-y border-white/5 overflow-hidden py-3 shadow-[0_10px_30px_rgba(0,0,0,0.8)] z-40">
      {/* Heavy Vignette Gradients for fading edges */}
      <div className="absolute top-0 left-0 w-20 md:w-40 h-full bg-gradient-to-r from-[#030305] via-[#030305]/80 to-transparent z-10 pointer-events-none" />
      <div className="absolute top-0 right-0 w-20 md:w-40 h-full bg-gradient-to-l from-[#030305] via-[#030305]/80 to-transparent z-10 pointer-events-none" />

      {/* The Scrolling Track */}
      <div className="flex w-max animate-marquee hover:[animation-play-state:paused] cursor-default items-center">
        {[...infoItems, ...infoItems, ...infoItems].map((item, idx) => (
          <div
            key={`${item.id}-${idx}`}
            className="flex items-center mx-8 sm:mx-12 whitespace-nowrap group"
          >
            {/* Broadcast Icon */}
            <div className="mr-4 p-1.5 bg-white/5 rounded-md border border-white/10 shadow-inner transform -skew-x-12">
              <div className="transform skew-x-12">{getIcon(item.type)}</div>
            </div>

            {/* Render Info Data */}
            <span className="text-xs sm:text-sm font-black text-gray-200 tracking-[0.15em] uppercase italic drop-shadow-sm">
              {item.link ? (
                <a
                  href={item.link}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#14b8a6] hover:text-[#5eead4] hover:underline transition-colors flex items-center gap-2"
                >
                  {item.text}
                  <Zap className="w-3 h-3" />
                </a>
              ) : (
                item.text
              )}
            </span>

            {/* Esports Angular Separator */}
            <div className="flex gap-1 ml-8 sm:ml-12 opacity-30">
              <div className="w-1 h-6 bg-white transform rotate-12" />
              <div className="w-1 h-6 bg-[#14b8a6] transform rotate-12" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}