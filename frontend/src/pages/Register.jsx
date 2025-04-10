import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

const Register = () => {
    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { registerUser, btnLoading } = useUser();
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        registerUser(name, username, email, password, navigate);
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-black text-white">
            <div className="bg-[#1c1c1c] p-6 rounded-lg shadow-md w-[350px] text-center border border-gray-700">
                <h1 className="text-4xl font-bold mb-4 font-logo">Instagram</h1>
                <p className="text-gray-400 mb-4 text-sm">Sign up to see photos and videos from your friends.</p>
                <button className="bg-blue-600 text-white w-full py-2 rounded-md font-semibold hover:bg-blue-700">
                    Log in with Facebook
                </button>
                <div className="flex items-center my-4">
                    <div className="flex-1 border-t border-gray-600"></div>
                    <span className="px-2 text-gray-400 text-sm">OR</span>
                    <div className="flex-1 border-t border-gray-600"></div>
                </div>
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
                    <input
                        type="text"
                        placeholder="Full Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="p-2 bg-[#333] border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                    />
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        className="p-2 bg-[#333] border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                    />
                    <p className="text-xs text-gray-400 px-2">
                        People who use our service may have uploaded your contact information to Instagram. <a href="#" className="text-blue-400">Learn More</a>
                    </p>
                    <p className="text-xs text-gray-400 px-2">
                        By signing up, you agree to our <a href="#" className="text-blue-400">Terms</a>, <a href="#" className="text-blue-400">Privacy Policy</a> and <a href="#" className="text-blue-400">Cookies Policy</a>.
                    </p>
                    <button
                        type="submit"
                        disabled={btnLoading}
                        className="bg-blue-600 text-white py-2 rounded-md font-semibold hover:bg-blue-700 disabled:opacity-50"
                    >
                        {btnLoading ? "Registering..." : "Sign up"}
                    </button>
                </form>
                <div className="mt-4 p-4 border border-gray-700">
                    <p className="text-sm text-gray-400">
                        Have an account? <Link to={'/login'} className="text-blue-400">Log in</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
