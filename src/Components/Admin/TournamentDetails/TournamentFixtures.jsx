import { useState } from "react";
import MatchScoreEditor from "./MatchSchoreEditor";
import {
  Plus,
  Settings,
  X,
  Calendar,
  Clock,
  CircleCheckBig,
  LoaderCircle,
  AlertTriangle,
} from "lucide-react";
import { API } from "../../../axios";
import { useNavigate } from "react-router";

import MotmModal from "./MotmModal";
import { useQuery } from "@tanstack/react-query";
import IssureOrangeCardModal from "./IssureOrangeCardModal";
import { toast } from "react-toastify";
import LiftBanModal from "./LiftBanModal";
import Submatches from "./Submatches";
import { PublishMatchModal } from "./publishRoundModal";
import AuthLoader from "../../Loaders/AuthLoader";

export default function TournamentFixtures({
  phases,
  tournament,
  refetch,
  isLoading,
}) {
  const [editingMatch, setEditingMatch] = useState(null);

  const [publishingMatch, setPublishingMatch] = useState(null);
  const [roundStatus, setRoundStatus] = useState("");

  const [motmModal, setMotmModal] = useState({
    isOpen: false,
    match: null,
  });
  const [actionMatch, setActionMatch] = useState(null);
  const navigate = useNavigate();

  const [liftBanModal, setLiftBanModal] = useState({
    isOpen: false,
    player: null,
    endDate: null,
    playerId: null,
  });

  const handlePublishRound = (matchId) => {
    setPublishingMatch(matchId);
    setRoundStatus("Scheduled");
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Scheduled":
        return "bg-yellow-600 text-yellow-100";
      case "Completed":
        return "bg-green-600 text-green-100";
      default:
        return "bg-gray-600 text-gray-200";
    }
  };

  const { data: { data: { data: playerStatuses } = {} } = {} } = useQuery({
    queryKey: ["playerStatuses"],
    queryFn: () => {
      return API.get(`/tournaments/${tournament?._id}/playerStatuses`, {
        headers: {
          Authorization: localStorage.getItem("authToken"),
        },
      });
    },
    enabled: !!tournament?._id,
  });

  const handleOpenActionModal = (matchId) => {
    setActionMatch(matchId);
  };

  const onLiftBan = async (playerId, banLiftDate) => {
    if (new Date(banLiftDate) > new Date()) {
      toast.error("Ban lift date is in the future. Cannot lift ban now.");
      return;
    } else {
      const response = await API.patch(
        `/users/liftBan/${playerId}`,
        {},
        {
          headers: {
            authorization: localStorage.getItem("authToken"),
          },
        },
      );
      if (response.data.success) {
        refetch();
        toast.success("Ban lifted successfully");
        setLiftBanModal({
          isOpen: false,
          player: null,
          endDate: null,
          playerId: null,
        });
      }
    }
  };

  if (isLoading) {
    return <AuthLoader />;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-100">Fixtures & Results</h2>
      </div>

      <div className="space-y-4 ">
        {phases?.map((phase) => (
          <div className="bg-black/70 border border-gray-800 rounded-lg p-6 mb-8">
            <div className="flex items-center justify-between  mb-8">
              <h3 className="font-bold text-[#ff97cd] text-xl">
                Phase - {phase.phaseOrder} : {phase.phaseName}
              </h3>
              <span
                className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(
                  phase.status,
                )}`}
              >
                {phase?.status}
              </span>
            </div>
            {phase.matches?.map((match) => (
              <div
                key={match._id}
                className="bg-gray-900/50 border border-gray-800 rounded-lg p-6 mb-5"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-6">
                    {/* Team 1 */}
                    <div className="text-center">
                      <p className="text-lg font-semibold text-gray-100 flex gap-5 items-center">
                        {match?.team1?.name}

                        {match?.team1_squad && match?.status == "Scheduled" && (
                          <span className="bg-[#05a000] text-md p-1 text-[#fff] rounded-full">
                            <CircleCheckBig size={20} />
                          </span>
                        )}
                        {!match?.team1_squad &&
                          match?.status == "Scheduled" && (
                            <span className="bg-[#f20604] text-md p-1 text-[#fff] rounded-full">
                              <X size={20} />
                            </span>
                          )}
                      </p>
                      <p className="text-2xl font-bold text-blue-400 ">
                        {match.team1_score}
                      </p>

                      <button
                        onClick={() =>
                          navigate(
                            `/admin/tournaments/tournament/${tournament._id}/squad-submit/${match._id}`,
                            {
                              state: {
                                tournament: tournament,
                                captain: match.team1.captain,
                              },
                            },
                          )
                        }
                        className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors mt-5"
                      >
                        Submit Squad
                      </button>
                    </div>

                    {/* Team 2 */}
                    <div className="text-center">
                      <p className="text-gray-400">VS</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-semibold text-gray-100 flex gap-5 items-center">
                        {match.team2?.name}

                        {match?.team2_squad && match?.status == "Scheduled" && (
                          <span className="bg-[#05a000] text-md p-1 text-[#fff] rounded-full">
                            <CircleCheckBig size={20} />
                          </span>
                        )}
                        {!match?.team2_squad &&
                          match?.status == "Scheduled" && (
                            <span className="bg-[#f20604] text-md p-1 text-[#fff] rounded-full">
                              <X size={20} />
                            </span>
                          )}
                      </p>
                      <p className="text-2xl font-bold text-blue-400">
                        {match.team2_score}
                      </p>

                      <button
                        onClick={() =>
                          navigate(
                            `/admin/tournaments/tournament/${tournament._id}/squad-submit/${match._id}`,
                            {
                              state: {
                                tournament: tournament,
                                captain: match.team2.captain,
                              },
                            },
                          )
                        }
                        className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors mt-5"
                      >
                        Submit Squad
                      </button>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="flex justify-end items-center space-x-2 mb-2">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                          match?.status,
                        )}`}
                      >
                        {match?.status}
                      </span>

                      {match?.status === "Unpublished" && (
                        <button
                          onClick={() => handlePublishRound(match._id)}
                          className="flex items-center space-x-1 px-2 py-1 bg-purple-600 hover:bg-purple-700 text-white text-xs rounded transition-colors"
                        >
                          <Settings className="w-3 h-3" />
                          <span>Publish</span>
                        </button>
                      )}
                      <button
                        onClick={() => handleOpenActionModal(match._id)}
                        className="flex items-center space-x-1 px-2 py-1 bg-orange-600 hover:bg-orange-700 text-white text-xs rounded transition-colors"
                      >
                        <AlertTriangle className="w-3 h-3" />
                        <span>Action</span>
                      </button>
                    </div>

                    <p className="text-gray-300 mt-2">
                      {match?.phase?.phaseName}
                    </p>
                    {/* <p className="text-gray-400 text-sm">
                  {new Date(match.scheduledDate).toLocaleString()}
                </p> */}
                    <p className="text-gray-400 text-sm">{match?.round}</p>
                    {match?.status === "Scheduled" && (
                      <button
                        onClick={() => setEditingMatch(match._id)}
                        className="mt-2 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors"
                      >
                        Enter Scores
                      </button>
                    )}
                    {!match?.manOfTheMatch && match?.status === "Completed" && (
                      <button
                        onClick={() =>
                          setMotmModal(() => ({
                            match: match._id,
                            isOpen: true,
                          }))
                        }
                        className="mt-2 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors"
                      >
                        Set MOTM
                      </button>
                    )}
                    {match?.manOfTheMatch && match?.status === "Completed" && (
                      <p className="text-green-400 text-sm mt-2">
                        MOTM: {match?.manOfTheMatch?.name}
                      </p>
                    )}
                  </div>
                </div>

                {match.details?.subMatches &&
                  match.details.subMatches.length > 0 && (
                    <div className="mt-4 border-t border-gray-700 pt-4">
                      <h4 className="text-sm font-medium text-gray-300 mb-3">
                        Individual Matches
                      </h4>

                      {editingMatch === match._id ? (
                        <MatchScoreEditor
                          match={match}
                          onCancel={() => setEditingMatch(null)}
                          refetch={refetch}
                          phase={phase}
                        />
                      ) : (
                        <Submatches
                          playerStatuses={playerStatuses}
                          match={match}
                          setLiftBanModal={setLiftBanModal}
                        />
                      )}
                    </div>
                  )}
              </div>
            ))}
          </div>
        ))}
      </div>

      {publishingMatch && (
        <PublishMatchModal
          setPublishingMatch={setPublishingMatch}
          publishingMatch={publishingMatch}
          refetch={refetch}
          roundStatus={roundStatus}
          setRoundStatus={setRoundStatus}
        />
      )}
      {motmModal.isOpen && (
        <MotmModal match={motmModal.match} setMotmModal={setMotmModal} />
      )}
      {actionMatch && (
        <IssureOrangeCardModal
          matches={phases.flatMap((phase) => phase.matches)}
          actionMatch={actionMatch}
          setActionMatch={setActionMatch}
          tournamentId={tournament._id}
          refetch={refetch}
        />
      )}
      {liftBanModal.isOpen && (
        <LiftBanModal
          liftBanModal={liftBanModal}
          setLiftBanModal={setLiftBanModal}
          handleLiftBan={onLiftBan}
        />
      )}
    </div>
  );
}
