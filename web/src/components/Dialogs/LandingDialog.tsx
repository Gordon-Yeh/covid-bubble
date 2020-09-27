import React from 'react';
import './LandingDialog.scss';

export default function LandingDialog({
  onLogin, onSignup, onNoAccount
}) {
  return (
    <div className="text-left h5">
      <p>
        There's currently 1 person in your bubble.
      </p>
      <p>
        <button
          type="button"
          className="btn btn-primary custom-btn mr-3"
          onClick={onLogin}
        >
          Login
        </button>
        <button
          type="button"
          className="btn btn-warning custom-btn"
          onClick={onSignup}
        >
            Signup
        </button>
      </p>
      <p>
        or
        <button type="button" className="btn btn-link" onClick={onNoAccount}>
          continue without an account
        </button>
      </p>
    </div>
  )
};

LandingDialog.defaultProps = {
  onLogin: () => {},
  onSignup: () => {},
  onNoAccount: () => {}
};
