import React from 'react';
import './LandingDialog.scss';

export default function LandingDialog({
  onLogin, onSignup, onNoAccount
}) {
  return (
    <div className="text-left h5">
      <p>
        <button
          type="button"
          className="btn btn-primary mr-3"
          onClick={onLogin}
        >
          Login
        </button>
        <button
          type="button"
          className="btn btn-warning text-white"
          onClick={onSignup}
        >
            Signup
        </button>
      </p>
      {/* <p>
        <button type="button" className="btn btn-link" onClick={onNoAccount}>
          continue without an account
        </button>
      </p> */}
    </div>
  )
};

LandingDialog.defaultProps = {
  onLogin: () => {},
  onSignup: () => {},
  onNoAccount: () => {}
};
