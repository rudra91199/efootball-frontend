import { useState } from "react";
import { useAuthStore } from "../store/authStore";
import { API } from "../axios";
import { useNavigate } from "react-router";

export default function TeamSubmit() {
  const [teamName, setTeamName] = useState("");
  const [firstDayPlayer, setFirstDayPlayer] = useState("");
  const [starPlayer, setStarPlayer] = useState("");
  const [lateNightPlayer, setLateNightPlayer] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const teamData = {
      teamName: e.target.teamName.value,
      firstDayPlayer: e.target.firstDayPlayer.value,
      starPlayer: e.target.starPlayer.value,
      lateNightPlayer: e.target.lateNightPlayer.value,
      captainId: user._id,
    };


    const response = await API.post("/teams/submit-team", teamData, {
      headers: {
        Authorization: localStorage.getItem("authToken"),
      },
    });
    if (response.data.success) {
      e.target.reset();
      setSubmitted(true);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#041996] to-black text-white p-6">
      <div className="w-full max-w-lg bg-black/60 backdrop-blur-xl p-8 rounded-xl shadow-2xl">
        <h2 className="text-3xl font-bold mb-6 text-center">
          Submit Your Team Data
        </h2>

        {submitted ? (
          <div className="text-center space-y-4">
            <h3 className="text-2xl font-semibold text-[#FEFB04]">
              Team Submitted ✅
            </h3>
            <p className="text-gray-300">
              Your team has been saved successfully.
            </p>
            <button className="cursor-pointer" onClick={() => navigate("/submittedsquad")}>Go to your squad</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5 w-full">
            <div>
              <label className="block text-sm mb-1">Team Name</label>
              <input
                type="text"
                name="teamName"
                onChange={(e) => setTeamName(e.target.value)}
                required
                className="w-full p-3 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-[#FEFB04]"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">First Day Player</label>
              <input
                type="text"
                name="firstDayPlayer"
                onChange={(e) => setFirstDayPlayer(e.target.value)}
                required
                className="w-full p-3 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-[#FF0082]"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Star Player</label>
              <input
                type="text"
                name="starPlayer"
                onChange={(e) => setStarPlayer(e.target.value)}
                required
                className="w-full p-3 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-[#F015C7]"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Late Night Player</label>
              <input
                type="text"
                name="lateNightPlayer"
                onChange={(e) => setLateNightPlayer(e.target.value)}
                required
                className="w-full p-3 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-[#69FD00]"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 rounded-lg bg-[#FEFB04] text-black font-bold hover:bg-[#FF0082] hover:text-white transition"
            >
              Submit Team
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
