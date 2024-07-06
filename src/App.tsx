import { BrowserRouter as Router, Route, Routes, useNavigate, Outlet } from "react-router-dom";
import Home from "./pages/Home";
import Layout from "./layout";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import React from "react";
import NewProducts from "./pages/NewProducts";
import TopProducts from "./pages/TopProducts";
import MightProducts from "./pages/MightProducts";

const users: string = 'a';

interface ProtectedRouteProps {
  children: React.ReactNode;
  isAuthentication: boolean;
  redirectTo?: string;
}

function ProtectedRoute({ children, isAuthentication, redirectTo = '/login' }: ProtectedRouteProps) {
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!isAuthentication) {
      navigate(redirectTo);
    }
  }, [isAuthentication, navigate, redirectTo]);

  if (!isAuthentication) {
    return null;
  }

  return <>{children}</>;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <ProtectedRoute isAuthentication={Boolean(users)}>
            <Layout>
              <Home />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/dashboard" element={
          <ProtectedRoute isAuthentication={Boolean(users)}>
            <Layout>
              <Dashboard />
              <Outlet />
            </Layout>
          </ProtectedRoute>
        }>
          <Route path="new" element={<NewProducts />} />
          <Route path="top" element={<TopProducts />} />
          <Route path="might" element={<MightProducts />} />
        </Route>
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
