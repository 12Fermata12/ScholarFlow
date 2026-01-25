import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import AuthGuard from './components/AuthGuard';
import Dashboard from './pages/Dashboard';
import Pomodoro from './pages/Pomodoro';
import Citations from './pages/Citations';
import Planner from './pages/Planner';
import ReadingList from './pages/ReadingList';
import Notes from './pages/Notes';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Signup from './pages/Signup';

function App() {
    return (
        <Layout>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />

                <Route path="/" element={<AuthGuard><Dashboard /></AuthGuard>} />
                <Route path="/pomodoro" element={<AuthGuard><Pomodoro /></AuthGuard>} />
                <Route path="/citations" element={<AuthGuard><Citations /></AuthGuard>} />
                <Route path="/planner" element={<AuthGuard><Planner /></AuthGuard>} />
                <Route path="/reading" element={<AuthGuard><ReadingList /></AuthGuard>} />
                <Route path="/notes" element={<AuthGuard><Notes /></AuthGuard>} />
                <Route path="/settings" element={<AuthGuard><Settings /></AuthGuard>} />
            </Routes>
        </Layout>
    );
}

export default App;
