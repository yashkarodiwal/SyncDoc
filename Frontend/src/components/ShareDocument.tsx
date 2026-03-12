import { useState } from "react";
import axios from "axios";

interface Props {
    documentId: string;
}

export default function ShareDocument({ documentId }: Props) {

    const [email, setEmail] = useState("");
    const [role, setRole] = useState("viewer");
    const [message, setMessage] = useState("");

    const token = localStorage.getItem("token");

    const shareDocument = async () => {

        try {

            await axios.post(
                "http://localhost:5000/api/documents/share",
                {
                    documentId,
                    email,
                    role
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setMessage("Document shared successfully!");

            setEmail("");

        } catch (error) {

            console.error("Share failed");

            setMessage("Failed to share document");

        }

    };

    return (

        <div className="p-4 border-b bg-gray-50">

            <h3 className="font-semibold mb-2">
                Share Document
            </h3>

            <input
                type="email"
                placeholder="Enter user email"
                className="border p-2 w-full mb-2 rounded"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />

            <select
                className="border p-2 w-full mb-2 rounded"
                value={role}
                onChange={(e) => setRole(e.target.value)}
            >
                <option value="viewer">Viewer</option>
                <option value="editor">Editor</option>
            </select>

            <button
                onClick={shareDocument}
                className="bg-blue-600 text-white px-4 py-2 rounded w-full"
            >
                Share
            </button>

            {message && (

                <div className="text-sm mt-2 text-gray-600">
                    {message}
                </div>

            )}

        </div>

    );

}