import { getAdminToken } from "@/utils/getAdminToken";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { HiOutlineCalendar, HiOutlineLocationMarker, HiOutlineUser, HiOutlineCurrencyRupee, HiOutlinePhotograph, HiOutlineDocumentText } from "react-icons/hi";

const CreateEvent = () => {
    const router = useRouter();
    const admin_id = getAdminToken();

    const [formData, setFormData] = useState({
        name: "",
        venue: "",
        organizer: "",
        datetime: "",
        price: "",
        profile: "",
        cover: "",
        description: "",
        publisher_id: "",
    });

    const [publishers, setPublishers] = useState([]);

    useEffect(() => {
        const fetchPublishers = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/publishers`);
                if (response.ok) {
                    const data = await response.json();
                    setPublishers(data);
                }
            } catch (error) {
                console.error("Fetch Publishers Error:", error);
            }
        };
        fetchPublishers();
    }, []);

    const handleEventFormSubmit = async (e) => {
        e.preventDefault();

        const datetemp = new Date(formData.datetime);
        const formattedDate = datetemp.toLocaleDateString("en-IN", {
            year: "numeric", mouth: "2-digit", day: "2-digit",
        });
        const formattedTime = datetemp.toLocaleTimeString("en-US", {
            hour: "numeric", minute: "numeric", hour12: true,
        });

        const requestBody = {
            ...formData,
            date: formattedDate,
            time: formattedTime,
            price: Number(formData.price),
            admin_id: admin_id,
        };

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/post/event`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(requestBody),
            });
            if (response.ok) {
                alert("Event Created Successfully");
                router.push("/admin/dashboard");
            }
        } catch (error) {
            console.error("Create Event Error:", error);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="bg-white rounded-3xl shadow-xl shadow-indigo-100/50 border border-indigo-50 overflow-hidden">
            <div className="p-8">
                <div className="mb-8">
                    <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Create New Event</h2>
                    <p className="text-gray-500 mt-2">Fill in the details below to launch your campus activity.</p>
                </div>

                <form onSubmit={handleEventFormSubmit} className="space-y-6">
                    <FormInput label="Event Title" name="name" icon={<HiOutlineCalendar />} value={formData.name} onChange={handleChange} required placeholder="e.g. Annual Tech Symposium" />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormInput label="Venue" name="venue" icon={<HiOutlineLocationMarker />} value={formData.venue} onChange={handleChange} required placeholder="e.g. Auditorium 1" />
                        <FormInput label="Organizer" name="organizer" icon={<HiOutlineUser />} value={formData.organizer} onChange={handleChange} required placeholder="e.g. coding Club" />
                        <FormInput label="Date & Time" name="datetime" type="datetime-local" icon={<HiOutlineCalendar />} value={formData.datetime} onChange={handleChange} required />
                        <FormInput label="Price (Rs.)" name="price" type="number" icon={<HiOutlineCurrencyRupee />} value={formData.price} onChange={handleChange} required placeholder="0 for Free" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                                <HiOutlineUser className="text-indigo-500" />
                                Assign Publisher (Optional)
                            </label>
                            <select
                                name="publisher_id"
                                value={formData.publisher_id}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                            >
                                <option value="">Select a publisher...</option>
                                {publishers.map((pub) => (
                                    <option key={pub._id} value={pub.user_token}>
                                        {pub.username} ({pub.email})
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormInput label="Profile Image URL" name="profile" icon={<HiOutlinePhotograph />} value={formData.profile} onChange={handleChange} placeholder="https://..." />
                        <FormInput label="Cover Image URL" name="cover" icon={<HiOutlinePhotograph />} value={formData.cover} onChange={handleChange} placeholder="https://..." />
                    </div>

                    <div>
                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                            <HiOutlineDocumentText className="text-indigo-500" />
                            Description
                        </label>
                        <textarea
                            name="description"
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                            rows="4"
                            value={formData.description}
                            onChange={handleChange}
                            required
                            placeholder="Tell us about the event..."
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transform hover:-translate-y-1 transition-all duration-200 shadow-lg shadow-indigo-200 focus:ring-4 focus:ring-indigo-500/50"
                    >
                        Publish Event
                    </button>
                </form>
            </div>
        </div>
    );
};

function FormInput({ label, icon, ...props }) {
    return (
        <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <span className="text-indigo-500">{icon}</span>
                {label}
            </label>
            <input
                {...props}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none placeholder:text-gray-400"
            />
        </div>
    );
}

export default CreateEvent;
