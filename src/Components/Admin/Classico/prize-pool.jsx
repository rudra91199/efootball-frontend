'use client';

export default function PrizePool({ prizes }) {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-foreground">Prize Pool</h2>

      <div className="bg-gradient-to-br from-accent/10 to-accent/5 border-2 border-accent/30 rounded-2xl p-8">
        <div className="text-center mb-8">
          <p className="text-muted-foreground text-lg mb-2">Total Prize Pool</p>
          <p className="text-5xl font-bold text-accent">${prizes.totalPool.toLocaleString()}</p>
        </div>

        {/* Prize Breakdown */}
        {prizes.placements.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Prize Distribution</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {prizes.placements.map((placement, idx) => (
                <div
                  key={placement._id}
                  className="bg-muted/20 border border-muted rounded-xl p-4 text-center hover:border-accent/50 transition-all"
                >
                  <p className="text-sm text-muted-foreground mb-2">{placement.position}</p>
                  <p className="text-3xl font-bold text-accent">${placement.amount.toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No Prize Pool Message */}
        {prizes.totalPool === 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground text-lg">Prize pool details to be announced</p>
          </div>
        )}
      </div>
    </div>
  );
}
