import { useState, useEffect } from "react";
import { HiOutlinePaperAirplane, HiOutlineDatabase, HiOutlineTerminal, HiOutlineCube, HiOutlineDotsVertical, HiOutlinePlusCircle } from "react-icons/hi";

export default function RabbitMQTest() {
    const [mode, setMode] = useState("builder"); // "builder" or "raw"
    const [messageType, setMessageType] = useState("event_update");
    const [builderData, setBuilderData] = useState({
        title: "Test Event",
        payload: "Something happened in the system!",
        priority: "medium",
        source: "Admin Dashboard"
    });
    const [rawMessage, setRawMessage] = useState("");
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isListening, setIsListening] = useState(true);

    const messagePresets = {
        event_update: { title: "New Event Created", payload: "A new tech symposium has been listed.", priority: "medium", source: "Event Engine" },
        user_alert: { title: "User Security Alert", payload: "Multiple failed login attempts detected.", priority: "high", source: "Auth Service" },
        system_notification: { title: "Maintenance Scheduled", payload: "System upgrade at 12:00 AM.", priority: "low", source: "Infrastructure" },
    };

    const handlePresetChange = (type) => {
        setMessageType(type);
        setBuilderData(messagePresets[type]);
    };

    const handlePublish = async (e) => {
        e.preventDefault();
        const payload = mode === "builder"
            ? JSON.stringify({ ...builderData, type: messageType, timestamp: new Date().toISOString() })
            : rawMessage;

        if (!payload.trim()) return;

        setLoading(true);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/rabbitmq/publish`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: payload }),
            });
            if (response.ok) {
                if (mode === "raw") setRawMessage("");
                addLog(`[Publisher] 📤 Sent message to exchange`, "sent", JSON.parse(payload));
            }
        } catch (error) {
            console.error("Publish Error:", error);
            addLog(`[Error] ❌ Failed to publish: ${error.message}`, "error");
        } finally {
            setLoading(false);
        }
    };

    const addLog = (title, type, content = null) => {
        const time = new Date().toLocaleTimeString();
        setLogs(prev => [{ title, type, content, time }, ...prev].slice(0, 50));
    };

    useEffect(() => {
        const eventSource = new EventSource(`${process.env.NEXT_PUBLIC_API_URL}/admin/rabbitmq/stream`);

        eventSource.onmessage = (event) => {
            const data = JSON.parse(event.data);
            // In our simple test, the backend "stream" just echoes back or acknowledges.
            // Let's treat incoming messages from the "Subscriber" exchange here.
            if (data.message && data.message !== "Connected to System Log Stream") {
                try {
                    const parsed = JSON.parse(data.message);
                    addLog(`[Subscriber] 📥 Received message from queue`, "received", parsed);
                } catch (e) {
                    addLog(`[Subscriber] 📥 Received: ${data.message}`, "received");
                }
            } else if (data.message === "Connected to System Log Stream") {
                addLog("System Subscriber Online", "info");
            }
        };

        eventSource.onerror = (err) => {
            console.error("SSE Error:", err);
            setIsListening(false);
        };

        return () => eventSource.close();
    }, []);

    return (
        <div className="space-y-8">
            <div className="flex flex-col lg:flex-row gap-8">
                {/* Publisher Section */}
                <div className="flex-grow bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-xl shadow-gray-100/50">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
                                <HiOutlinePaperAirplane className="w-6 h-6 rotate-45" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">Message Builder</h3>
                                <p className="text-sm text-gray-500 font-medium">Test RabbitMQ flow</p>
                            </div>
                        </div>
                        <div className="flex bg-gray-100 p-1 rounded-xl">
                            <button
                                onClick={() => setMode("builder")}
                                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${mode === "builder" ? "bg-white text-indigo-600 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                            >
                                GUI Builder
                            </button>
                            <button
                                onClick={() => setMode("raw")}
                                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${mode === "raw" ? "bg-white text-indigo-600 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                            >
                                Raw JSON
                            </button>
                        </div>
                    </div>

                    <form onSubmit={handlePublish} className="space-y-6">
                        {mode === "builder" ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <label className="block text-xs font-black uppercase tracking-widest text-gray-400">Message Preset</label>
                                    <div className="grid grid-cols-1 gap-2">
                                        {Object.keys(messagePresets).map(type => (
                                            <button
                                                key={type}
                                                type="button"
                                                onClick={() => handlePresetChange(type)}
                                                className={`text-left px-4 py-3 rounded-2xl border transition-all text-sm font-bold ${messageType === type
                                                        ? "border-indigo-600 bg-indigo-50 text-indigo-700 shadow-sm shadow-indigo-100"
                                                        : "border-gray-100 hover:border-gray-200 text-gray-600"
                                                    }`}
                                            >
                                                {type.replace(/_/g, ' ').toUpperCase()}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Title</label>
                                        <input
                                            value={builderData.title}
                                            onChange={(e) => setBuilderData({ ...builderData, title: e.target.value })}
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-gray-700"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Priority</label>
                                        <select
                                            value={builderData.priority}
                                            onChange={(e) => setBuilderData({ ...builderData, priority: e.target.value })}
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-gray-700 appearance-none"
                                        >
                                            <option value="low">Low</option>
                                            <option value="medium">Medium</option>
                                            <option value="high">High</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Source Service</label>
                                        <input
                                            value={builderData.source}
                                            onChange={(e) => setBuilderData({ ...builderData, source: e.target.value })}
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-gray-700"
                                        />
                                    </div>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Payload Content</label>
                                    <textarea
                                        value={builderData.payload}
                                        onChange={(e) => setBuilderData({ ...builderData, payload: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none font-medium text-gray-700"
                                        rows="3"
                                    />
                                </div>
                            </div>
                        ) : (
                            <div>
                                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Raw JSON Payload</label>
                                <textarea
                                    value={rawMessage}
                                    onChange={(e) => setRawMessage(e.target.value)}
                                    className="w-full px-4 py-4 bg-gray-900 text-green-400 font-mono text-sm border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none min-h-[300px]"
                                    placeholder='{ "key": "value" }'
                                />
                            </div>
                        )}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-5 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-[2rem] shadow-xl shadow-indigo-100 transition-all transform hover:-translate-y-1 active:translate-y-0 disabled:opacity-50 flex items-center justify-center gap-3"
                        >
                            {loading ? (
                                <div className="animate-spin h-5 w-5 border-2 border-white/30 border-t-white rounded-full" />
                            ) : (
                                <>Publish Message <HiOutlinePaperAirplane className="w-5 h-5 rotate-45" /></>
                            )}
                        </button>
                    </form>
                </div>

                {/* Subscriber / Log Section */}
                <div className="lg:w-[400px] flex flex-col gap-6">
                    <div className="bg-gray-900 rounded-[2.5rem] p-8 border border-gray-800 shadow-2xl flex flex-col h-[650px] overflow-hidden">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-3">
                                <div className={`p-2.5 rounded-xl ${isListening ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                                    <HiOutlineTerminal className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white leading-tight">Subscriber Console</h3>
                                    <div className="flex items-center gap-1.5 mt-0.5">
                                        <div className={`h-1.5 w-1.5 rounded-full ${isListening ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-wider">{isListening ? 'Live Tracking' : 'Offline'}</p>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => setLogs([])}
                                className="text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-white transition-colors p-2"
                            >
                                Clear
                            </button>
                        </div>

                        <div className="flex-grow overflow-y-auto space-y-4 pr-1 custom-scrollbar">
                            {logs.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full opacity-30">
                                    <HiOutlineCube className="w-12 h-12 text-gray-400 mb-4" />
                                    <p className="text-sm font-mono text-gray-500 italic">Listening for messages...</p>
                                </div>
                            ) : (
                                logs.map((log, i) => (
                                    <div key={i} className={`p-4 rounded-3xl border border-white/5 animate-in fade-in slide-in-from-right-4 duration-300 ${log.type === 'error' ? 'bg-red-500/10 border-red-500/20' :
                                            log.type === 'info' ? 'bg-blue-500/10 border-blue-500/20' :
                                                log.type === 'received' ? 'bg-green-500/10 border-green-500/20' : 'bg-white/5'
                                        }`}>
                                        <div className="flex items-center justify-between mb-2">
                                            <span className={`text-[10px] font-black uppercase tracking-widest ${log.type === 'sent' ? 'text-indigo-400' :
                                                    log.type === 'received' ? 'text-green-400' :
                                                        log.type === 'error' ? 'text-red-400' : 'text-blue-400'
                                                }`}>{log.title}</span>
                                            <span className="text-[10px] text-gray-500 font-mono">{log.time}</span>
                                        </div>
                                        {log.content && (
                                            <pre className="text-[11px] text-gray-300 font-mono bg-black/40 p-3 rounded-2xl overflow-x-auto">
                                                {JSON.stringify(log.content, null, 2)}
                                            </pre>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 255, 255, 0.2);
                }
            `}</style>
        </div>
    );
}
