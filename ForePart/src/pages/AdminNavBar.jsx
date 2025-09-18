export default function AdminNavbar() {
  return (
    <header className="ml-64 bg-white shadow p-4 flex justify-between items-center">
      <h1 className="text-xl font-semibold">Karathi Greenscape Admin</h1>
      <button className="bg-red-600 text-white px-4 py-2 rounded">
        Logout
      </button>
    </header>
  );
}
