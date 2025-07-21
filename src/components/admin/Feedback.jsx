import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../contexts/Authcontext";
import { toast } from "react-toastify";

export default function Feedback() {
  const { user } = useAuth();
  const [userReviews, setUserReviews] = useState([]);

  useEffect(() => {
    if (user?.role !== "admin") {
      toast.error("Access Denied");
      return;
    }

    const fetchUserReviews = async () => {
      try {
        const res = await axios.get("http://localhost:3001/users"); // updated port
        const reviewsList = res.data
          .filter((u) => u.reviews && u.reviews.length > 0)
          .map((u) =>
            u.reviews.map((msg) => ({
              name: u.name,
              message: msg,
            }))
          )
          .flat();

        setUserReviews(reviewsList);
      } catch (error) {
        console.error("Failed to load reviews", error);
        toast.error("Failed to load reviews");
      }
    };

    fetchUserReviews();
  }, [user]);

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <h2 className="text-3xl font-bold mb-6">User Reviews</h2>

      {userReviews.length === 0 ? (
        <p className="text-gray-500">No reviews found.</p>
      ) : (
        <div className="space-y-4">
          {userReviews.map((review, idx) => (
            <div
              key={idx}
              className="bg-white shadow-md rounded p-4 border border-gray-200"
            >
              <p className="font-semibold text-gray-800">{review.name}</p>
              <p className="text-gray-700 mt-1">{review.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
