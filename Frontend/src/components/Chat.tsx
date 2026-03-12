import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { socket } from "../services/socket";

interface Message {
    _id?: string;
    message?: string;
    fileUrl?: string;
    sender?: {
        name: string;
    };
    timestamp?: string;
}

interface Props {
    documentId: string;
}

export default function Chat({ documentId }: Props) {

    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [file, setFile] = useState<File | null>(null);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const token = localStorage.getItem("token");
    const user = localStorage.getItem("name") || "User";

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({
            behavior: "smooth"
        });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);


    useEffect(() => {

        const loadMessages = async () => {

            try {

                const res = await axios.get(
                    `https://syncdoc.onrender.com/api/chat/${documentId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                setMessages(res.data);

            } catch (error) {

                console.error("Failed to load chat history");

            }

        };

        loadMessages();

    }, [documentId]);

    useEffect(() => {

        socket.on("receive-message", (data) => {

            setMessages((prev) => [...prev, data]);

        });

        return () => {
            socket.off("receive-message");
        };

    }, []);

    const sendMessage = async () => {

        if (!input.trim() && !file) return;

        try {

            const formData = new FormData();

            formData.append("documentId", documentId);

            if (input) formData.append("message", input);

            if (file) formData.append("file", file);

            const res = await axios.post(
                "https://syncdoc.onrender.com/api/chat",
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            socket.emit("send-message", {
                documentId,
                message: res.data.message,
                fileUrl: res.data.fileUrl,
                user
            });

            setInput("");
            setFile(null);

        } catch (error) {

            console.error("Failed to send message");

        }

    };

    return (

        <div className="flex flex-col h-full border-l bg-white">

            <div className="p-4 font-bold border-b">
                Chat
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">

                {messages.map((msg, index) => (

                    <div key={index}>

                        <div className="font-semibold text-blue-600">
                            {msg.sender?.name}
                        </div>

                        {msg.message && (
                            <div className="text-gray-800">
                                {msg.message}
                            </div>
                        )}

                        {msg.fileUrl && (
                            <a
                                href={msg.fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500 underline"
                            >
                                View File
                            </a>
                        )}

                    </div>

                ))}

                <div ref={messagesEndRef}></div>

            </div>

            <div className="p-3 border-t flex items-center gap-2">

                <input
                    type="text"
                    placeholder="Type message..."
                    className="flex-1 border rounded p-2"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            sendMessage();
                        }
                    }}
                />

                <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-2 border rounded"
                >
                    📎
                </button>

                <input
                    type="file"
                    ref={fileInputRef}
                    hidden
                    onChange={(e) => {
                        if (e.target.files) {
                            setFile(e.target.files[0]);
                        }
                    }}
                />

                <button
                    onClick={sendMessage}
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                    Send
                </button>

            </div>

        </div>

    );

}
