import React, { useEffect, useState } from "react";
import api from "../../services/api";

const AdminBlog = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [selectedBlog, setSelectedBlog] = useState(null);
    console.log(selectedBlog)
    const [showModal, setShowModal] = useState(false);

    const fetchBlogs = async () => {
        try {
            const { data } = await api.get("/blog");
            setBlogs(data.data);
            setLoading(false);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to fetch blogs");
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBlogs();
    }, []);

    // ✅ Open View Modal
    const handleView = (blog) => {
        setSelectedBlog(blog);
        setShowModal(true);
    };

    // ✅ Delete Comment
    const handleDeleteComment = async (blogId, commentId) => {
        try {
            await api.delete(`/blog/${blogId}/comment/${commentId}`);

            // Update UI without refresh
            setSelectedBlog((prev) => ({
                ...prev,
                comments: prev.comments.filter(
                    (comment) => comment._id !== commentId
                ),
            }));

            setBlogs((prevBlogs) =>
                prevBlogs.map((blog) =>
                    blog._id === blogId
                        ? {
                            ...blog,
                            comments: blog.comments.filter(
                                (comment) => comment._id !== commentId
                            ),
                        }
                        : blog
                )
            );
        } catch (err) {
            alert("Failed to delete comment");
        }
    };

    if (loading)
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-lg font-semibold">Loading Blogs...</p>
            </div>
        );

    if (error)
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-red-500 font-semibold">{error}</p>
            </div>
        );

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">
                Blog Analytics Dashboard
            </h1>

            <div className="bg-white shadow-xl rounded-xl overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-100 text-gray-600 uppercase text-sm">
                        <tr>
                            <th className="px-6 py-4">#</th>
                            <th className="px-6 py-4">Title</th>
                            <th className="px-6 py-4">Author</th>
                            <th className="px-6 py-4">Likes</th>
                            <th className="px-6 py-4">Comments</th>
                            <th className="px-6 py-4">Views</th>
                            <th className="px-6 py-4">Created</th>
                            <th className="px-6 py-4">Action</th> {/* ✅ Added */}
                        </tr>
                    </thead>

                    <tbody className="text-gray-700">
                        {blogs.map((blog, index) => (
                            <tr
                                key={blog._id}
                                className="border-b hover:bg-gray-50 transition"
                            >
                                <td className="px-6 py-4">{index + 1}</td>

                                <td className="px-6 py-4 font-semibold text-gray-800">
                                    {blog.title}
                                </td>

                                <td className="px-6 py-4">
                                    {blog.author?.name || "Unknown"}
                                </td>

                                <td className="px-6 py-4">
                                    <span className="bg-pink-100 text-pink-600 px-3 py-1 rounded-full text-xs font-semibold">
                                        {blog.likes?.length || 0}
                                    </span>
                                </td>

                                <td className="px-6 py-4">
                                    <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs font-semibold">
                                        {blog.comments?.length || 0}
                                    </span>
                                </td>

                                <td className="px-6 py-4">
                                    <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-xs font-semibold">
                                        {blog.views || 0}
                                    </span>
                                </td>

                                <td className="px-6 py-4">
                                    {new Date(blog.createdAt).toLocaleDateString()}
                                </td>

                                <td className="px-6 py-4">
                                    <button
                                        onClick={() => handleView(blog)}
                                        className="bg-indigo-500 text-white px-3 py-1 rounded text-xs hover:bg-indigo-600"
                                    >
                                        View
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {blogs.length === 0 && (
                    <div className="p-6 text-center text-gray-500">
                        No blogs found.
                    </div>
                )}
            </div>

            {/* ✅ View Modal */}
            {showModal && selectedBlog && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
                    <div className="bg-white w-2/3 p-6 rounded-xl shadow-lg max-h-[80vh] overflow-y-auto">
                        <h2 className="text-2xl font-bold mb-4">
                            {selectedBlog.title}
                        </h2>

                        <video
                            src={selectedBlog.videoUrl}
                            controls
                            className="w-full h-50 mb-4 rounded"
                        />

                        <h3 className="font-semibold mb-2">
                            Comments ({selectedBlog.comments?.length || 0})
                        </h3>

                        {selectedBlog.comments?.map((comment) => (
                            <div
                                key={comment._id}
                                className="flex justify-between items-center border-b py-2"
                            >
                                <div>
                                    <p className="text-sm font-semibold">
                                        {comment.user?.name}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        {comment.comment}
                                    </p>
                                </div>

                                <button
                                    onClick={() =>
                                        handleDeleteComment(
                                            selectedBlog._id,
                                            comment._id
                                        )
                                    }
                                    className="bg-red-500 text-white px-3 py-1 rounded text-xs hover:bg-red-600"
                                >
                                    Delete
                                </button>
                            </div>
                        ))}

                        <div className="text-right mt-4">
                            <button
                                onClick={() => setShowModal(false)}
                                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminBlog;