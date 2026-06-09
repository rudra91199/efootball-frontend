import { useState } from "react";
// Import your API utility (adjust the path as needed)
import { API } from "../../../axios";

// --- CHANGED THIS SECTION ---
// Use react-toastify instead of react-hot-toast
import { toast } from "react-toastify";
// Make sure to import the CSS for react-toastify
// This is often done in App.jsx or index.jsx, but can be here too.
import "react-toastify/dist/ReactToastify.css";
// --- END OF CHANGE ---

const TeamVsSlideManage = () => {
  // We still use state for loading, but not for form fields
  const [isLoading, setIsLoading] = useState(false);

  // Handle the form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Stop the page from reloading
    setIsLoading(true);

    // Get the form element from the event
    const formElement = e.target;

    // 1. Create FormData from the form
    const formDataObj = new FormData(formElement);

    // 2. Convert FormData to a plain JavaScript object
    const formData = Object.fromEntries(formDataObj.entries());

    // 3. Manually convert displayOrder to a number if it exists
    if (formData.displayOrder) {
      formData.displayOrder = Number(formData.displayOrder);
    } else {
      formData.displayOrder = 0;
    }

    try {
      await API.post(
        "/slider-match/create",
        formData, // Send the object
        {
          headers: {
            Authorization: localStorage.getItem("authToken"),
          },
        }
      );

      // Handle success (this syntax works perfectly with react-toastify)
      toast.success("Slider created successfully!");
      formElement.reset(); // Reset the form fields
    } catch (error) {
      // Handle error (this syntax works perfectly with react-toastify)
      console.error("Failed to create slider:", error);
      const message = error.response?.data?.message || "An error occurred.";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="motmManage text-white">
      <div className="sm:p-8">
        <h2 className="text-2xl font-bold mb-6">Customize Slide</h2>

        <div className="bg-gradient-to-br from-[#041a9659] to-black p-10">
          {/* Add the onSubmit handler to the form tag */}
          <form
            onSubmit={handleSubmit}
            className="space-y-4 w-full grid grid-cols-2 gap-4"
          >
            {/* Motm Player Name -> playerName */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                Team 1 Name
              </label>
              <input
                type="text"
                name="teamName" // <-- 'name' must match schema
                className="w-full bg-white/20 border border-white/20 rounded px-4 py-2 text-white"
                required
              />
            </div>

            {/* Motm Player Image -> motmImageUrl */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                Team 1 Banner (URL)
              </label>
              <input
                type="text"
                name="team1BannerUrl" // <-- 'name' must match schema
                className="w-full bg-white/20 border border-white/20 rounded px-4 py-2 text-white"
                required
              />
            </div>

            {/* Motm Player Team Logo -> team1LogoUrl */}
            <div>
              <label className="block text-sm font-semibold mb-2">
               Team 2 Name
              </label>
              <input
                type="text"
                name=" opponentTeamName" // <-- 'name' must match schema
                className="w-full bg-white/20 border border-white/20 rounded px-4 py-2 text-white"
                required
              />
            </div>

            {/* Opponent Player Team Logo -> team2LogoUrl */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                                Team 2 Banner (URL)

              </label>
              <input
                type="text"
                name="team2BannerUrl" // <-- 'name' must match schema
                className="w-full bg-white/20 border border-white/20 rounded px-4 py-2 text-white"
                required
              />
            </div>

         
            {/* --- SUBMIT BUTTON --- */}
            <div className="col-span-2 w-full">
              <button
                type="submit"
                disabled={isLoading}
                className="bg-gradient-to-bl from-[#69fd00] to-[#fefb04] w-full text-[#041996] font-bold py-3 px-6 rounded focus:outline-none focus:shadow-outline disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Creating..." : "Create Slide"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TeamVsSlideManage;
