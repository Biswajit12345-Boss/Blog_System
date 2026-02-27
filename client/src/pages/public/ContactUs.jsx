import { useState } from "react";
import api from "../../services/api";

const ContactUs = () => {
    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        message: "",
    });

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState("");

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await api.post("contact/add", form);

            if (res.data.status) {
                setSuccess("Message sent successfully ✅");
                setForm({
                    name: "",
                    email: "",
                    phone: "",
                    message: "",
                });
            }
        } catch (error) {
            console.error(error.response?.data || error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
            <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-lg">
                <h2 className="text-3xl font-bold mb-6 text-center">
                    Contact Us
                </h2>

                {success && (
                    <p className="bg-green-100 text-green-700 p-2 rounded mb-4 text-sm">
                        {success}
                    </p>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        name="name"
                        placeholder="Your Name"
                        value={form.name}
                        onChange={handleChange}
                        required
                        className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400"
                    />

                    <input
                        type="email"
                        name="email"
                        placeholder="Your Email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400"
                    />

                    <input
                        type="text"
                        name="phone"
                        placeholder="Phone Number"
                        value={form.phone}
                        onChange={handleChange}
                        className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400"
                    />

                    <textarea
                        name="message"
                        placeholder="Your Message"
                        rows="4"
                        value={form.message}
                        onChange={handleChange}
                        required
                        className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400"
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                        {loading ? "Sending..." : "Send Message"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ContactUs;