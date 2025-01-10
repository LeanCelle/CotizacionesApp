import React from 'react';
import './styles/App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Main from './pages/main';
import Register from './pages/register';
import ActionDetails from './pages/chartPage';
import Login from './pages/login';
import Layout from './pages/layout';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Main />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/action/:action" element={<ActionDetails />} />
                    <Route path="/login" element={<Login />} />
                </Route>
            </Routes>
        </Router>
    );
};

export default App;
