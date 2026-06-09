import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  RadioTower,
  Trash2,
  Send,
  Flame,
  AlertTriangle,
  Info,
  Link as LinkIcon,
  Loader2,
  ChevronDown,
} from "lucide-react";
import { API } from "../../axios"; // Adjust path if necessary

export default function AdminBroadcasts() {
  const queryClient = useQueryClient();

  // Form State
  const [message, setMessage] = useState("");
  const [type, setType] = useState("Info");
  const [link, setLink] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const authHeaders = {
    headers: { Authorization: localStorage.getItem("authToken") },
  };

  // 1. Fetch Current Broadcasts (Reusing the public endpoint, but we will filter it)
  const { data: { data: { data: tickerItems } = {} } = {}, isLoading } =
    useQuery({
      queryKey: ["live-ticker"],
      queryFn: () => API.get("/broadcast-ticker/ticker-data", authHeaders),
    });

  // Filter out the automatic Match logs so we only see manual admin broadcasts
  const adminMessages =
    tickerItems?.filter((item) => item.type !== "CombatLog") || [];

  // 2. Create Broadcast Mutation
  const createMutation = useMutation({
    mutationFn: (newBroadcast) =>
      API.post("/broadcast-ticker", newBroadcast, authHeaders),
    onSuccess: () => {
      queryClient.invalidateQueries(["live-ticker"]); // Refresh list immediately
      setMessage("");
      setLink("");
      setType("Info");
    },
  });

  // 3. Delete Broadcast Mutation
  const deleteMutation = useMutation({
    mutationFn: (id) => API.delete(`/broadcast-ticker/${id}`, authHeaders),
    onSuccess: () => {
      queryClient.invalidateQueries(["live-ticker"]);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    createMutation.mutate({ message, type, link });
  };

  const getIconForType = (broadcastType) => {
    switch (broadcastType) {
      case "Warning":
        return <AlertTriangle className="w-4 h-4 text-[#e11d48]" />;
      case "Hype":
        return <Flame className="w-4 h-4 text-[#eab308]" />;
      case "Promo":
        return <RadioTower className="w-4 h-4 text-[#ec4899]" />;
      default:
        return <Info className="w-4 h-4 text-[#14b8a6]" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-8 animate-fade-in text-white font-sans">
      {/* Header */}
      <div className="flex items-center gap-4 bg-[#0a0a0c] border border-white/10 p-5 rounded-2xl shadow-xl">
        <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl relative">
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full animate-ping" />
          <RadioTower className="w-6 h-6 text-red-500" />
        </div>
        <div>
          <h1 className="text-2xl font-black uppercase tracking-widest italic">
            Live Broadcast Hub
          </h1>
          <p className="text-gray-400 text-xs sm:text-sm tracking-wide mt-1">
            Inject global announcements directly into the homepage ticker.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT COLUMN: The Form */}
        <div className="bg-[#030305] border border-white/10 p-5 rounded-2xl shadow-xl h-fit">
          <h2 className="text-sm font-black uppercase tracking-widest text-gray-500 mb-5 border-b border-white/5 pb-2">
            New Transmission
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Message Input */}
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5">
                Broadcast Message
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="E.g., Registration for Season 4 closes tonight!"
                className="w-full bg-[#0a0a0c] border border-white/10 rounded-xl p-3 text-sm focus:outline-none focus:border-[#e11d48] transition-colors resize-none h-24 text-white"
                required
              />
            </div>

            {/* Type & Link Row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                {/* Type Selection (Custom Dropdown) */}
                <div className="relative">
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5">
                    Message Type
                  </label>

                  {/* Selected Value Button */}
                  <button
                    type="button"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className={`flex items-center justify-between w-full bg-[#0a0a0c] border rounded-xl p-3 text-sm transition-colors text-white ${isDropdownOpen ? "border-[#e11d48]" : "border-white/10 hover:border-white/30"}`}
                  >
                    <div className="flex items-center gap-2 font-bold">
                      {type === "Info" && (
                        <>
                          <Info className="w-4 h-4 text-[#14b8a6]" /> Info
                        </>
                      )}
                      {type === "Hype" && (
                        <>
                          <Flame className="w-4 h-4 text-[#eab308]" /> Hype
                        </>
                      )}
                      {type === "Warning" && (
                        <>
                          <AlertTriangle className="w-4 h-4 text-[#e11d48]" />{" "}
                          Warning
                        </>
                      )}
                      {type === "Promo" && (
                        <>
                          <RadioTower className="w-4 h-4 text-[#ec4899]" />{" "}
                          Promo
                        </>
                      )}
                    </div>
                    <ChevronDown
                      className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  {/* Dropdown Options List */}
                  {isDropdownOpen && (
                    <div className="absolute z-50 w-full mt-2 bg-[#030305] border border-white/10 rounded-xl overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.8)]">
                      {[
                        {
                          value: "Info",
                          icon: Info,
                          color: "text-[#14b8a6]",
                          bgHover: "hover:bg-[#14b8a6]/10",
                        },
                        {
                          value: "Hype",
                          icon: Flame,
                          color: "text-[#eab308]",
                          bgHover: "hover:bg-[#eab308]/10",
                        },
                        {
                          value: "Warning",
                          icon: AlertTriangle,
                          color: "text-[#e11d48]",
                          bgHover: "hover:bg-[#e11d48]/10",
                        },
                        {
                          value: "Promo",
                          icon: RadioTower,
                          color: "text-[#ec4899]",
                          bgHover: "hover:bg-[#ec4899]/10",
                        },
                      ].map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => {
                            setType(opt.value);
                            setIsDropdownOpen(false);
                          }}
                          className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-gray-300 transition-colors ${opt.bgHover} ${type === opt.value ? "bg-white/5" : ""}`}
                        >
                          <opt.icon className={`w-4 h-4 ${opt.color}`} />
                          {opt.value}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5 flex items-center gap-1">
                  <LinkIcon className="w-3 h-3" /> Link (Optional)
                </label>
                <input
                  type="url"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  placeholder="https://..."
                  className="w-full bg-[#0a0a0c] border border-white/10 rounded-xl p-3 text-sm focus:outline-none focus:border-[#e11d48] transition-colors text-white"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={createMutation.isPending || !message.trim()}
              className="w-full mt-2 flex items-center justify-center gap-2 bg-[#e11d48] hover:bg-[#be123c] text-white font-black uppercase tracking-widest text-xs py-3.5 rounded-xl transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {createMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              Transmit Message
            </button>
          </form>
        </div>

        {/* RIGHT COLUMN: Active Broadcasts */}
        <div className="bg-[#030305] border border-white/10 p-5 rounded-2xl shadow-xl">
          <div className="flex items-center justify-between border-b border-white/5 pb-2 mb-4">
            <h2 className="text-sm font-black uppercase tracking-widest text-gray-500">
              Active Transmissions
            </h2>
            <span className="bg-white/10 text-white text-[10px] font-black px-2 py-0.5 rounded-md">
              {adminMessages.length} Active
            </span>
          </div>

          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {isLoading ? (
              <div className="flex justify-center py-10">
                <Loader2 className="w-6 h-6 text-[#e11d48] animate-spin" />
              </div>
            ) : adminMessages.length === 0 ? (
              <div className="text-center py-10 bg-black/50 border border-white/5 rounded-xl">
                <RadioTower className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                <p className="text-gray-500 text-xs uppercase tracking-widest font-black">
                  No active broadcasts
                </p>
              </div>
            ) : (
              adminMessages.map((msg) => (
                <div
                  key={msg.id}
                  className="group relative bg-[#0a0a0c] border border-white/5 hover:border-white/20 p-3.5 rounded-xl transition-all flex items-start justify-between gap-3 overflow-hidden"
                >
                  {/* Subtle background color based on type */}
                  <div
                    className={`absolute left-0 top-0 w-1 h-full ${msg.type === "Warning" ? "bg-[#e11d48]" : msg.type === "Hype" ? "bg-[#eab308]" : msg.type === "Promo" ? "bg-[#ec4899]" : "bg-[#14b8a6]"}`}
                  />

                  <div className="flex items-start gap-3 pl-2">
                    <div className="mt-0.5">{getIconForType(msg.type)}</div>
                    <div>
                      <p className="text-sm font-bold text-gray-200">
                        {msg.text}
                      </p>
                      {msg.link && (
                        <a
                          href={msg.link}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[10px] text-[#14b8a6] hover:underline uppercase font-bold tracking-wider mt-1 flex items-center gap-1"
                        >
                          <LinkIcon className="w-3 h-3" /> Attached Link
                        </a>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => deleteMutation.mutate(msg.id)}
                    disabled={
                      deleteMutation.isPending &&
                      deleteMutation.variables === msg.id
                    }
                    className="p-2 text-red-500 bg-red-500/10 hover:bg-red-500 hover:text-white rounded-lg transition-all active:scale-95 shrink-0  group-hover:opacity-100 disabled:opacity-50"
                    title="Terminate Broadcast"
                  >
                    {deleteMutation.isPending &&
                    deleteMutation.variables === msg.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4 " />
                    )}
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
