import Dashboard_Filter from "@/components/Dashboard_Filter";
import Popup_Filter from "@/components/Popup_Filter";
import UserNavBar from "@/components/UserNavBar";
import Image from "next/image";
import { useEffect, useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { FaUsers } from "react-icons/fa";

function UserDashboard() {
    // State hooks
    const [allEvents, setAllEvents] = useState([]);
    const [popupFilterOpen, setPopupFilterOpen] = useState(false);
    const [filterOptions, setFilterOptions] = useState({
        keyword: "",
        category: "",
        dateRange: "",
        price: [10, 3000],
    });

    // Fetch events from your API
    const fetchAllEvents = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/getallevents`);
            if (!response.ok) {
                throw new Error(`Failed to fetch events, Status: ${response.status}`);
            }
            const data = await response.json();
            console.log("Fetched events:", data);
            setAllEvents(data);
        } catch (error) {
            console.error("Error fetching events:", error);
        }
    };

    useEffect(() => {
        fetchAllEvents();
    }, []);

    // Setup WebSocket for event notifications
    useEffect(() => {
        const socket = new WebSocket("ws://localhost:8080"); // Ensure this matches your backend's port

        socket.addEventListener("open", () => {
            console.log("✅ Connected to WebSocket server");
        });

        socket.addEventListener("message", (event) => {
            try {
                const eventData = JSON.parse(event.data);
                console.log("📩 New event received:", eventData);
                alert(`New Event Added: ${eventData.name} is happening on ${eventData.date}`);
            } catch (error) {
                console.error("Error parsing WebSocket message:", error);
            }
        });

        socket.addEventListener("close", () => {
            console.log("❌ WebSocket connection closed.");
        });

        socket.addEventListener("error", (error) => {
            console.error("⚠️ WebSocket error:", error);
        });

        return () => {
            socket.close();
        };
    }, []);

    // Filter events based on filterOptions
    const [filteredEvents, setFilteredEvents] = useState([]);
    useEffect(() => {
        if (allEvents.length > 0) {
            setFilteredEvents(
                allEvents.filter((event) => {
                    // Keyword filter
                    if (
                        filterOptions.keyword &&
                        !event.name.toLowerCase().includes(filterOptions.keyword.toLowerCase())
                    ) {
                        return false;
                    }
                    // Date filter
                    if (filterOptions.dateRange) {
                        const eventDate = new Date(event.date.split("/").reverse().join("-"));
                        const filterDate = new Date(filterOptions.dateRange);
                        if (eventDate < filterDate) return false;
                    }
                    // Price filter
                    if (
                        event.price < filterOptions.price[0] ||
                        event.price > filterOptions.price[1]
                    ) {
                        return false;
                    }
                    return true;
                })
            );
        }
    }, [allEvents, filterOptions]);

    const handleFilterClear = () => {
        setFilterOptions({
            keyword: "",
            category: "",
            dateRange: "",
            price: [10, 3000],
        });
        setFilteredEvents(allEvents);
        setPopupFilterOpen(false);
    };

    const handleEventClick = (eventId) => {
        window.location.href = `/event/${eventId}`;
    };

    return (
        <div className="pt-20 lg:pt-8 overflow-y-hidden bg-[color:var(--primary-color)]">
            <UserNavBar />
            <div className="flex m-auto">
                <div className="flex mx-auto container">
                    <div className="flex m-auto overflow-y-hidden gap-4 lg:gap-8 w-full h-[calc(88vh)]">
                        {/* Sidebar Filter */}
                        <div className="hidden md:flex flex-col p-4 sticky top-0 w-1/6 md:w-1/4">
                            <Dashboard_Filter
                                filterOptions={filterOptions}
                                setFilterOptions={setFilterOptions}
                                handleFilterClear={handleFilterClear}
                            />
                        </div>
                        {/* Popup Filter for mobile */}
                        {popupFilterOpen && (
                            <div className="md:hidden fixed inset-0 z-10 bg-black bg-opacity-50 flex items-center justify-center">
                                <div className="bg-white rounded-lg p-4 w-5/6">
                                    <Popup_Filter
                                        filterOptions={filterOptions}
                                        setFilterOptions={setFilterOptions}
                                        handleFilterClear={handleFilterClear}
                                        handleClose={() => setPopupFilterOpen(false)}
                                    />
                                </div>
                            </div>
                        )}
                        {/* Main Dashboard Content */}
                        <div className="flex w-full md:w-3/4 mx-auto justify-between container">
                            <div className="p-4 overflow-y-auto w-full h-[calc(80vh)]">
                                <h2 className="text-lg font-medium mb-4">Events</h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                                    {filteredEvents.length === 0 ? (
                                        <p>No events yet</p>
                                    ) : (
                                        filteredEvents.map((event) => (
                                            <div
                                                key={event._id}
                                                onClick={() => handleEventClick(event.event_id)}
                                                className="hover:scale-105 cursor-pointer transition-all mt-5 bg-[color:var(--white-color)] rounded-lg shadow-md px-3 py-3"
                                            >
                                                <div className="relative h-[25rem]">
                                                    {event.profile ? (
                                                        <Image
                                                            fill
                                                            className="object-cover h-full w-full rounded-md"
                                                            src={event.profile}
                                                            alt={event.name || "Event Image"}
                                                            sizes="(min-width: 640px) 100vw, 50vw"
                                                            priority
                                                        />
                                                    ) : (
                                                        <div className="bg-gray-300 h-full w-full rounded-md flex items-center justify-center">
                                                            <span>No Image</span>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex flex-row justify-between items-start mt-4">
                                                    <div className="px-2">
                                                        <p className="text-sm text-gray-800 font-bold">
                                                            {event.name.length > 30
                                                                ? event.name.slice(0, 30) + "..."
                                                                : event.name}
                                                        </p>
                                                        <p className="text-sm text-gray-800">{event.venue}</p>
                                                        <p className="text-sm text-gray-800">{event.date}</p>
                                                    </div>
                                                    <div className="flex flex-col justify-end items-center">
                                                        <span className="w-full flex flex-row items-center">
                                                            <FaUsers />
                                                            <span className="ml-2 text-sm">4,92</span>
                                                        </span>
                                                        <p className="text-sm text-gray-800 mt-2">
                                                            <strong className="whitespace-nowrap">
                                                                Rs: {event.price}
                                                            </strong>
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                        {/* Bottom Button for Mobile Filter */}
                        <div className="fixed bottom-3 right-3">
                            <button
                                onClick={() => setPopupFilterOpen(true)}
                                className="md:hidden flex items-center justify-center w-[4rem] h-[4rem] text-white rounded-full bg-[color:var(--darker-secondary-color)] hover:bg-[color:var(--secondary-color)] hover:scale-105 shadow-lg cursor-pointer transition-all ease-in-out"
                            >
                                <AiOutlinePlus size={24} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UserDashboard;
