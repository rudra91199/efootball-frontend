import moment from "moment";
import { useAuthStore } from "../../../store/authStore";
import { FaUsers } from "react-icons/fa";
import { AlignStartVertical, Award, LoaderCircle, Medal } from "lucide-react";
import { getFaceCropUrl } from "../../../Utils/utils";
import AuthLoader from "../../Loaders/AuthLoader";

const Overview = ({ tournament, isLoading, theme }) => {
  const { user } = useAuthStore();

  const myTeam = tournament?.teams?.find((team) =>
    team.players.some((player) => player._id === user?._id)
  );
  
  if (isLoading) {
    return <AuthLoader />;
  }

  // ==========================================
  // DYNAMIC IMAGE BACKGROUND STYLES
  // ==========================================
  const isRMA = myTeam?.name === "RMA" || myTeam?.name === "Real Madrid";
  const isBarca = myTeam?.name === "Barca" || myTeam?.name === "FCB";
  const isSevenBlades = myTeam?.name === "Seven Blades of Bloodshed";
  const isSuryaSen = myTeam?.name === "Surya Sen Bloodline FC" || myTeam?.name === "Surya Sen Bloodline";
  // Default Fallback Styling
  let avatarBgClass = "bg-gradient-to-b from-[#312c85]/80 via-[#0a0e29]/70 to-black"; 
  let avatarRingClass = theme.avatarBorder || "border-white/20";

  if (isRMA) {
    avatarBgClass = "bg-gradient-to-b from-[#cfb53b] to-[#050505]"; 
    avatarRingClass = "border-[#cfb53b]/60 shadow-[0_0_15px_rgba(207,181,59,0.3)]";
  } else if (isBarca) {
    avatarBgClass = "bg-gradient-to-br from-[#a50044]/80 via-[#080b1f] to-[#004d98]"; 
    avatarRingClass = "border-[#a50044]/60 shadow-[0_0_15px_rgba(165,0,68,0.3)]";
  } else if (isSevenBlades) {
    // Charcoal/Black to Dark Crimson red
    avatarBgClass = "bg-gradient-to-b from-[#2a2a2a]/90 via-[#0a0a0a] to-[#660000]/90";
    // Silver/Chrome border with a blood red glow
    avatarRingClass = "border-[#c0c0c0]/70 shadow-[0_0_15px_rgba(220,20,60,0.4)]";
  } else if (isSuryaSen) {
    // Patina Green/Teal via Tarnished Bronze to Muted Navy
    avatarBgClass = "bg-gradient-to-b from-[#2d4046]/80 via-[#9c8466]/50 to-[#1a2c3a]";
    // Tarnished Bronze border with a subtle warm glow
    avatarRingClass = "border-[#b08d5c]/70 shadow-[0_0_15px_rgba(176,141,92,0.3)]";
  }

  return (
    <div className={`relative text-white min-h-screen md:p-4 rounded-xl`}>
      
      {/* --- MAIN CONTENT (Z-10 brings it above watermark) --- */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-2">
        
        {/* Left Side: Tournament & Team Details */}
        <div className="lg:col-span-2 space-y-2">
          
          {/* TOURNAMENT INFORMATION PANEL */}
          <div className={`${theme.panelBg} liquid-glass-card ${theme.shadow} ${theme.beforeShadow} rounded-xl before:rounded-xl backdrop-blur-sm p-6 transition-all duration-500`}>
            <h3 className="text-sm font-bold mb-4 flex items-center gap-2">
              <Medal className={theme.accentText} size={14}/> Tournament Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div className="space-y-3">
                <div>
                  <p className={`text-[9px]  ${theme.normalText? theme.normalText : "text-[#ffffff]/70"} mb-1 uppercase tracking-wider`}>
                    Tournament Name
                  </p>
                  <p className={`font-black w-fit text-base tracking-wide bg-gradient-to-r ${theme.gradientText} bg-clip-text text-transparent`}>
                    {tournament?.name}
                  </p>
                </div>

                <div>
                  <p className={`text-[9px] ${theme.normalText? theme.normalText : "text-[#ffffff]/70"} mb-1 uppercase tracking-wider`}>Type</p>
                  <span className={`px-2 py-1.5 rounded-full text-[9px] font-bold uppercase ${theme.badge}`}>
                    {tournament?.type}
                  </span>
                </div>
                <div>
                  <p className={`text-[9px] ${theme.normalText? theme.normalText : "text-[#ffffff]/70"} mb-1 uppercase tracking-wider`}>
                    Entry Fee
                  </p>
                  <p className="font-medium text-xs text-gray-200">{tournament?.entryFee === 0 ? "FREE" : `${tournament?.entryFee} BDT`}</p>
                </div>
                <div>
                  <p className={`text-[9px] ${theme.normalText? theme.normalText : "text-[#ffffff]/70"} mb-1 uppercase tracking-wider`}>Stages</p>
                  <p className={`font-bold text-sm ${theme.accentText}`}>
                    {tournament?.stages?.length}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <p className={`text-[9px] ${theme.normalText? theme.normalText : "text-[#ffffff]/70"} mb-1 uppercase tracking-wider`}>
                    Start Date
                  </p>
                  <p className="font-medium text-xs text-gray-200">
                    {moment(tournament?.startDate).format("LL")}
                  </p>
                </div>
              
                <div>
                  <p className={`text-[9px] ${theme.normalText? theme.normalText : "text-[#ffffff]/70"} mb-1 uppercase tracking-wider`}>
                    Organizer
                  </p>
                  <p className={`font-bold text-xs ${theme.accentText}`}>
                    The eFootball Center
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* TEAM PERFORMANCE OVERVIEW PANEL */}
          <div className={`${theme.panelBg} liquid-glass-card ${theme.shadow} ${theme.beforeShadow} rounded-xl before:rounded-xl backdrop-blur-sm p-4 transition-all duration-500`}>
            <h3 className="text-sm font-bold mb-2 flex items-center gap-2">
              <FaUsers className={theme.accentText} />
              My Squad
            </h3>

            {/* Faction & Captain Card */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-black/30 px-4 py-2 rounded-lg border border-white/5 mb-3">
              <div className="space-y-1">
                <div>
                  <p className={`text-[10px] ${theme.normalText? theme.normalText : "text-[#ffffff]/70"} mb-1 uppercase tracking-wider`}>
                    Squad
                  </p>
                  <p className={`w-fit font-black text-sm tracking-wider uppercase bg-gradient-to-r ${theme.gradientText} bg-clip-text text-transparent drop-shadow-md`}>
                    {myTeam?.name || "Unassigned"}
                  </p>
                </div>
              </div>
              
              <div className="space-y-1">
                <div>
                  <p className={`text-[9px] ${theme.normalText? theme.normalText : "text-[#ffffff]/70"} mb-1 uppercase tracking-wider`}>Captain</p>
                  <div className="flex items-center gap-3">
                    {/* Captain Avatar */}
                    <div className="relative">
                      <div className={`w-10 h-10 rounded-full overflow-hidden border-[3px] ${avatarRingClass} ${avatarBgClass}`}>
                        <img
                          src={getFaceCropUrl(myTeam?.captain?.image?.url)}
                          alt={myTeam?.captain?.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="absolute -top-1.5 -right-1.5 bg-black rounded-full border border-white/20 p-0.5 text-[10px] shadow-lg">👑</div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm text-gray-100 truncate">
                        {myTeam?.captain?.name || "TBD"}
                      </p>
                      <p className={`text-xs font-medium ${theme.accentText} truncate uppercase tracking-widest`}>
                        {myTeam?.captain?.inGameUserName || "Pending"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <p className={`text-[10px] ${theme.normalText? theme.normalText : "text-[#ffffff]/70"} uppercase tracking-widest mb-3`}>Active Roster</p>
            
            {/* The Roster Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-1">
              {myTeam?.players?.map((player, index) => {
                const isCaptain = player._id === myTeam?.captain?._id;
                
                return (
                  <div
                    key={index}
                    className="bg-black/40 rounded-xl py-2 px-3 flex gap-3 items-center hover:bg-white/5 transition-colors group"
                  >
                    {/* Roster Avatar */}
                    <div className="relative shrink-0">
                      <div className={`w-8 h-8 rounded-full overflow-hidden border-2 transition-transform duration-300 group-hover:scale-105 ${avatarRingClass} ${avatarBgClass}`}>
                        <img
                          src={getFaceCropUrl(player.image?.url)}
                          alt={player.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      {isCaptain && (
                         <div className="absolute -top-1 -right-1 bg-black rounded-full p-0.5 text-[8px] shadow-md z-10">👑</div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col mb-0.5">
                        <p className="text-xs font-bold text-gray-200 leading-tight truncate">
                          {player?.name}
                        </p>
                      </div>
                      <div className="flex flex-col">
                        <p className={`font-bold text-[10px] ${theme.accentText} leading-tight truncate`}>
                          {player?.inGameUserName}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
          </div>
        </div>

        {/* Right Side: Sidebar Information */}
        <div className="space-y-2">
          
          {/* QUICK STATS PANEL */}
          <div className={`${theme.panelBg} liquid-glass-card ${theme.shadow} ${theme.beforeShadow} rounded-xl before:rounded-xl backdrop-blur-sm p-6 transition-all duration-500`}>
            <h3 className="text-sm font-bold mb-4 flex items-center gap-2">
              <AlignStartVertical className={theme.accentText} size={14} />
              Tournament Info
            </h3>
            <div className="space-y-2 ">
              <div className="flex justify-between items-center border-b border-white/5 pb-1 pl-4">
                <span className={`text-[9px] ${theme.normalText? theme.normalText : "text-[#ffffff]/70"} uppercase  `}>Teams</span>
                <span className="font-bold text-gray-200  text-xs">
                  {tournament?.teams?.length || 0} / {tournament?.maxTeams || 0}
                </span>
              </div>
              <div className="flex justify-between items-center border-b border-white/5 pb-1 pl-4">
                <span className={`text-[9px] ${theme.normalText? theme.normalText : "text-[#ffffff]/70"} uppercase  `}>Status</span>
                <span className={`font-bold uppercase tracking-widest text-xs flex items-center gap-2 ${
                  tournament?.status === 'Live' ? 'text-red-400' : 'text-green-400'
                }`}>
                  <span className={`w-2 h-2 rounded-full animate-pulse ${
                    tournament?.status === 'Live' ? 'bg-red-500' : 'bg-green-500'
                  }`}></span>
                  {tournament?.status}
                </span>
              </div>
              <div className="flex justify-between items-center pb-2 pl-4">
                <span className={`text-[9px] ${theme.normalText? theme.normalText : "text-[#ffffff]/70"} uppercase  `}>Prizepool</span>
                <span className={`font-black text-sm ${theme.accentText} drop-shadow-md`}>
                  BDT {tournament?.prizes?.totalPool?.toLocaleString() || 0}
                </span>
              </div>

              {/* Placement Prizes */}
              {tournament?.prizes?.placements && tournament.prizes.placements.length > 0 && (
                <div className="">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <Award className="w-4 h-4 text-gray-400" />
                    Victory
                  </h3>
                  <div className="grid grid-cols-1 gap-2">
                    {tournament.prizes.placements.map((placement, index) => (
                      <div key={index} className="bg-black/40 border border-white/5 p-2.5 rounded-lg flex justify-between items-center">
                        <span className={`font-bold text-xs flex items-center gap-2 ${
                            index === 0 ? "text-yellow-400" : index === 1 ? "text-gray-300" : index === 2 ? "text-orange-400" : "text-gray-400"
                          }`}
                        >
                          <Medal size={16}/>
                          {placement.position}
                        </span>
                        <span className="text-sm font-bold text-gray-100">
                          BDT {placement?.amount?.toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Individual Awards */}
              {tournament?.prizes?.individualAwards && tournament.prizes.individualAwards.length > 0 && (
                <div className="">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-1">
                    <Award className="w-4 h-4 text-gray-400" />
                    Individual Glory
                  </h3>
                  <div className="grid grid-cols-1 gap-1">
                    {tournament.prizes.individualAwards.map((award, index) => (
                      <div key={index} className="bg-black/40 border border-white/5 p-2.5 rounded-lg flex items-center justify-between">
                        <h4 className="font-bold text-[9px] uppercase tracking-wider text-gray-200">
                          {award?.awardName}
                        </h4>
                        <p className={`text-xs font-bold ${theme.accentText}`}>
                          BDT {award?.amount?.toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* TOURNAMENT PROGRESS PANEL */}
          <div className={`${theme.panelBg} liquid-glass-card ${theme.shadow} ${theme.beforeShadow} rounded-xl before:rounded-xl backdrop-blur-sm p-6 transition-all duration-500`}>
            <h3 className="text-sm font-bold mb-5 flex items-center gap-2">
              <LoaderCircle className={theme.accentText} /> Mission Progress
            </h3>
            <div className="space-y-5">
              {tournament?.stages?.map((stage, index) => (
                <div key={index}>
                  <div className="flex justify-between text-xs mb-1.5 items-end">
                    <span className="text-gray-300 font-bold uppercase tracking-wider text-[10px] max-w-[70%] leading-tight">
                      Phase {stage?.stageOrder}: <br/><span className={`${theme.accentText} text-[11px]`}>{stage.stageName}</span>
                    </span>
                    <span
                      className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded border ${
                        stage.status === "Active" ? `${theme.accentText} border-current bg-white/5` 
                        : stage.status === "Pending" ? "text-gray-500 border-gray-600 bg-black/40"
                        : `${theme.accentText} border-current bg-white/5`
                      }`}
                    >
                      {stage.status}
                    </span>
                  </div>
                  <div className="w-full bg-black/50 border border-white/5 rounded-full h-2 overflow-hidden shadow-inner">
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ${
                        stage.status === "Active" ? `${theme.progressActive} w-[50%] animate-pulse` 
                        : stage.status === "Pending" ? "bg-transparent w-0"
                        : `${theme.progressActive} w-full`
                      }`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default Overview;