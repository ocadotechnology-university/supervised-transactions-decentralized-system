import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import SupervisorMain from "./pages/SupervisorMain";
import RegisterTrader from "./pages/SupervisorRegister";
import SupervisorTraderQR from "./pages/SupervisorTraderQR.tsx";
import CustomerRegistration from "./pages/CustomerRegistration.tsx";
import CustomerMain from "./pages/CustomerMain.tsx";
import CustomerScan from "./pages/CustomerScan.tsx";
import TraderRegistration from "./pages/TraderRegistration.tsx";
import TraderMain from "./pages/TraderMain.tsx";
import TraderPoints from "./pages/TraderPoints";
import TraderPointsQR from "./pages/TraderPointsQR";
import CustomerScanResults from "./pages/CustomerScanResults.tsx";
import CustomerCashout from "./pages/CustomerCashout.tsx";
import CustomerCashoutQR from "./pages/CustomerCashoutQR.tsx";
import SupervisorVerify from "./pages/SupervisorVerify.tsx";
import SupervisorVerifyResults from "./pages/SupervisorVerifyResults.tsx";

export default function App() {
  return (
      <Router>
          <Routes>
              <Route path="/" element={<Home />} />

              <Route path="/customer">
                  <Route index element={<CustomerMain />} />
                  <Route path="register" element={<CustomerRegistration />} />
                  <Route path="scan" element={<CustomerScan />} />
                  <Route path="scan/results" element={<CustomerScanResults />} />
                  <Route path="cashout" element={<CustomerCashout />} />
                  <Route path="cashout/qr" element={<CustomerCashoutQR />} />
              </Route>

              <Route path="/trader">
                  <Route index element={<TraderMain />} />
                  <Route path="register" element={<TraderRegistration />} />
                  <Route path="points" element={<TraderPoints />} />
                  <Route path="points/qr" element={<TraderPointsQR />} />
              </Route>

              <Route path="/supervisor">
                  <Route index element={<SupervisorMain />} />
                  <Route path="registerTrader" element={<RegisterTrader />} />
                  <Route path="registerTrader/qr" element={<SupervisorTraderQR />} />
                  <Route path="verifyTransaction" element={<SupervisorVerify />} />
                  <Route path="verifyTransaction/results" element={<SupervisorVerifyResults />} />
              </Route>
          </Routes>
      </Router>
  );
}
