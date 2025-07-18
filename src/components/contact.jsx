import React from "react";

function Contact() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold mb-4 text-center text-gray-800">
          Contact Me
        </h1>
        <p className="mb-6 text-center text-gray-600">
          Please fill out the form below.
        </p>

        <form className="space-y-4">
          <div>
            <label htmlFor="name" className="block mb-1 font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className="w-full border border-gray-300 rounded px-3 py-2"
              placeholder="Your full name"
            />
          </div>

          <div>
            <label htmlFor="email" className="block mb-1 font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="w-full border border-gray-300 rounded px-3 py-2"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="message" className="block mb-1 font-medium text-gray-700">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              rows="4"
              className="w-full border border-gray-300 rounded px-3 py-2"
              placeholder="Write your message here..."
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition"
          >
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
}

export default Contact;
