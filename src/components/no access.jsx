import { Link } from "react-router-dom";

export default function NoAccess() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-md text-center">
        <h1 className="text-3xl font-bold text-red-600 mb-4">Access Denied</h1>
        <p className="text-gray-700 text-lg mb-6">
          You do not have permission to view this page.
        </p>
        <Link
          to="/home"
          className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition duration-200 inline-block"
        >
          Go back to Home
        </Link>
      </div>
    </div>
  );
}
