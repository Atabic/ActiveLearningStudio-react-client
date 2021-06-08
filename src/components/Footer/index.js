import React from 'react';
import logo from 'assets/images/studio_black_transparent.png';
import cc from 'assets/images/cc.png';
import by from 'assets/images/by.png';

function Footer() {
  return (
    <div className="footer-img-section">
      <footer className="footer-all">
        <a target="_blank" href="https://www.curriki.org/terms-of-service/" rel="noopener noreferrer">
          Terms of Service
        </a>
        <a target="_blank" href="https://www.curriki.org/privacy-policy/" rel="noopener noreferrer">
          Privacy Policy
        </a>
        <a target="_blank" href="https://support.curriki.org/" rel="noopener noreferrer">
          Help & Support
        </a>
      </footer>
      {/* <div className="cc-by-logo">
        <img src={ccLogo} alt="cc" />
        <img src={byLogo} alt="by" />
      </div> */}
      <div className="img-">
        <img className="cc-logo" src={cc} alt="cc" />
        <img className="by-logo" src={by} alt="by" />
        <span>Powered by</span>
        <img src={logo} alt="" />
      </div>
    </div>
  );
}

export default Footer;
