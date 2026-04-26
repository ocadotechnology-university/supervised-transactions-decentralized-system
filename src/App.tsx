import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import SupervisorMain from "./pages/SupervisorMain";
import RegisterTrader from "./pages/SupervisorRegister";
import SupervisorTraderQR from "./pages/SupervisorTraderQR.tsx";
import CustomerRegistration from "./pages/CustomerRegistration.tsx";
import CustomerMain from "./pages/CustomerMain.tsx";
import TraderRegistration from "./pages/TraderRegistration.tsx";
import TraderMain from "./pages/TraderMain.tsx";

export default function App() {
  return (
      <Router>
          <Routes>
              <Route path="/" element={<Home />} />

              <Route path="/customer">
                  <Route index element={<CustomerMain />} />
                  <Route path="register" element={<CustomerRegistration />} />
              </Route>

              <Route path="/trader">
                  <Route index element={<TraderRegistration />} />
                  <Route path="traderMain" element={<TraderMain />} />
              </Route>

              <Route path="/supervisor">
                  <Route index element={<SupervisorMain />} />
                  <Route path="registerTrader" element={<RegisterTrader />} />
                  <Route path="registerTrader/qr" element={<SupervisorTraderQR />} />
              </Route>
          </Routes>
      </Router>
  );
}
