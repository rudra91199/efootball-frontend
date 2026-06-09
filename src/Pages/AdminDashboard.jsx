import AdminSidebar from "../Components/Admin/admin-sidebar.jsx";
import { Outlet } from "react-router";

export default function AdminDashboard() {
  return (
    <div className="min-h-screen w-full bg-black overflow-auto">
      <div className="flex">
        <AdminSidebar />

        <div className="w-full sm:p-8 sm:pt-5">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
