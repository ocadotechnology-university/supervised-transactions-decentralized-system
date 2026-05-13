import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { GlobalStyle } from "./styles/common.styles.ts";
import Home from "./pages/Home";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import QrPrinter from "./components/QrPrinter";
import SupervisorMain from "./pages/SupervisorMain";
import SupervisorRegister from "./pages/SupervisorRegister";
import CustomerRegistration from "./pages/CustomerRegistration.tsx";
import CustomerMain from "./pages/CustomerMain.tsx";

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
              </Route>

              <Route path="/supervisor">
                  <Route index element={<SupervisorMain />} />
                  <Route path="register" element={<SupervisorRegister />} />
                  <Route path="register/qr" element={<QrPrinter />} />
              </Route>
          </Routes>
      </Router>
  );
}
