import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import SupervisorAuth from "./pages/SupervisorAuth";
import SupervisorMain from "./pages/SupervisorMain";
import ProtectedRoute from "./components/ProtectedRoute";
import RegisterTrader from "./pages/SupervisorRegister";

export default function App() {
  return (
      <Router>
          <Routes>
              <Route path="/" element={<Home />} />

              <Route path="/supervisor">
                  {/* login page */}
                  <Route index element={<SupervisorAuth />} />

                  {/* protected group */}
                  <Route element={<ProtectedRoute />}>
                      <Route path="main" element={<SupervisorMain />} />
                      <Route path="registerTrader" element={<RegisterTrader />} />

                      {/* future pages go here */}
                  </Route>
              </Route>
          </Routes>
      </Router>
  );
}
