export default function LeagueMyMatches({ leagueFixture, currentUserTeam }) {
  const getMyMatches = () => {
    return (
      leagueFixture?.filter(
        (match) =>
          match.team1._id === currentUserTeam ||
          match.team2._id === currentUserTeam
      ) || []
    );
  };

  const getStatusBadge = (status) => {
    const colors = {
      Completed: "bg-green-500/20 text-green-400 border-green-500/30",
      Live: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
      Scheduled: "bg-blue-500/20 text-blue-400 border-blue-500/30",
      Upcoming: "bg-gray-500/20 text-gray-400 border-gray-500/30",
      Pending: "bg-gray-600/20 text-gray-500 border-gray-600/30",
    };
    return colors[status] || "bg-gray-500/20 text-gray-400 border-gray-500/30";
  };

  const renderMatch = (match) => (
    <div key={match._id} className="p-4 bg-background/50 rounded-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1">
          <div className="flex items-center gap-2">
            <img
              src={match.team1.image.url || "/placeholder.svg"}
              // alt={match.team1.name}
              className="w-8 h-8 rounded object-cover"
            />
            <span
              className={`font-medium ${
                match.team1._id === currentUserTeam
                  ? "text-primary"
                  : "text-foreground"
              }`}
            >
              {match.team1.name}
            </span>
          </div>
          <div className="text-center min-w-[120px]">
            {match.status === "Completed" || match.status === "Live" ? (
              <span className="text-lg font-bold text-foreground">
                {match.homeScore} - {match.awayScore}
              </span>
            ) : (
              <span className="text-sm text-muted-foreground">vs</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <img
              src={match.team2.image.url || "/placeholder.svg"}
              alt={match.team2.name}
              className="w-8 h-8 rounded object-cover"
            />
            <span
              className={`font-medium ${
                match.team2._id === currentUserTeam
                  ? "text-primary"
                  : "text-foreground"
              }`}
            >
              {match.team2.name}
            </span>
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex px-2 py-1 rounded text-xs font-medium border ${getStatusBadge(
                match.status
              )}`}
            >
              {match.status}
            </span>
            {/* {match.published && (
              <span className="inline-flex px-2 py-1 rounded text-xs font-medium bg-green-500/20 text-green-400 border border-green-500/30">
                Published
              </span>
            )} */}
          </div>
          {/* <p className="text-sm text-muted-foreground mt-1">
            {match.date} • {match.time}
          </p> */}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="clean-card p-6 rounded-lg">
        <h2 className="text-xl font-bold text-foreground mb-6">My Matches</h2>
        <div className="space-y-4">
          {getMyMatches().length > 0 ? (
            getMyMatches().map((match) => renderMatch(match))
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                No matches found.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
