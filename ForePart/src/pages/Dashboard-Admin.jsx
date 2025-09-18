import AdminSidebar from "./AdminSideBar";
import AdminNavbar from "./AdminNavBar";

export default function Dashboard() {
  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-1 ml-64">
        <AdminNavbar />
        <main className="p-6">
          <h2 className="text-2xl font-bold mb-4">Dashboard Overview</h2>
          <p>Welcome, Admin. Here’s an overview of the system.</p>
        </main>
      </div>
    </div>
  );
}