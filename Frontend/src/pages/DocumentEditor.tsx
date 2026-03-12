import { useParams } from "react-router-dom";
import { useState } from "react";

import Sidebar from "../components/Sidebar";
import Editor from "../components/Editor";
import Chat from "../components/Chat";
import AIPanel from "../components/AIPanel";
import ShareDocument from "../components/ShareDocument";
import DocumentTitle from "../components/DocumentTitle";

export default function DocumentEditor() {

    const { id } = useParams();
    const [content, setContent] = useState("");

    if (!id) return null;

    return (

        <div className="flex h-screen">

            {/* Sidebar */}
            <Sidebar />

            {/* Main Area */}
            <div className="flex-1 flex flex-col">

                {/* Top Bar */}
                <div className="flex items-center justify-between border-b p-4">

                    <DocumentTitle documentId={id} />

                    <div className="w-80">
                        <ShareDocument documentId={id} />
                    </div>

                </div>

                {/* Editor + Chat + AI */}
                <div className="flex flex-1">

                    {/* Editor */}
                    <div className="flex-1 p-4">
                        <Editor
                            documentId={id}
                            onContentChange={setContent}
                        />
                    </div>

                    {/* Chat */}
                    <div className="w-80 border-l">
                        <Chat documentId={id} />
                    </div>

                    {/* AI Panel */}
                    <div className="w-80 border-l">
                        <AIPanel content={content} />
                    </div>

                </div>

            </div>

        </div>

    );

}