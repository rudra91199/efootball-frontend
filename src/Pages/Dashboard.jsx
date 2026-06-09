"use client";

import { useState } from "react";
import Sidebar from "../Components/Dashboard/Sidebar";
import { Outlet } from "react-router";

export default function Dashboard() {
  const [activeSection, setActiveSection] = useState("overview");

  return (
    <div className="min-h-screen bg-black flex lg:pt-10 pb-24">
      <Sidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
       
      />
      <main className="flex-1 md:p-6 md:ml-64 w-full">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>

 
    </div>
  );
}
