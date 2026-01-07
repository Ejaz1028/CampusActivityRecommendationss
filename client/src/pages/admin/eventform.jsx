import AdminNavBar from "@/components/AdminNavBar";
import CreateEventForm from "@/components/CreateEventForm";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import AdminSidebar from "@/components/AdminSidebar";

function eventform() {
    const [activeTab, setActiveTab] = useState("events"); // Default to events for this page

    return (
        <div className="min-h-screen bg-gray-50">
            <AdminNavBar />
            <AdminSidebar activeTab={activeTab} setActiveTab={(tab) => {
                if (tab !== "events") {
                    window.location.href = "/admin/dashboard?tab=" + tab;
                }
            }} />

            <main className="lg:pl-64 pt-16">
                <div className="p-4 md:p-8 max-w-7xl mx-auto flex flex-col lg:flex-row gap-12 items-start">
                    {/* Form Section */}
                    <div className="w-full">
                        <div className="flex flex-col lg:flex-row gap-12 items-start">
                            <div className="hidden lg:block w-1/3 sticky top-24">
                                <div className="relative group">
                                    <div className="absolute -inset-4 bg-indigo-100 rounded-[3rem] blur-2xl opacity-50 group-hover:opacity-100 transition duration-1000"></div>
                                    <Image
                                        src="/img/eventsFormImg.jpg"
                                        alt="Event Creation"
                                        width={600}
                                        height={800}
                                        className="relative rounded-[2.5rem] shadow-2xl object-cover"
                                    />
                                </div>
                            </div>

                            <div className="w-full lg:w-2/3">
                                <CreateEventForm />
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default eventform;
