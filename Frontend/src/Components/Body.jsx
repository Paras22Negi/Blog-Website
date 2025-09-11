import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Body() {
  const [data, setData] = useState([]); // State to hold user and blog data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isLoggedIn = Boolean(localStorage.getItem("token"));
  const Navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/users`);
        // The API might return an object like { users: [...] } or just the array [...]
        // This check ensures we are always working with an array.
        const usersData = Array.isArray(response.data)
          ? response.data
          : response.data?.users;

        // Ensure we have an array before setting state
        setData(Array.isArray(usersData) ? usersData : []);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to fetch data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // This will flatten the data so we have one row per blog post.
  const flatData = data.flatMap((user) =>
    user.blog && user.blog.length > 0
      ? user.blog.map((blog) => ({
          userName: user.name,
          userEmail: user.email,
          blogTitle: blog.title,
          blogContent: blog.content,
          blogImage: blog.image,
          // Create a unique key for each row
          uniqueKey: blog._id || `${user._id}-${blog.Title}`,
        }))
      : []
  );
  console.log("Flattened Data:", flatData);

  const handleClick = async (blogId) => {
    try {
      isLoggedIn ? (
        Navigate("/Blog")
       ) : (
        Navigate("/login")
       )
    }catch(error){
      console.error("Error deleting blog:", error)
    }
  }

  if (loading) {
    return <div className="text-center p-8">Loading...</div>;
  }

  if (error) {
    return <div className="text-center p-8 text-red-500">{error}</div>;
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="shadow-md rounded-xl overflow-hidden border border-gray-200 bg-white">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              {["Name", "Email", "BlogTitle", "BlogContent", "BlogImage"].map(
                (head, index) => (
                  <th
                    key={index}
                    scope="col"
                    className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wide"
                  >
                    {head}
                  </th>
                )
              )}
              {/* <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">BlogHeading</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">BlogContent</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">BlogImage</th> */}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {flatData.length > 0 ? (
              flatData.map((item) => (
                <tr
                  key={item.uniqueKey}
                  className="hover:bg-yellow-800 transition-colors duration-200"
                >
                  <td
                    onClick={handleClick}
                    className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
                  >
                    {item.userName}
                  </td>
                  <td
                    onClick={handleClick}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                  >
                    {item.userEmail}
                  </td>
                  <td
                    onClick={handleClick}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                  >
                    {item.blogTitle}
                  </td>
                  <td
                    onClick={handleClick}
                    className="px-6 py-4 text-sm text-gray-500 max-w-sm truncate"
                  >
                    {item.blogContent}
                  </td>
                  <td className="px-6 py-4">
                    {item.blogImage ? (
                      <img
                        src={`${import.meta.env.VITE_BACKEND_URL}${
                          item.blogImage
                        }`}
                        alt="Blog"
                        className="w-20 h-20 object-cover rounded border"
                      />
                    ) : (
                      <span className="text-sm text-gray-400 italic">
                        No image
                      </span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="4"
                  className="px-6 py-4 text-center text-sm text-gray-500"
                >
                  No data found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Body;
