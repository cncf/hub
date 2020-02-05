import React from 'react';
import logo from '../../images/cncf.svg';
import ExternalLink from '../common/ExternalLink';
import styles from './Logo.module.css';

const Logo = () => (
  <div className={`mt-auto text-center pb-5 pt-5 mt-3 ${styles.wrapper}`}>
    <img className={`${styles.logo} m-3`} src={logo} alt="Logo CNCF" />

    <h5 className="pt-4">
      Hub is a <ExternalLink href="https://www.cncf.io/" className="font-weight-bold text-primary">Cloud Native Computing Foundation</ExternalLink> sandbox project.
    </h5>
  </div>
);

export default Logo;
