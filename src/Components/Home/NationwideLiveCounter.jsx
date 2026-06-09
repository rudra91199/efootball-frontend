import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import AuthLoader from "../Loaders/AuthLoader";
import { API } from "../../axios";
import { Swords, Flame } from "lucide-react";

const NationwideLiveCounter = () => {
  const navigate = useNavigate();
  const NATIONWIDE_TOURNAMENT_ID = "69efb58d4741e37a280e6404";

  const [dragBounds, setDragBounds] = useState({ top: 0, bottom: 200 });

  useEffect(() => {
    if (typeof window !== "undefined") {
      setDragBounds({
        top: -(window.innerHeight / 2) + 400,
        bottom: window.innerHeight / 2 + 50,
      });
    }
  }, []);

  const { data: { data: { data: leaderboardData } = {} } = {}, isLoading } =
    useQuery({
      queryKey: ["championship-leaderboard", NATIONWIDE_TOURNAMENT_ID],
      queryFn: () => {
        return API.get(
          `/massacre/championship-leaderboard/${NATIONWIDE_TOURNAMENT_ID}`,
          {
            headers: {
              Authorization: localStorage.getItem("authToken"),
            },
          },
        );
      },
    });

  if (isLoading) return null; 

  const team1 = leaderboardData?.[0] || null;
  const team2 = leaderboardData?.[1] || null;

  if (!team1 || !team2) return null;

  const team1Score = team1?.teamGrandTotal || 0;
  const team2Score = team2?.teamGrandTotal || 0;

  // ==========================================
  // COMPACT THEME ENGINE
  // ==========================================
  const getTeamStyles = (teamName) => {
    const name = (teamName || "").toLowerCase().trim();

    if (name.includes("seven blades")) {
      return { neonColor: "#ef4444" }; // Crimson Red
    }
    if (name.includes("surya sen")) {
      return { neonColor: "#b08d5c" }; // Gold/Bronze
    }
    if (name === "rma" || name.includes("real madrid")) {
      return { neonColor: "#eab308" }; // Gold
    }
    if (name === "barca" || name.includes("fc barcelona") || name === "fcb") {
      return { neonColor: "#ef4444" }; // Barca Red
    }
    // Fallback
    return { neonColor: "#6366f1" };
  };

  const t1Styles = getTeamStyles(team1?.teamName);
  const t2Styles = getTeamStyles(team2?.teamName);

  return (
    <motion.div
      drag
      dragConstraints={{
        right: 0,
        left: 0,
        top: dragBounds.top,
        bottom: dragBounds.bottom,
      }}
      dragElastic={{ x: 10, y: 0.1 }}
      initial={{ x: 50, opacity: 0, y: "-50%" }}
      animate={{ x: 0, opacity: 1, y: "-50%" }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() =>
        navigate(
          `/dashboard/my-tournaments/massacre/${NATIONWIDE_TOURNAMENT_ID}`,
        )
      }
      className="fixed right-2 sm:right-4 top-[20%] z-[100] cursor-grab active:cursor-grabbing touch-none bg-linear-to-br from-[#ef4444]/30 via-black/20 to-[#b08d5c]/30 liquid-glass-card low rounded-full backdrop-blur-xl"
    >
      <div className="flex  items-center  backdrop-blur-[1px]  p-2.5 gap-3 ">
        <div className="flex items-center gap-2">
          <div
            className="w-10 h-10 rounded-full overflow-hidden bg-black/70 p-0.5"
            style={{
              borderColor: t1Styles.neonColor,
              boxShadow: `0 0 15px ${t1Styles.neonColor}40`,
            }}
          >
            <img
              src={team1.teamLogo || "/placeholder.svg"}
              alt="T1"
              className="w-full h-full object-contain pointer-events-none saturate-150 brightness-150"
            />
          </div>
          <span
            className="font-black text-xl leading-none drop-shadow-md pointer-events-none"
            style={{ color: t1Styles.neonColor }}
          >
            {team1Score}
          </span>
        </div>

        <div className="w-full h-[1px] bg-white/10 relative flex items-center justify-center my-1 pointer-events-none">
          <div className="absolute bg-[#0a0b10] p-1 rounded-full border border-white/10">
            <Swords className="w-3.5 h-3.5 text-gray-500" strokeWidth={2} />
          </div>
        </div>

        <div className="flex items-center gap-2 pointer-events-none">
          <span
            className="font-black text-xl leading-none drop-shadow-md"
            style={{ color: t2Styles.neonColor }}
          >
            {team2Score}
          </span>
          <div
            className="w-10 h-10 rounded-full overflow-hidden bg-black/70 p-0.5"
            style={{
              borderColor: t2Styles.neonColor,
              boxShadow: `0 0 15px ${t2Styles.neonColor}40`,
            }}
          >
            <img
              src={team2.teamLogo || "/placeholder.svg"}
              alt="T2"
              className="w-full h-full object-contain pointer-events-none saturate-150 brightness-150"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default NationwideLiveCounter;
