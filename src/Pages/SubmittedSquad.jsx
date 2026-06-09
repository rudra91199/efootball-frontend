import { useState } from "react";
import { API } from "../axios";
import { useAuthStore } from "../store/authStore";
import { useQuery } from "@tanstack/react-query";
import Particles from "../Components/Loaders/Particle";
import AuthLoader from "../Components/Loaders/AuthLoader";

export default function SubmittedSquad() {
  const { user } = useAuthStore();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const {
    data: { data: { data } = {} } = {},
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["team", user._id],
    queryFn: () => {
      return API.get(`/teams/teamById`, {
        headers: {
          Authorization: localStorage.getItem("authToken"),
        },
      });
    },
  });

  const handleUpdateSquad = async (e) => {
    e.preventDefault();
    // TODO: send update request to backend API

    const teamData = {
      teamName: e.target.teamName.value,
      firstDayPlayer: e.target.firstDayPlayer.value,
      starPlayer: e.target.starPlayer.value,
      lateNightPlayer: e.target.lateNightPlayer.value,
    };

    const response = await API.patch(`/teams/${data?._id}`, teamData, {
      headers: {
        Authorization: localStorage.getItem("authToken"),
      },
    });
    if (response.data.success) {
      setEditing(false);
      refetch();
    }
  };

  if (isLoading) {
    return <AuthLoader />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#041996] to-black text-white flex flex-col items-center p-6">
      <Particles />
      <h1 className="text-3xl font-bold text-[#FEFB04] mb-6">Your Squad</h1>

      {!editing ? (
        <div className="bg-black/30 rounded-xl shadow-lg p-6 w-full max-w-md space-y-4 border border-[#FF0082]/40">
          <h2 className="text-2xl font-semibold text-[#FF0082]">
            {data.teamName}
          </h2>
          <p>
            <span className="font-bold text-[#F015C7]">First Day Player:</span>{" "}
            {data.firstDayPlayer}
          </p>
          <p>
            <span className="font-bold text-[#F015C7]">Star Player:</span>{" "}
            {data.starPlayer}
          </p>
          <p>
            <span className="font-bold text-[#F015C7]">Late Night Player:</span>{" "}
            {data.lateNightPlayer}
          </p>

          <button
            onClick={() => setEditing(true)}
            className="w-full mt-4 py-2 rounded-lg font-semibold bg-gradient-to-r from-[#FF0082] to-[#F015C7] text-white hover:opacity-90 transition"
          >
            Edit Squad
          </button>
        </div>
      ) : (
        <form onSubmit={handleUpdateSquad} className="space-y-5 w-[40%]">
          <div>
            <label className="block text-sm mb-1">Team Name</label>
            <input
              type="text"
              defaultValue={data.teamName}
              name="teamName"
              required
              className="w-full p-3 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-[#FEFB04]"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">First Day Player</label>
            <input
              type="text"
              defaultValue={data.firstDayPlayer}
              name="firstDayPlayer"
              required
              className="w-full p-3 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-[#FF0082]"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Star Player</label>
            <input
              type="text"
              defaultValue={data.starPlayer}
              name="starPlayer"
              required
              className="w-full p-3 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-[#F015C7]"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Late Night Player</label>
            <input
              type="text"
              defaultValue={data.lateNightPlayer}
              name="lateNightPlayer"
              required
              className="w-full p-3 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-[#69FD00]"
            />
          </div>
          <div className="flex gap-10">
            <button
              type="submit"
              className="w-[50%] py-3 rounded-lg bg-[#FEFB04] text-black font-bold hover:bg-[#FF0082] hover:text-white transition"
            >
              Save
            </button>
            <button
              onClick={() => setEditing(false)}
              className="w-[50%] py-3 rounded-lg bg-[#f20604] text-white font-bold hover:bg-[#FF0082] hover:text-white transition"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
