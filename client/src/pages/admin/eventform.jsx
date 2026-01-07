import AdminNavBar from "@/components/AdminNavBar";
import CreateEventForm from "@/components/CreateEventForm";
import Image from "next/image";
import React from "react";

function eventform() {
    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 md:px-8">
            <AdminNavBar />
            <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-12 items-start">
                {/* Left Side: Illustration/Image */}
                <div className="hidden lg:block w-1/2 sticky top-24">
                    <div className="relative group">
                        <div className="absolute -inset-4 bg-indigo-100 rounded-[3rem] blur-2xl opacity-50 group-hover:opacity-100 transition duration-1000"></div>
                        <Image
                            src="/img/eventsFormImg.jpg"
                            alt="Event Creation"
                            width={600}
                            height={800}
                            className="relative rounded-[2.5rem] shadow-2xl object-cover"
                        />
                        <div className="absolute bottom-10 left-10 p-6 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl text-white">
                            <h3 className="text-xl font-bold">Plan your event</h3>
                            <p className="text-sm opacity-80">Make it memorable for everyone.</p>
                        </div>
                    </div>
                </div>

                {/* Right Side: Form */}
                <div className="w-full lg:w-1/2">
                    <CreateEventForm />
                </div>
            </div>
        </div>
    );
}

export default eventform;
