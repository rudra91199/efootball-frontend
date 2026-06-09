import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { API } from "../../../axios";
import { LoaderCircle, UploadCloud, X, Shield, Crosshair } from "lucide-react";

const SUPPORTED_FORMATS = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/tiff",
  "image/x-icon",
  "application/pdf",
  "image/svg+xml",
];

const teamFormSchema = z.object({
  name: z
    .string()
    .min(1, "Squad designation is required")
    .min(2, "Designation must be at least 2 characters"),
  captain: z.string().min(1, "Squad Commander is required"),
  players: z.array(z.string()).min(1, "Please draft at least one operator"),
});

export function TeamModal({
  open,
  onOpenChange,
  players = [],
  tournament,
  refetchTournament,
}) {
  const fileInputRef = useRef(null);
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [logoError, setLogoError] = useState(null);
  const [creating, setCreating] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
    setValue,
  } = useForm({
    resolver: zodResolver(teamFormSchema),
    defaultValues: {
      name: "",
      captain: "",
      players: [],
    },
  });

  const selectedPlayers = watch("players");

  const handleLogoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!SUPPORTED_FORMATS.includes(file.type)) {
        setLogoError(
          "Invalid format. Accepted: JPG, PNG, GIF, WebP, SVG"
        );
        setLogoFile(null);
        setLogoPreview(null);
        return;
      }

      setLogoFile(file);
      setLogoError(null);

      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveLogo = () => {
    setLogoFile(null);
    setLogoPreview(null);
    setLogoError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handlePlayerToggle = (playerId) => {
    const updatedPlayers = selectedPlayers.includes(playerId)
      ? selectedPlayers.filter((id) => id !== playerId)
      : [...selectedPlayers, playerId];
    setValue("players", updatedPlayers);
  };

  const onSubmitForm = async (data) => {
    setCreating(true);
    try {
      const response = await API.post(
        "/massacre/register-team",
        {
          ...data,
          logo: logoPreview,
          tournament: tournament,
        },
        { headers: { Authorization: localStorage.getItem("authToken") } }
      );
      if (response.data.success) {
        reset();
        handleRemoveLogo();
        refetchTournament();
        onOpenChange(false);
      }
    } catch (error) {
      console.error("Error creating squad", error);
    } finally {
      setCreating(false);
    }
  };

  const selectedPlayerNames = selectedPlayers
    .map((id) => players.find((p) => p._id === id)?.name)
    .filter(Boolean);

  if (!open) return null;

  return (
    <>
      {/* Dark Blurred Backdrop */}
      <div
        className="fixed inset-0 bg-[#030305]/90 backdrop-blur-md z-40 animate-fade-in"
        onClick={() => onOpenChange(false)}
      />

      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-2xl px-4 animate-fade-in font-sans">
        {/* Premium Dark Modal Container */}
        <div className="bg-[#0a0b10] border border-white/10 rounded-[24px] shadow-[0_0_80px_rgba(225,29,72,0.15)] max-h-[90vh] flex flex-col overflow-hidden relative">
          
          {/* Ambient Glows */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#e11d48] to-[#ec4899]" />
          <div className="absolute -top-32 -right-32 w-64 h-64 bg-[radial-gradient(circle,rgba(236,72,153,0.15)_0%,transparent_70%)] pointer-events-none" />

          {/* Header */}
          <div className="px-6 sm:px-8 py-6 border-b border-white/5 flex items-start justify-between bg-[#030305]/50 relative z-10">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-widest flex items-center gap-2">
                <Shield className="w-5 h-5 text-[#e11d48]" />
                Deploy Squad
              </h2>
              <p className="text-[10px] sm:text-xs text-[#ec4899] font-bold uppercase tracking-[0.2em] mt-1.5">
                Massacre Operational Roster Selection
              </p>
            </div>
            <button
              onClick={() => onOpenChange(false)}
              className="p-2.5 rounded-xl bg-white/5 hover:bg-rose-500/20 text-gray-400 hover:text-rose-400 border border-transparent hover:border-rose-500/30 transition-all active:scale-95"
            >
              <X size={20} strokeWidth={2.5} />
            </button>
          </div>

          {/* Form Body (Scrollable) */}
          <div className="overflow-y-auto custom-scrollbar relative z-10 bg-[#0a0b10]/50 backdrop-blur-xl">
            <form onSubmit={handleSubmit(onSubmitForm)} className="p-6 sm:p-8 space-y-8">
              
              {/* Squad Name */}
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2.5">
                  Squad Designation <span className="text-[#e11d48]">*</span>
                </label>
                <input
                  type="text"
                  placeholder="E.G. CRIMSON VANGUARD"
                  {...register("name")}
                  className={`w-full px-4 py-3.5 bg-[#030305] border rounded-xl text-white placeholder-gray-600 focus:outline-none transition-all shadow-inner font-black tracking-wide text-sm uppercase ${
                    errors.name
                      ? "border-[#e11d48] focus:border-[#e11d48] focus:ring-1 focus:ring-[#e11d48]/50"
                      : "border-white/10 focus:border-[#ec4899] focus:ring-1 focus:ring-[#ec4899]/50"
                  }`}
                />
                {errors.name && (
                  <p className="text-[10px] font-black uppercase tracking-widest text-[#e11d48] mt-2">{errors.name.message}</p>
                )}
              </div>

              {/* Grid for Crest & Commander */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-6">
                {/* Logo Upload */}
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2.5">
                    Squad Crest / Emblem
                  </label>
                  <div className="flex flex-col gap-3">
                    <div
                      className={`border-2 border-dashed rounded-[16px] p-6 text-center cursor-pointer transition-all bg-[#030305] shadow-inner ${
                        logoError
                          ? "border-[#e11d48] bg-[#e11d48]/5"
                          : "border-white/10 hover:border-[#ec4899]/50 hover:bg-white/5"
                      }`}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      {logoPreview ? (
                        <img
                          src={logoPreview}
                          alt="Logo preview"
                          className="h-20 w-20 rounded-[12px] object-cover mx-auto border border-white/10 shadow-[0_0_20px_rgba(236,72,153,0.2)]"
                        />
                      ) : (
                        <div className="space-y-3 flex flex-col items-center">
                          <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-gray-500 mb-1 border border-white/5">
                            <UploadCloud size={20} />
                          </div>
                          <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">
                            Upload Matrix
                          </p>
                          <p className="text-[8px] text-gray-600 font-bold uppercase tracking-widest">
                            JPG, PNG, WEBP
                          </p>
                        </div>
                      )}
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      hidden
                      accept={SUPPORTED_FORMATS.join(",")}
                      onChange={handleLogoChange}
                    />
                    {logoError && (
                      <p className="text-[10px] font-black uppercase tracking-widest text-[#e11d48]">{logoError}</p>
                    )}
                    {logoPreview && (
                      <button
                        type="button"
                        onClick={handleRemoveLogo}
                        className="px-4 py-2 text-[9px] font-black uppercase tracking-widest text-[#e11d48] bg-[#e11d48]/10 border border-[#e11d48]/20 rounded-xl hover:bg-[#e11d48]/20 transition-colors w-full"
                      >
                        Purge Image
                      </button>
                    )}
                  </div>
                </div>

                {/* Captain Selection */}
                <div>
                  <label
                    htmlFor="captain"
                    className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2.5"
                  >
                    Squad Commander <span className="text-[#e11d48]">*</span>
                  </label>
                  <select
                    id="captain"
                    {...register("captain")}
                    className={`w-full px-4 py-3.5 bg-[#030305] border rounded-xl text-white focus:outline-none appearance-none transition-all shadow-inner font-bold text-sm tracking-wide cursor-pointer ${
                      errors.captain
                        ? "border-[#e11d48] focus:border-[#e11d48] focus:ring-1 focus:ring-[#e11d48]/50"
                        : "border-white/10 focus:border-[#ec4899] focus:ring-1 focus:ring-[#ec4899]/50"
                    }`}
                  >
                    <option value="" className="bg-[#0a0a0c] text-gray-600">Assign commander...</option>
                    {players?.map((player) => (
                      <option key={player._id} value={player._id} className="bg-[#0a0a0c] text-white">
                        {player.name}
                      </option>
                    ))}
                  </select>
                  {errors.captain && (
                    <p className="text-[10px] font-black uppercase tracking-widest text-[#e11d48] mt-2">{errors.captain.message}</p>
                  )}
                </div>
              </div>

              {/* Players Selection */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <Crosshair className="w-3.5 h-3.5 text-[#ec4899]" />
                    Draft Roster <span className="text-[#e11d48]">*</span>
                  </label>
                  <span className="text-[9px] text-[#ec4899] font-black tracking-widest uppercase bg-[#ec4899]/10 px-2.5 py-1 rounded-md border border-[#ec4899]/20">
                    {selectedPlayers.length} Operators Selected
                  </span>
                </div>
                
                <div className="border border-white/5 bg-[#030305] rounded-[16px] p-2 h-56 overflow-y-auto space-y-1 custom-scrollbar shadow-inner">
                  {players?.map((player) => {
                    const isSelected = selectedPlayers.includes(player._id);
                    return (
                      <div
                        key={player._id}
                        className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all border ${
                          isSelected ? "bg-[#ec4899]/10 border-[#ec4899]/30 shadow-[0_0_10px_rgba(236,72,153,0.1)]" : "bg-transparent border-transparent hover:bg-white/5"
                        }`}
                        onClick={() => handlePlayerToggle(player._id)}
                      >
                        <div className={`w-4 h-4 rounded-[4px] flex items-center justify-center border transition-colors ${
                          isSelected ? "bg-[#ec4899] border-[#ec4899]" : "bg-black/50 border-white/20"
                        }`}>
                           {isSelected && <X className="w-3 h-3 text-white rotate-45" />}
                        </div>
                        <label className={`cursor-pointer flex-1 text-xs font-black uppercase tracking-wider transition-colors ${isSelected ? "text-white" : "text-gray-400"}`}>
                          {player.name}
                        </label>
                      </div>
                    );
                  })}
                </div>
                {errors.players && (
                  <p className="text-[10px] font-black uppercase tracking-widest text-[#e11d48] mt-2">{errors.players.message}</p>
                )}

                {/* Selected Players Tags */}
                {selectedPlayerNames.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4 bg-[#030305] p-3 rounded-xl border border-white/5">
                    {selectedPlayerNames.map((name) => (
                      <span
                        key={name}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-white/5 text-gray-300 text-[9px] font-black uppercase tracking-widest rounded-lg border border-white/10"
                      >
                        {name}
                      </span>
                    ))}
                  </div>
                )}
              </div>

            </form>
          </div>

          {/* Footer Actions */}
          <div className="p-6 sm:px-8 sm:py-6 border-t border-white/5 bg-[#030305]/80 flex items-center justify-end gap-4 relative z-10">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="px-6 py-3.5 text-[10px] sm:text-xs font-black uppercase tracking-widest text-gray-400 bg-transparent hover:text-white transition-colors"
            >
              Abort
            </button>
            <button
              onClick={handleSubmit(onSubmitForm)}
              disabled={creating}
              className="flex items-center justify-center min-w-[160px] px-8 py-3.5 text-[10px] sm:text-xs font-black text-white uppercase tracking-widest bg-gradient-to-r from-[#e11d48] to-[#ec4899] rounded-xl hover:shadow-[0_0_20px_rgba(236,72,153,0.4)] hover:-translate-y-0.5 border border-white/20 transition-all duration-300 disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed disabled:transform-none"
            >
              {creating ? (
                <>
                  <LoaderCircle className="animate-spin mr-2" size={16} strokeWidth={3} />
                  Deploying...
                </>
              ) : (
                "Deploy Squad"
              )}
            </button>
          </div>

        </div>
      </div>
    </>
  );
}