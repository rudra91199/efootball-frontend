import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X, Trophy, Swords } from "lucide-react";

const scoreSchema = z.object({
  team1_score: z.coerce
    .number()
    .min(0, "Score must be positive")
    .max(100, "Score too high"),
  team2_score: z.coerce
    .number()
    .min(0, "Score must be positive")
    .max(100, "Score too high"),
  winnerId: z.string().nullish(),
});

export default function UpdateMatchScoreModal({
  isOpen,
  onClose,
  onSubmit,
  match,
}) {
  const [selectedWinner, setSelectedWinner] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    reset,
  } = useForm({
    resolver: zodResolver(scoreSchema),
    defaultValues: {
      team1_score: match?.team1_score || 0,
      team2_score: match?.team2_score || 0,
      winnerId: match?.winner?._id || undefined,
    },
  });

  // --- Force the form to reset when the 'match' prop changes ---
  useEffect(() => {
    if (match) {
      reset({
        team1_score: match.team1_score || 0,
        team2_score: match.team2_score || 0,
        winnerId: match?.winner?._id || undefined,
      });
      setSelectedWinner(match?.winner?._id || null);
    }
  }, [match, reset]);
  // ----------------------------------------------------------------------

  const team1Score = watch("team1_score");
  const team2Score = watch("team2_score");
  const isTied = team1Score === team2Score;

  const handleFormSubmit = async (data) => {
    if (isTied && !selectedWinner) {
      alert("Deadlock detected. Please select the advancing operator.");
      return;
    }
    await onSubmit({
      ...data,
      winnerId: selectedWinner,
    });
    reset();
    onClose();
  };

  if (!isOpen || !match) return null;

  return (
    <div className="fixed inset-0 bg-[#030305]/90 backdrop-blur-md flex items-center justify-center z-[9999] px-4 font-sans animate-fade-in">
      {/* Premium Modal Container */}
      <div className="relative bg-[#0a0b10] border border-white/10 rounded-[24px] w-full max-w-md shadow-[0_0_80px_rgba(225,29,72,0.15)] overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Subtle Ambient Glow */}
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-[#e11d48]/10 via-transparent to-[#ec4899]/10 pointer-events-none" />

        {/* Header */}
        <div className="relative px-6 sm:px-8 py-5 border-b border-white/5 flex items-center justify-between bg-[#030305]/50 z-10 shrink-0">
          <h2 className="text-lg font-black text-white uppercase tracking-widest flex items-center gap-2">
            <Swords className="w-5 h-5 text-[#e11d48]" />
            Log Result
          </h2>
          <button
            onClick={onClose}
            className="p-2.5 text-gray-400 hover:text-rose-400 bg-white/5 hover:bg-rose-500/10 rounded-xl transition-all active:scale-95"
          >
            <X size={18} strokeWidth={2.5} />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="overflow-y-auto custom-scrollbar">
          <form onSubmit={handleSubmit(handleFormSubmit)} className="relative p-6 sm:p-8 space-y-8 z-10">
            
            {/* Round & VS Display - Broadcast Style */}
            <div className="text-center space-y-6">
              <p className="text-gray-400 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] bg-[#030305] inline-block px-4 py-1.5 rounded-lg border border-white/5 shadow-inner">
                {match.round} • Fixture {match.matchNumber}
              </p>
              
              <div className="flex items-center justify-center gap-4 sm:gap-6">
                {/* Squad 1 (Crimson) */}
                <div className="flex flex-col items-center flex-1 min-w-0">
                  <div className="w-16 h-16 bg-[#030305] rounded-[14px] p-1 border border-[#e11d48]/50 shadow-[0_0_20px_rgba(225,29,72,0.3)] shrink-0 mb-3 flex items-center justify-center">
                    <img
                      src={match.team1?.image?.url || match.team1?.logo || "/placeholder.svg"}
                      alt={match.team1?.name}
                      className="w-full h-full rounded-lg object-cover"
                    />
                  </div>
                  <p className="text-white font-black text-xs uppercase tracking-wide text-center truncate w-full">
                    {match.team1?.inGameUserName || match.team1?.name?.split(" ").slice(0, 2).join(" ")}
                  </p>
                </div>
                
                <p className="text-gray-600 font-black italic text-xl sm:text-2xl shrink-0 tracking-[0.2em] uppercase">VS</p>
                
                {/* Squad 2 (Neon Pink) */}
                <div className="flex flex-col items-center flex-1 min-w-0">
                  <div className="w-16 h-16 bg-[#030305] rounded-[14px] p-1 border border-[#ec4899]/50 shadow-[0_0_20px_rgba(236,72,153,0.3)] shrink-0 mb-3 flex items-center justify-center">
                    <img
                      src={match.team2?.image?.url || match.team2?.logo || "/placeholder.svg"}
                      alt={match.team2?.name}
                      className="w-full h-full rounded-lg object-cover"
                    />
                  </div>
                  <p className="text-white font-black text-xs uppercase tracking-wide text-center truncate w-full">
                     {match.team2?.inGameUserName || match.team2?.name?.split(" ").slice(0, 2).join(" ")}
                  </p>
                </div>
              </div>
            </div>

            {/* Score Inputs */}
            <div className="flex items-center gap-6">
              <div className="flex-1 space-y-2">
                <label className="block text-gray-500 text-[10px] font-black uppercase tracking-widest text-center">
                  Squad 1 Score
                </label>
                <input
                  {...register("team1_score", { valueAsNumber: true })}
                  type="number"
                  min="0"
                  max="100"
                  className={`w-full px-4 py-4 bg-[#030305] border rounded-[16px] text-white placeholder-gray-600 focus:outline-none transition-all text-center text-4xl font-black shadow-inner ${
                    errors.team1_score ? "border-[#e11d48] focus:border-[#e11d48] focus:ring-1 focus:ring-[#e11d48]/50" : "border-white/10 focus:border-[#e11d48] focus:ring-1 focus:ring-[#e11d48]/50"
                  }`}
                />
                {errors.team1_score && (
                  <p className="text-[#e11d48] text-[9px] font-black uppercase tracking-widest text-center mt-2">
                    {errors.team1_score.message}
                  </p>
                )}
              </div>
              
              <div className="flex-1 space-y-2">
                <label className="block text-gray-500 text-[10px] font-black uppercase tracking-widest text-center">
                  Squad 2 Score
                </label>
                <input
                  {...register("team2_score", { valueAsNumber: true })}
                  type="number"
                  min="0"
                  max="100"
                  className={`w-full px-4 py-4 bg-[#030305] border rounded-[16px] text-white placeholder-gray-600 focus:outline-none transition-all text-center text-4xl font-black shadow-inner ${
                    errors.team2_score ? "border-[#ec4899] focus:border-[#ec4899] focus:ring-1 focus:ring-[#ec4899]/50" : "border-white/10 focus:border-[#ec4899] focus:ring-1 focus:ring-[#ec4899]/50"
                  }`}
                />
                {errors.team2_score && (
                  <p className="text-[#ec4899] text-[9px] font-black uppercase tracking-widest text-center mt-2">
                    {errors.team2_score.message}
                  </p>
                )}
              </div>
            </div>

            {/* Winner Selection for Tied Matches */}
            {isTied && (
              <div className="bg-[#030305] border border-white/5 shadow-inner rounded-[20px] p-5">
                <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-4 text-center">
                  Deadlock. Select Advancing Operator:
                </p>
                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={() => setSelectedWinner(match.team1._id)}
                    className={`w-full flex items-center gap-4 p-3 rounded-[14px] border transition-all ${
                      selectedWinner === match.team1._id
                        ? "bg-[#e11d48]/10 border-[#e11d48]/50 text-white shadow-[0_0_20px_rgba(225,29,72,0.2)]"
                        : "bg-[#0a0b10] border-white/5 text-gray-500 hover:border-[#e11d48]/30 hover:bg-[#e11d48]/5"
                    }`}
                  >
                    <img
                      src={match.team1?.image?.url || match.team1?.logo || "/placeholder.svg"}
                      alt={match.team1?.name}
                      className="w-10 h-10 rounded-[10px] object-cover shrink-0"
                    />
                    <span className="font-black text-xs uppercase tracking-wider truncate">
                      {match.team1?.inGameUserName || match.team1?.name}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedWinner(match.team2._id)}
                    className={`w-full flex items-center gap-4 p-3 rounded-[14px] border transition-all ${
                      selectedWinner === match.team2._id
                        ? "bg-[#ec4899]/10 border-[#ec4899]/50 text-white shadow-[0_0_20px_rgba(236,72,153,0.2)]"
                        : "bg-[#0a0b10] border-white/5 text-gray-500 hover:border-[#ec4899]/30 hover:bg-[#ec4899]/5"
                    }`}
                  >
                    <img
                      src={match.team2?.image?.url || match.team2?.logo || "/placeholder.svg"}
                      alt={match.team2?.name}
                      className="w-10 h-10 rounded-[10px] object-cover shrink-0"
                    />
                    <span className="font-black text-xs uppercase tracking-wider truncate">
                      {match.team2?.inGameUserName || match.team2?.name}
                    </span>
                  </button>
                </div>
              </div>
            )}

            {/* Auto Winner Display */}
            {!isTied && (
              <div className="flex items-center justify-center p-4 bg-[#030305] border border-white/5 shadow-inner rounded-xl">
                <p className="text-white text-[10px] sm:text-xs font-black uppercase tracking-widest flex items-center gap-2">
                  <Trophy className={`w-4 h-4 ${team1Score > team2Score ? "text-[#e11d48]" : "text-[#ec4899]"}`} />
                  Advancing:{" "}
                  <span className={team1Score > team2Score ? "text-[#e11d48]" : "text-[#ec4899]"}>
                    {team1Score > team2Score
                      ? match.team1?.inGameUserName || match.team1?.name
                      : match.team2?.inGameUserName || match.team2?.name}
                  </span>
                </p>
              </div>
            )}
          </form>
        </div>
        
        {/* Fixed Footer Actions */}
        <div className="p-6 sm:px-8 sm:py-6 border-t border-white/5 bg-[#030305]/80 flex items-center gap-4 z-10 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3.5 bg-transparent text-gray-500 hover:text-white rounded-xl font-black uppercase tracking-widest text-[10px] transition-colors"
          >
            Abort
          </button>
          <button
            type="submit"
            onClick={handleSubmit(handleFormSubmit)}
            disabled={isSubmitting}
            className="flex-[2] py-3.5 bg-gradient-to-r from-[#e11d48] to-[#ec4899] disabled:opacity-50 disabled:grayscale text-white rounded-xl font-black uppercase tracking-widest text-[10px] transition-all hover:shadow-[0_0_20px_rgba(236,72,153,0.4)] hover:-translate-y-0.5 active:translate-y-0 flex justify-center border border-white/20"
          >
            {isSubmitting ? "Logging..." : "Confirm Result"}
          </button>
        </div>

      </div>
    </div>
  );
}