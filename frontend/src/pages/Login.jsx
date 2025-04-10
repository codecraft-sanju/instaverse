import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { loginUser, btnLoading } = useUser();
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        loginUser(email, password, navigate);
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-black text-white">
            <div className="bg-[#1c1c1c] p-6 rounded-lg shadow-md w-[350px] text-center border border-gray-700">
                <h1 className="text-4xl font-bold mb-4 font-logo">Instagram</h1>
                <p className="text-gray-400 mb-4 text-sm">Log in to your account</p>
                <form className="flex flex-col space-y-3" onSubmit={handleSubmit}>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="p-2 bg-[#333] border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="p-2 bg-[#333] border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                    />
                    <button
                        type="submit"
                        disabled={btnLoading}
                        className="bg-blue-600 text-white py-2 rounded-md font-semibold hover:bg-blue-700 disabled:opacity-50"
                    >
                        {btnLoading ? "Logging in..." : "Log in"}
                    </button>
                </form>
                <div className="mt-4">
                    <p className="text-sm text-gray-400">
                        <a href="#" className="text-blue-400">Forgot password?</a>
                    </p>
                </div>
                <div className="mt-4 p-4 border border-gray-700">
                    <p className="text-sm text-gray-400">
                        Don't have an account? <Link to={'/register'} className="text-blue-400">Sign up</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;