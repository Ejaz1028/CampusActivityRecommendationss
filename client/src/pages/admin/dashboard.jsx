import AdminSidebar from "@/components/AdminSidebar";
import RabbitMQTest from "@/components/RabbitMQTest";
import Dashboard_Filter from "@/components/Dashboard_Filter";
import Popup_Filter from "@/components/Popup_Filter";
import { getAdminToken } from "@/utils/getAdminToken";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { HiOutlineTrash, HiOutlineUsers, HiOutlineCalendar, HiOutlineCurrencyRupee, HiOutlineChartBar } from "react-icons/hi";
import { RxHamburgerMenu } from "react-icons/rx";

function AdminDashboard() {
    const router = useRouter();
    const adminIdCookie = getAdminToken();

    const [activeTab, setActiveTab] = useState("overview");
    const [allEvents, setAllEvents] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalEvents: 0,
        totalRevenue: 0,
        totalRegistrations: 0
    });

    const [popupFilterOpen, setPopupFilterOpen] = useState(false);
    const [filterOptions, setFilterOptions] = useState({
        keyword: "",
        category: "",
        dateRange: "",
        price: [0, 5000],
    });

    const fetchDashboardData = async () => {
        if (!adminIdCookie) return;

        try {
            // 1. Fetch Admin Details (Events created by this admin)
            const adminRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/details`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ admin_id: adminIdCookie }),
            });
            if (adminRes.ok) {
                const data = await adminRes.json();
                setAllEvents(data.eventCreated || []);
            }

            // 2. Fetch Stats
            const statsRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/stats`);
            if (statsRes.ok) {
                const data = await statsRes.json();
                setStats(data);
            }

            // 3. Fetch Users
            const usersRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/users`);
            if (usersRes.ok) {
                const data = await usersRes.json();
                setAllUsers(data);
            }
        } catch (error) {
            console.error("Fetch Dashboard Data Error:", error);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const [filteredEvents, setFilteredEvents] = useState([]);

    useEffect(() => {
        const newFilteredEvents = allEvents.filter((event) => {
            if (filterOptions.keyword && !event.name.toLowerCase().includes(filterOptions.keyword.toLowerCase())) return false;
            if (event.price < filterOptions.price[0] || event.price > filterOptions.price[1]) return false;
            return true;
        });
        setFilteredEvents(newFilteredEvents);
    }, [allEvents, filterOptions]);

    const handleDeleteEvent = async (event_id) => {
        if (!window.confirm("Are you sure you want to delete this event?")) return;

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/deleteevent`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ event_id, admin_id: adminIdCookie }),
            });
            if (response.ok) {
                alert("Event deleted successfully");
                fetchDashboardData();
            }
        } catch (error) {
            console.error("Delete Event Error:", error);
        }
    };

    const handleFilterClear = () => {
        setFilterOptions({ keyword: "", category: "", dateRange: "", price: [0, 5000] });
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <AdminNavBar />
            <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

            <main className="lg:pl-64 pt-16">
                <div className="p-4 md:p-8 max-w-7xl mx-auto">

                    {/* Header Section */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                {activeTab === "overview" && "Dashboard Overview"}
                                {activeTab === "events" && "Manage Events"}
                                {activeTab === "users" && "User Directory"}
                            </h1>
                            <p className="text-gray-500 text-sm mt-1">
                                Welcome back! Here's what's happening today.
                            </p>
                        </div>
                    </div>

                    {/* Stats Cards (Overview only) */}
                    {activeTab === "overview" && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            <StatCard label="Total Users" value={stats.totalUsers} icon={<HiOutlineUsers className="text-blue-600" />} color="blue" />
                            <StatCard label="Live Events" value={stats.totalEvents} icon={<HiOutlineCalendar className="text-indigo-600" />} color="indigo" />
                            <StatCard label="Total Revenue" value={`Rs. ${stats.totalRevenue}`} icon={<HiOutlineCurrencyRupee className="text-green-600" />} color="green" />
                            <StatCard label="Registrations" value={stats.totalRegistrations} icon={<HiOutlineChartBar className="text-purple-600" />} color="purple" />
                        </div>
                    )}

                    {/* Content Section */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">

                        {/* Overview (Stats + Events List) */}
                        {activeTab === "overview" && (
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-lg font-semibold text-gray-800">Recent Events</h2>
                                    <button onClick={() => setActiveTab("events")} className="text-indigo-600 text-sm font-medium hover:underline">View all</button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {allEvents.slice(0, 3).map((event) => (
                                        <AdminEventCard key={event.event_id} event={event} onDelete={handleDeleteEvent} />
                                    ))}
                                    {allEvents.length === 0 && <p className="text-gray-400 text-sm italic">No events created yet.</p>}
                                </div>
                            </div>
                        )}

                        {/* Events Tab */}
                        {activeTab === "events" && (
                            <div className="p-6">
                                <div className="flex flex-col lg:flex-row gap-8">
                                    <div className="w-full lg:w-1/4">
                                        <Dashboard_Filter
                                            filterOptions={filterOptions}
                                            setFilterOptions={setFilterOptions}
                                            handleFilterClear={handleFilterClear}
                                        />
                                    </div>
                                    <div className="w-full lg:w-3/4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {filteredEvents.map((event) => (
                                                <AdminEventCard key={event.event_id} event={event} onDelete={handleDeleteEvent} />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Users Tab */}
                        {activeTab === "users" && (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-gray-50 border-b border-gray-200">
                                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
                                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Registration #</th>
                                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Contact</th>
                                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Registered Events</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {allUsers.map((user) => (
                                            <tr key={user.user_token} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-10 w-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm">
                                                            {user.username?.[0]?.toUpperCase() || "U"}
                                                        </div>
                                                        <div>
                                                            <div className="text-sm font-semibold text-gray-900">{user.username}</div>
                                                            <div className="text-xs text-gray-500">{user.email}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-600 font-medium">{user.reg_number}</td>
                                                <td className="px-6 py-4 text-sm text-gray-600">{user.contactNumber}</td>
                                                <td className="px-6 py-4 text-sm text-gray-900 font-bold text-right">{user.registeredEvents?.length || 0}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {/* Test Tab */}
                        {activeTab === "test" && (
                            <div className="p-6">
                                <RabbitMQTest />
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}

function StatCard({ label, value, icon, color }) {
    const colorClasses = {
        blue: "bg-blue-50 border-blue-100",
        indigo: "bg-indigo-50 border-indigo-100",
        green: "bg-green-50 border-green-100",
        purple: "bg-purple-50 border-purple-100",
    };

    return (
        <div className={`p-6 rounded-2xl border ${colorClasses[color]} flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow`}>
            <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">{label}</span>
                <div className="p-2 bg-white rounded-lg shadow-sm">{icon}</div>
            </div>
            <div className="text-3xl font-extrabold text-gray-900">{value}</div>
        </div>
    );
}

function AdminEventCard({ event, onDelete }) {
    const router = useRouter();
    return (
        <div className="group relative bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-xl transition-all overflow-hidden flex flex-col h-full">
            <div className="relative h-48 overflow-hidden">
                <Image
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    src={event.profile || "https://i.etsystatic.com/15907303/r/il/c8acad/1940223106/il_794xN.1940223106_9tfg.jpg"}
                    alt={event.name}
                    sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute top-4 right-4 flex gap-2">
                    <button
                        onClick={(e) => { e.stopPropagation(); onDelete(event.event_id); }}
                        className="p-2 bg-white/90 backdrop-blur rounded-lg shadow-sm text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-black/5"
                    >
                        <HiOutlineTrash className="w-4 h-4" />
                    </button>
                </div>
            </div>
            <div className="p-5 flex flex-col flex-grow">
                <h3 className="font-bold text-gray-900 mb-2 truncate group-hover:text-indigo-600 transition-colors">{event.name}</h3>
                <div className="space-y-1 text-sm text-gray-500">
                    <div className="flex items-center gap-2"><HiOutlineCalendar className="w-4 h-4" /> {event.date}</div>
                    <div className="font-semibold text-gray-900 mt-2">Rs. {event.price}</div>
                </div>
                <button
                    onClick={() => router.push(`/event/${event.event_id}/adminevents`)}
                    className="w-full mt-auto pt-4 text-center text-sm font-bold text-indigo-600 hover:text-indigo-800"
                >
                    View Registrations →
                </button>
            </div>
        </div>
    );
}

export default AdminDashboard;
