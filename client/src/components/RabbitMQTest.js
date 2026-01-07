import { useState, useEffect } from "react";
import { HiOutlinePaperAirplane, HiOutlineDatabase, HiOutlineTerminal } from "react-icons/hi";

export default function RabbitMQTest() {
    const [publishMessage, setPublishMessage] = useState("");
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(false);

    const handlePublish = async (e) => {
        e.preventDefault();
        if (!publishMessage.trim()) return;

        setLoading(true);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/rabbitmq/publish`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: publishMessage }),
            });
            if (response.ok) {
                setPublishMessage("");
                // Optionally add to local logs immediately or wait for subscription
                addLog(`[Publisher] Sent: ${publishMessage}`);
            }
        } catch (error) {
            console.error("Publish Error:", error);
            addLog(`[Error] Failed to publish: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const addLog = (msg) => {
        const time = new Date().toLocaleTimeString();
        setLogs(prev => [`[${time}] ${msg}`, ...prev].slice(0, 50));
    };

    // Simulate "Subscriber" via SSE or just showing test data for now
    // In a real scenario, this would listen to an SSE stream from the backend
    useEffect(() => {
        const eventSource = new EventSource(`${process.env.NEXT_PUBLIC_API_URL}/admin/rabbitmq/stream`);

        eventSource.onmessage = (event) => {
            const data = JSON.parse(event.data);
            addLog(`[Subscriber] Received: ${data.message}`);
        };

        eventSource.onerror = (err) => {
            console.error("SSE Error:", err);
            // eventSource.close();
        };

        return () => eventSource.close();
    }, []);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Publisher UI */}
            <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                        <HiOutlinePaperAirplane className="w-6 h-6 rotate-45" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-gray-900">Message Publisher</h3>
                        <p className="text-sm text-gray-500">Send test data to RabbitMQ exchange</p>
                    </div>
                </div>

                <form onSubmit={handlePublish} className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Message Payload</label>
                        <textarea
                            value={publishMessage}
                            onChange={(e) => setPublishMessage(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            rows="4"
                            placeholder='{"type": "test", "content": "Hello RabbitMQ!"}'
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 flex items-center justify-center gap-2"
                    >
                        {loading ? "Publishing..." : <>Publish Message <HiOutlinePaperAirplane className="rotate-45" /></>}
                    </button>
                </form>
            </div>

            {/* Subscriber UI */}
            <div className="bg-gray-900 rounded-[2rem] p-8 border border-gray-800 shadow-2xl flex flex-col h-[500px]">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-green-500/10 text-green-500 rounded-2xl">
                            <HiOutlineTerminal className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white">System Logs</h3>
                            <p className="text-sm text-gray-400">Subscriber Activity</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setLogs([])}
                        className="text-xs font-bold text-gray-500 hover:text-white transition-colors"
                    >
                        Clear Logs
                    </button>
                </div>

                <div className="flex-grow overflow-y-auto font-mono text-xs space-y-2 custom-scrollbar">
                    {logs.length === 0 ? (
                        <div className="text-gray-600 italic">Waiting for messages...</div>
                    ) : (
                        logs.map((log, i) => (
                            <div key={i} className={`p-2 rounded ${log.includes('Error') ? 'bg-red-500/10 text-red-400' : log.includes('Received') ? 'text-green-400' : 'text-blue-400'}`}>
                                {log}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
