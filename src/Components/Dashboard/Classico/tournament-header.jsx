
export default function TournamentHeader({ tournament }) {
  const getStatusStyles = (status) => {
    if (status === "Live") {
      return "bg-accent/20 text-accent border-accent/30";
    }
    return "bg-muted text-muted-foreground border-muted";
  };

  return (
    <div className="">
      {/* Main Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground">
            {tournament.name}
          </h1>
        </div>

      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-muted/30 border border-muted rounded-lg p-4">
          <p className="text-sm text-muted-foreground mb-1">Tournament Type</p>
          <p className="text-xl font-semibold text-foreground">
            {tournament.type}
          </p>
        </div>
        <div className="bg-muted/30 border border-muted rounded-lg p-4">
          <p className="text-sm text-muted-foreground mb-1">Teams</p>
          <p className="text-xl font-semibold text-foreground">
            {tournament.teams.length}/{tournament.maxTeams}
          </p>
        </div>
        <div className="bg-muted/30 border border-muted rounded-lg p-4">
          <p className="text-sm text-muted-foreground mb-1">Total Players</p>
          <p className="text-xl font-semibold text-foreground">
            {tournament.teams.reduce(
              (sum, team) => sum + team.players.length,
              0,
            )}
          </p>
        </div>
        <div className="bg-muted/30 border border-muted rounded-lg p-4">
          <p className="text-sm text-muted-foreground mb-1">Prize Pool</p>
          <p className="text-xl font-semibold text-foreground">
            ${tournament.prizes.totalPool.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}
