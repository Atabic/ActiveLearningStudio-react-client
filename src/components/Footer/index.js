import React, { useState } from 'react';
import { Modal } from 'react-responsive-modal';

import logo from 'assets/images/studio_black_transparent.png';
import headerLOGO from 'assets/images/openeducation_logo.png';
import cc from 'assets/images/cc.png';
import by from 'assets/images/by.png';
import 'react-responsive-modal/styles.css';

function Footer() {
  const [open, setOpen] = useState(false);
  const onOpenModal = () => setOpen(true);
  const onCloseModal = () => setOpen(false);
  return (
    <div className="footer-img-section">
      <footer className="footer-all">
        <a style={{ cursor: 'pointer' }} target="_blank" onClick={onOpenModal} rel="noopener noreferrer">
          Terms of Service
        </a>
        <a style={{ cursor: 'pointer' }} target="_blank" onClick={onOpenModal} rel="noopener noreferrer">
          Privacy Policy
        </a>
        <a style={{ cursor: 'pointer' }} target="_blank" href="https://support.curriki.org/" rel="noopener noreferrer">
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
      <Modal open={open} onClose={onCloseModal} center classNames="footer-model-react">
        <div className="img-logo"><img src={headerLOGO} alt="" /></div>
        <div className="coming-soon">
          Coming Soon.
          <p>
            Learn more about CurrikiStudio:
            <a target="_blank" rel="noreferrer" href="https://www.curriki.org/">Click Here</a>
          </p>
        </div>
      </Modal>
    </div>
  );
}

export default Footer;
