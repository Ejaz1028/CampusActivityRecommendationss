import { useRouter } from "next/router";
import { HiOutlineChartBar, HiOutlineUsers, HiOutlineCalendar, HiOutlineViewGrid } from "react-icons/hi";

export default function AdminSidebar({ activeTab, setActiveTab }) {
    const router = useRouter();

    const menuItems = [
        { id: "overview", label: "Overview", icon: <HiOutlineChartBar className="w-5 h-5" /> },
        { id: "events", label: "Manage Events", icon: <HiOutlineCalendar className="w-5 h-5" /> },
        { id: "users", label: "Registered Users", icon: <HiOutlineUsers className="w-5 h-5" /> },
        { id: "test", label: "System Test (RabbitMQ)", icon: <HiOutlineViewGrid className="w-5 h-5" /> },
    ];

    return (
        <aside className="w-64 bg-white border-r border-gray-200 h-[calc(100vh-64px)] fixed left-0 top-16 hidden lg:block overflow-y-auto">
            <div className="p-6">
                <nav className="space-y-1">
                    {menuItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all ${activeTab === item.id
                                ? "bg-indigo-50 text-indigo-700 shadow-sm"
                                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                }`}
                        >
                            {item.icon}
                            {item.label}
                        </button>
                    ))}
                </nav>
            </div>

            <div className="absolute bottom-0 w-full p-6 border-t border-gray-100 bg-gray-50/50">
                <button
                    onClick={() => router.push("/admin/eventform")}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-200"
                >
                    <HiOutlineViewGrid className="w-4 h-4" />
                    Create Event
                </button>
            </div>
        </aside>
    );
}
