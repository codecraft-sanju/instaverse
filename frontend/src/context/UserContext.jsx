import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [users, setUsers] = useState([]);
    const [isAuth, setIsAuth] = useState(false);
    const [btnLoading, setBtnLoading] = useState(false);
    const [loading, setLoading] = useState(true);

    // Register User
    async function registerUser(name, username, email, password, navigate) {
        setBtnLoading(true);
        try {
            const { data } = await axios.post("/api/register", { name, username, email, password });
            toast.success(data.message);
            setBtnLoading(false);
            navigate("/");
        } catch (error) {
            console.log(error.response?.data?.message || "Registration failed");
           
            setBtnLoading(false);
        }
    }

    // Login User
    async function loginUser(email, password, navigate) {
        setBtnLoading(true);
        try {
            const { data } = await axios.post("/api/login", { email, password });  // Fixed API URL
            toast.success(data.message);
            setIsAuth(true);
            setBtnLoading(false);
            navigate("/");
            window.location.reload();
        } catch (error) {
          //  console.log(error.response?.data?.message || "Login failed");
             toast.success('please check your email and password'); 
            setBtnLoading(false);
        }
    }

    // Fetch User
    async function fetchUser() {
        try {
            const { data } = await axios.get("/api/profile");
            setUser(data);
            setIsAuth(true);
            setLoading(false);
        } catch (error) {
          //  console.log(error.response?.data?.message || "Fetching user failed");
          
            setLoading(false);
        }
    }

    // fetch all users
    async function fetchAllUsers() {
        setLoading(true);
        try {
            const { data } = await axios.get('/api/getall');
            setUsers(data);
            setIsAuth(true);
            setLoading(false);
        } catch (error) {
            console.log(error.response.data.message);
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchUser();
        fetchAllUsers();
    }, []);

    // Logout User
    async function logoutUser() {
        setBtnLoading(true);
        try {
            const { data } = await axios.post("/api/logout");
            toast.success(data.message);
            setIsAuth(false);
            setUser(null);
            setBtnLoading(false);
            window.location.reload();
        } catch (error) {
            console.log(error.response?.data?.message || "Logout failed");
            setBtnLoading(false);
        }
    }

    async function updateProfilePic(file) {
        setBtnLoading(true);
        try {
            const formData = new FormData();
            formData.append("file", file);
            const { data } = await axios.put('/api/profile-picture', formData, {
                headers:{"Content-Type":"multipart/form-data"}
            })
            toast.success(data.message);
           // setUser(prevUser => ({ ...prevUser, profilePicture: data.profilePicture }));
            setUser((prevUser) => ({
  ...prevUser,
  user: {
    ...prevUser.user,
    profilePicture: data.profilePicture,
  },
}));

            setBtnLoading(false);
        } catch (error) {
            toast.error(error.response.data.message);
            setBtnLoading(false);
        }
    }

        // Update Bio
    async function updateBio(bio) {
        setBtnLoading(true);
        try {
            const { data } = await axios.put("/api/update-bio", { bio });
            toast.success(data.message);

            // update local user state with new bio
            setUser((prev) => ({
                ...prev,
                user: {
                    ...prev.user,
                    bio: data.bio
                }
            }));

            setBtnLoading(false);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update bio");
            setBtnLoading(false);
        }
    }


    return (
        <UserContext.Provider value={{ user, isAuth, registerUser, loginUser, logoutUser, loading, btnLoading,updateProfilePic,users,fetchAllUsers,fetchUser,updateBio}}>
            {children}
            <Toaster />
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);
