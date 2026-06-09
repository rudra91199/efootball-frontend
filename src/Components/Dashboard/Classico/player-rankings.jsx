'use client';

export default function PlayerRankings({ players }) {
  const maxWins = Math.max(...players.map((p) => p.wins || 0));

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-foreground">Player Rankings</h2>

      <div className="bg-muted/20 border border-muted rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 bg-muted/40 border-b border-muted font-semibold text-muted-foreground">
          <div className="col-span-1">Rank</div>
          <div className="col-span-1">Team</div>
          <div className="col-span-4">Player</div>
          <div className="col-span-2">In-Game</div>
          <div className="col-span-2">Wins</div>
          <div className="col-span-2">Performance</div>
        </div>

        {/* Player Rows */}
        <div className="divide-y divide-muted">
          {players.map((player, idx) => (
            <div
              key={`${player.playerData?._id}-${idx}`}
              className="p-4 md:p-6 hover:bg-muted/10 transition-colors"
            >
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-4 items-center">
                {/* Rank - Mobile Badge */}
                <div className="md:col-span-1">
                  <div className="flex items-center gap-2 md:block">
                    <span className="md:hidden text-xs font-semibold text-muted-foreground">Rank:</span>
                    <span
                      className={`inline-flex items-center justify-center w-10 h-10 rounded-full font-bold text-lg ${
                        idx === 0
                          ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                          : idx === 1
                            ? 'bg-gray-400/20 text-gray-300 border border-gray-500/30'
                            : idx === 2
                              ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                              : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      #{player.rank}
                    </span>
                  </div>
                </div>

                {/* Team */}
                <div className="md:col-span-1">
                  <span className="md:hidden text-xs font-semibold text-muted-foreground">Team: </span>
                  <span className="font-semibold text-accent">{player.team}</span>
                </div>

                {/* Player - Image + Name */}
                <div className="md:col-span-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={player.playerData?.image.url || "/placeholder.svg"}
                      alt={player.playerData?.name}
                      className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover border border-muted"
                    />
                    <div className="min-w-0">
                      <p className="font-semibold text-foreground truncate">{player.playerData?.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{player.playerData?.inGameUserName}</p>
                    </div>
                  </div>
                </div>

                {/* In-Game Username */}
                <div className="md:col-span-2">
                  <span className="md:hidden text-xs font-semibold text-muted-foreground">In-Game: </span>
                  <span className="text-sm text-muted-foreground">{player.playerData?.inGameUserName}</span>
                </div>

                {/* Wins */}
                <div className="md:col-span-2">
                  <div className="flex items-center gap-3">
                    <span className="md:hidden text-xs font-semibold text-muted-foreground">Wins:</span>
                    <span className="text-xl md:text-2xl font-bold text-accent">{player.wins}</span>
                  </div>
                </div>

                {/* Performance Bar */}
                <div className="md:col-span-2">
                  <div className="space-y-1">
                    <div className="w-full bg-muted/40 rounded-full h-2 border border-muted/30 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-accent to-accent/60 h-full transition-all duration-300"
                        style={{
                          width: `${maxWins > 0 ? (player.wins / maxWins) * 100 : 0}%`
                        }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground text-right">
                      {maxWins > 0 ? ((player.wins / maxWins) * 100).toFixed(0) : 0}%
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
