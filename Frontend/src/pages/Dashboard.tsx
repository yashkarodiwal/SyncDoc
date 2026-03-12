import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import Sidebar from "../components/Sidebar";

interface Document {
    _id: string;
    title: string;
    updatedAt: string;
}

export default function Dashboard() {

    const [documents, setDocuments] = useState<Document[]>([]);

    const navigate = useNavigate();

    const token = localStorage.getItem("token");

    // LOAD DOCUMENTS
    useEffect(() => {

        const fetchDocuments = async () => {

            try {

                const res = await axios.get(
                    "http://localhost:5000/api/documents",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                setDocuments(res.data);

            } catch (error) {

                console.error("Failed to load documents");

            }

        };

        fetchDocuments();

    }, []);


    // CREATE DOCUMENT
    const createDocument = async () => {

        try {

            const res = await axios.post(
                "http://localhost:5000/api/documents",
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            navigate(`/document/${res.data._id}`);

        } catch (error) {

            console.error("Failed to create document");

        }

    };


    return (

        <div className="flex h-screen">

            {/* Sidebar */}
            <Sidebar />

            {/* Main */}
            <div className="flex-1 p-8 bg-gray-100">

                {/* Header */}
                <div className="flex justify-between items-center mb-8">

                    <h1 className="text-2xl font-bold">
                        Dashboard
                    </h1>

                    <button
                        onClick={createDocument}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                    >
                        + New Document
                    </button>

                </div>

                {/* Documents */}
                {documents.length === 0 ? (

                    <div className="text-gray-500">
                        No documents yet. Create your first document.
                    </div>

                ) : (

                    <div className="grid grid-cols-3 gap-6">

                        {documents.map((doc) => (

                            <div
                                key={doc._id}
                                onClick={() => navigate(`/document/${doc._id}`)}
                                className="bg-white p-5 rounded-lg shadow hover:shadow-lg cursor-pointer transition"
                            >

                                <h2 className="font-semibold text-lg mb-2">
                                    {doc.title || "Untitled Document"}
                                </h2>

                                <p className="text-sm text-gray-500">
                                    Last updated:{" "}
                                    {new Date(doc.updatedAt).toLocaleDateString()}
                                </p>

                            </div>

                        ))}

                    </div>

                )}

            </div>

        </div>

    );

}