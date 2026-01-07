import { getAdminToken } from "@/utils/getAdminToken";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import AdminDropdown from "@/components/AdminDropdown";

export default function NavBar() {
    const router = useRouter();
    const adminIdCookie = getAdminToken();
    const [adminData, setAdminData] = useState({});

    const fetchAdminData = async () => {
        if (!adminIdCookie) {
            router.push("/admin/auth");
            return;
        }
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/admin/details`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ admin_id: adminIdCookie }),
                }
            );
            if (response.ok) {
                const data = await response.json();
                setAdminData(data);
            }
        } catch (error) {
            console.error("Fetch Admin Data Error:", error);
        }
    };

    useEffect(() => {
        fetchAdminData();
    }, []);

    return (
        <header className="fixed top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                <div
                    onClick={() => router.push("/admin/dashboard")}
                    className="flex items-center gap-2 cursor-pointer transition-transform hover:scale-105"
                >
                    <Image
                        src="/favicon_io/android-chrome-192x192.png"
                        width={32}
                        height={32}
                        alt="Logo"
                        className="rounded-lg shadow-sm"
                    />
                    <h1 className="text-xl font-extrabold tracking-tight text-gray-900">
                        In<span className="text-indigo-600">VIT</span>e
                    </h1>
                </div>

                <div className="flex items-center gap-4">
                    <nav className="hidden md:flex items-center gap-6">
                        <button
                            onClick={() => router.push("/admin/dashboard")}
                            className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors"
                        >
                            Dashboard
                        </button>
                        <button
                            onClick={() => router.push("/")}
                            className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors"
                        >
                            Site Home
                        </button>
                    </nav>
                    <div className="h-6 w-px bg-gray-200 hidden md:block" />
                    <AdminDropdown adminData={adminData} />
                </div>
            </div>
        </header>
    );
}
