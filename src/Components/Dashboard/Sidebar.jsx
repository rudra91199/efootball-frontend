import { useState, useEffect } from "react";
import { GiDiamondTrophy } from "react-icons/gi";
import { PiBookOpenUserFill } from "react-icons/pi";
import { ImProfile } from "react-icons/im";
import { NavLink, useLocation } from "react-router";

const menuItems = [
  { id: "", label: "Career", icon: <PiBookOpenUserFill /> },
  { id: "my-tournaments", label: "Tournaments", icon: <GiDiamondTrophy /> },
  { id: "profile", label: "Profile", icon: <ImProfile /> },
];

export default function Sidebar({
  activeSection,
  setActiveSection,
 
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const pathname = useLocation().pathname;

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <>
    

      <div
        className={`hidden sm:block fixed left-0 top-0 h-full bg-gradient-to-br from-[#262e5c] to-black backdrop-blur-3xl  border-white/10 border-r transition-all duration-300 ease-in-out pt-20 z-40 w-[70%] sm:w-[15%]
        md:translate-x-0`}
      >
        <div className="p-4">
          <div className="flex items-center justify-between mb-8">
            <h1
              className={`font-bold text-lg md:text-xl text-foreground transition-all duration-300`}
            >
              Player Dashboard
            </h1>
          </div>

          <nav className="space-y-2">
            {menuItems.map((item, index) => (
              <NavLink
                to={item.id}
                key={item.id}
                onClick={() => {
                  setActiveSection(item.id);
                }}
                className={({ isActive }) =>
                  `w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200 animate-fade-in-up ${
                    (isActive && pathname === "/dashboard") ||
                    (isActive && pathname === `/dashboard/${item.id}`)
                      ? "bg-primary text-primary-foreground"
                      : "text-sidebar-foreground hover:bg-secondary hover:text-secondary-foreground"
                  }`
                }
                style={{
                  "--stagger-delay": index,
                  animationDelay: `${index * 0.1}s`,
                }}
              >
                <span className="text-lg">{item.icon}</span>
                <span className={`font-medium transition-all duration-300`}>
                  {item.label}
                </span>
              </NavLink>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
}
