const DashboardSquadSubmitted = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold">Submitted Squad</h3>
        <div className="flex items-center gap-2">
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              submittedSquad.status === "Confirmed"
                ? "bg-green-500/20 text-green-400 border border-green-500/30"
                : "bg-orange-500/20 text-orange-400 border border-orange-500/30"
            }`}
          >
            {submittedSquad.status}
          </span>
          <span className="text-sm text-muted-foreground">
            Submitted: {submittedSquad.submittedAt}
          </span>
        </div>
      </div>

      {tournament.squadSubmitted ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Star Player */}
          <div className="bg-card border border-border/20 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                <span className="text-xl">⭐</span>
              </div>
              <div>
                <h4 className="font-bold text-lg">Star Player</h4>
                <p className="text-sm text-muted-foreground">
                  Primary performer
                </p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Name:</span>
                <span className="font-medium">
                  {submittedSquad.starPlayer.name}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Position:</span>
                <span className="font-medium">
                  {submittedSquad.starPlayer.position}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Rating:</span>
                <span className="font-bold text-primary">
                  {submittedSquad.starPlayer.rating}
                </span>
              </div>
            </div>
          </div>

          {/* First Day Player */}
          <div className="bg-card border border-border/20 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full flex items-center justify-center">
                <span className="text-xl">🌅</span>
              </div>
              <div>
                <h4 className="font-bold text-lg">First Day Player</h4>
                <p className="text-sm text-muted-foreground">
                  Early matches specialist
                </p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Name:</span>
                <span className="font-medium">
                  {submittedSquad.firstDayPlayer.name}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Position:</span>
                <span className="font-medium">
                  {submittedSquad.firstDayPlayer.position}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Rating:</span>
                <span className="font-bold text-primary">
                  {submittedSquad.firstDayPlayer.rating}
                </span>
              </div>
            </div>
          </div>

          {/* Late Night Player */}
          <div className="bg-card border border-border/20 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-full flex items-center justify-center">
                <span className="text-xl">🌙</span>
              </div>
              <div>
                <h4 className="font-bold text-lg">Late Night Player</h4>
                <p className="text-sm text-muted-foreground">
                  Night matches specialist
                </p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Name:</span>
                <span className="font-medium">
                  {submittedSquad.lateNightPlayer.name}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Position:</span>
                <span className="font-medium">
                  {submittedSquad.lateNightPlayer.position}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Rating:</span>
                <span className="font-bold text-primary">
                  {submittedSquad.lateNightPlayer.rating}
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-card border border-border/20 rounded-xl p-8 text-center">
          <div className="w-16 h-16 bg-muted/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl text-muted-foreground">👥</span>
          </div>
          <h4 className="text-lg font-bold mb-2">No Squad Submitted</h4>
          <p className="text-muted-foreground mb-4">
            You haven't submitted a squad for this tournament yet.
          </p>
          <button
            onClick={() => setActiveSection("squad")}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            Go to Squad Management
          </button>
        </div>
      )}

      {tournament.squadSubmitted && (
        <div className="bg-muted/10 border border-border/10 rounded-xl p-6">
          <h4 className="font-bold mb-4">Squad Summary</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Total Players:</span>
              <span className="font-medium ml-2">3</span>
            </div>
            <div>
              <span className="text-muted-foreground">Average Rating:</span>
              <span className="font-medium ml-2 text-primary">
                {Math.round(
                  (submittedSquad.starPlayer.rating +
                    submittedSquad.firstDayPlayer.rating +
                    submittedSquad.lateNightPlayer.rating) /
                    3
                )}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Submission Status:</span>
              <span className="font-medium ml-2 text-green-400">Complete</span>
            </div>
            <div>
              <span className="text-muted-foreground">Last Updated:</span>
              <span className="font-medium ml-2">
                {submittedSquad.submittedAt}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardSquadSubmitted;
