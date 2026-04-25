import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import SupervisorAuth from "./components/SupervisorAuth";
import SupervisorMain from "./components/SupervisorMain";
import ProtectedRoute from "./utils/ProtectedRoute";
import RegisterTrader from "./components/SupervisorRegister";
import SupervisorTraderQR from "./components/SupervisorTraderQR.tsx";
import CustomerRegistration from "./components/CustomerRegistration.tsx";
import CustomerMain from "./components/CustomerMain.tsx";

export default function App() {
  return (
      <Router>
          <Routes>
              <Route path="/" element={<Home />} />

              <Route path="/customer">
                  <Route index element={<CustomerMain />} />
                  <Route path="register" element={<CustomerRegistration />} />
              </Route>

              <Route path="/supervisor">
                  <Route path="login" element={<SupervisorAuth />} />
                  <Route element={<ProtectedRoute />}>
                      <Route index element={<SupervisorMain />} />
                      <Route path="registerTrader" element={<RegisterTrader />} />
                      <Route path="registerTrader/qr" element={<SupervisorTraderQR />} />
                  </Route>
              </Route>
          </Routes>
      </Router>
  );
}
