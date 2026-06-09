import { useNavigate } from "react-router";
import key from "../../assets/key.png";


const MobileButtons = ({ isMobileMenuOpen, setIsMobileMenuOpen, user }) => {
    const navigate = useNavigate();
  return (
    <div className="justify-self-end menu-buttons flex items-center gap-2">
      <button
        id="hamburger-button"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="md:hidden text-white p-2 hover:bg-white/10 rounded-lg transition-colors bg-transparent border-none cursor-pointer"
        aria-label="Toggle menu"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {isMobileMenuOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>

      {!user && (
        <button
          onClick={() => navigate("/login")}
          className="flex sm:hidden text-white bg-[#2f4fff]  items-center gap-2 border-none px-3 sm:px-4 py-2 rounded-md cursor-pointer hover:bg-white/10 transition-colors text-sm sm:text-base"
        >
          <img
            src={key || "/placeholder.svg"}
            alt="Key"
            className="w-4 h-4 sm:w-5 sm:h-5"
          />
        </button>
      )}
    </div>
  );
};

export default MobileButtons;
