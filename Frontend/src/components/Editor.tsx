import { useEffect, useRef, useState } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import axios from "axios";
import { socket } from "../services/socket";

interface Props {
    documentId: string;
    onContentChange?: (content: string) => void;
}

export default function Editor({ documentId, onContentChange }: Props) {

    const editorRef = useRef<HTMLDivElement | null>(null);
    const quillRef = useRef<Quill | null>(null);

    const [users, setUsers] = useState<string[]>([]);

    // Get logged-in user name
    const user = localStorage.getItem("name") || "User";

    socket.emit("join-document", {
        documentId,
        user
    });

    // Initialize editor
    useEffect(() => {

        if (!editorRef.current || quillRef.current) return;

        const quill = new Quill(editorRef.current, {
            theme: "snow",
            modules: {
                toolbar: [
                    [{ header: [1, 2, 3, false] }],
                    ["bold", "italic", "underline", "strike"],
                    [{ list: "ordered" }, { list: "bullet" }],
                    ["blockquote", "code-block"],
                    ["link"],
                    ["clean"]
                ]
            }
        });

        quillRef.current = quill;

        // Send changes
        quill.on("text-change", (delta, _oldDelta, source) => {

            if (source !== "user") return;

            socket.emit("send-changes", {
                documentId,
                delta
            });

            const content = quill.root.innerHTML;

            if (onContentChange) {
                onContentChange(content);
            }

        });

    }, []);

    // Join document room
    useEffect(() => {

        socket.emit("join-document", {
            documentId,
            user
        });

    }, [documentId]);

    // Receive document changes
    useEffect(() => {

        socket.off("receive-changes");

        socket.on("receive-changes", (delta) => {

            if (!quillRef.current) return;

            quillRef.current.updateContents(delta);

        });

        return () => {
            socket.off("receive-changes");
        };

    }, []);

    // Active users listener
    useEffect(() => {

        socket.off("active-users");

        socket.on("active-users", (activeUsers) => {

            setUsers(activeUsers);

        });

        return () => {
            socket.off("active-users");
        };

    }, []);

    // Load document
    useEffect(() => {

        const loadDocument = async () => {

            try {

                const token = localStorage.getItem("token");

                const res = await axios.get(
                    `http://localhost:5000/api/documents/${documentId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                if (quillRef.current) {
                    quillRef.current.root.innerHTML = res.data.content;
                }

            } catch (error) {
                console.error("Failed to load document");
            }

        };

        loadDocument();

    }, [documentId]);

    // Auto save
    useEffect(() => {

        const interval = setInterval(async () => {

            try {

                const token = localStorage.getItem("token");

                const content = quillRef.current?.root.innerHTML;

                await axios.put(
                    `http://localhost:5000/api/documents/${documentId}`,
                    { content },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

            } catch (error) {

                console.error("Auto-save failed");

            }

        }, 2000);

        return () => clearInterval(interval);

    }, [documentId]);

    return (

        <div className="flex flex-col h-full">

            <div className="text-sm text-gray-600 mb-2">

                {users.length > 0 && (
                    <div>
                        Active users: {users.join(", ")}
                    </div>
                )}

            </div>

            <div
                ref={editorRef}
                className="flex-1 bg-white rounded shadow-sm"
            />

        </div>

    );

}