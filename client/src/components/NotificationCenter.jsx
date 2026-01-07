import React, { useState, useEffect } from "react";
import { HiOutlineBell, HiOutlineX, HiOutlineAnnotation } from "react-icons/hi";

const NotificationCenter = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [hasUnread, setHasUnread] = useState(false);

    useEffect(() => {
        // SSE connection for real-time notifications
        const eventSource = new EventSource(`${process.env.NEXT_PUBLIC_API_URL}/admin/rabbitmq/stream`);

        eventSource.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.message) {
                const newNotification = {
                    id: Date.now(),
                    text: data.message,
                    time: new Date().toLocaleTimeString(),
                };
                setNotifications(prev => [newNotification, ...prev].slice(0, 10));
                setHasUnread(true);
            }
        };

        return () => eventSource.close();
    }, []);

    return (
        <div className="relative">
            <button
                onClick={() => { setIsOpen(!isOpen); setHasUnread(false); }}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors relative"
            >
                <HiOutlineBell className="w-6 h-6 text-gray-600" />
                {hasUnread && (
                    <span className="absolute top-2 right-2 w-3 h-3 bg-red-500 border-2 border-white rounded-full"></span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-4 w-80 bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden z-[100] animate-in fade-in zoom-in duration-200">
                    <div className="bg-indigo-600 p-4 text-white flex justify-between items-center">
                        <h3 className="font-bold flex items-center gap-2">
                            <HiOutlineAnnotation className="w-5 h-5" />
                            Notifications
                        </h3>
                        <button onClick={() => setIsOpen(false)}><HiOutlineX /></button>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="p-8 text-center text-gray-400 italic">
                                No new notifications
                            </div>
                        ) : (
                            notifications.map(notif => (
                                <div key={notif.id} className="p-4 border-b border-gray-50 hover:bg-indigo-50/30 transition-colors">
                                    <p className="text-sm text-gray-800">{notif.text}</p>
                                    <span className="text-[10px] text-gray-400 mt-1 block">{notif.time}</span>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationCenter;
