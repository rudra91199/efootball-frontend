import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import z from "zod";
import { API } from "../../../axios";

const playerCardSchema = z.object({
  cardType: z.enum(["Yellow", "Orange", "Red"], {
    required_error: "Please select a card type",
  }),
  reason: z
    .string()
    .min(5, "Reason must be at least 5 characters")
    .max(500, "Reason must not exceed 500 characters"),
});

const IssueCardModal = ({
  selectedPlayer,
  setIsCardModalOpen,
  setSelectedPlayer,
  tournament,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(playerCardSchema),
  });

  const handleCloseCardModal = () => {
    setIsCardModalOpen(false);
    setSelectedPlayer(null);
    reset();
  };

  const onSubmitCard = async (data) => {
    const cardData = {
      playerId: selectedPlayer?.player._id,
      cardType: data.cardType,
      reason: data.reason,
      tournamentId: tournament._id,
    };
    const response = await API.post("/users/issue-card", cardData, {
      headers: {
        authorization: `${localStorage.getItem("authToken")}`,
      },
    });
    // TODO: Implement card issuing logic
    if (response.data.success === true) {
      handleCloseCardModal();
      //   refetch();
      toast.success("Card issued successfully");
    }
  };

  return (
    <div>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-gray-900 border border-gray-800 rounded-lg max-w-md w-full p-6">
          <h3 className="text-xl font-bold text-gray-100 mb-4">Issue Card</h3>

          {/* Player Info */}
          <div className="flex items-center space-x-3 mb-6 p-4 bg-gray-800/50 rounded-lg">
            <img
              src={
                selectedPlayer.player.image.url ||
                "/placeholder.svg?height=48&width=48"
              }
              alt={selectedPlayer.player.name}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <h4 className="text-sm font-semibold text-gray-100">
                {selectedPlayer.player.name}
              </h4>
              <p className="text-xs text-gray-400">
                @{selectedPlayer.player.inGameUserName}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmitCard)} className="space-y-4">
            {/* Card Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Card Type *
              </label>
              <select
                {...register("cardType")}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select card type</option>
                <option value="Yellow">Yellow Card</option>
                <option value="Red">Red Card</option>
              </select>
              {errors?.cardType && (
                <p className="mt-1 text-sm text-red-400">
                  {errors?.cardType?.message}
                </p>
              )}
            </div>

            {/* Reason Input */}
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Reason *
              </label>
              <textarea
                {...register("reason")}
                rows={4}
                placeholder="Enter the reason for issuing this card..."
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
              {errors?.reason && (
                <p className="mt-1 text-sm text-red-400">
                  {errors?.reason?.message}
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={handleCloseCardModal}
                className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting && (
                  <LoaderCircle className="w-4 h-4 mr-2 inline-block animate-spin" />
                )}
                {isSubmitting ? "Please wait..." : "Issue Card"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default IssueCardModal;
