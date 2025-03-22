import React from 'react';
import { Link, NavLink } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="container navbar-content">
        <Link to="/" className="navbar-brand">
          Fleet Management
        </Link>
        
        <ul className="navbar-menu">
          <li>
            <NavLink to="/dashboard" activeClassName="active">
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink to="/fleet" activeClassName="active">
              Fleet
            </NavLink>
          </li>
          <li>
            <NavLink to="/asset" activeClassName="active">
              Asset
            </NavLink>
          </li>
          <li>
            <NavLink to="/group" activeClassName="active">
              Group
            </NavLink>
          </li>
          <li>
            <NavLink to="/cocoon" activeClassName="active">
              Cocoon
            </NavLink>
          </li>
          <li>
            <NavLink to="/management" activeClassName="active">
              Management
            </NavLink>
          </li>
        </ul>
        
        
      </div>
    </nav>
  );
};

export default Navbar;
