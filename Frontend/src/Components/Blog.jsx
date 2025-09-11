import React, { useState, useEffect } from "react";
import axios from "axios";
import { MdEdit } from "react-icons/md";
import { MdDeleteForever } from "react-icons/md";
import { MdViewHeadline } from "react-icons/md";

function Blog() {
  const [isOpen, setIsOpen] = useState(false);
  const [userId, setUserId] = useState("");
  const [token, setToken] = useState(null);

  const [blogs, setBlogs] = useState([]); // Renamed for clarity
  const [view, setView] = useState(false);
  const [image, setImage] = useState(null);
  const [formdata, setFromdata] = useState({
    title: "",
    content: "",
  });
  console.log(formdata);

  const [editId, setEditId] = useState(null); // null for creating, holds ID for editing
  const [formError, setFormError] = useState(null); // For displaying form errors

  const resetForm = () => {
    setIsOpen(false);
    setEditId(null);
    setImage(null);
    setFromdata({ title: "", content: "" });
  };

  // --- Data Fetching ---

  useEffect(() => {
    // This effect runs once to get the user's ID and then fetches their blogs.
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUserId(userData._id);
      setToken(userData.token); // Assuming the token is stored with user data
    }
  }, []); // Empty dependency array ensures this runs only once on mount.

  // This effect runs whenever the userId changes
  useEffect(() => {
    const fetchBlogs = async () => {
      if (!userId) return; // Don't fetch if we don't have a userId
      try {
        const token = localStorage.getItem("token");
        const authHeader = `Bearer ${token}`;
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/blogs/${userId}`,
          {
            headers: {
              Authorization: authHeader,
            },
          }
        );
        console.log("Fetched blogs:", response.data.blogs);
        setBlogs(response.data.blogs || []);
      } catch (error) {
        console.error("Error fetching blogs:", error);
        setBlogs([]); // Set to an empty array on error to prevent crashes
      }
    };
    fetchBlogs();
  }, [userId, editId]); // Re-run this effect when userId changes

  // --- Event Handlers ---

  const openCreateForm = () => {
    setIsOpen(true);
    // Clear form for creating a new blog
    // setFromdata.title("");
    // setFromdata.content("");
    // setEditId(null);
    // setFormError(null); // Clear previous errors
  };

  // const handleEdit = (blog) => {
  //   setIsOpen(true);
  //   // Populate form with the blog post to be edited
  //   setTitle(blog.Title); // Your backend uses 'Title' with a capital T
  //   setContent(blog.content);
  //   setEditId(blog._id);
  //   setFormError(null); // Clear previous errors
  // };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this blog?")) {
      try {
        await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/blogs/${id}`);
        // Update state to remove the deleted blog from the UI instantly
        setBlogs(blogs.filter((blog) => blog._id !== id));
      } catch (error) {
        setFormError(error.response?.data?.message || "Error deleting blog.");
        console.error("Error deleting blog:", error);
      }
    }
  };

  const handleEdit = (blog) => {
    setIsOpen(true);
    setFromdata({
      title: blog.title,
      content: blog.content,
    });
    setEditId(blog._id);
    setFormError(null); // Clear previous errors
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setImage(files[0]); // Use files[0] to get the uploaded file
    } else {
      setFromdata({
        ...formdata,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null); // Reset error on new submission

    // const blogData = { Title: title, content: content, image: image };
    // console.log("Submitting blog data:", blogData);

    try {
      const formData = new FormData();
      formData.append("title", formdata.title);
      formData.append("content", formdata.content);
      if (image) {
        formData.append("image", image);
      }

      // Create new blog
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/blogs/${userId}`,
        formData
      );
      console.log("Blog created successfully:", res.data);
      setBlogs([...blogs, res.data.blog]);

      // 3. On success, reset form and close modal
      resetForm();
    } catch (error) {
      console.error("Error submitting blog:", error);
      // Set a user-friendly error message from the backend if available
      console.log("Error response:", error.response);
      const message =
        error.response?.data?.message ||
        "There was an error submitting your blog. Please try again.";
      setFormError(message);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setFormError(null);

    try {
      const formDatatosend = new FormData();
      formDatatosend.append("title", formdata.title);
      formDatatosend.append("content", formdata.content);
      if (image) {
        formDatatosend.append("image", image);
      }
      const res = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/blogs/${editId}`,
        formDatatosend
      );
      setBlogs(
        blogs.map((blog) => (blog._id === editId ? res.data.blog : blog))
      );
      resetForm();
    } catch (error) {
      console.error("Error updating blog:", error);
      setFormError(
        error.response?.data?.message ||
          "There was an error updating your blog. Please try again."
      );
    }
  };

  return (
    <>
      <div className=" flex justify-between items-center w-full h-16 bg-gray-800 text-white px-4">
        <h1>Blog</h1>
        <button onClick={openCreateForm}>Add Blog</button>
      </div>
      {isOpen && (
        <div className="flex flex-col items-center gap-3 bg-gradient-to-br bg-cyan-900 text-gray-900 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
          {/* Display the error message if it exists */}
          {formError && (
            <div className="bg-red-500 text-white p-2 rounded mb-4 w-full text-center">
              {formError}
            </div>
          )}
          {/* The form now calls handleSubmit on submission */}
          <form
            className="flex flex-col gap-3 w-80 bg-gray-100 p-6 rounded-lg shadow-md mx-auto mb-6"
            onSubmit={editId ? handleUpdate : handleSubmit}
          >
            <div>
              <label className="font-medium text-gray-800">Image:</label>
              <input
                type="file"
                name="image"
                onChange={(e) => handleChange(e)}
                className="mt-1 p-2 rounded border border-gray-300 w-full"
              />
            </div>
            <div>
              <label className="font-medium text-gray-800">Title:</label>
              {/* Inputs are now controlled by state */}
              <input
                type="text"
                required
                name="title"
                value={formdata.title}
                onChange={(e) => handleChange(e)}
                className="mt-1 p-2 rounded border border-gray-300 w-full"
              />
            </div>
            <div>
              <label className="font-medium text-gray-800">Content:</label>
              <input
                type="text"
                required
                name="content"
                value={formdata.content}
                onChange={(e) => handleChange(e)}
                className="mt-1 p-2 rounded border border-gray-300 w-full"
              ></input>
            </div>
            <div className="flex space-x-4 mt-4">
              <button className="px-2 py-1 bg-gray-400 rounded" type="submit">
                {/* Button text changes based on whether we are editing or creating */}
                {editId ? "Update" : "Submit"}
              </button>
              <button
                className="px-2 py-1 bg-gray-400 rounded"
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  setFromdata({ title: "", content: "" });
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="p-4 sm:p-6 lg:p-8">
        <div className="shadow-md rounded-xl overflow-hidden border border-gray-200 bg-white">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                {["Title", "Content", "Actions", "Image"].map((head, index) => (
                  <th
                    key={index}
                    scope="col"
                    className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wide"
                  >
                    {head}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {blogs.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="text-center px-6 py-6 text-gray-500 italic"
                  >
                    No data found.
                  </td>
                </tr>
              ) : (
                blogs.map(
                  (blog) =>
                    blog &&
                    blog._id && (
                      <tr
                        key={blog._id}
                        className="hover:bg-yellow-800 transition-colors duration-200"
                      >
                        <td className="px-6 py-4 text-sm text-gray-800 max-w-xs break-words">
                          {blog.title}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700 max-w-md break-words">
                          {blog.content}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <button
                              className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded shadow-sm transition"
                              onClick={() => handleEdit(blog)}
                            >
                              <MdEdit />
                            </button>
                            <button
                              className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-sm rounded shadow-sm transition"
                              onClick={() => handleDelete(blog._id)}
                            >
                              <MdDeleteForever />
                            </button>
                            <button
                              className="px-3 py-1 bg-green-300 hover:bg-green-600 text-white text-sm rounded shadow-sm transition"
                              onClick={() => setView(true)}
                            >
                              <MdViewHeadline />
                            </button>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {blog.image ? (
                            <img
                              src={`${import.meta.env.VITE_BACKEND_URL}${
                                blog.image
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
                    )
                )
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default Blog;
