import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { UserProvider, useUser } from "./context/UserContext";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Search from "./pages/Search";  
import Sidebar from "./components/Sidebar";
import Loading from "./components/Loading";
import SearchUser from "./pages/SearchUser";



function AppContent() {
  const { isAuth, loading } = useUser();

  if (loading) return <Loading />;

  return (
    <Router>
      <div className="flex">
        {isAuth && <Sidebar />}
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={isAuth ? <Home/> : <Login/>} />
            <Route path="/login" element={isAuth ? <Home/> : <Login />} />
            <Route path="/register" element={isAuth ? <Navigate to="/" /> : <Register />} />
            <Route path="/profile" element={isAuth ? <Profile /> : <Login />} />
            <Route path="/search" element={isAuth ? <Search /> : <Login />} />
            <Route path="/search/:id" element={isAuth ? <SearchUser/> :<Login/>} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

function App() {
  return (
    <UserProvider>
      <AppContent />
    </UserProvider>
  );
}

export default App;
