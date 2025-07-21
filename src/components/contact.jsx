import React, { useContext, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { AuthContext } from "./contexts/Authcontext";

function Contact() {
  const { user } = useContext(AuthContext); // logged-in user
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!user){
      toast.error("Please login to send a message");
    }
    if (!message.trim()) {
      return toast.error("Message cannot be empty!");
    }

    try {
      // get current user data
      const res = await axios.get(`http://localhost:3001/users/${user.id}`);
      const currentReviews = res.data.reviews || [];

      // add new message
      const updatedReviews = [...currentReviews, message];

      // patch new review
      await axios.patch(`http://localhost:3001/users/${user.id}`, {
        reviews: updatedReviews,
      });

      toast.success("Thanks for contacting us!");
      setMessage(""); // clear message input
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold mb-4 text-center text-gray-800">Contact Me</h1>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="message" className="block mb-1 font-medium text-gray-700">
              Share Your Feedback
            </label>
            <textarea
              id="message"
              name="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows="4"
              className="w-full border border-gray-300 rounded px-3 py-2"
              placeholder="Write your message here..."
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gray-600 text-white py-2 rounded font-semibold hover:bg-black transition"
          >
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
}

export default Contact;
