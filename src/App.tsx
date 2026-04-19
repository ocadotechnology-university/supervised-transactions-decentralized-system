import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import SupervisorAuth from "./pages/SupervisorAuth";
import SupervisorMain from "./pages/SupervisorMain";
import ProtectedRoute from "./components/ProtectedRoute";
import RegisterTrader from "./pages/SupervisorRegister";
import SupervisorTraderQR from "./pages/SupervisorTraderQR.tsx";
import CustomerRegistration from "./pages/CustomerRegistration.tsx";
import CustomerMain from "./pages/CustomerMain.tsx";

export default function App() {
  return (
      <Router>
          <Routes>
              <Route path="/" element={<Home />} />

              <Route path="/customer">
                  {/* login page */}
                  <Route index element={<CustomerRegistration />} />
                  {/* must add protected route*/}
                  <Route path="main" element={<CustomerMain />} />
              </Route>

              <Route path="/supervisor">
                  {/* login page */}
                  <Route index element={<SupervisorAuth />} />

                  {/* protected group */}
                  <Route element={<ProtectedRoute />}>
                      <Route path="main" element={<SupervisorMain />} />
                      <Route path="registerTrader" element={<RegisterTrader />} />
                      <Route path="registerTrader/qr" element={<SupervisorTraderQR />} />

                      {/* future pages go here */}
                  </Route>
              </Route>
          </Routes>
      </Router>
  );
}
