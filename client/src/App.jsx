import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/admin/Login';
import CreateBank from './pages/admin/CreateBank';
import SearchBank from './pages/admin/SearchBank';
import { AuthProvider, useAuth } from './context/admin/AuthContext';
import Dashboard from './pages/admin/Dashboard';
import BankDetail from './pages/admin/BankDetail';
import { toast, ToastContainer } from 'react-toastify';
import GetAllBank from './pages/admin/GetAllBank';
import UpdateBank from './pages/admin/UpdateBank';
import GetUser from './pages/admin/GetUser';
import UserDetail from './pages/admin/UserDetail';
import SuperSearch from './pages/admin/SuperSearch';
import ErrorBoundary from './components/admin/ErrorBoundry';

const PrivateRoute = ({ children }) => {
  const { isLoggedIn, loading } = useAuth();

  if (loading || isLoggedIn === null) {
    return <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>;
  }

  return isLoggedIn ? children : <Navigate to="/" replace />;
};

const PublicRoute = ({ children }) => {
  const { isLoggedIn, loading } = useAuth();

  if (loading || isLoggedIn === null) {
    return <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>;
  }

  return !isLoggedIn ? children : <Navigate to="/dashboard" replace />;
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } />
          <Route path="/dashboard" element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } />
          {/* Other routes remain the same */}
          <Route path="/add-bank" element={<PrivateRoute><CreateBank/></PrivateRoute>} />
          <Route path="/search-bank" element={<PrivateRoute><SearchBank /></PrivateRoute>} />
          <Route path="/super-search" element={<PrivateRoute><SuperSearch /></PrivateRoute>} />
          <Route path='/get-all-bank' element={<PrivateRoute><GetAllBank/></PrivateRoute>} />
          <Route path="/bank/:id" element={<PrivateRoute><BankDetail /></PrivateRoute>} />
          <Route path='/update-bank/:id' element={<PrivateRoute><ErrorBoundary><UpdateBank/></ErrorBoundary></PrivateRoute>} />
          <Route path='/get-users' element={<PrivateRoute><GetUser/></PrivateRoute>} />
          <Route path='/get-user/:id' element={<PrivateRoute><UserDetail/></PrivateRoute>} />
        </Routes>
        <ToastContainer />
      </Router>
    </AuthProvider>
  );
};

export default App;