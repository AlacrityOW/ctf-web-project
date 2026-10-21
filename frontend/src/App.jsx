import '@mantine/core/styles.css';
import { useEffect, useState } from 'react';
import { MantineProvider } from '@mantine/core';
import { BrowserRouter, Routes, Route, Navigate, createBrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Challenges from './pages/Challenges';
import Leaderboard from './pages/Leaderboard';
import api, {setAccessTokenInMemory} from './api/axios.js'
import ChallengePage from './pages/ChallengePage'

function BaseUrlRedirect({ isAuthenticated }) {
  return isAuthenticated ? (
    <Navigate to="/dashboard" replace />
  ) : (
    <Navigate to="/home" replace />
  );
}

// const route = createBrowserRouter([{
//   path:"challenges/:id",
//   element:<ChallengePage/>,
//   loader:challengeLoader,
//   },

// ])

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Prevents premature page flashes

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
  };

  useEffect(() => {
    const restoreSession = async () => {
      try {
        // 1. Hit the refresh endpoint on boot. Browser sends the disk cookie automatically!
        const response = await api.post('/api/auth/refresh');
        const { accessToken } = response.data;

        // 2. Save it to memory and flip our auth state to true
        setAccessTokenInMemory(accessToken);
        setIsAuthenticated(true);
      } catch (err) {
        // Cookie was expired or missing - user is unauthenticated
        setIsAuthenticated(false);
      } finally {
        // 3. Turn off loading screen once the network call settles
        setIsLoading(false);
      }
    };

    restoreSession();
  }, []);
  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <h3>Loading your session...</h3>
      </div>
    );
  }
  return (
    <MantineProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* FIXED: Uses the sub-wrapper to cleanly manage state routing */}
            {/* <Route path="/" element={<BaseUrlRedirect isAuthenticated={isAuthenticated} />} /> */}
            
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login onAuthSuccess={handleAuthSuccess} />} /> 
            <Route path="/register" element={<Register />} />
            
            {/* FIXED: Pass the success trigger down as a property to the Login view */}
            
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/challenges"
              element={
                <ProtectedRoute>
                  <Challenges />
                </ProtectedRoute>
              }
            />
            <Route path="/challenges/:id" element={<ChallengePage/>}/>
            <Route path="/leaderboard" element={<Leaderboard />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </MantineProvider>
  );
}