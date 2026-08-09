import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-600">
          LeadDesk Mini
        </h1>

        <Link to="/login">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
            Admin Login
          </button>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;