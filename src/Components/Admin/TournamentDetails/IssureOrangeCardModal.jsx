import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Settings, X, AlertTriangle } from "lucide-react";
import { API } from "../../../axios";
import { toast } from "react-toastify";

const orangeCardSchema = z.object({
  playerId: z.string().min(1, "Please select a player"),
  reason: z.string().min(10, "Reason must be at least 10 characters"),
});

const IssureOrangeCardModal = ({
  matches,
  actionMatch,
  setActionMatch,
  tournamentId,
  refetch,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(orangeCardSchema),
  });

  const getMatchPlayers = (match) => {
    const players = [];
    if (match.team1_squad) {
      players.push(match.details.subMatches[0].player1);
      players.push(match.details.subMatches[1].player1);
      players.push(match.details.subMatches[2].player1);
    }
    if (match.team2_squad) {
      players.push(match.details.subMatches[0].player2);
      players.push(match.details.subMatches[1].player2);
      players.push(match.details.subMatches[2].player2);
    }
    return players;
  };

  const onSubmitOrangeCard = async (data) => {
    const cardData = {
      playerId: data.playerId,
      cardType: "Orange",
      reason: data.reason,
      tournamentId: tournamentId,
      matchId: actionMatch,
    };
    const response = await API.post("/users/issue-card", cardData, {
      headers: {
        authorization: `${localStorage.getItem("authToken")}`,
      },
    });
    if (response.data.success) {
      setActionMatch(null);
      reset();
      refetch();
      toast.success("Orange card issued successfully");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-100">
            Match Action:{" "}
            {matches.find((m) => m._id === actionMatch)?.team1.name} vs{" "}
            {matches.find((m) => m._id === actionMatch)?.team2.name}
          </h3>
          <button
            onClick={() => setActionMatch(null)}
            className="text-gray-400 hover:text-gray-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmitOrangeCard)} className="space-y-6">
          <div>
            <h4 className="text-md font-medium text-gray-200 mb-4">
              Select Player to Issue Orange Card
            </h4>
            <div className="grid grid-cols-2 gap-4">
              {getMatchPlayers(matches.find((m) => m._id === actionMatch)).map(
                (player) => (
                  <label
                    key={player._id}
                    className="flex items-center space-x-3 p-4 bg-gray-800/50 border border-gray-700 rounded-lg cursor-pointer hover:bg-gray-800 transition-colors"
                  >
                    <input
                      type="radio"
                      value={player._id}
                      {...register("playerId")}
                      className="w-4 h-4 text-orange-600 focus:ring-orange-500 focus:ring-2"
                    />
                    <div className="flex items-center space-x-3 flex-1">
                      <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center text-gray-300 font-semibold">
                        {player.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-100">
                          {player.name}
                        </p>
                      </div>
                    </div>
                  </label>
                )
              )}
            </div>
            {errors.playerId && (
              <p className="text-red-400 text-sm mt-2">
                {errors.playerId.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Reason for Orange Card
            </label>
            <textarea
              {...register("reason")}
              rows={4}
              placeholder="Enter the reason for issuing the orange card..."
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            {errors.reason && (
              <p className="text-red-400 text-sm mt-2">
                {errors.reason.message}
              </p>
            )}
          </div>

          <div className="flex space-x-3">
            <button
              type="button"
              onClick={() => setActionMatch(null)}
              className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors flex items-center justify-center space-x-2"
            >
              <AlertTriangle className="w-4 h-4" />
              <span>Issue Orange Card</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default IssureOrangeCardModal;
