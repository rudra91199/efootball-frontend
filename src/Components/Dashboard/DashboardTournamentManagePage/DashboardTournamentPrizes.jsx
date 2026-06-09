import { Award, Trophy } from "lucide-react";
import AuthLoader from "../../Loaders/AuthLoader";

const DashboardTournamentPrizes = ({ tournament, isLoading, prizes }) => {
  if (isLoading) {
    return <AuthLoader />;
  }
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-100 mb-2">
          Prize Distribution
        </h2>
        <p className="text-gray-400">Prize pool and awards for {tournament}</p>
      </div>

      {prizes ? (
        <div className="space-y-6">
          {/* Total Prize Pool */}
          <div className="bg-gradient-to-br from-yellow-500/20 to-orange-600/20 border border-yellow-500/30 rounded-lg p-8 text-center">
            <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
            <h3 className="text-gray-300 text-lg mb-2">Total Prize Pool</h3>
            <p className="text-5xl font-bold text-yellow-400">
              BDT {prizes?.totalPool?.toLocaleString()}
            </p>
          </div>

          {/* Placement Prizes */}
          {prizes?.placements && prizes?.placements?.length > 0 && (
            <div className="bg-black/70 border border-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-bold text-gray-100 mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-blue-400" />
                Placement Prizes
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {prizes?.placements?.map((placement, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border ${
                      index === 0
                        ? "bg-yellow-500/10 border-yellow-500/30"
                        : index === 1
                          ? "bg-gray-400/10 border-gray-400/30"
                          : index === 2
                            ? "bg-orange-600/10 border-orange-600/30"
                            : "bg-gray-900/50 border-gray-800"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className={`font-bold text-lg ${
                          index === 0
                            ? "text-yellow-400"
                            : index === 1
                              ? "text-gray-300"
                              : index === 2
                                ? "text-orange-400"
                                : "text-gray-400"
                        }`}
                      >
                        {placement.position}
                      </span>
                      {index === 0 && <span className="text-2xl">🥇</span>}
                      {index === 1 && <span className="text-2xl">🥈</span>}
                      {index === 2 && <span className="text-2xl">🥉</span>}
                    </div>
                    <p className="text-2xl font-bold text-green-400">
                      BDT {placement?.amount?.toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Individual Awards */}
          {prizes?.individualAwards && prizes?.individualAwards?.length > 0 && (
            <div className="bg-black/70 border border-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-bold text-gray-100 mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-purple-400" />
                Individual Awards
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {prizes?.individualAwards?.map((award, index) => (
                  <div
                    key={index}
                    className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-100 mb-1">
                          {award?.awardName}
                        </h4>
                        <p className="text-2xl font-bold text-purple-400">
                          BDT {award?.amount?.toLocaleString()}
                        </p>
                      </div>
                      <Award className="w-8 h-8 text-purple-400" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-black/70 border border-gray-800 rounded-lg p-12 text-center">
          <Trophy className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 text-lg">
            No prize information available
          </p>
          <p className="text-gray-500 text-sm mt-2">
            Prize details will be announced soon
          </p>
        </div>
      )}
    </div>
  );
};

export default DashboardTournamentPrizes;
