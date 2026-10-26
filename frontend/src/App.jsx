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
import AdminChallenges from './pages/AdminChallenges'
import AdminChallengePage from './pages/AdminChallengePage.jsx';
import api, {setAccessTokenInMemory} from './api/axios.js'
import ChallengePage from './pages/ChallengePage'

function BaseUrlRedirect({ isAuthenticated }) {
  return isAuthenticated ? (
    <Navigate to="/dashboard" replace />
  ) : (
    <Navigate to="/home" replace />
  );
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Prevents premature page flashes

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
  };

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const response = await api.post('/api/auth/refresh');
        // console.log("REFRESH")
        // console.log(response.data)
        const { accessToken } = response.data;

        setAccessTokenInMemory(accessToken);
        setIsAuthenticated(true);
      } catch (err) {
        setIsAuthenticated(false);
      } finally {
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
            <Route path="/admin/challenges/:id" element={<AdminChallengePage/>}/>
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/admin/challenges" element={<AdminChallenges />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </MantineProvider>
  );
}