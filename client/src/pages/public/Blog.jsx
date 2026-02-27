import { useEffect, useState } from "react";
import api from "../../services/api";
import {
    Heart,
    Eye,
    MessageCircle,
    Play,
    Plus,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Blog = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [blogs, setBlogs] = useState([]);
    const [filteredBlogs, setFilteredBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState("latest");

    const [selectedBlog, setSelectedBlog] = useState(null);

    // Create modal
    const [showCreate, setShowCreate] = useState(false);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [videoUrl, setVideoUrl] = useState("");
    const [thumbnail, setThumbnail] = useState("");

    // Comment state
    const [commentText, setCommentText] = useState("");

    // ================= FETCH BLOGS =================
    const fetchBlogs = async () => {
        try {
            const res = await api.get("blog");
            setBlogs(res.data.data);
            setFilteredBlogs(res.data.data);
        } catch (error) {
            console.error(error.response?.data || error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBlogs();
    }, []);

    // ================= SEARCH + SORT =================
    useEffect(() => {
        let filtered = blogs.filter((blog) =>
            blog.title.toLowerCase().includes(search.toLowerCase())
        );

        if (sortBy === "latest") {
            filtered.sort(
                (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
            );
        } else if (sortBy === "views") {
            filtered.sort((a, b) => b.views - a.views);
        } else if (sortBy === "likes") {
            filtered.sort((a, b) => b.likes.length - a.likes.length);
        }

        setFilteredBlogs(filtered);
    }, [search, sortBy, blogs]);

    // ================= CREATE BLOG =================
    const handleCreateBlog = async (e) => {
        e.preventDefault();

        if (!videoUrl) return alert("Video URL is required");

        try {
            await api.post("blog", {
                title,
                description,
                videoUrl,
                thumbnail,
            });

            alert("Blog created successfully 🚀");

            setShowCreate(false);
            setTitle("");
            setDescription("");
            setVideoUrl("");
            setThumbnail("");
            fetchBlogs();
        } catch (error) {
            console.error(error.response?.data || error.message);
        }
    };
    // ================= LIKE =================
    const handleLike = async (id) => {
        if (!user) return alert("Login required");

        try {
            const res = await api.put(`blog/${id}/like`);

            setBlogs((prev) =>
                prev.map((blog) =>
                    blog._id === id
                        ? { ...blog, likes: res.data.likes }
                        : blog
                )
            );
        } catch (error) {
            console.error(error.response?.data || error.message);
        }
    };

    // ================= VIEW INCREMENT =================
    const handleVideoOpen = async (blog) => {
        setSelectedBlog(blog);

        try {
            await api.put(`blog/${blog._id}/view`);

            setBlogs((prev) =>
                prev.map((b) =>
                    b._id === blog._id
                        ? { ...b, views: b.views + 1 }
                        : b
                )
            );
        } catch (error) {
            console.error(error);
        }
    };

    // ================= COMMENT =================
    const handleComment = async (e) => {
        e.preventDefault();
        if (!commentText) return;

        try {
            const res = await api.post(
                `blog/${selectedBlog._id}/comment`,
                { comment: commentText }
            );

            const updatedComments = res.data.comments;

            setBlogs((prev) =>
                prev.map((blog) =>
                    blog._id === selectedBlog._id
                        ? { ...blog, comments: updatedComments }
                        : blog
                )
            );

            setSelectedBlog((prev) => ({
                ...prev,
                comments: updatedComments,
            }));

            setCommentText("");
        } catch (error) {
            console.error(error.response?.data || error.message);
        }
    };

    if (loading)
        return <p className="text-center mt-10 text-lg">Loading Blogs...</p>;

    return (
        <div className="min-h-screen bg-gray-100 px-6 py-10">
            {/* HEADER */}
            <div className="max-w-7xl mx-auto mb-10 flex justify-between items-center">
                <h1 className="text-4xl font-bold">
                    Explore Video Blogs
                </h1>

                {user && (
                    <button
                        onClick={() => setShowCreate(true)}
                        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                    >
                        <Plus size={18} /> Create Blog
                    </button>
                )}
            </div>

            {/* SEARCH + SORT */}
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-4 justify-between mb-10">
                <input
                    type="text"
                    placeholder="Search blogs..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="border px-4 py-2 rounded-lg w-full md:w-1/3"
                />

                <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="border px-4 py-2 rounded-lg w-full md:w-1/4"
                >
                    <option value="latest">Latest</option>
                    <option value="views">Most Viewed</option>
                    <option value="likes">Most Liked</option>
                </select>
            </div>

            {/* BLOG GRID */}
            <div className="max-w-7xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredBlogs.map((blog) => (
                    <div
                        key={blog._id}
                        className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition duration-300"
                    >
                        {/* Thumbnail */}
                        <div
                            className="relative cursor-pointer"
                            onClick={() => handleVideoOpen(blog)}
                        >
                            <img
                                src={
                                    blog.thumbnail ||
                                    "/default-thumbnail.jpg"
                                }
                                alt={blog.title}
                                className="w-full h-52 object-cover"
                            />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                <Play
                                    size={40}
                                    className="text-white"
                                />
                            </div>
                        </div>

                        <div className="p-5">
                            {/* Author */}
                            <div className="flex justify-between mb-2">
                                <button
                                    onClick={() =>
                                        navigate(
                                            `/profile/${blog.user._id}`
                                        )
                                    }
                                    className="text-sm text-blue-600 hover:underline"
                                >
                                    {blog.user.name}
                                </button>
                                <span className="text-xs text-gray-400">
                                    {new Date(
                                        blog.createdAt
                                    ).toLocaleDateString()}
                                </span>
                            </div>

                            <h2 className="text-lg font-semibold mb-2 truncate">
                                {blog.title}
                            </h2>

                            <p className="text-gray-500 text-sm line-clamp-2 mb-4">
                                {blog.description}
                            </p>

                            {/* Stats */}
                            <div className="flex justify-between text-gray-600 text-sm">
                                <div className="flex items-center gap-1">
                                    <Eye size={16} />
                                    {blog.views}
                                </div>

                                <button
                                    onClick={() =>
                                        handleLike(blog._id)
                                    }
                                    className={`flex items-center gap-1 ${blog.likes.includes(
                                        user?._id
                                    )
                                        ? "text-red-500"
                                        : ""
                                        }`}
                                >
                                    <Heart size={16} />
                                    {blog.likes.length}
                                </button>

                                <button
                                    onClick={() =>
                                        setSelectedBlog(blog)
                                    }
                                    className="flex items-center gap-1"
                                >
                                    <MessageCircle size={16} />
                                    {blog.comments.length}
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* CREATE MODAL */}
            {showCreate && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl w-11/12 md:w-1/2 p-6">
                        <h2 className="text-2xl font-bold mb-4">
                            Create Blog
                        </h2>

                        <form
                            onSubmit={handleCreateBlog}
                            className="space-y-4"
                        >
                            <input
                                type="text"
                                placeholder="Title"
                                value={title}
                                onChange={(e) =>
                                    setTitle(e.target.value)
                                }
                                className="w-full border px-4 py-2 rounded"
                                required
                            />

                            <textarea
                                placeholder="Description"
                                value={description}
                                onChange={(e) =>
                                    setDescription(e.target.value)
                                }
                                className="w-full border px-4 py-2 rounded"
                                rows={3}
                                required
                            />

                            <input
                                type="text"
                                placeholder="Paste Video URL (YouTube / mp4 link)"
                                value={videoUrl}
                                onChange={(e) => setVideoUrl(e.target.value)}
                                className="w-full border px-4 py-2 rounded"
                                required
                            />

                            <input
                                type="text"
                                placeholder="Paste Thumbnail Image URL"
                                value={thumbnail}
                                onChange={(e) => setThumbnail(e.target.value)}
                                className="w-full border px-4 py-2 rounded"
                            />

                            <div className="flex justify-end gap-4">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowCreate(false)
                                    }
                                    className="px-4 py-2 bg-gray-400 text-white rounded"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded"
                                >
                                    Publish
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {selectedBlog && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">

                    <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl my-8 max-h-[95vh] flex flex-col">

                        {/* Video Section */}
                        <div className="relative shrink-0">
                            <video
                                src={selectedBlog.videoUrl}
                                controls
                                autoPlay
                                className="w-full h-[400px] bg-black object-contain"
                            />
                            <button
                                onClick={() => setSelectedBlog(null)}
                                className="absolute top-3 right-3 bg-black/60 hover:bg-black text-white px-3 py-1 rounded-lg text-sm"
                            >
                                ✕ Close
                            </button>
                        </div>

                        {/* Scrollable Content Section */}
                        <div className="p-6 grid md:grid-cols-3 gap-6 overflow-y-auto">

                            {/* LEFT - Blog Info */}
                            <div className="md:col-span-2">
                                <h2 className="text-2xl font-bold mb-2">
                                    {selectedBlog.title}
                                </h2>

                                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                                    <span>
                                        {selectedBlog.views} views •{" "}
                                        {new Date(selectedBlog.createdAt).toLocaleDateString()}
                                    </span>

                                    <button
                                        onClick={() => handleLike(selectedBlog._id)}
                                        className={`flex items-center gap-1 ${selectedBlog.likes.includes(user?._id)
                                            ? "text-red-500"
                                            : "text-gray-600"
                                            }`}
                                    >
                                        ❤️ {selectedBlog.likes.length}
                                    </button>
                                </div>

                                <p className="text-gray-700 leading-relaxed">
                                    {selectedBlog.description}
                                </p>
                            </div>

                            {/* RIGHT - Comments */}
                            <div className="bg-gray-50 rounded-xl p-4 flex flex-col max-h-[350px]">
                                <h3 className="font-semibold mb-3 text-lg">
                                    Comments ({selectedBlog.comments.length})
                                </h3>

                                <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                                    {selectedBlog.comments.length === 0 && (
                                        <p className="text-gray-400 text-sm">
                                            No comments yet.
                                        </p>
                                    )}

                                    {selectedBlog.comments.map((c) => (
                                        <div
                                            key={c._id}
                                            className="bg-white p-3 rounded-lg shadow-sm"
                                        >
                                            <p className="text-sm font-semibold text-gray-800">
                                                {c.user?.name || "User"}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                {c.comment}
                                            </p>
                                        </div>
                                    ))}
                                </div>

                                {user && (
                                    <form
                                        onSubmit={handleComment}
                                        className="flex gap-2 mt-3 shrink-0"
                                    >
                                        <input
                                            type="text"
                                            value={commentText}
                                            onChange={(e) => setCommentText(e.target.value)}
                                            placeholder="Write a comment..."
                                            className="flex-1 border px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                                        />
                                        <button
                                            type="submit"
                                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 rounded-lg text-sm"
                                        >
                                            Post
                                        </button>
                                    </form>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Blog;