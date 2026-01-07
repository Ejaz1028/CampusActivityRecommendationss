import React, { useState, useEffect } from "react";
import AdminNavBar from "@/components/AdminNavBar";
import { HiOutlineCalendar, HiOutlineChatAlt2, HiOutlineAnnotation, HiOutlineX } from "react-icons/hi";

export default function PublisherDashboard() {
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [publisherId, setPublisherId] = useState(null);
    const [isVerified, setIsVerified] = useState(false);

    useEffect(() => {
        // In a real app, this would come from the auth context/token
        const token = localStorage.getItem("userToken");
        const verified = localStorage.getItem("isVerified") === "true";
        setPublisherId(token);
        setIsVerified(verified);
    }, []);

    useEffect(() => {
        if (!publisherId) return;

        const fetchEvents = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/publisher/events/${publisherId}`);
                if (response.ok) {
                    const data = await response.json();
                    setEvents(data);
                }
            } catch (error) {
                console.error("Fetch Publisher Events Error:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, [publisherId]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!selectedEvent || !message.trim()) return;

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/publisher/send-message`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ eventId: selectedEvent.event_id, message }),
            });

            if (response.ok) {
                alert("Message sent successfully!");
                setMessage("");
                setSelectedEvent(null);
            }
        } catch (error) {
            console.error("Send Message Error:", error);
            alert("Failed to send message.");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <AdminNavBar />

            <main className="pt-24 pb-12 px-4 md:px-8 max-w-7xl mx-auto">
                <header className="mb-12">
                    <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Publisher Dashboard</h1>
                    <p className="text-gray-500 mt-2 text-lg">Manage your assigned events and communicate with subscribers.</p>
                </header>

                {!isVerified && (
                    <div className="mb-12 bg-orange-50 border-l-8 border-orange-400 p-8 rounded-3xl shadow-lg shadow-orange-100/50">
                        <div className="flex items-center gap-6">
                            <div className="p-4 bg-orange-100 rounded-2xl">
                                <HiOutlineAnnotation className="w-8 h-8 text-orange-600" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-orange-900">Awaiting Verification</h2>
                                <p className="text-orange-700 mt-1">Your account is currently under review by the administrator. You will be able to send messages once verified.</p>
                            </div>
                        </div>
                    </div>
                )}

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                    </div>
                ) : events.length === 0 ? (
                    <div className="bg-white rounded-3xl p-12 text-center shadow-xl shadow-indigo-100/50 border border-indigo-50">
                        <div className="bg-indigo-50 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <HiOutlineCalendar className="w-10 h-10 text-indigo-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">No Events Assigned</h2>
                        <p className="text-gray-500">You haven't been assigned any events yet. Contact the admin for more details.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {events.map((event) => (
                            <div
                                key={event._id}
                                className="bg-white rounded-[2rem] overflow-hidden shadow-xl shadow-indigo-100/50 border border-indigo-50 hover:shadow-2xl hover:shadow-indigo-200/50 transition-all duration-300 group"
                            >
                                <div className="relative h-48">
                                    <img src={event.cover} alt={event.name} className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                    <div className="absolute bottom-4 left-6">
                                        <h3 className="text-xl font-bold text-white">{event.name}</h3>
                                        <p className="text-indigo-200 text-sm">{event.date} • {event.time}</p>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="p-3 bg-indigo-50 rounded-xl">
                                            <HiOutlineAnnotation className="w-6 h-6 text-indigo-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Subscribers</p>
                                            <p className="text-2xl font-bold text-gray-900">{event.participants?.length || 0}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setSelectedEvent(event)}
                                        disabled={!isVerified}
                                        className={`w-full py-4 font-bold rounded-2xl transform transition-all duration-200 shadow-lg flex items-center justify-center gap-2 ${isVerified
                                                ? "bg-indigo-600 text-white hover:bg-indigo-700 hover:-translate-y-1 shadow-indigo-200"
                                                : "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none"
                                            }`}
                                    >
                                        <HiOutlineChatAlt2 className="w-5 h-5" />
                                        {isVerified ? "Send Message" : "Verification Pending"}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Message Modal */}
                {selectedEvent && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-[3rem] w-full max-w-lg overflow-hidden shadow-2xl">
                            <div className="bg-indigo-600 p-8 text-white relative">
                                <button
                                    onClick={() => setSelectedEvent(null)}
                                    className="absolute top-6 right-6 p-2 hover:bg-white/10 rounded-xl transition-colors"
                                >
                                    <HiOutlineX className="w-6 h-6" />
                                </button>
                                <h2 className="text-2xl font-bold mb-2">Send Message</h2>
                                <p className="text-indigo-100">Broadcasting to all subscribers of <b>{selectedEvent.name}</b></p>
                            </div>
                            <form onSubmit={handleSendMessage} className="p-8">
                                <div className="mb-6">
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Your Message</label>
                                    <textarea
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                                        rows="6"
                                        placeholder="Type your announcement here..."
                                        required
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transform hover:-translate-y-1 transition-all duration-200 shadow-lg shadow-indigo-200"
                                >
                                    Send Notification
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
