import {
  Routes,
  Route,
  useLocation
} from "react-router-dom";

import "./style/styles.css";
import Home from "./pages/home";
import Login from "./pages/login";
import Register from "./pages/register";
import DashBoard from "./pages/DashBoard";
import NotFound from "./pages/NotFound";
import Travel from "./pages/Travel";
import AddTrip from "./pages/AddTrip";
import TravelInfo from "./pages/TravelInfo";
import HostedTrips from "./pages/HostedTrips";
import TravelChatRoom from "./pages/TravelChatRoom";

function App() {
  const location = useLocation();
  return (
    <Routes location={location} key={location.pathname}>
        <Route exact path="/" element={<DashBoard />} />
        <Route exact path="/home" element={<Home />} />
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/register" element={<Register />} />
        <Route exact path="/travel" element={<Travel />} />
        <Route exact path="/dashboard" element={<DashBoard />} />
        <Route exact path="/addTrip" element={<AddTrip />} />
        <Route exact path="/travelInfo" element={<TravelInfo />} />
        <Route exact path="/hostedTrips" element={<HostedTrips />} />
        <Route exact path="/travelChatRoom" element={<TravelChatRoom />} />
        <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
