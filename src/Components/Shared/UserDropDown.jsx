import { useNavigate } from "react-router";
import { useAuthStore } from "../../store/authStore";
import { MdAdminPanelSettings } from "react-icons/md";
import { Key } from "lucide-react";

const UserDropDown = ({ dropdownRef, isDropdownOpen, setIsDropdownOpen }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  return (
    <>
      {user ? (
        <div className=" relative w-[50%]" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="bg-pink-500 hover:bg-pink-600 text-white font-semibold px-3 sm:px-4 py-2 hidden sm:flex rounded-lg transition-colors duration-200 items-center space-x-2"
          >
            <div className="w-5 h-5 hidden  sm:w-6 sm:h-6 bg-white/20 rounded-full sm:flex items-center justify-center">
              <svg
                className="w-3 h-3 sm:w-4 sm:h-4"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </div>
            <svg
              className={`w-3 h-3 hidden sm:inline sm:w-4 sm:h-4 transition-transform duration-200 ${
                isDropdownOpen ? "rotate-180" : ""
              }`}
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M7 10l5 5 5-5z" />
            </svg>
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-[#000a44] border-1 border-[#001279] rounded-lg shadow-xl z-50">
              <div className="py-2">
                {user.role === "admin" && (
                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      navigate("/admin");
                    }}
                    className="w-full text-left px-4 py-2 text-gray-300 hover:bg-blue-700 hover:text-white transition-colors duration-200 flex items-center space-x-3 bg-transparent border-none cursor-pointer"
                  >
                    <MdAdminPanelSettings />

                    <span>Admin Panel</span>
                  </button>
                )}
                <button
                  onClick={() => {
                    setIsDropdownOpen(false);
                    navigate("/dashboard");
                  }}
                  className="w-full text-left px-4 py-2 text-gray-300 hover:bg-blue-700 hover:text-white transition-colors duration-200 flex items-center space-x-3 bg-transparent border-none cursor-pointer"
                >
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" />
                  </svg>
                  <span>Dashboard</span>
                </button>

                <button
                  onClick={() => {
                    setIsDropdownOpen(false);
                    navigate("/dashboard/profile");
                  }}
                  className="w-full text-left px-4 py-2 text-gray-300 hover:bg-blue-700 hover:text-white transition-colors duration-200 flex items-center space-x-3 bg-transparent border-none cursor-pointer"
                >
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                  <span>Profile</span>
                </button>

                <div className="border-t border-blue-700 my-1"></div>

                <button
                  onClick={() => {
                    setIsDropdownOpen(false);
                    logout();
                  }}
                  className="w-full text-left px-4 py-2 text-red-400 hover:bg-blue-700 hover:text-red-300 transition-colors duration-200 flex items-center space-x-3 bg-transparent border-none cursor-pointer"
                >
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.59L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" />
                  </svg>
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <button
          onClick={() => navigate("/login")}
          className="hidden sm:flex w-[50%] text-white bg-[#2f4fff] items-center gap-2 border-none px-3 sm:px-4 py-2 rounded-md cursor-pointer hover:bg-white/10 transition-colors text-sm sm:text-base"
        >
       <Key className="w-4 h-4" />
          <span className="hidden sm:inline text-sm">Sign In</span>
          <span className="sm:hidden">Login</span>
        </button>
      )}
    </>
  );
};

export default UserDropDown;
