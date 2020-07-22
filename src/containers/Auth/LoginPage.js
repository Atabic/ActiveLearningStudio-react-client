import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import validator from 'validator';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import bg from 'assets/images/loginbg.png';
import bg1 from 'assets/images/loginbg2.png';
import logo from 'assets/images/logo.svg';
import loader from 'assets/images/loader.svg';
import { loginAction } from 'store/actions/auth';
import Error from './Error';

import './style.scss';

class LoginPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      rememberMe: false,
    };
  }

  componentDidMount() {
    window.scrollTo(0, 0);
  }

  onChangeField = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  onSubmit = async (e) => {
    e.preventDefault();

    try {
      const { email, password } = this.state;
      const { history, login } = this.props;

      await login({ email, password });
      history.push('/account');
    } catch (err) {
      // console.log(err);
    }
  };

  isDisabled = () => {
    const { email, password } = this.state;
    return !validator.isEmail(email) || validator.isEmpty(password);
  }

  render() {
    const { email, password, rememberMe } = this.state;
    const { isLoading, error } = this.props;

    return (
      <div className="auth-page">
        <img className="auth-header-logo" src={logo} alt="" />

        <div className="auth-container">
          <h1 className="auth-title">Login to Curriki Studio</h1>
          <h2 className="auth-subtitle">Powering the creation of the world’s most immersive learn experiences</h2>
          <h3 className="auth-description">
            CurrikiStudio is changing the way learning experiences are
            designed, created, and delivered to a new generation of learners.
          </h3>

          <form
            onSubmit={this.onSubmit}
            autoComplete="off"
            className="auth-form"
          >
            <div className="form-group">
              <FontAwesomeIcon icon="envelope" />
              <input
                autoFocus
                className="input-box"
                type="email"
                name="email"
                placeholder="Email*"
                required
                value={email}
                onChange={this.onChangeField}
              />
            </div>

            <div className="form-group">
              <FontAwesomeIcon icon="lock" />
              <input
                className="password-box"
                type="password"
                name="password"
                placeholder="Password*"
                required
                value={password}
                onChange={this.onChangeField}
              />
            </div>

            <div className="form-group remember-me">
              <label>
                <input
                  type="checkbox"
                  name="rememberMe"
                  value={rememberMe}
                  onChange={this.onChangeField}
                />
                Remember Me
              </label>
              <div className="forgot-password-box">
                <Link to="/forgot-password">Forgot Password ?</Link>
              </div>
            </div>

            <div className="form-group">
              <button
                type="submit"
                className="btn btn-primary submit"
                disabled={isLoading || this.isDisabled()}
              >
                {isLoading ? (
                  <img src={loader} alt="" />
                ) : (
                  'Login'
                )}
              </button>
            </div>

            <Error error={error} />

            <div className="form-group text-center">
              New to here?
              {' '}
              <Link to="/register">Sign Up</Link>
            </div>
          </form>
        </div>

        <img src={bg} className="bg1" alt="" />
        <img src={bg1} className="bg2" alt="" />
      </div>
    );
  }
}

LoginPage.propTypes = {
  history: PropTypes.object.isRequired,
  isLoading: PropTypes.bool.isRequired,
  error: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  login: PropTypes.func.isRequired,
};

LoginPage.defaultProps = {
  error: null,
};

const mapDispatchToProps = (dispatch) => ({
  login: (data) => dispatch(loginAction(data)),
});

const mapStateToProps = (state) => ({
  isLoading: state.auth.isLoading,
  error: state.auth.error,
});

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(LoginPage),
);