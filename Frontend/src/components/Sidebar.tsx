import { useNavigate } from "react-router-dom";

export default function Sidebar() {

    const navigate = useNavigate();

    const logout = () => {

        localStorage.removeItem("token");

        navigate("/login");

    };

    return (

        <div className="w-60 bg-gray-900 text-white flex flex-col h-full">

            <div className="p-4 text-lg font-bold border-b border-gray-700">
                SyncDoc
            </div>

            <div className="flex-1 p-4 space-y-3">

                <button
                    onClick={() => navigate("/")}
                    className="block w-full text-left px-3 py-2 rounded hover:bg-gray-700"
                >
                    Dashboard
                </button>

                <button
                    className="block w-full text-left px-3 py-2 rounded hover:bg-gray-700"
                >
                    Documents
                </button>

                <button
                    className="block w-full text-left px-3 py-2 rounded hover:bg-gray-700"
                >
                    AI Tools
                </button>

                <button
                    className="block w-full text-left px-3 py-2 rounded hover:bg-gray-700"
                >
                    Users
                </button>

            </div>

            <div className="p-4 border-t border-gray-700">

                <button
                    onClick={logout}
                    className="w-full bg-red-500 px-3 py-2 rounded"
                >
                    Logout
                </button>

            </div>

        </div>

    );

}