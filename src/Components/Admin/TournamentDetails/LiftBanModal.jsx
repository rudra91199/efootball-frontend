import { X } from "lucide-react";
import moment from "moment";

const LiftBanModal = ({ setLiftBanModal, liftBanModal, handleLiftBan }) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-100">
            Lift Player Ban
          </h3>
          <button
            onClick={() =>
              setLiftBanModal({
                isOpen: false,
                player: null,
                endDate: null,
                playerId: null,
              })
            }
            className="text-gray-400 hover:text-gray-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
            <p className="text-gray-300 mb-2">
              Are you sure you want to lift the ban for:
            </p>
            <p className="text-xl font-bold text-yellow-400">
              {liftBanModal.player}
            </p>
          </div>

          <p className="text-sm text-gray-400">
            This action will immediately remove the player's ban and allow them
            to participate in upcoming matches.
          </p>

          {moment(liftBanModal.endDate).isAfter(moment()) && (
            <p className="text-sm text-red-500">
              Note: The selected lift date is in the future. You can only lift
              the ban on or after this date.
            </p>
          )}
        </div>

        <div className="flex space-x-3 mt-6">
          <button
            onClick={() =>
              setLiftBanModal({
                isOpen: false,
                player: null,
                endDate: null,
                playerId: null,
              })
            }
            className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() =>
              handleLiftBan(liftBanModal.playerId, liftBanModal.endDate)
            }
            disabled={moment(liftBanModal.endDate).isAfter(moment())}
            className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Lift Ban
          </button>
        </div>
      </div>
    </div>
  );
};

export default LiftBanModal;
