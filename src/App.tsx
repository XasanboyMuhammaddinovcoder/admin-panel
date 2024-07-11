import { BrowserRouter as Router, Route, Routes, useNavigate, Outlet } from "react-router-dom";
import Home from "./pages/Home";
import Layout from "./layout";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import React from "react";
import NewProducts from "./pages/NewProducts";
import TopProducts from "./pages/TopProducts";
import MightProducts from "./pages/MightProducts";

// const userJson = localStorage.getItem('user');
// const user: string = userJson ? JSON.parse(userJson) : null;
const user: string = 'aa';

// const user = ;

// // Now 'user' will contain the parsed object if it exists, or null if not
// console.log(user); // Check the contents of 'user' in the console

// // Example usage


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
          <ProtectedRoute isAuthentication={Boolean(user)}>
            <Layout>
              <Home />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/dashboard" element={
          <ProtectedRoute isAuthentication={Boolean(user)}>
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
