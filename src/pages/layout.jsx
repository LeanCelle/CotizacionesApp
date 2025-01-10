import React from 'react';
import { Outlet } from 'react-router-dom'; // Esto renderiza las rutas hijas
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/navbar';
import Footer from '../components/footer';

const Layout = () => {

    const navigate = useNavigate();

    const handleSearch = (query) => {
        if (query) {
            navigate(`/action/${query}`);
        } else {
            // Redirigir a la página principal o mostrar un mensaje de error
            navigate('/'); // Redirigir a la página principal
        }
    };
    return (
        <div>
            <Navbar onSearch={handleSearch}/>
            <main>
                <Outlet />  {/* Esto renderiza el componente de la ruta seleccionada */}
            </main>
            <Footer />
        </div>
    );
}

export default Layout;
