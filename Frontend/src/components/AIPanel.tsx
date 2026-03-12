import { useState } from "react";
import axios from "axios";

interface Props {
    content: string;
}

export default function AIPanel({ content }: Props) {

    const [result, setResult] = useState("");
    const [loading, setLoading] = useState(false);

    const token = localStorage.getItem("token");

    const callAI = async (endpoint: string) => {

        if (!content || content.trim() === "") {
            setResult("Document is empty.");
            return;
        }

        try {

            setLoading(true);
            setResult("");

            const res = await axios.post(
                `https://syncdoc.onrender.com/api/ai/${endpoint}`,
                { content },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setResult(res.data.result);

        } catch (error) {

            console.error("AI request failed:", error);
            setResult("AI request failed.");

        } finally {

            setLoading(false);

        }

    };

    return (

        <div className="flex flex-col h-full border-l bg-white">

            {/* Header */}
            <div className="p-4 font-bold border-b">
                AI Assistant
            </div>

            {/* Buttons */}
            <div className="p-4 space-y-3">

                <button
                    onClick={() => callAI("summarize")}
                    className="bg-blue-600 text-white px-3 py-2 rounded w-full"
                >
                    Summarize
                </button>

                <button
                    onClick={() => callAI("grammar")}
                    className="bg-green-600 text-white px-3 py-2 rounded w-full"
                >
                    Fix Grammar
                </button>

                <button
                    onClick={() => callAI("rewrite")}
                    className="bg-purple-600 text-white px-3 py-2 rounded w-full"
                >
                    Rewrite
                </button>

            </div>

            {/* Result Panel */}
            <div className="flex-1 overflow-y-auto p-4 border-t text-sm whitespace-pre-wrap">

                {loading
                    ? "AI is generating response..."
                    : result || "AI response will appear here."}

            </div>

        </div>

    );

}
