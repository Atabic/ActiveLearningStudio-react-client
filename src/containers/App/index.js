/* eslint-disable */
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { ToastContainer } from 'react-toastify';
import { connect, useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet';
import logo from 'assets/images/studio_new_logo.png';
import loader from 'assets/images/dotsloader.gif';
import { getUserAction } from 'store/actions/auth';
// import { cloneDuplicationRequest } from 'store/actions/notification';
import { getBranding, getOrganizationFirstTime, getAllPermission } from 'store/actions/organization';
//import { updatedActivity } from 'store/actions/resource';
//import { updatedProject } from 'store/actions/project';
//import { updatedPlaylist } from 'store/actions/playlist';
import AppRouter from 'routers/AppRouter';
import Help from './help';

import './style.scss';

let runOnce = true;
function App(props) {
  const dispatch = useDispatch();
  const { getUser } = props;
  useEffect(() => {
    getUser();
  }, [getUser]);
  const userDetails = useSelector((state) => state.auth.user);
  const { activeOrganization, permission } = useSelector((state) => state.organization);
  const { help } = useSelector((state) => state.ui);
  useEffect(() => {
    if (userDetails) {
      if (activeOrganization) {
        // dispatch(cloneDuplicationRequest(userDetails.id));
        // dispatch(updatedProject(userDetails.id));
        // dispatch(updatedPlaylist(userDetails.id));
        // dispatch(updatedActivity(userDetails.id));
      }
      if (runOnce) {
        runOnce = false;
        if (window.location.href.includes('/org/')) {
          if (window.location.pathname.split('/org/')[1].split('/').length === 1) {
            const subDomain = window.location.pathname.split('/org/')[1]?.replace(/\//g, '');
            (async () => {
              const result = dispatch(getBranding(subDomain));
              result
                .then((data) => {
                  if (permission?.Organization?.includes('organization:view')) dispatch(getOrganizationFirstTime(data?.organization?.id));
                  dispatch(getAllPermission(data?.organization?.id));
                  // document.querySelector(':root').style.setProperty('--main-primary-color', data?.organization?.branding['primary_color']);
                  // document.querySelector(':root').style.setProperty('--main-secondary-color', data?.organization?.branding['secondary_color']);
                  // document.querySelector(':root').style.setProperty('--main-paragraph-text-color', data?.organization?.branding['secondary_color']);
                })
                .catch((err) => err && window.location.replace('/org/currikistudio'));
            })();
          } else {
            const subDomain = window.location.pathname.split('/org/')[1].split('/')[0]?.replace(/\//g, '');
            (async () => {
              const result = dispatch(getBranding(subDomain));
              result
                .then((data) => {
                  if (permission?.Organization?.includes('organization:view')) dispatch(getOrganizationFirstTime(data?.organization?.id));
                  dispatch(getAllPermission(data?.organization?.id));
                  // document.querySelector(':root').style.setProperty('--main-primary-color', data?.organization?.branding['primary_color']);
                  // document.querySelector(':root').style.setProperty('--main-secondary-color', data?.organization?.branding['secondary_color']);
                  // document.querySelector(':root').style.setProperty('--main-paragraph-text-color', data?.organization?.branding['secondary_color']);
                })
                .catch((err) => err && window.location.replace('/org/currikistudio'));
            })();
          }
        } else if (window.location.pathname.includes('/preview')) {
          const subDomain = localStorage.getItem('current_org');
          (async () => {
            const result = dispatch(getBranding(subDomain));
            result
              .then((data) => {
                if (permission?.Organization?.includes('organization:view')) dispatch(getOrganizationFirstTime(data?.organization?.id));
                dispatch(getAllPermission(data?.organization?.id));
              })
              .catch((err) => err && window.location.replace('/org/currikistudio'));
          })();
        }
      }
    }
  }, [dispatch, userDetails, activeOrganization]);

  useEffect(() => {
    if (!localStorage.getItem('auth_token')) {
      dispatch({
        type: 'SET_ALL_PERSMISSION',
        payload: { loading: false },
      });
    }
  }, []);

  // useEffect(() => {
  //   dispatch({
  //     type: 'CHANGE_ORIENTATION',
  //     payload: window.screen.orientation.angle || 0,
  //   });
  //   window.addEventListener('orientationchange', (event) => {
  //     dispatch({
  //       type: 'CHANGE_ORIENTATION',
  //       payload: event.target.screen.orientation.angle,
  //     });
  //   });
  // }, []);

  useEffect(() => {
    if (
      window.location.href.includes('/login') ||
      window.location.pathname.includes('/register') ||
      window.location.pathname.includes('/forgot-password') ||
      window.location.pathname.includes('/reset-password')
    ) {
      const subDomain = window.location.pathname.split('/')[window.location.pathname.split('/').length - 1];
      if (subDomain?.includes('login') || subDomain?.includes('register') || subDomain?.includes('forgot-password') || window.location.pathname.includes('/reset-password')) {
        const result = dispatch(getBranding('currikistudio'));
        result.then((data) => {
          // document.querySelector(':root').style.setProperty('--main-primary-color', data?.organization?.branding['primary_color']);
          // document.querySelector(':root').style.setProperty('--main-secondary-color', data?.organization?.branding['secondary_color']);
          // document.querySelector(':root').style.setProperty('--main-paragraph-text-color', data?.organization?.branding['secondary_color']);
        });
      } else if (subDomain) {
        const result = dispatch(getBranding(subDomain || 'currikistudio'));
        result
          .then((data) => {
            // document.querySelector(':root').style.setProperty('--main-primary-color', data?.organization?.branding['primary_color']);
            // document.querySelector(':root').style.setProperty('--main-secondary-color', data?.organization?.branding['secondary_color']);
            // document.querySelector(':root').style.setProperty('--main-paragraph-text-color', data?.organization?.branding['secondary_color']);
          })
          .catch((err) => err && window.location.replace('/login'));
      } else {
        const result = dispatch(getBranding('currikistudio'));
        result.then((data) => {
          // document.querySelector(':root').style.setProperty('--main-primary-color', data?.organization?.branding['primary_color']);
          // document.querySelector(':root').style.setProperty('--main-secondary-color', data?.organization?.branding['secondary_color']);
          // document.querySelector(':root').style.setProperty('--main-paragraph-text-color', data?.organization?.branding['secondary_color']);
        });
      }
    }
    if (window.HubSpotConversations) {
      // console.log('The api is ready already');
    } else {
      window.hsConversationsOnReady = [
        () => {
          // console.log('Now the api is ready');
          window.HubSpotConversations.widget.load();
        },
      ];
    }
  }, [window.location.href]);
  /*
  useEffect(() => {
    const newScripts = [
      `${window.__RUNTIME_CONFIG__.REACT_APP_RESOURCE_URL}/storage/h5p/h5p-core/js/jquery.js`,
      // `${window.__RUNTIME_CONFIG__.REACT_APP_RESOURCE_URL}/storage/h5p/h5p-core/js/h5p.js`,
      `${window.__RUNTIME_CONFIG__.REACT_APP_RESOURCE_URL}/storage/h5p/h5p-core/js/h5p-event-dispatcher.js`,
      `${window.__RUNTIME_CONFIG__.REACT_APP_RESOURCE_URL}/storage/h5p/h5p-core/js/h5p-x-api-event.js`,
      `${window.__RUNTIME_CONFIG__.REACT_APP_RESOURCE_URL}/storage/h5p/h5p-core/js/h5p-x-api.js`,
      `${window.__RUNTIME_CONFIG__.REACT_APP_RESOURCE_URL}/storage/h5p/h5p-core/js/h5p-content-type.js`,
      `${window.__RUNTIME_CONFIG__.REACT_APP_RESOURCE_URL}/storage/h5p/h5p-core/js/h5p-confirmation-dialog.js`,
      `${window.__RUNTIME_CONFIG__.REACT_APP_RESOURCE_URL}/storage/h5p/h5p-core/js/h5p-action-bar.js`,
      `${window.__RUNTIME_CONFIG__.REACT_APP_RESOURCE_URL}/storage/h5p/h5p-core/js/request-queue.js`,
      // `${window.__RUNTIME_CONFIG__.REACT_APP_RESOURCE_URL}/storage/h5p/h5p-editor/scripts/h5peditor-editor.js`,
      // `${window.__RUNTIME_CONFIG__.REACT_APP_RESOURCE_URL}/storage/h5p/laravel-h5p/js/laravel-h5p.js`,
      `${window.__RUNTIME_CONFIG__.REACT_APP_RESOURCE_URL}/storage/h5p/libraries/H5P.JoubelUI-1.3/js/joubel-help-dialog.js?ver=1.3.9`,
      `${window.__RUNTIME_CONFIG__.REACT_APP_RESOURCE_URL}/storage/h5p/libraries/H5P.JoubelUI-1.3/js/joubel-message-dialog.js?ver=1.3.9`,
      `${window.__RUNTIME_CONFIG__.REACT_APP_RESOURCE_URL}/storage/h5p/libraries/H5P.JoubelUI-1.3/js/joubel-progress-circle.js?ver=1.3.9`,
      `${window.__RUNTIME_CONFIG__.REACT_APP_RESOURCE_URL}/storage/h5p/libraries/H5P.JoubelUI-1.3/js/joubel-simple-rounded-button.js?ver=1.3.9`,
      `${window.__RUNTIME_CONFIG__.REACT_APP_RESOURCE_URL}/storage/h5p/libraries/H5P.JoubelUI-1.3/js/joubel-speech-bubble.js?ver=1.3.9`,
      `${window.__RUNTIME_CONFIG__.REACT_APP_RESOURCE_URL}/storage/h5p/libraries/H5P.JoubelUI-1.3/js/joubel-throbber.js?ver=1.3.9`,
      `${window.__RUNTIME_CONFIG__.REACT_APP_RESOURCE_URL}/storage/h5p/libraries/H5P.JoubelUI-1.3/js/joubel-tip.js?ver=1.3.9`,
      `${window.__RUNTIME_CONFIG__.REACT_APP_RESOURCE_URL}/storage/h5p/libraries/H5P.JoubelUI-1.3/js/joubel-slider.js?ver=1.3.9`,
      `${window.__RUNTIME_CONFIG__.REACT_APP_RESOURCE_URL}/storage/h5p/libraries/H5P.JoubelUI-1.3/js/joubel-score-bar.js?ver=1.3.9`,
      `${window.__RUNTIME_CONFIG__.REACT_APP_RESOURCE_URL}/storage/h5p/libraries/H5P.JoubelUI-1.3/js/joubel-progressbar.js?ver=1.3.9`,
      `${window.__RUNTIME_CONFIG__.REACT_APP_RESOURCE_URL}/storage/h5p/libraries/H5P.JoubelUI-1.3/js/joubel-ui.js?ver=1.3.9`,

      `${window.__RUNTIME_CONFIG__.REACT_APP_RESOURCE_URL}/storage/h5p/libraries/H5P.Question-1.4/scripts/question.js?ver=1.4.7`,
      `${window.__RUNTIME_CONFIG__.REACT_APP_RESOURCE_URL}/storage/h5p/libraries/H5P.Question-1.4/scripts/explainer.js?ver=1.4.7`,
      `${window.__RUNTIME_CONFIG__.REACT_APP_RESOURCE_URL}/storage/h5p/libraries/H5P.Question-1.4/scripts/score-points.js?ver=1.4.7`,
      // `${window.__RUNTIME_CONFIG__.REACT_APP_RESOURCE_URL}/storage/h5p/libraries/Drop-1.0/js/drop.min.js?ver=1.0.2`,
      `${window.__RUNTIME_CONFIG__.REACT_APP_RESOURCE_URL}/storage/h5p/libraries/H5P.Transition-1.0/transition.js?ver=1.0.4`,
      `${window.__RUNTIME_CONFIG__.REACT_APP_RESOURCE_URL}/storage/h5p/libraries/H5P.JoubelUI-1.3/js/joubel-help-dialog.js?ver=1.3.9`,
      `${window.__RUNTIME_CONFIG__.REACT_APP_RESOURCE_URL}/storage/h5p/libraries/H5P.JoubelUI-1.3/js/joubel-message-dialog.js?ver=1.3.9`,
      `${window.__RUNTIME_CONFIG__.REACT_APP_RESOURCE_URL}/storage/h5p/libraries/H5P.JoubelUI-1.3/js/joubel-progress-circle.js?ver=1.3.9`,
      `${window.__RUNTIME_CONFIG__.REACT_APP_RESOURCE_URL}/storage/h5p/libraries/H5P.JoubelUI-1.3/js/joubel-simple-rounded-button.js?ver=1.3.9`,
      `${window.__RUNTIME_CONFIG__.REACT_APP_RESOURCE_URL}/storage/h5p/libraries/H5P.JoubelUI-1.3/js/joubel-speech-bubble.js?ver=1.3.9`,
      `${window.__RUNTIME_CONFIG__.REACT_APP_RESOURCE_URL}/storage/h5p/libraries/H5P.JoubelUI-1.3/js/joubel-throbber.js?ver=1.3.9`,
      `${window.__RUNTIME_CONFIG__.REACT_APP_RESOURCE_URL}/storage/h5p/libraries/H5P.JoubelUI-1.3/js/joubel-tip.js?ver=1.3.9`,
      `${window.__RUNTIME_CONFIG__.REACT_APP_RESOURCE_URL}/storage/h5p/libraries/H5P.JoubelUI-1.3/js/joubel-slider.js?ver=1.3.9`,
      `${window.__RUNTIME_CONFIG__.REACT_APP_RESOURCE_URL}/storage/h5p/libraries/H5P.JoubelUI-1.3/js/joubel-score-bar.js?ver=1.3.9`,
      `${window.__RUNTIME_CONFIG__.REACT_APP_RESOURCE_URL}/storage/h5p/libraries/H5P.JoubelUI-1.3/js/joubel-progressbar.js?ver=1.3.9`,
      `${window.__RUNTIME_CONFIG__.REACT_APP_RESOURCE_URL}/storage/h5p/libraries/H5P.JoubelUI-1.3/js/joubel-ui.js?ver=1.3.9`,
      `${window.__RUNTIME_CONFIG__.REACT_APP_RESOURCE_URL}/storage/h5p/libraries/H5P.GeoGebra3d-1.0/scripts/deployggb.js?ver=1.0.2`,
      `${window.__RUNTIME_CONFIG__.REACT_APP_RESOURCE_URL}/storage/h5p/libraries/H5P.GeoGebra3d-1.0/scripts/geogebra.js?ver=1.0.2`,
      `${window.__RUNTIME_CONFIG__.REACT_APP_RESOURCE_URL}/storage/h5p/libraries/H5P.GeoGebraClassic-1.0/scripts/deployggb.js?ver=1.0.2`,
      `${window.__RUNTIME_CONFIG__.REACT_APP_RESOURCE_URL}/storage/h5p/libraries/H5P.GeoGebraClassic-1.0/scripts/geogebra.js?ver=1.0.2`,
      `${window.__RUNTIME_CONFIG__.REACT_APP_RESOURCE_URL}/storage/h5p/libraries/H5P.GeoGebraGeometry-1.0/scripts/geogebra.js?ver=1.0.2`,
      `${window.__RUNTIME_CONFIG__.REACT_APP_RESOURCE_URL}/storage/h5p/libraries/H5P.GeoGebraGeometry-1.0/scripts/deployggb.js?ver=1.0.2`,
      `${window.__RUNTIME_CONFIG__.REACT_APP_RESOURCE_URL}/storage/h5p/libraries/H5P.GeoGebraGraphing-1.0/scripts/deployggb.js?ver=1.0.2`,
      `${window.__RUNTIME_CONFIG__.REACT_APP_RESOURCE_URL}/storage/h5p/libraries/H5P.GeoGebraGraphing-1.0/scripts/geogebra.js?ver=1.0.2`,
      `${window.__RUNTIME_CONFIG__.REACT_APP_RESOURCE_URL}/storage/h5p/libraries/H5P.GeoGebraIM68Math-1.0/scripts/deployggb.js?ver=1.0.2`,
      `${window.__RUNTIME_CONFIG__.REACT_APP_RESOURCE_URL}/storage/h5p/libraries/H5P.GeoGebraIM68Math-1.0/scripts/geogebra.js?ver=1.0.2`,
      `${window.__RUNTIME_CONFIG__.REACT_APP_RESOURCE_URL}/storage/h5p/libraries/H5P.DocumentsUpload-1.0/scripts/DocumentsUpload.js`,
      `${window.__RUNTIME_CONFIG__.REACT_APP_RESOURCE_URL}/storage/h5p/libraries/H5P.MemoryGame-1.3/memory-game.js?ver=1.3.5`,

      `${window.__RUNTIME_CONFIG__.REACT_APP_RESOURCE_URL}/storage/h5p/libraries/H5P.Collage-0.3/collage.js?ver=0.3.14`,
      `${window.__RUNTIME_CONFIG__.REACT_APP_RESOURCE_URL}/storage/h5p/libraries/H5P.Collage-0.3/template.js?ver=0.3.14`,
      `${window.__RUNTIME_CONFIG__.REACT_APP_RESOURCE_URL}/storage/h5p/libraries/H5P.Collage-0.3/clip.js?ver=0.3.14`,
      `${window.__RUNTIME_CONFIG__.REACT_APP_RESOURCE_URL}/storage/h5p/libraries/H5P.MemoryGame-1.3/card.js?ver=1.3.5`,
      `${window.__RUNTIME_CONFIG__.REACT_APP_RESOURCE_URL}/storage/h5p/libraries/H5P.PhetInteractiveSimulation-1.0/phet-simulation.js`,

      'https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.4/latest.js?config=TeX-MML-AM_CHTML',
    ];

    newScripts.forEach((value) => {
      const script = document.createElement('script');
      script.src = value;
      script.async = false;
      document.body.appendChild(script);
    });
  }, []);
*/

  // useEffect(() => {
  //   function myStopFunction() {
  //     // eslint-disable-next-line no-use-before-define
  //     clearTimeout(timerMath);
  //   }
  //
  //   const timerMath = setInterval(() => {
  //     try {
  //       window.MathJax.Hub.Queue(['Typeset', window.MathJax.Hub]);
  //       myStopFunction();
  //     } catch (e) {
  //       console.log(e);
  //     }
  //   }, 1000);
  // }, []);

  return (
    <div>
      <Helmet>
        <meta name="description" content="CurrikiStudio" />
        <meta name="theme-color" content="#008f68" />

        <script type="text/javascript" id="hs-script-loader" async defer src={`//js.hs-scripts.com/${window.__RUNTIME_CONFIG__.REACT_APP_HUBSPOT}.js`} />
      </Helmet>
      <AppRouter />
      <ToastContainer limit={1} />
      {Object.keys(permission)?.length === 0 && (
        <div className="loader-main-curriki-permission">
          <img src={logo} className="logo" alt="" />
          <img src={loader} className="loader" alt="" />
        </div>
      )}
      <div className="mobile-app-alert">
        <img src={logo} alt="" />

        <div className="text-description">
          <h2>Please use desktop browser</h2>

          <p>CurrikiStudio doesn’t yet support mobile for authors. To continue, we recommend that you use either a browser on a desktop or laptop computer.</p>
          <p>
            Why no mobile access for authors? All learning courses built with CurrikiStudio are accessible on mobile for learners. However, in order for an author to build a truly
            interactive, immersive learning experience, a full browser is required.
          </p>

          <p>
            To learn more click here
            <a href="https://curriki.org"> Curriki</a>
          </p>
        </div>
      </div>
      {help && <Help />}
    </div>
  );
}

App.propTypes = {
  // isLoading: PropTypes.bool.isRequired,
  getUser: PropTypes.func.isRequired,
};

const mapDispatchToProps = (dispatch) => ({
  getUser: (data) => dispatch(getUserAction(data)),
});

const mapStateToProps = (state) => ({
  isLoading: state.auth.isLoading,
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
