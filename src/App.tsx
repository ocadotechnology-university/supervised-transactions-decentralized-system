import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { GlobalStyle } from "./styles/common.styles.ts";
import Home from "./pages/Home";
import QrPrinter from "./components/QrPrinter";
import SupervisorMain from "./pages/SupervisorMain";
import SupervisorRegister from "./pages/SupervisorRegister";
import CustomerRegistration from "./pages/CustomerRegistration.tsx";
import CustomerMain from "./pages/CustomerMain.tsx";
import CustomerScan from "./pages/CustomerScan.tsx";
import TraderRegistration from "./pages/TraderRegistration.tsx";
import TraderMain from "./pages/TraderMain.tsx";
import TraderPoints from "./pages/TraderPoints";
import CustomerScanResults from "./pages/CustomerScanResults.tsx";
import CustomerCashout from "./pages/CustomerCashout.tsx";
import SupervisorVerify from "./pages/SupervisorVerify.tsx";
import SupervisorVerifyResults from "./pages/SupervisorVerifyResults.tsx";
import { SupervisorRanking } from "./pages/SupervisorRanking.tsx";

export default function App() {
  return (
      <Router>
          <GlobalStyle />
          <Routes>
              <Route path="/" element={<Home />} />

              <Route path="/customer">
                  <Route index element={<CustomerMain />} />
                  <Route path="register" element={<CustomerRegistration />} />
                  <Route path="scan" element={<CustomerScan />} />
                  <Route path="scan/results" element={<CustomerScanResults />} />
                  <Route path="cashout" element={<CustomerCashout />} />
                  <Route path="cashout/qr" element={<QrPrinter />} />
              </Route>

              <Route path="/trader">
                  <Route index element={<TraderMain />} />
                  <Route path="register" element={<TraderRegistration />} />
                  <Route path="points" element={<TraderPoints />} />
                  <Route path="points/qr" element={<QrPrinter />} />
              </Route>

              <Route path="/supervisor">
                  <Route index element={<SupervisorMain />} />
                  <Route path="register" element={<SupervisorRegister />} />
                  <Route path="register/qr" element={<QrPrinter />} />
                  <Route path="verify" element={<SupervisorVerify />} />
                  <Route path="verify/results" element={<SupervisorVerifyResults />} />
                  <Route path="ranking" element={<SupervisorRanking />} />
              </Route>
          </Routes>
      </Router>
  );
}
