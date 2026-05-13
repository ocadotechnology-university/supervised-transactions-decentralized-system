import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { GlobalStyle } from "./styles/common.styles.ts";
import Home from "./pages/Home";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import QrPrinter from "./components/QrPrinter";
import ScanResults from "./components/ScanResults.tsx";
import SupervisorMain from "./pages/SupervisorMain";
import SupervisorRegister from "./pages/SupervisorRegister";
import CustomerRegistration from "./pages/CustomerRegistration.tsx";
import CustomerMain from "./pages/CustomerMain.tsx";
import CustomerScan from "./pages/CustomerScan.tsx";
import TraderRegistration from "./pages/TraderRegistration.tsx";
import TraderMain from "./pages/TraderMain.tsx";
import TraderPoints from "./pages/TraderPoints";
import CustomerCashout from "./pages/CustomerCashout.tsx";
import SupervisorVerify from "./pages/SupervisorVerify.tsx";
import { SupervisorRanking } from "./pages/SupervisorRanking.tsx";

export default function App() {
  return (
      <Router>
          <GlobalStyle />
          <Routes>
              <Route path="/" element={<Home />} />

              <Route element={<ProtectedRoute storageKey="customerData" path="/customer" requireData={false} />}>
                  <Route path="/customer/register" element={<CustomerRegistration />} />
              </Route>
              <Route element={<ProtectedRoute storageKey="customerData" path="/customer/register" requireData={true} />}>
                  <Route path="/customer" element={<CustomerMain />} />
                  <Route path="/customer/scan" element={<CustomerScan />} />
                  <Route path="/customer/scan/results" element={<ScanResults />} />
                  <Route path="/customer/cashout" element={<CustomerCashout />} />
                  <Route path="/customer/cashout/qr" element={<QrPrinter />} />
              </Route>

              <Route element={<ProtectedRoute storageKey="traderData" path="/trader" requireData={false} />}>
                  <Route path="/trader/register" element={<TraderRegistration />} />
                  <Route path="/trader/register/results" element={<ScanResults />} />
              </Route>
              <Route element={<ProtectedRoute storageKey="traderData" path="/trader/register" requireData={true} />}>
                  <Route path="/trader" element={<TraderMain />} />
                  <Route path="/trader/points" element={<TraderPoints />} />
                  <Route path="/trader/points/qr" element={<QrPrinter />} />
              </Route>

              <Route path="/supervisor">
                  <Route index element={<SupervisorMain />} />
                  <Route path="register" element={<SupervisorRegister />} />
                  <Route path="register/qr" element={<QrPrinter />} />
                  <Route path="verify" element={<SupervisorVerify />} />
                  <Route path="verify/results" element={<ScanResults />} />
                  <Route path="ranking" element={<SupervisorRanking />} />
              </Route>
          </Routes>
      </Router>
  );
}
