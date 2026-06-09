import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FaTimes, FaPlus, FaTrophy } from "react-icons/fa";
import { API } from "../../axios";

const tournamentSchema = z.object({
  name: z
    .string()
    .min(1, "Tournament name is required")
    .max(100, "Name too long"),
  type: z.enum([
    "Trifecta",
    "League",
    "Knockout",
    "League + Knockout Solo",
    "League + Knockout Team",
    "Champions Circuit",
    "The Massacre Trilogy",
    "EC UCL",
  ]),
  maxTeams: z.number().min(2, "Minimum 2 teams").max(64, "Maximum 64 teams"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(1000, "Description too long")
    .optional(),
  entryFee: z.number().min(0, "Entry fee must be positive"),
  registrationDeadline: z.string().min(1, "Registration deadline is required"),
  startDate: z.string().min(1, "Start date is required"),
  totalPool: z.number().min(0, "Total pool must be positive"),
  rules: z
    .array(
      z.object({
        text: z.string().min(1, "Rule cannot be empty"),
      }),
    )
    .min(1, "At least one rule is required"),
  placements: z
    .array(
      z.object({
        position: z.string().min(1, "Position is required"),
        amount: z.number().min(0, "Amount must be positive"),
      }),
    )
    .min(1, "At least one placement prize is required"),
  individualAwards: z.array(
    z.object({
      awardName: z.string().min(1, "Award name is required"),
      amount: z.number().min(0, "Amount must be positive"),
    }),
  ),
});

const CreateTournamentModal = ({ isOpen, onClose, refetch }) => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(tournamentSchema),
    defaultValues: {
      name: "",
      type: "Trifecta",
      description: "",
      maxTeams: 16,
      entryFee: 0,
      registrationDeadline: "",
      startDate: "",
      totalPool: 0,
      rules: [{ text: "" }],
      placements: [{ position: "1st Place", amount: 0 }],
      individualAwards: [],
    },
  });

  const {
    fields: ruleFields,
    append: appendRule,
    remove: removeRule,
  } = useFieldArray({
    control,
    name: "rules",
  });

  const {
    fields: placementFields,
    append: appendPlacement,
    remove: removePlacement,
  } = useFieldArray({
    control,
    name: "placements",
  });

  const {
    fields: awardFields,
    append: appendAward,
    remove: removeAward,
  } = useFieldArray({
    control,
    name: "individualAwards",
  });

  const handleFormSubmit = async (data) => {
    const newTournament = {
      name: data.name,
      type: data.type,
      description: data.description,
      status: "Upcoming",
      maxTeams: data.maxTeams,
      entryFee: data.entryFee,
      registrationDeadline: data.registrationDeadline,
      startDate: data.startDate,
      rules: data.rules.map((rule) => rule.text),
      prizes: {
        totalPool: data.totalPool,
        placements: data.placements,
        individualAwards: data.individualAwards,
      },
    };
    const response = await API.post("/tournaments/create", newTournament, {
      headers: {
        Authorization: localStorage.getItem("authToken"),
      },
    });

    if (response.data.success) {
      reset();
      refetch();
      onClose();
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 pt-20 p-4">
      <div className="bg-gray-900/90 backdrop-blur-sm border border-gray-700 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex flex-row items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-white text-2xl font-bold">
            Create New Tournament
          </h2>
          <button
            onClick={handleClose}
            className="border border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent p-2 rounded-md transition-colors"
          >
            <FaTimes />
          </button>
        </div>

        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="p-6 space-y-6"
        >
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Tournament Name
              </label>
              <input
                {...register("name")}
                type="text"
                className="w-full p-2 bg-gray-800/50 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter tournament name"
              />
              {errors.name && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Tournament Type
              </label>
              <select
                {...register("type")}
                className="w-full p-2 bg-gray-800/50 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Trifecta">Trifecta</option>
                <option value="League">League</option>
                <option value="Knockout">Knockout</option>
                <option value="League + Knockout Solo">
                  League + Knockout Solo
                </option>
                <option value="League + Knockout Team">
                  League + Knockout Team
                </option>
                <option value="Champions Circuit">Champions Circuit</option>
                <option value="The Massacre Trilogy">
                  The Massacre Trilogy
                </option>
                <option value="EC UCL">EC UCL</option>
              </select>
              {errors.type && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.type.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Max Teams
              </label>
              <input
                {...register("maxTeams", { valueAsNumber: true })}
                type="number"
                className="w-full p-2 bg-gray-800/50 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="4"
                max="64"
              />
              {errors.maxTeams && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.maxTeams.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Entry Fee ($)
              </label>
              <input
                {...register("entryFee", { valueAsNumber: true })}
                type="number"
                className="w-full p-2 bg-gray-800/50 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="0"
                step="0.01"
              />
              {errors.entryFee && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.entryFee.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Registration Deadline
              </label>
              <input
                {...register("registrationDeadline")}
                type="datetime-local"
                className="w-full p-2 bg-gray-800/50 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {errors.registrationDeadline && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.registrationDeadline.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Start Date
              </label>
              <input
                {...register("startDate")}
                type="datetime-local"
                className="w-full p-2 bg-gray-800/50 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {errors.startDate && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.startDate.message}
                </p>
              )}
            </div>
          </div>

          {/* Rules Section */}

          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Description
            </label>
            <textarea
              rows={4}
              {...register("description")}
              type="text"
              className="w-full p-2 bg-gray-800/50 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter Tournament Description"
            />
            {errors.description && (
              <p className="text-red-400 text-sm mt-1">
                {errors.description.message}
              </p>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="text-gray-300 text-sm font-medium">
                Tournament Rules
              </label>
              <button
                type="button"
                onClick={() => appendRule({ text: "" })}
                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md text-sm transition-colors flex items-center"
              >
                <FaPlus className="mr-1" /> Add Rule
              </button>
            </div>
            <div className="space-y-3">
              {ruleFields.map((field, index) => (
                <div key={field.id} className="flex items-center space-x-2">
                  <input
                    {...register(`rules.${index}.text`)}
                    type="text"
                    className="w-full p-2 bg-gray-800/50 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={`Rule ${index + 1}`}
                  />
                  {ruleFields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeRule(index)}
                      className="border border-red-500/50 text-red-400 hover:bg-red-500/10 p-2 rounded-md transition-colors"
                    >
                      <FaTimes />
                    </button>
                  )}
                </div>
              ))}
            </div>
            {errors.rules && (
              <p className="text-red-400 text-sm mt-1">
                {errors.rules.message}
              </p>
            )}
          </div>

          {/* Prize Structure */}
          <div>
            <div className="mb-4">
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Total Prize Pool ($)
              </label>
              <input
                {...register("totalPool", { valueAsNumber: true })}
                type="number"
                className="w-full p-2 bg-gray-800/50 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="0"
                step="0.01"
              />
              {errors.totalPool && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.totalPool.message}
                </p>
              )}
            </div>

            {/* Placement Prizes */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <label className="text-gray-300 text-sm font-medium">
                  Placement Prizes
                </label>
                <button
                  type="button"
                  onClick={() => appendPlacement({ position: "", amount: 0 })}
                  className="bg-yellow-600 hover:bg-yellow-700 text-black px-3 py-1 rounded-md text-sm transition-colors flex items-center"
                >
                  <FaPlus className="mr-1" /> Add Placement
                </button>
              </div>
              <div className="space-y-3">
                {placementFields.map((field, index) => (
                  <div key={field.id} className="grid grid-cols-2 gap-3">
                    <input
                      {...register(`placements.${index}.position`)}
                      type="text"
                      className="w-full p-2 bg-gray-800/50 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Position (e.g., 1st Place)"
                    />
                    <div className="flex items-center space-x-2">
                      <input
                        {...register(`placements.${index}.amount`, {
                          valueAsNumber: true,
                        })}
                        type="number"
                        className="w-full p-2 bg-gray-800/50 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Prize amount"
                        min="0"
                        step="0.01"
                      />
                      {placementFields.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removePlacement(index)}
                          className="border border-red-500/50 text-red-400 hover:bg-red-500/10 p-2 rounded-md transition-colors"
                        >
                          <FaTimes />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              {errors.placements && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.placements.message}
                </p>
              )}
            </div>

            {/* Individual Awards */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <label className="text-gray-300 text-sm font-medium">
                  Individual Awards
                </label>
                <button
                  type="button"
                  onClick={() => appendAward({ awardName: "", amount: 0 })}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded-md text-sm transition-colors flex items-center"
                >
                  <FaPlus className="mr-1" /> Add Award
                </button>
              </div>
              <div className="space-y-3">
                {awardFields.map((field, index) => (
                  <div key={field.id} className="grid grid-cols-2 gap-3">
                    <input
                      {...register(`individualAwards.${index}.awardName`)}
                      type="text"
                      className="w-full p-2 bg-gray-800/50 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Award name (e.g., MVP)"
                    />
                    <div className="flex items-center space-x-2">
                      <input
                        {...register(`individualAwards.${index}.amount`, {
                          valueAsNumber: true,
                        })}
                        type="number"
                        className="w-full p-2 bg-gray-800/50 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Award amount"
                        min="0"
                        step="0.01"
                      />
                      <button
                        type="button"
                        onClick={() => removeAward(index)}
                        className="border border-red-500/50 text-red-400 hover:bg-red-500/10 p-2 rounded-md transition-colors"
                      >
                        <FaTimes />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4 pt-6 border-t border-gray-700">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-yellow-600 hover:bg-yellow-700 disabled:opacity-50 text-black font-bold py-2 px-4 rounded-md transition-colors flex items-center justify-center"
            >
              <FaTrophy className="mr-2" />
              {isSubmitting ? "Creating..." : "Create Tournament"}
            </button>
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 border border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent py-2 px-4 rounded-md transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTournamentModal;
