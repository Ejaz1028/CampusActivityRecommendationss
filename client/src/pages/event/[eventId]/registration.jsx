import AdminNavBar from "@/components/AdminNavBar";
import { useState, useEffect } from "react";
import { HiOutlineCheck, HiOutlineSearch, HiOutlineUsers, HiOutlineViewList, HiOutlineClipboardCheck, HiOutlineArrowLeft } from "react-icons/hi";
import { useRouter } from "next/router";

const Registration = () => {
    const router = useRouter();
    const eventId = router.query.eventId;
    const [viewMode, setViewMode] = useState("all"); // "all" or "checklist"
    const [users, setUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);

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
                setUsers(data.participants || []);
            }
        } catch (error) {
            console.error("Error fetching attendee data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvent();
    }, [eventId]);

    const handleCheckboxChange = (userId) => {
        setUsers(users.map(user =>
            user.id === userId ? { ...user, checked: !user.checked } : user
        ));
    };

    const handleSubmit = async () => {
        const checkedUsers = users.filter(user => user.checked).map(user => user.id);
        if (checkedUsers.length === 0) {
            alert("No participants selected");
            return;
        }

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/event/checkin`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ event_id: eventId, checkInList: checkedUsers }),
            });
            if (response.ok) {
                alert("Check-in successful");
                router.reload();
            }
        } catch (error) {
            console.error("Check-in Error:", error);
        }
    };

    const filteredUsers = users.filter(user =>
    (user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 pb-12">
            <AdminNavBar />

            <div className="pt-24 px-4 max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                    <div>
                        <button
                            onClick={() => router.back()}
                            className="flex items-center gap-2 text-indigo-600 font-semibold text-sm mb-2 hover:translate-x-1 transition-transform"
                        >
                            <HiOutlineArrowLeft /> Back to Event
                        </button>
                        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Attendee Management</h1>
                        <p className="text-gray-500 mt-1">Manage registrations and coordinate check-ins.</p>
                    </div>

                    <div className="flex bg-white p-1 rounded-2xl border border-gray-200 shadow-sm">
                        <TabButton
                            active={viewMode === "all"}
                            onClick={() => setViewMode("all")}
                            label="All Attendees"
                            icon={<HiOutlineUsers />}
                        />
                        <TabButton
                            active={viewMode === "checklist"}
                            onClick={() => setViewMode("checklist")}
                            label="Check-in Mode"
                            icon={<HiOutlineClipboardCheck />}
                        />
                    </div>
                </div>

                {/* Filters & Search */}
                <div className="bg-white rounded-3xl p-4 shadow-sm border border-gray-200 mb-8 flex flex-col md:flex-row gap-4 items-center">
                    <div className="relative flex-grow w-full">
                        <HiOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                        />
                    </div>
                    <div className="text-sm font-medium text-gray-500 whitespace-nowrap px-4">
                        Showing {filteredUsers.length} participants
                    </div>
                </div>

                {/* Attendees Table */}
                <div className="bg-white rounded-[2.5rem] shadow-xl shadow-indigo-100/50 border border-indigo-50 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-indigo-50/50 border-b border-indigo-100">
                                    <th className="px-8 py-5 text-sm font-bold text-gray-700">Attendee</th>
                                    <th className="px-8 py-5 text-sm font-bold text-gray-700">Reg. Number</th>
                                    <th className="px-8 py-5 text-sm font-bold text-gray-700 text-center">Status</th>
                                    {viewMode === "checklist" && (
                                        <th className="px-8 py-5 text-sm font-bold text-gray-700 text-right">Selection</th>
                                    )}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredUsers.map((user) => (
                                    <tr key={user.id} className={`hover:bg-indigo-50/20 transition-colors ${user.checked ? "bg-indigo-50/10" : ""}`}>
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center font-bold text-xs shadow-md shadow-indigo-100">
                                                    {user.name?.[0]?.toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className="text-sm font-bold text-gray-900">{user.name}</div>
                                                    <div className="text-xs text-gray-500">{user.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 text-sm font-medium text-gray-600">{user.regno || user.reg_number}</td>
                                        <td className="px-8 py-5 text-center">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${user.entry
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-amber-100 text-amber-700"
                                                }`}>
                                                {user.entry ? "Checked In" : "Pending"}
                                            </span>
                                        </td>
                                        {viewMode === "checklist" && (
                                            <td className="px-8 py-5 text-right">
                                                {!user.entry && (
                                                    <input
                                                        type="checkbox"
                                                        checked={!!user.checked}
                                                        onChange={() => handleCheckboxChange(user.id)}
                                                        className="h-5 w-5 rounded-lg border-gray-300 text-indigo-600 focus:ring-indigo-500 accent-indigo-600 cursor-pointer"
                                                    />
                                                )}
                                            </td>
                                        )}
                                    </tr>
                                ))}
                                {filteredUsers.length === 0 && (
                                    <tr>
                                        <td colSpan="100%" className="px-8 py-12 text-center text-gray-400 italic">
                                            No attendees found matching your criteria.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Action Bar (Checklist mode only) */}
                {viewMode === "checklist" && (
                    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-md px-4 z-50 animate-bounce-subtle">
                        <button
                            onClick={handleSubmit}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-4 rounded-[2rem] shadow-2xl shadow-indigo-300 flex items-center justify-center gap-2 transition-all transform hover:scale-105"
                        >
                            <HiOutlineCheck className="w-6 h-6" />
                            Confirm Check-in for Selection
                        </button>
                    </div>
                )}
            </div>

            <style jsx>{`
                @keyframes bounce-subtle {
                    0%, 100% { transform: translate(-50%, 0); }
                    50% { transform: translate(-50%, -5px); }
                }
                .animate-bounce-subtle {
                    animation: bounce-subtle 2s infinite ease-in-out;
                }
            `}</style>
        </div>
    );
};

function TabButton({ active, onClick, label, icon }) {
    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${active
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                }`}
        >
            {icon}
            {label}
        </button>
    );
}

export default Registration;
