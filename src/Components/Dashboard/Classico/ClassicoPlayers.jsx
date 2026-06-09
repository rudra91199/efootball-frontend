"use client";

import { useQuery } from "@tanstack/react-query";
import Massacre from "../../../assets/ClassicoMassacreHigh.jpg";
import { Trophy, ShieldAlert } from "lucide-react";
import { API } from "../../../axios";
import { getFaceCropUrl } from "../../../Utils/utils";
import AuthLoader from "../../Loaders/AuthLoader";

export default function ClassicoPlayers() {
  const tournamentId = "69a4db2bb752126f7d7768e4";

  const {
    data: { data: { data: tournamentData } = {} } = {},
    isLoading: isTournamentLoading,
  } = useQuery({
    queryKey: ["tournament", tournamentId],
    queryFn: () => {
      return API.get(`/tournaments/${tournamentId}`, {
        headers: { Authorization: localStorage.getItem("authToken") },
      });
    },
    enabled: !!tournamentId,
  });

  if (isTournamentLoading) {
    return (
      <div className="w-full aspect-[9/16] bg-[#05050a] flex items-center justify-center rounded-2xl border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.8)]">
        <AuthLoader />
      </div>
    );
  }

  const teams = tournamentData?.teams || [];
  
  const rmaTeam = teams.find((t) => t.name === "Real Madrid" || t.name === "RMA");
  const barcaTeam = teams.find((t) => t.name === "FC Barcelona" || t.name === "Barca");

  // Ensure we always map over exactly 8 slots to keep the grid perfectly balanced
  const rmaPlayers = [...(rmaTeam?.players || [])];
  while (rmaPlayers.length < 8) rmaPlayers.push({});
  
  const barcaPlayers = [...(barcaTeam?.players || [])];
  while (barcaPlayers.length < 8) barcaPlayers.push({});

  const isCaptain = (team, playerId) => {
    if (!team?.captain || !playerId) return false;
    const capId = team.captain._id || team.captain.$oid || team.captain;
    const pId = playerId._id || playerId.$oid || playerId;
    return capId === pId;
  };

  return (
    <div className="flex justify-center w-full bg-[#05050a] py-4 sm:py-8">
      {/* ========================================== */}
      {/* 9:16 MASTER CONTAINER                      */}
      {/* ========================================== */}
      <div className="relative w-full max-w-[420px] aspect-[9/16] bg-[#05050a] overflow-hidden rounded-[2rem] shadow-[0_0_50px_rgba(0,0,0,0.8)] border border-white/10 group">
        
        {/* --- BACKGROUND LAYER --- */}
        <div className="absolute inset-0 z-0">
          <img 
            src={Massacre} 
            alt="The Clásico Massacre" 
            className="w-full h-full object-cover transition-transform duration-[20s] ease-linear group-hover:scale-110" 
          />
          {/* Intense Vignette to focus the center and make text pop */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_20%,_#05050a_120%)] pointer-events-none" />
          <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-[#05050a]/20 via-[#05050a]/50 to-transparent pointer-events-none" />
        </div>


        {/* ========================================== */}
        {/* FOREGROUND: PLAYER ROSTERS                 */}
        {/* ========================================== */}
        <div className="absolute inset-x-0 top-[50%] -translate-y-1/2 h-[68%] z-20 flex justify-between  pb-6">
          
          {/* --- REAL MADRID (LEFT) --- */}
          <div className="w-[43%] h-full grid grid-rows-8 gap-2">
            {rmaPlayers.slice(0, 8).map((player, idx) => {
              const isCap = isCaptain(rmaTeam, player);
              const hasData = !!player._id;

              return (
                <div 
                  key={idx} 
                  className={`relative flex items-center gap-2.5 w-full h-full bg-[#0a0a14]/50  rounded-r-xl border-y border-r border-white/5 transition-all duration-300 hover:bg-white/10 ${hasData ? 'border-l-[2px] border-l-[#cfb43b96]' : 'border-l-[3px] border-l-gray-700 opacity-50'}`}
                >
                  {/* Subtle Team Gradient Background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-[#cfb53b]/10 to-transparent pointer-events-none rounded-r-xl" />

                  {/* Avatar */}
                  <div className="relative shrink-0 ml-1.5 my-1 h-10 w-10 sm:h-9 sm:w-9">
                    <div className="w-full h-full rounded-md overflow-hidden bg-transparent border border-white/10 shadow-[0_0_15px_rgba(207,181,59,0.2)]">
                      {hasData ? (
                        <img 
                          src={getFaceCropUrl(player?.image?.url) || "/placeholder.svg"} 
                          alt="P1"
                          className="w-full h-full object-cover bg-transparent"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center"><ShieldAlert className="w-4 h-4 text-gray-600" /></div>
                      )}
                    </div>
                    {isCap && (
                      <div className="absolute -top-2 -left-2 bg-[#05050a] rounded-full p-0.5 border border-[#cfb53b] shadow-[0_0_8px_rgba(207,181,59,0.8)] z-10">
                        <Trophy className="w-2.5 h-2.5 text-[#cfb53b]" />
                      </div>
                    )}
                  </div>

                  {/* Name */}
                  <div className="flex flex-col justify-center overflow-hidden pr-1 relative z-10">
                    <span className="text-[10px] sm:text-[11px] font-black text-white uppercase tracking-widest truncate w-full drop-shadow-md">
                      {hasData ? player.inGameUserName : "Awaiting..."}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* --- BARCELONA (RIGHT) --- */}
          <div className="w-[43%] h-full grid grid-rows-8 gap-2">
            {barcaPlayers.slice(0, 8).map((player, idx) => {
              const isCap = isCaptain(barcaTeam, player);
              const hasData = !!player._id;

              return (
                <div 
                  key={idx} 
                  className={`relative flex items-center justify-end gap-2.5 w-full h-full bg-[#0a0a14]/60  rounded-l-xl border-y border-l border-white/5 transition-all duration-300 hover:bg-white/10 ${hasData ? 'border-r-[2px] border-r-[#a50045a2]' : 'border-r-[3px] border-r-gray-700 opacity-50'}`}
                >
                  {/* Subtle Team Gradient Background */}
                  <div className="absolute inset-0 bg-gradient-to-l from-[#a50044]/10 to-transparent pointer-events-none rounded-l-xl" />

                  {/* Name */}
                  <div className="flex flex-col justify-center items-end overflow-hidden pl-1 relative z-10">
                    <span className="text-[10px] sm:text-[11px] font-black text-white uppercase tracking-widest truncate w-full text-right drop-shadow-md">
                      {hasData ? player.inGameUserName : "Awaiting..."}
                    </span>
                  </div>

                  {/* Avatar */}
                  <div className="relative shrink-0 mr-1.5 my-1 h-10 w-10 sm:h-9 sm:w-9">
                    <div className="w-full h-full rounded-md overflow-hidden bg-transparent border border-white/10 shadow-[0_0_15px_rgba(165,0,68,0.2)]">
                      {hasData ? (
                        <img 
                          src={getFaceCropUrl(player?.image?.url) || "/placeholder.svg"} 
                          alt="P2"
                          className="w-full h-full object-cover bg-transparent"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center"><ShieldAlert className="w-4 h-4 text-gray-600" /></div>
                      )}
                    </div>
                    {isCap && (
                      <div className="absolute -top-2 -right-2 bg-[#05050a] rounded-full p-0.5 border border-[#edbb00] shadow-[0_0_8px_rgba(237,187,0,0.8)] z-10">
                        <Trophy className="w-2.5 h-2.5 text-[#edbb00]" />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </div>
  );
}