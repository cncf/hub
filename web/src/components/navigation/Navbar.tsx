import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiHexagon } from 'react-icons/fi';
import classnames from 'classnames';
import SearchBar from '../common/SearchBar';
import styles from './Navbar.module.css';

const Navbar = () => {
  const location = useLocation();

  return (
    <nav className={classnames(
      'navbar navbar-top navbar-expand-sm navbar-dark',
      styles.navbar,
      {[styles.homeNavbar]: location.pathname === '/'}
    )}>
      <div className="container">
        <Link className={`navbar-brand d-flex align-items-center ${styles.brand}`} to="/">
          <FiHexagon className="mr-2" />
          HUB
        </Link>

        {location.pathname !== '/' && <SearchBar size="normal" formClassName={`mr-auto flex-grow-1 ${styles.search}`} />}

        <div className="collapse navbar-collapse" id="navbarNav">
          {/* TODO - login */}
          <ul className="navbar-nav align-items-center ml-auto">
            <li className="nav-item position-relative ml-4">
              <button
                type="button"
                className={classnames(
                  'btn btn-disabled pl-0 pr-0 font-weight-bold text-uppercase position-relative text-nowrap',
                  styles.button,
                )}
                data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"
              >
                Sign up
              </button>
            </li>

            <li className="nav-item ml-4 position-relative">
              <button
                type="button"
                className={classnames(
                  'btn btn-disabled pl-0 pr-0 font-weight-bold text-uppercase position-relative text-nowrap',
                  styles.button,
                )}
                data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"              >
                Login
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
