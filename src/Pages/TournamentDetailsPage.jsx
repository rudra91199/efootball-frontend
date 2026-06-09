"use client";

import { useState } from "react";
import { Link, useLocation, useParams, useNavigate } from "react-router";
import moment from "moment";
import { 
  ArrowRightCircle, Award, Trophy, ArrowLeft, Gamepad2, 
  ShieldAlert, MapPin, DollarSign, Calendar, Users, 
  Clock, ShieldCheck, Target
} from "lucide-react";
import { useAuthStore } from "../store/authStore";

export default function TournamentDetailsPage() {
  const params = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const tournament = location.state;
  const { user } = useAuthStore(); // Added to match button logic

  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(false);

  // Synced Cyberpunk Status Themes
  const getStatusTheme = (status) => {
    switch (status) {
      case "LIVE":
        return "bg-pink-500/10 border-pink-500/50 text-pink-400 shadow-[0_0_10px_rgba(236,72,153,0.2)]";
      case "REGISTRATION_OPEN":
      case "Published":
        return "bg-cyan-500/10 border-cyan-500/50 text-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.2)]";
      case "UPCOMING":
        return "bg-indigo-500/10 border-indigo-500/50 text-indigo-400 shadow-[0_0_10px_rgba(99,102,241,0.2)]";
      case "REGISTRATION_CLOSED":
        return "bg-yellow-500/10 border-yellow-500/50 text-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.2)]";
      case "COMPLETED":
        return "bg-gray-500/10 border-gray-500/50 text-gray-400";
      default:
        return "bg-white/5 border-white/20 text-gray-300";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "LIVE":
        return "LIVE NOW";
      case "REGISTRATION_OPEN":
      case "Published":
        return "REGISTRATION OPEN";
      case "UPCOMING":
        return "UPCOMING";
      case "REGISTRATION_CLOSED":
        return "REGISTRATION CLOSED";
      case "COMPLETED":
        return "COMPLETED";
      default:
        return status;
    }
  };

  const handleNavigate = (type, tournamentId) => {
    if (type === "trifecta") {
      navigate(`/dashboard/my-tournaments/tournament/${tournamentId}`);
    } else if (
      type === "league + knockout solo" ||
      type === "champions circuit"
    ) {
      navigate(`/dashboard/my-tournaments/league-knockout/${tournamentId}`);
    }
  };

  if (!tournament) return <div className="min-h-screen bg-[#05050a] flex justify-center items-center text-white font-bold">Tournament Not Found</div>;

  return (
    <div className="min-h-screen bg-[#05050a] text-white selection:bg-pink-500/30 pb-16">
      
      {/* --- HERO SECTION (Tactical Briefing Header) --- */}
      <section className="relative pt-24 pb-12 overflow-hidden border-b border-white/5">
        {/* Ambient Core Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/30 via-pink-900/10 to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest w-fit group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> 
              Back to Intel
            </button>

            <div className="flex items-center gap-3">
              <span className={`px-3 py-1.5 rounded-md text-[10px] font-black uppercase tracking-widest border backdrop-blur-md ${getStatusTheme(tournament.status)}`}>
                {getStatusText(tournament.status)}
              </span>
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest bg-white/5 px-3 py-1.5 rounded-md border border-white/10">
                {tournament.type}
              </span>
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-10 tracking-tight drop-shadow-lg uppercase leading-tight">
            {tournament.name}
          </h1>

          {/* Top HUD Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="bg-[#0a0a14]/80 backdrop-blur-xl rounded-2xl p-6 border border-white/5 shadow-[0_10px_30px_rgba(0,0,0,0.5)] flex items-start gap-4 group hover:border-yellow-500/30 transition-colors">
              <div className="p-3 bg-yellow-500/10 rounded-xl border border-yellow-500/20 text-yellow-400 group-hover:scale-110 transition-transform">
                <Trophy className="w-6 h-6" />
              </div>
              <div>
                <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Total Prize Pool</div>
                <div className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">
                  {tournament.prizes.totalPool} <span className="text-sm">BDT</span>
                </div>
              </div>
            </div>

            <div className="bg-[#0a0a14]/80 backdrop-blur-xl rounded-2xl p-6 border border-white/5 shadow-[0_10px_30px_rgba(0,0,0,0.5)] flex items-start gap-4 group hover:border-pink-500/30 transition-colors">
              <div className="p-3 bg-pink-500/10 rounded-xl border border-pink-500/20 text-pink-400 group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Roster Limit</div>
                <div className="text-2xl font-black text-white">
                  {tournament.teams?.length || 0} <span className="text-gray-600 text-sm">/ {tournament.maxTeams}</span>
                </div>
              </div>
            </div>

            <div className="bg-[#0a0a14]/80 backdrop-blur-xl rounded-2xl p-6 border border-white/5 shadow-[0_10px_30px_rgba(0,0,0,0.5)] flex items-start gap-4 group hover:border-indigo-500/30 transition-colors">
              <div className="p-3 bg-indigo-500/10 rounded-xl border border-indigo-500/20 text-indigo-400 group-hover:scale-110 transition-transform">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Kickoff Date</div>
                <div className="text-xl font-black text-white mt-0.5">
                  {moment.utc(tournament.startDate).format("MMM Do, YYYY")}
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* --- NAVIGATION TABS --- */}
      <section className="border-b border-white/5 sticky top-0 z-50 bg-[#05050a]/90 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex space-x-8 overflow-x-auto scrollbar-hide">
            {["overview", "rules", "prizes"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-5 px-2 relative font-black uppercase tracking-widest text-xs transition-colors whitespace-nowrap ${
                  activeTab === tab
                    ? "text-pink-400"
                    : "text-gray-500 hover:text-white"
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 to-indigo-500 rounded-t-full shadow-[0_-2px_10px_rgba(236,72,153,0.5)]" />
                )}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* --- TAB CONTENT --- */}
      <section className="py-12 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          
          {/* OVERVIEW TAB */}
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Left Column (Intel) */}
              <div className="lg:col-span-2 space-y-8">
                <div>
                  <h2 className="text-xl font-black text-white mb-4 uppercase tracking-wider flex items-center gap-2">
                    <Target className="w-5 h-5 text-pink-500" /> Mission Briefing
                  </h2>
                  <div className="bg-[#0a0a14]/80 backdrop-blur-xl rounded-2xl p-6 sm:p-8 border border-white/5 leading-relaxed text-gray-300 text-sm sm:text-base">
                    {tournament.description}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Tournament Info */}
                  <div className="bg-[#0a0a14]/80 backdrop-blur-xl rounded-2xl p-6 border border-white/5">
                    <h3 className="text-[11px] font-black text-gray-500 uppercase tracking-widest mb-6 border-b border-white/5 pb-3">
                      Event Parameters
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-2 text-gray-400 text-xs font-bold uppercase tracking-wider">
                          <Gamepad2 className="w-4 h-4 text-indigo-400" /> Game
                        </span>
                        <span className="font-bold text-white text-sm">Efootball 26</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-2 text-gray-400 text-xs font-bold uppercase tracking-wider">
                          <ShieldCheck className="w-4 h-4 text-pink-400" /> Organizer
                        </span>
                        <span className="font-bold text-white text-sm">Efootball Center</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-2 text-gray-400 text-xs font-bold uppercase tracking-wider">
                          <MapPin className="w-4 h-4 text-green-400" /> Region
                        </span>
                        <span className="font-bold text-white text-sm">Bangladesh</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-2 text-gray-400 text-xs font-bold uppercase tracking-wider">
                          <DollarSign className="w-4 h-4 text-yellow-400" /> Entry Fee
                        </span>
                        <span className="font-bold text-yellow-400 text-sm">{tournament.entryFee === 0 ? "FREE" : `${tournament.entryFee} BDT`}</span>
                      </div>
                    </div>
                  </div>

                  {/* Important Dates */}
                  <div className="bg-[#0a0a14]/80 backdrop-blur-xl rounded-2xl p-6 border border-white/5">
                    <h3 className="text-[11px] font-black text-gray-500 uppercase tracking-widest mb-6 border-b border-white/5 pb-3">
                      Timeline
                    </h3>
                    <div className="space-y-5">
                      <div>
                        <div className="flex items-center gap-2 text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">
                          <Clock className="w-4 h-4 text-pink-400" /> Reg Deadline
                        </div>
                        <div className="text-white font-bold pl-6 text-sm">
                          {moment.utc(tournament.registrationDeadline).format("MMMM Do YYYY, h:mm A")}
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">
                          <Calendar className="w-4 h-4 text-indigo-400" /> Tournament Kickoff
                        </div>
                        <div className="text-white font-bold pl-6 text-sm">
                          {moment.utc(tournament.startDate).format("MMMM Do YYYY, h:mm A")}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column (Sticky Quick Actions) */}
              <div className="relative">
                <div className="bg-[#0a0a14]/90 backdrop-blur-xl rounded-2xl p-6 border border-white/10 sticky top-[100px] shadow-[0_0_40px_rgba(0,0,0,0.8)]">
                  <h3 className="text-lg font-black text-white mb-6 uppercase tracking-wider text-center border-b border-white/5 pb-4">
                    Command Center
                  </h3>
                  
                  <div className="space-y-4">
                    {/* Replicated Button Logic from AllTournaments */}
                    {tournament.status === "Upcoming" ? (
                      <div className="w-full bg-[#05050a] border border-white/10 text-gray-500 py-4 rounded-xl font-bold text-xs text-center uppercase tracking-widest">
                        Awaiting Kickoff
                      </div>
                    ) : tournament.status === "Published" ? (
                      <Link
                        to={`/tournament/register/${tournament._id}`}
                        className="relative w-full overflow-hidden rounded-xl p-[1px] group flex transition-all duration-300 hover:shadow-[0_0_20px_rgba(34,211,238,0.3)]"
                      >
                        <span className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-indigo-500 rounded-xl opacity-80 group-hover:opacity-100 transition-opacity duration-300"></span>
                        <div className="relative w-full bg-[#05050a] py-4 rounded-[11px] flex items-center justify-center transition-all duration-300 group-hover:bg-opacity-0">
                          <span className="relative z-10 text-white font-black text-xs uppercase tracking-[0.2em]">
                            Register Now
                          </span>
                        </div>
                      </Link>
                    ) : !tournament?.stages[0]?.stageData?.participants?.includes(user?._id) ? (
                      <button
                        onClick={() => handleNavigate(tournament?.type.toLowerCase(), tournament._id)}
                        className="w-full bg-gradient-to-r from-pink-600 to-indigo-600 hover:from-pink-500 hover:to-indigo-500 text-white py-4 rounded-xl font-black text-xs text-center uppercase tracking-[0.15em] transition-all flex items-center justify-center gap-2 shadow-lg"
                        disabled={loading}
                      >
                        Access Dashboard <ArrowRightCircle className="w-4 h-4" />
                      </button>
                    ) : (
                      <div className="w-full bg-red-500/10 border border-red-500/20 text-red-400 py-4 rounded-xl font-bold text-xs text-center uppercase tracking-widest flex items-center justify-center gap-2">
                        Roster Full <ShieldAlert className="w-4 h-4" />
                      </div>
                    )}
                  </div>

                  {/* Quick Stat */}
                  <div className="mt-6 pt-6 border-t border-white/5 text-center">
                    <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Current Slots Filled</div>
                    <div className="text-xl font-black text-white">
                      {tournament.teams?.length || 0} / {tournament.maxTeams}
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* RULES TAB */}
          {activeTab === "rules" && (
            <div className="max-w-4xl mx-auto">
              <h2 className="text-xl font-black text-white mb-6 uppercase tracking-wider flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-indigo-400" /> Rules of Engagement
              </h2>
              <div className="bg-[#0a0a14]/80 backdrop-blur-xl rounded-2xl p-6 sm:p-10 border border-white/5">
                <ul className="space-y-6">
                  {tournament.rules.map((rule, index) => (
                    <li key={index} className="flex items-start gap-4 text-gray-300 group">
                      <span className="bg-[#05050a] border border-indigo-500/30 text-indigo-400 rounded-lg w-8 h-8 flex items-center justify-center text-sm font-black flex-shrink-0 mt-0.5 group-hover:bg-indigo-500/20 transition-colors shadow-[0_0_10px_rgba(99,102,241,0.1)]">
                        {index + 1}
                      </span>
                      <span className="pt-1.5 text-sm sm:text-base leading-relaxed">{rule}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* PRIZES TAB */}
          {activeTab === "prizes" && (
            <div className="max-w-5xl mx-auto">
              {tournament?.prizes ? (
                <div className="space-y-8">
                  
                  {/* Hero Prize Pool */}
                  <div className="relative bg-[#0a0a14]/90 backdrop-blur-xl border border-yellow-500/20 rounded-2xl p-10 text-center overflow-hidden">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-yellow-500/10 to-transparent pointer-events-none" />
                    <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-4 drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]" />
                    <h3 className="text-[11px] font-black text-yellow-500/70 uppercase tracking-[0.2em] mb-2">
                      Total Prize Pool
                    </h3>
                    <p className="text-5xl sm:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-yellow-200 to-yellow-600 drop-shadow-md">
                      {tournament?.prizes?.totalPool?.toLocaleString()} <span className="text-2xl text-yellow-500">BDT</span>
                    </p>
                  </div>

                  {/* Placements Grid */}
                  {tournament?.prizes?.placements?.length > 0 && (
                    <div>
                      <h3 className="text-sm font-black text-white mb-4 uppercase tracking-widest flex items-center gap-2 pl-2">
                        <Award className="w-4 h-4 text-indigo-400" /> Placement Rewards
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {tournament?.prizes?.placements?.map((placement, index) => {
                          // Dynamic styling based on position (Gold, Silver, Bronze, Standard)
                          const isFirst = index === 0;
                          const isSecond = index === 1;
                          const isThird = index === 2;
                          
                          let cardStyle = "bg-[#0a0a14]/80 border-white/5";
                          let textStyle = "text-white";
                          let icon = "";

                          if (isFirst) {
                            cardStyle = "bg-yellow-500/5 border-yellow-500/30 shadow-[0_0_20px_rgba(250,204,21,0.1)]";
                            textStyle = "text-yellow-400";
                            icon = "🥇";
                          } else if (isSecond) {
                            cardStyle = "bg-gray-400/5 border-gray-400/30 shadow-[0_0_20px_rgba(156,163,175,0.1)]";
                            textStyle = "text-gray-300";
                            icon = "🥈";
                          } else if (isThird) {
                            cardStyle = "bg-orange-500/5 border-orange-500/30 shadow-[0_0_20px_rgba(249,115,22,0.1)]";
                            textStyle = "text-orange-400";
                            icon = "🥉";
                          }

                          return (
                            <div key={index} className={`p-6 rounded-2xl border backdrop-blur-md ${cardStyle} flex flex-col items-center justify-center text-center relative overflow-hidden group hover:-translate-y-1 transition-transform`}>
                              <div className="text-3xl mb-2">{icon}</div>
                              <span className={`font-black uppercase tracking-widest mb-1 ${textStyle}`}>
                                {placement.position}
                              </span>
                              <p className={`text-2xl font-black ${isFirst ? 'text-yellow-400' : 'text-white'}`}>
                                {placement?.amount?.toLocaleString()} <span className="text-xs text-gray-500">BDT</span>
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Individual Awards */}
                  {tournament?.prizes?.individualAwards?.length > 0 && (
                    <div>
                      <h3 className="text-sm font-black text-white mb-4 uppercase tracking-widest flex items-center gap-2 pl-2 mt-8">
                        <Award className="w-4 h-4 text-pink-400" /> Individual Honors
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {tournament?.prizes?.individualAwards?.map((award, index) => (
                          <div key={index} className="p-6 bg-[#0a0a14]/80 backdrop-blur-xl border border-pink-500/20 rounded-2xl flex items-center justify-between hover:bg-pink-500/5 transition-colors">
                            <div>
                              <h4 className="font-black text-white uppercase tracking-wider mb-1">
                                {award?.awardName}
                              </h4>
                              <p className="text-xl font-black text-pink-400">
                                {award?.amount?.toLocaleString()} <span className="text-xs text-pink-600">BDT</span>
                              </p>
                            </div>
                            <div className="w-12 h-12 rounded-full bg-pink-500/10 flex items-center justify-center border border-pink-500/30">
                              <Award className="w-6 h-6 text-pink-400" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </div>
              ) : (
                <div className="bg-[#0a0a14]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-16 text-center">
                  <div className="w-20 h-20 rounded-full bg-[#05050a] border border-white/10 flex items-center justify-center mx-auto mb-6">
                    <Trophy className="w-8 h-8 text-gray-600" />
                  </div>
                  <p className="text-white font-black uppercase tracking-widest text-lg mb-2">
                    Classified Intel
                  </p>
                  <p className="text-gray-500 text-sm font-bold uppercase tracking-wider">
                    Prize distributions have not been disclosed yet.
                  </p>
                </div>
              )}
            </div>
          )}

        </div>
      </section>
    </div>
  );
}