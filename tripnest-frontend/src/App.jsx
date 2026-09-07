import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/AuthContext';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import OAuth2Success from './pages/OAuth2Success';
import Trips from './pages/Trips';
import TripDetail from './pages/TripDetail';
import ItineraryDay from './pages/ItineraryDay';
import Budget from './pages/Budget';
import Groups from './pages/Groups';
import Destinations from './pages/Destinations';
import DestinationDetail from './pages/DestinationDetail';
import Profile from './pages/Profile';
import Notifications from './pages/Notifications';
import DestinationAdmin from './pages/DestinationAdmin';

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  const token = localStorage.getItem('token');
  const storedUser = localStorage.getItem('user');

  if (!user && !token && !storedUser) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const AppRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Landing Page — First Page */}
        <Route path="/" element={<LandingPage />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/oauth2/success" element={<OAuth2Success />} />

        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route path="/trips" element={<PrivateRoute><Trips /></PrivateRoute>} />
        <Route path="/trips/:tripId" element={<PrivateRoute><TripDetail /></PrivateRoute>} />
        <Route path="/trips/:tripId/itinerary/:itineraryId" element={<PrivateRoute><ItineraryDay /></PrivateRoute>} />
        <Route path="/trips/:tripId/budget" element={<PrivateRoute><Budget /></PrivateRoute>} />
        <Route path="/trips/:tripId/groups" element={<PrivateRoute><Groups /></PrivateRoute>} />
        <Route path="/destinations" element={<PrivateRoute><Destinations /></PrivateRoute>} />
        <Route path="/destinations/:destinationId" element={<PrivateRoute><DestinationDetail /></PrivateRoute>} />
        <Route path="/admin/destinations" element={<PrivateRoute><DestinationAdmin /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
        <Route path="/notifications" element={<PrivateRoute><Notifications /></PrivateRoute>} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
        <Toaster
          position="bottom-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#131b2e',
              color: '#f8fafc',
              border: '1px solid #1e293b',
              borderRadius: '0.75rem',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5), 0 0 15px rgba(99, 102, 241, 0.15)',
            },
            success: {
              iconTheme: {
                primary: '#10b981',
                secondary: '#131b2e',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#131b2e',
              },
            },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;