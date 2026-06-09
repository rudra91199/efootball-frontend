import React from 'react';
import { Trophy, Sparkles, Target, Cpu, Swords } from 'lucide-react';

// Built-in Cloudinary function with increased zoom-out
export const getFaceCropUrl = (url) => {
  if (!url || typeof url !== "string") return "/placeholder.svg";

  if (url.includes("cloudinary.com")) {
    if (url.includes("g_face") || url.includes("g_auto")) return url;

    // Strip the old version number
    const cleanUrl = url.replace(/\/v\d+\//, '/');

    // Changed z_0.7 to z_0.45 to zoom out significantly more
    const newUrl = cleanUrl.replace(
      "/image/upload/", 
      "/image/upload/c_thumb,g_face,z_0.6,w_300,h_450,q_auto,f_auto/"
    );

    return newUrl.includes("?") ? `${newUrl}&v=trans3` : `${newUrl}?v=trans3`;
  }

  return url;
};

const players = [
  { id: 1, name: 'VenoMouSss🐍', points: 11 ,url:"https://res.cloudinary.com/daqhrz2gr/image/upload/q_auto/f_auto/v1772223543/pc1prtklixsqk80pco1x.webp" },
  { id: 2, name: 'RuDrA91199', points: 9,url:"https://res.cloudinary.com/daqhrz2gr/image/upload/v1777032304/mzejnzkrsnpugc4njjji.png" },
  { id: 3, name: 'KayoZzz', points: 8,url:"https://res.cloudinary.com/daqhrz2gr/image/upload/q_auto/f_auto/v1772223973/ceczzm4oekci4dvm6l6n.webp" },
  { id: 4, name: 'Burns10', points: 8,url:"https://res.cloudinary.com/daqhrz2gr/image/upload/q_auto/f_auto/v1772223945/nmytjgrimpyzbrfv6db8.webp" },
  { id: 5, name: 'LeviAcKerMan', points: 7,url:"https://res.cloudinary.com/daqhrz2gr/image/upload/q_auto/f_auto/v1772413499/vae32xhcze51nvczqrtq.png" },
  { id: 6, name: 'visca el', points: 7,url:"https://res.cloudinary.com/daqhrz2gr/image/upload/q_auto/f_auto/v1772223853/bwiemyictqibtf2eettc.webp" },
  { id: 7, name: 'iNeed2Pe', points: 4,url:"https://res.cloudinary.com/daqhrz2gr/image/upload/q_auto/f_auto/v1772223730/eho1kmwl9tei9vhuixgw.webp" },
  { id: 8, name: 'YURiiii', points: 3,url:"https://res.cloudinary.com/daqhrz2gr/image/upload/q_auto/f_auto/v1772223866/we0rydczittlypnzzp6z.webp" },
];

const ChampionBanner = () => {
  return (
    <div className="w-[100%] sm:max-w-4xl mx-auto bg-[#040509] flex flex-col items-center justify-start gap-2 md:gap-4 py-2  md:px-4 font-sans overflow-hidden relative border border-[#c5a059]/20 rounded-3xl shadow-[inset_0_0_80px_rgba(0,0,0,0.8)]">
      
      {/* Embedded CSS for Advanced Barca Metallic Animations */}
      <style>
        {`     
          .text-metallic-gold {
            background: linear-gradient(to bottom, #fff7e0 0%, #e6b961 25%, #c5a059 50%, #8f6e35 75%, #ffffca 100%);
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
            filter: drop-shadow(0 2px 0px rgba(0,0,0,0.5));
          }
        `}
      </style>

      {/* Animated Barca Background Layer */}
      <div className="absolute inset-0 barca-bg-animate -z-20 rounded-3xl"></div>
      
      {/* Subtle Background Glow for depth */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[120%] h-1/2 bg-[#a50044]/10 blur-[100px] -z-10 rounded-full pointer-events-none transition-all duration-1000"></div>

      {/* Header Section */}
      <div className="flex flex-col items-center text-center z-10 shrink-0 w-full pt-1">
        <div className="animate-float">
          <Trophy className="w-8 h-8 md:w-14 md:h-14 text-[#e6b961] mb-1 drop-shadow-[0_0_15px_rgba(230,185,97,0.8)]" />
        </div>

        {/* Subtitle Badge */}
        <div className="border border-[#c5a059]/60 bg-[#004d98]/20 backdrop-blur-md rounded-full px-4 md:px-5 py-1 mb-1 md:mb-2 shadow-[inset_0_0_10px_rgba(197,160,89,0.3)] flex items-center gap-2  transition-all duration-500 ">
          <Sparkles className="w-3 h-3 md:w-4 md:h-4 text-[#e6b961] animate-pulse" />
          <h2 className="text-[#fdf2d7] text-[9px] md:text-sm font-bold tracking-widest uppercase flex items-center gap-2 divide-x divide-[#c5a059]/50">
            <span className="drop-shadow-md pr-2">FC Barcelona</span>
          </h2>
          <Sparkles className="w-3 h-3 md:w-4 md:h-4 text-[#e6b961] animate-pulse" />
        </div>

        {/* Main Title */}
        <div className="relative">
          <h1 className="text-2xl md:text-5xl font-black uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-[#c5a059] via-[#fff7e0] to-[#c5a059] animate-metal-sheen drop-shadow-[0_4px_6px_rgba(0,0,0,0.9)] text-center leading-none">
            Classico Massacre
          </h1>
          <span className="block text-lg md:text-4xl text-transparent bg-clip-text bg-gradient-to-r from-[#016fdd] via-[#e90162] to-[#037af1] font-extrabold mt-1 md:mt-2 bg-[length:200%_auto] animate-[pulse_4s_ease-in-out_infinite] drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
            First Blood
          </span>
        </div>

        {/* Match Result Callout */}
        <div className="mt-2 md:mt-3 border border-[#a50044]/60 bg-[#0a0205]/80 backdrop-blur-sm rounded-lg px-3 md:px-6 py-1.5 flex items-center justify-center gap-1.5 md:gap-3 card-reveal shadow-[inset_0_0_15px_rgba(165,0,68,0.3)]" style={{ animationDelay: '100ms' }}>
          <Swords className="w-3 h-3 md:w-4 md:h-4 text-[#a50044]" />
          <p className="text-[#f8dce6] text-[7px] md:text-xs font-semibold tracking-widest uppercase">
            FC Barcelona beats Real Madrid by <span className="text-[#e6b961] font-black drop-shadow-[0_0_8px_rgba(230,185,97,0.8)]">7 points margin</span>
          </p>
          <Swords className="w-3 h-3 md:w-4 md:h-4 text-[#a50044]" />
        </div>
      </div>

      {/* Player Cards Grid - 6 columns to center the last 2 items */}
      <div className="grid grid-cols-6 gap-2 md:gap-3 z-10 w-full flex-1 min-h-0 place-items-center justify-center content-center pb-2 px-1">
        {players.map((player, index) => (
          <div 
            key={player.id} 
            className={`card-reveal relative w-full h-full flex justify-center items-center col-span-2 ${index === 6 ? 'col-start-2' : ''}`}
            style={{ animationDelay: `${index * 60 + 150}ms` }}
          >
            
            {/* 1. OUTER WRAPPER */}
            <div className="relative w-full aspect-[3/4.5] max-h-full filter drop-shadow-[0_0_4px_rgba(165,0,68,0.4)] md:hover:drop-shadow-[0_0_15px_rgba(165,0,68,0.8)] transform transition-all duration-300 md:hover:scale-[1.03] md:hover:z-20 group cursor-pointer border border-[#c5a059]/10 rounded-xl">

              {/* 2. OUTER METALLIC GARNET BORDER */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#a50044] via-[#610028] to-[#a50044] p-[1px] md:p-[2px] [clip-path:polygon(10px_0,calc(100%-10px)_0,100%_10px,100%_calc(100%-10px),calc(100%-10px)_100%,10px_100%,0_calc(100%-10px),0_10px)] md:[clip-path:polygon(12px_0,calc(100%-12px)_0,100%_12px,100%_calc(100%-12px),calc(100%-12px)_100%,12px_100%,0_calc(100%-12px),0_12px)]">

                {/* 3. DARK GAP LAYER */}
                <div className="relative w-full h-full bg-[#040509] p-[2px] md:p-[2px] [clip-path:polygon(8px_0,calc(100%-8px)_0,100%_8px,100%_calc(100%-8px),calc(100%-8px)_100%,8px_100%,0_calc(100%-8px),0_8px)] md:[clip-path:polygon(10px_0,calc(100%-10px)_0,100%_10px,100%_calc(100%-10px),calc(100%-10px)_100%,10px_100%,0_calc(100%-10px),0_10px)] shadow-[inset_0_0_15px_rgba(0,0,0,0.6)]">
                  
                  {/* Tech Accents inside the gap */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-[3px] md:h-[2px] bg-[#c5a059] z-10 md:group-hover:bg-[#fff7e0] transition-colors"></div>
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-[3px] md:h-[2px] bg-[#c5a059] z-10 md:group-hover:bg-[#fff7e0] transition-colors"></div>
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] md:w-[2px] h-4 md:h-6 bg-[#790133] z-10"></div>
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[2px] md:w-[2px] h-4 md:h-6 bg-[#790133] z-10"></div>

                  {/* 4. INNER METALLIC GOLD BORDER */}
                  <div className="w-full h-full bg-gradient-to-r from-[#c5a059] via-[#fff7e0] to-[#c5a059] animate-metal-sheen p-[1px] md:p-[1.5px] [clip-path:polygon(6px_0,calc(100%-6px)_0,100%_6px,100%_calc(100%-6px),calc(100%-6px)_100%,6px_100%,0_calc(100%-6px),0_6px)] md:[clip-path:polygon(8px_0,calc(100%-8px)_0,100%_8px,100%_calc(100%-8px),calc(100%-8px)_100%,8px_100%,0_calc(100%-8px),0_8px)]">

                    {/* 5. MAIN CONTENT AREA */}
                    <div className="relative w-full h-full bg-gradient-to-b from-[#1a1c3a] via-[#040509] to-[#3a0018] [clip-path:polygon(5px_0,calc(100%-5px)_0,100%_5px,100%_calc(100%-5px),calc(100%-5px)_100%,5px_100%,0_calc(100%-5px),0_5px)] md:[clip-path:polygon(7px_0,calc(100%-7px)_0,100%_7px,100%_calc(100%-7px),calc(100%-7px)_100%,7px_100%,0_calc(100%-7px),0_7px)] flex flex-col justify-end overflow-hidden border border-[#c5a059]/10 rounded-xl">
                      
                      {/* Sweeping Metallic Specular Highlight */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent w-1/2 h-full -translate-x-full skew-x-[-25deg] z-40 animate-specular-mobile md:animate-none md:animate-specular-desktop md:hidden md:group-hover:block pointer-events-none"></div>
                      
                      {/* Subtle Grid overlay */}
                      <div className="absolute inset-0 bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5+AAAAIklEQVQIW2NkQAKrVq36z8gAFWNgYGSA8iGCYAVWSAsAAPKCC4fD7D3AAAAAAElFTkSuQmCC')] opacity-[0.03] z-20 pointer-events-none"></div>

                      {/* Top Corner Details */}
                      <div className="absolute top-1 left-1.5 md:top-2 md:left-2.5 flex items-center gap-1 z-30 opacity-100 md:opacity-70 md:group-hover:opacity-100 transition-opacity">
                        <Cpu className="w-1.5 h-1.5 md:w-3 md:h-3 text-[#e6b961]" />
                        <span className="text-[3px] md:text-[6px] text-[#fdf2d7] font-mono tracking-widest hidden lg:block">PLATE.ENGRAVED</span>
                      </div>
                      <Target className="absolute top-1 right-1.5 md:top-2 md:right-2.5 w-1.5 h-1.5 md:w-3 md:h-3 text-[#a50044] z-30 md:group-hover:animate-pulse" />

                      {/* Player Image - INCREASED VISIBILITY */}
                      <img
                        src={getFaceCropUrl(player.url)}
                        alt={player.name}
                        className="absolute inset-0 w-full h-full object-cover object-top z-0 transition-all duration-700 ease-out transform
                                   opacity-100 grayscale-0 mix-blend-normal scale-[1.03] animate-[mobileImageReveal_1.5s_ease-out_forwards]
                                   md:animate-none md:opacity-90 md:mix-blend-normal md:filter md:grayscale-[40%] md:scale-100 
                                   md:group-hover:scale-110 md:group-hover:opacity-100 md:group-hover:grayscale-0"
                        style={{ animationDelay: `${index * 60 + 500}ms` }}
                      />
                      
                      {/* Smooth Black Gradient Mesh from bottom to almost middle */}
                      <div className="absolute inset-0 z-10 pointer-events-none bg-[linear-gradient(to_top,black_0%,black_10%,rgba(0,0,0,0.9)_20%,rgba(0,0,0,0.7)_30%,rgba(0,0,0,0.3)_40%,transparent_50%)] opacity-100 md:opacity-100 md:group-hover:opacity-80 transition-opacity duration-300"></div>

                      {/* Text Information Block */}
                      <div className="relative z-30 w-full p-1 md:p-2.5 flex flex-col items-center justify-end md:pb-4">
                        {/* Metallic Gold Name - BIGGER */}
                        <h3 className="text-metallic-gold text-[10px] md:text-xl font-black tracking-wider uppercase mb-1 text-center px-1 w-full line-clamp-1 transform transition-transform duration-300 -translate-y-1 md:translate-y-0 md:group-hover:-translate-y-1">
                          {player.name}
                        </h3>
                        
                        {/* Grana Points Wrapper */}
                        <div className="bg-[#a50044]/40 md:bg-[#a50044]/20 border border-[#a50044]/60 md:border-[#a50044]/40 rounded shadow-inner px-1.5 py-1 transform transition-transform duration-300 -translate-y-1 md:translate-y-0 md:group-hover:-translate-y-1">
                          <p className="text-[#f8dce6] text-[8px] md:text-[12px] font-bold tracking-widest uppercase flex items-center gap-1.5">
                            PTS 
                            <span className="w-[1px] h-2.5 md:h-3 bg-[#e6b961]/50 md:bg-[#a50044]/50"></span>
                            {/* Gold Points Text - BIGGER */}
                            <span className="text-[#e6b961] text-[11px] md:text-xl font-black drop-shadow-[0_0_5px_rgba(230,185,97,0.5)]">
                              {player.points}
                            </span>
                          </p>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              </div>
            </div>
            
          </div>
        ))}
      </div>

    </div>
  );
};

export default ChampionBanner;