import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { GlobalStyle } from "./styles.ts";
import Home from "./pages/Home";
import SupervisorMain from "./pages/SupervisorMain";
import SupervisorRegister from "./pages/SupervisorRegister";
import SupervisorRegisterQr from "./pages/SupervisorRegisterQr.tsx";
import CustomerRegistration from "./pages/CustomerRegistration.tsx";
import CustomerMain from "./pages/CustomerMain.tsx";

export default function App() {
  return (
      <Router>
          <GlobalStyle />
          <Routes>
              <Route path="/" element={<Home />} />

              <Route path="/customer">
                  <Route index element={<CustomerMain />} />
                  <Route path="register" element={<CustomerRegistration />} />
              </Route>

              <Route path="/supervisor">
                  <Route index element={<SupervisorMain />} />
                  <Route path="register" element={<SupervisorRegister />} />
                  <Route path="register/qr" element={<SupervisorRegisterQr />} />
              </Route>
          </Routes>
      </Router>
  );
}
