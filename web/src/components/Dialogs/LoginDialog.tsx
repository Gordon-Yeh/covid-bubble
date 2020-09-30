import React, { useState } from 'react';

export default function SignupDialog({
  onSubmit,onBack
}) {
  const [email, setEmail] = useField('');
  const [password, setPassword] = useField('');
  const [showPassword, setShowPassword] = useState(false);


  function handleSubmit() {
    onSubmit({
      email, password
    });
  }

  function handleToggleShowPassword() {
    setShowPassword(!showPassword);
  }

  return (
    <form>
      {/* email field */}
      <div className="row g-3 align-items-center mb-3">
        <div className="col-3">
          <label htmlFor="email" className="col-form-label">
            Email
          </label>
        </div>
        <div className="col-7">
          <input 
            id="emai"
            type="email" 
            className="form-control" 
            value={email} 
            onChange={setEmail}
            required
          />
        </div>
      </div>

      {/* password field */}
      <div className="row g-3 align-items-center mb-3">
        <div className="col-3">
          <label htmlFor="password" className="col-form-label">
            Password
          </label>
        </div>
        <div className="col-7">
          <input 
            id="password"
            type={showPassword ? 'text' : 'password'} 
            className="form-control" 
            value={password} 
            onChange={setPassword}
            required
          />
        </div>
        <div className="col-2">
          <span onClick={handleToggleShowPassword}>Show</span>
        </div>
      </div>

      <div className="row g-3 justify-content-end mb-3 mr-2">
        <div className="col-auto">
          <button type="button" className="btn btn-light btn-custom" onClick={onBack}>
            Back
          </button>
        </div>
        <div className="col-auto">
          <button type="submit" className="btn btn-primary" onSubmit={handleSubmit}>
            Login
          </button>
        </div>
      </div>
    </form>
  )
};

function useField(initial) {
  let [state, setState] = useState(initial);
  function setStateFromInput(e) {
    setState(e.target.value);
  }
  return [state, setStateFromInput];
}

SignupDialog.defaultProps = {
  onSubmit: _ => console.log(_),
  onBack: _ => console.log(_)
};
