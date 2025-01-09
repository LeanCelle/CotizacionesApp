import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faXTwitter, faInstagram, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { faCopyright } from '@fortawesome/free-solid-svg-icons';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-socials">
                        <p>
                            <a href="https://www.facebook.com/leandro.celle" target="_blank" rel="noopener noreferrer">
                                <FontAwesomeIcon icon={faFacebookF} />
                            </a>
                        </p>
                        <p>
                            <a href="https://x.com/leandro_celle" target="_blank" rel="noopener noreferrer">
                                <FontAwesomeIcon icon={faXTwitter} />
                            </a>
                        </p>
                        <p>
                            <a href="https://www.instagram.com/leancelle/" target="_blank" rel="noopener noreferrer">
                                <FontAwesomeIcon icon={faInstagram} />
                            </a>
                        </p>
                        <p>
                            <a href="https://www.linkedin.com/in/leandrocelle/" target="_blank" rel="noopener noreferrer">
                                <FontAwesomeIcon icon={faLinkedin} />
                            </a>
                        </p>
                </div>
            </div>
            <div className="footer-bottom">
                <p>
                    <FontAwesomeIcon icon={faCopyright} /> 2025 Cotizaciones.App. Todos los derechos reservados.
                </p>
            </div>
        </footer>
    );
};

export default Footer;
