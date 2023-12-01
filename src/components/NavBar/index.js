import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import './style.scss';

const Navbar = ({ startTitle, links, init, ...props }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [activeLink, setActiveLink] = useState(init);

    const handleClick = (index) => {
        setActiveLink(index);
        if (isOpen) {
            setIsOpen(false);
        }
    };

    return (
        <div className="Navbar" {...props}>
            <span className="nav-logo">{startTitle}</span>

            <div className={`nav-items ${isOpen && 'open'}`}>
                {links.map((link, index) => (
                    <Link
                        key={index}
                        to={link.to}
                        onClick={() => handleClick(index)}
                        className={activeLink === index ? 'active' : ''}
                    >
                        {link.text}
                    </Link>
                ))}
            </div>
            <div
                className={`nav-toggle ${isOpen && 'open'}`}
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="bar"></div>
            </div>
        </div>
    );
};

export default Navbar;
