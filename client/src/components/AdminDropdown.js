import React, { useState, useRef, useEffect } from "react";
import { HiOutlineChevronDown, HiOutlineLogout, HiOutlineUserCircle, HiOutlineMail } from "react-icons/hi";
import { useRouter } from "next/router";
import { removeAdminToken } from "@/utils/removeAdminToken";

export default function Dropdown({ adminData }) {
    const router = useRouter();
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);

    const toggleDropdown = () => setShowDropdown(!showDropdown);

    const handleLogout = () => {
        removeAdminToken();
        router.push("/");
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={toggleDropdown}
                className="flex items-center gap-2 pl-3 pr-4 py-2 bg-indigo-50 hover:bg-indigo-100/80 text-indigo-700 font-bold rounded-xl transition-all border border-indigo-100"
            >
                <div className="h-7 w-7 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs shadow-sm capitalize">
                    {adminData.name?.[0] || 'A'}
                </div>
                <span className="text-sm">Admin</span>
                <HiOutlineChevronDown className={`w-4 h-4 transition-transform ${showDropdown ? "rotate-180" : ""}`} />
            </button>

            {showDropdown && (
                <div className="absolute right-0 mt-3 w-72 bg-white rounded-3xl shadow-2xl shadow-indigo-200/50 border border-indigo-50 z-[100] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="p-6 bg-gradient-to-br from-indigo-600 to-purple-700 text-white">
                        <div className="flex items-center gap-4 mb-2">
                            <div className="h-12 w-12 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center font-black text-xl shadow-lg capitalize font-mono">
                                {adminData.name?.[0] || 'A'}
                            </div>
                            <div className="overflow-hidden">
                                <div className="font-bold truncate text-lg leading-tight">{adminData.name}</div>
                                <div className="text-xs text-white/70 truncate uppercase tracking-widest font-bold mt-1">System Admin</div>
                            </div>
                        </div>
                    </div>

                    <div className="p-2">
                        <div className="px-4 py-3 hover:bg-gray-50 rounded-2xl flex items-center gap-3 transition-colors">
                            <HiOutlineMail className="w-5 h-5 text-gray-400" />
                            <div className="overflow-hidden">
                                <div className="text-[10px] uppercase tracking-widest font-black text-gray-400">Email Address</div>
                                <div className="text-sm font-semibold text-gray-700 truncate">{adminData.email}</div>
                            </div>
                        </div>

                        <div className="h-px bg-gray-100 my-2 mx-4" />

                        <button
                            onClick={handleLogout}
                            className="w-full px-4 py-4 hover:bg-red-50 text-red-600 rounded-2xl flex items-center gap-3 transition-colors group"
                        >
                            <HiOutlineLogout className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                            <span className="font-bold text-sm">Sign Out Safely</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
