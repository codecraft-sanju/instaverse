import Sidebar from "../components/Sidebar";
import Feed from "../components/Feed";
import SuggestedUsers from "../components/SuggestedUser";
const Home = () => {

  return (
    <div className="flex bg-black min-h-screen">
      <Sidebar />
      <Feed />
      <SuggestedUsers />
    </div>
  );
};

export default Home;
