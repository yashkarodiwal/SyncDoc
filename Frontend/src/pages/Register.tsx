import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const register = async (e: React.FormEvent) => {

        e.preventDefault();

        try {

            const res = await axios.post(
                "http://localhost:5000/api/auth/register",
                { name, email, password }
            );

            localStorage.setItem("token", res.data.token);
            localStorage.setItem("name", res.data.name);

            navigate("/");

        } catch (err: any) {

            setError(err.response?.data?.message || "Registration failed");

        }

    };

    return (

        <div className="min-h-screen flex items-center justify-center bg-gray-100">

            <div className="bg-white p-8 rounded-lg shadow-md w-96">

                <h1 className="text-3xl font-bold text-center mb-2">
                    SyncDoc
                </h1>

                <p className="text-center text-gray-500 mb-6">
                    Create your account
                </p>

                {error && (
                    <div className="bg-red-100 text-red-600 p-2 rounded mb-4 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={register} className="space-y-4">

                    <input
                        type="text"
                        placeholder="Name"
                        className="w-full border p-2 rounded"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />

                    <input
                        type="email"
                        placeholder="Email"
                        className="w-full border p-2 rounded"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        className="w-full border p-2 rounded"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <button className="w-full bg-blue-600 text-white py-2 rounded">
                        Register
                    </button>

                </form>

                <p className="text-sm text-center mt-4">
                    Already have an account?{" "}
                    <Link to="/login" className="text-blue-600">
                        Login
                    </Link>
                </p>

            </div>

        </div>

    );

}