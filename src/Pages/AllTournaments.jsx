import { useEffect, useState } from "react";
import { useAuthStore } from "../store/authStore";
import moment from "moment";
import { Link, useNavigate } from "react-router";
import { ArrowRightCircle, Trophy, Users, Calendar, ShieldAlert } from "lucide-react";

export default function AllTournaments() {
  const { tournaments, isLoadingTournaments, getTournaments } = useAuthStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { user } = useAuthStore();

  useEffect(() => {
    getTournaments();
  }, []);

  // Cyberpunk Neon Status Themes
  const getStatusTheme = (status) => {
    switch (status) {
      case "LIVE":
        return "bg-pink-500/10 border-pink-500/50 text-pink-400 shadow-[0_0_10px_rgba(236,72,153,0.2)]";
      case "Published": // Open for Registration
        return "bg-cyan-500/10 border-cyan-500/50 text-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.2)]";
      case "UPCOMING":
        return "bg-indigo-500/10 border-indigo-500/50 text-indigo-400 shadow-[0_0_10px_rgba(99,102,241,0.2)]";
      case "REGISTRATION_CLOSED":
        return "bg-yellow-500/10 border-yellow-500/50 text-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.2)]";
      case "Completed":
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

  if (isLoadingTournaments) {
    return (
      <div className="min-h-screen bg-[#05050a] flex items-center justify-center relative overflow-hidden">
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

  return (
    <div className="min-h-screen bg-[#05050a] pb-20 relative overflow-hidden text-white">
      
      {/* Background Ambient Layers */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-pink-900/5 to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      {/* Hero Section */}
      <section className="relative pt-12 pb-16 sm:pt-20 sm:pb-24 border-b border-white/5">
        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <div className="mb-4 inline-flex px-4 py-1.5 rounded-full border border-pink-500/30 bg-pink-500/10 backdrop-blur-md shadow-[0_0_15px_rgba(236,72,153,0.15)]">
            <span className="text-[10px] sm:text-xs font-black text-pink-400 uppercase tracking-[0.2em]">
              The Pro Circuit
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-6 tracking-tight drop-shadow-lg uppercase">
            Active <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500">Tournaments</span>
          </h1>
          <p className="text-xs sm:text-sm lg:text-base text-gray-400 font-bold uppercase tracking-[0.15em] max-w-2xl mx-auto leading-relaxed">
            Compete in the most prestigious eFootball formats and prove your skills against the absolute best.
          </p>
        </div>
      </section>

      {/* Tournaments Grid */}
      <section className="relative z-10 py-12 lg:py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {tournaments.map((tournament) => (
              <div
                key={tournament._id}
                onClick={() =>
                  navigate(`/tournaments/${tournament._id}`, {
                    state: tournament,
                  })
                }
                className="group relative bg-[#0a0a14]/80 backdrop-blur-xl rounded-2xl p-6 sm:p-8 border border-white/10 hover:border-indigo-500/40 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_10px_40px_rgba(99,102,241,0.15)] cursor-pointer overflow-hidden flex flex-col h-full"
              >
                {/* Subtle Hover Gradient Inside Card */}
                <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                <div className="relative z-10 flex flex-col h-full">
                  {/* Top Row: Status & Type */}
                  <div className="flex items-start justify-between mb-6 gap-2">
                    <span className={`px-3 py-1.5 rounded-md text-[9px] sm:text-[10px] font-black uppercase tracking-widest border backdrop-blur-md ${getStatusTheme(tournament.status)}`}>
                      {getStatusText(tournament.status)}
                    </span>
                    <span className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-widest text-right mt-1">
                      {tournament.type}
                    </span>
                  </div>

                  {/* Title & Desc */}
                  <h3 className="text-xl sm:text-2xl font-black text-white mb-3 tracking-wide leading-tight group-hover:text-indigo-400 transition-colors">
                    {tournament.name}
                  </h3>
                  <p className="text-gray-400 text-xs sm:text-sm mb-6 line-clamp-2 leading-relaxed font-medium">
                    {tournament.description}
                  </p>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    {/* Prize Pool */}
                    <div className="bg-[#05050a] rounded-xl p-3 border border-white/5">
                      <div className="flex items-center gap-1.5 mb-1 text-gray-500">
                        <Trophy className="w-3.5 h-3.5" />
                        <span className="text-[9px] font-bold uppercase tracking-widest">Prize Pool</span>
                      </div>
                      <div className="text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600 drop-shadow-[0_0_8px_rgba(250,204,21,0.3)]">
                        {tournament.prizes.totalPool} <span className="text-xs">BDT</span>
                      </div>
                    </div>

                    {/* Participants Data */}
                    <div className="bg-[#05050a] rounded-xl p-3 border border-white/5">
                      <div className="flex items-center gap-1.5 mb-1 text-gray-500">
                        <Users className="w-3.5 h-3.5" />
                        <span className="text-[9px] font-bold uppercase tracking-widest">Roster</span>
                      </div>
                      <div className="text-lg font-black text-white">
                        {tournament.teams.length}<span className="text-gray-600 text-sm">/{tournament.maxTeams}</span>
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-6">
                    <div className="w-full bg-[#05050a] rounded-full h-1.5 border border-white/5 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-indigo-500 to-pink-500 h-full rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(236,72,153,0.8)]"
                        style={{
                          width: `${(tournament.teams.length / tournament.maxTeams) * 100}%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Dates */}
                  <div className="mb-8 mt-auto space-y-2 bg-[#05050a]/50 rounded-lg p-3 border border-white/5">
                    {tournament.status === "Completed" ? (
                      <div className="flex items-center justify-center gap-2 text-gray-500 text-xs font-bold uppercase tracking-widest">
                        <Calendar className="w-3.5 h-3.5" /> Tournament Concluded
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center justify-between text-[10px] sm:text-xs">
                          <span className="text-gray-500 font-bold uppercase tracking-wider">Reg Close</span>
                          <span className="text-gray-300 font-medium">
                            {moment.utc(tournament.registrationDeadline).format("MMM Do, HH:mm")}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-[10px] sm:text-xs">
                          <span className="text-gray-500 font-bold uppercase tracking-wider">Kickoff</span>
                          <span className="text-indigo-400 font-bold">
                            {moment.utc(tournament.startDate).format("MMM Do, HH:mm")}
                          </span>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Action Buttons (Maintaining your exact logic) */}
                  <div className="mt-auto">
                    {tournament.status === "Upcoming" ? (
                      <div className="w-full bg-[#05050a] border border-white/10 text-gray-500 py-3.5 rounded-xl font-bold text-[11px] sm:text-xs text-center uppercase tracking-widest">
                        Awaiting Kickoff
                      </div>
                    ) : tournament.status === "Published" ? (
                      <Link
                        to={`/tournament/register/${tournament._id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="relative w-full overflow-hidden rounded-xl p-[1px] group flex transition-all duration-300 hover:shadow-[0_0_20px_rgba(34,211,238,0.3)]"
                      >
                        <span className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-indigo-500 rounded-xl opacity-80 group-hover:opacity-100 transition-opacity duration-300"></span>
                        <div className="relative w-full bg-[#05050a] py-3.5 rounded-[11px] flex items-center justify-center transition-all duration-300 group-hover:bg-opacity-0">
                          <span className="relative z-10 text-white font-black text-[11px] sm:text-xs uppercase tracking-[0.2em]">
                            Register Now
                          </span>
                        </div>
                      </Link>
                    ) : (
                      <div className="w-full bg-red-500/10 border border-red-500/20 text-red-400 py-3.5 rounded-xl font-bold text-[11px] sm:text-xs text-center uppercase tracking-widest flex items-center justify-center gap-2">
                        Roster Full <ShieldAlert className="w-4 h-4" />
                      </div>
                    )}
                  </div>

                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}