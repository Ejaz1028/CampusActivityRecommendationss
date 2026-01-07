import AdminNavBar from "@/components/AdminNavBar";
import { getAdminToken } from "@/utils/getAdminToken";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { HiOutlineCalendar, HiOutlineLocationMarker, HiOutlineUser, HiOutlineCurrencyRupee, HiOutlineTrash, HiOutlineShare, HiOutlineTicket } from "react-icons/hi";

function AdminEventPage() {
    const router = useRouter();
    const eventId = router.query.eventId;
    const [eventData, setEventData] = useState(null);
    const adminId = getAdminToken();

    const fetchEvent = async () => {
        if (!eventId) return;
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/getevent`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ event_id: eventId }),
            });
            if (response.ok) {
                const data = await response.json();
                setEventData(data);
            }
        } catch (error) {
            console.error("Error fetching event data:", error);
        }
    };

    useEffect(() => {
        fetchEvent();
    }, [eventId]);

    const share = () => {
        if (navigator.share) {
            navigator.share({
                title: eventData.name,
                text: `Join us for ${eventData.name}!`,
                url: window.location.href,
            }).catch(console.error);
        } else {
            navigator.clipboard.writeText(window.location.href);
            alert("Link copied to clipboard!");
        }
    };

    const deleteEvent = async () => {
        if (!window.confirm("This action will permanently delete the event. Proceed?")) return;
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/deleteevent`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ event_id: eventId, admin_id: adminId }),
            });
            if (response.ok) {
                alert("Event deleted successfully");
                router.push("/admin/dashboard");
            }
        } catch (error) {
            console.error("Error deleting event:", error);
        }
    };

    if (!eventData) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 pb-12">
            <Head>
                <title>Admin | {eventData.name}</title>
            </Head>
            <AdminNavBar />

            <div className="pt-24 px-4 max-w-7xl mx-auto">
                {/* Hero Section */}
                <div className="relative h-[300px] md:h-[450px] rounded-[2.5rem] overflow-hidden shadow-2xl mb-12">
                    <Image
                        src={eventData.cover}
                        alt={eventData.name}
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end">
                        <div className="p-8 md:p-12 w-full flex flex-col md:flex-row md:items-end justify-between gap-6">
                            <div className="max-w-3xl">
                                <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
                                    {eventData.name}
                                </h1>
                                <div className="flex flex-wrap gap-4 text-white/90 text-sm font-medium">
                                    <span className="flex items-center gap-1.5 px-3 py-1 bg-white/10 backdrop-blur rounded-full">
                                        <HiOutlineCalendar className="w-4 h-4" /> {eventData.date}
                                    </span>
                                    <span className="flex items-center gap-1.5 px-3 py-1 bg-white/10 backdrop-blur rounded-full">
                                        <HiOutlineLocationMarker className="w-4 h-4" /> {eventData.venue}
                                    </span>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <button onClick={share} className="p-4 bg-white/10 backdrop-blur hover:bg-white/20 text-white rounded-2xl transition-all">
                                    <HiOutlineShare className="w-6 h-6" />
                                </button>
                                <button onClick={deleteEvent} className="p-4 bg-red-500/80 backdrop-blur hover:bg-red-600 text-white rounded-2xl transition-all">
                                    <HiOutlineTrash className="w-6 h-6" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        <section className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">About Event</h2>
                            <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                                {eventData.description}
                            </p>
                        </section>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <DetailCard icon={<HiOutlineUser />} label="Organizer" value={eventData.organizer} />
                            <DetailCard icon={<HiOutlineCurrencyRupee />} label="Price" value={`Rs. ${eventData.price}`} />
                        </div>
                    </div>

                    {/* Sidebar Stats */}
                    <div className="space-y-6">
                        <div className="bg-indigo-600 rounded-[2rem] p-8 text-white shadow-xl shadow-indigo-200">
                            <div className="flex items-center justify-between mb-6">
                                <span className="text-indigo-100 font-medium tracking-wide uppercase text-xs">Total Registrations</span>
                                <HiOutlineTicket className="w-8 h-8 opacity-40" />
                            </div>
                            <div className="text-5xl font-black mb-8">{eventData.participants?.length || 0}</div>
                            <button
                                onClick={() => router.push(`/event/${eventData.event_id}/registration`)}
                                className="w-full py-4 bg-white text-indigo-600 font-bold rounded-2xl hover:bg-indigo-50 transition-colors"
                            >
                                View Attendee List
                            </button>
                        </div>

                        <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm">
                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4 italic">Pro Tip</h3>
                            <p className="text-sm text-gray-500 italic leading-relaxed">
                                Use the attendee list to manage check-ins and send updates directly to registered participants.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function DetailCard({ icon, label, value }) {
    return (
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">{icon}</div>
            <div>
                <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{label}</div>
                <div className="text-lg font-bold text-gray-900">{value}</div>
            </div>
        </div>
    );
}

export default AdminEventPage;
