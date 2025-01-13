import React from 'react';
import { Outlet } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/navbar';
import Footer from '../components/footer';

const Layout = () => {

    const navigate = useNavigate();

    const handleSearch = (query) => {
        if (query) {
            navigate(`/action/${query}`);
        } else {
            navigate('/');
        }
    };
    return (
        <div>
            <Navbar onSearch={handleSearch}/>
            <main>
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}

export default Layout;
