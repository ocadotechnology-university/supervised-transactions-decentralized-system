import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Page1 from "./pages/Page1";
import Page2 from "./pages/Page2";
import SupervisorAuth from "./pages/SupervisorAuth";
import SupervisorMain from "./pages/SupervisorMain";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
      <Router>
          <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/page/1" element={<Page1 />} />
              <Route path="/page/2" element={<Page2 />} />

              <Route path="/supervisor">
                  {/* login page */}
                  <Route index element={<SupervisorAuth />} />

                  {/* protected group */}
                  <Route element={<ProtectedRoute />}>
                      <Route path="main" element={<SupervisorMain />} />

                      {/* future pages go here */}
                  </Route>
              </Route>
          </Routes>
      </Router>
  );
}
