import React, { useState } from 'react';
import './SignupDialog.scss';

export default function SignupDialog({
  onSubmit
}) {
  const [firstName, setFirstName] = useField('');
  const [lastName, setLastName] = useField('');
  const [email, setEmail] = useField('');
  const [username, setUsername] = useField('');
  const [password, setPassword] = useField('');
  const [showPassword, setShowPassword] = useState(false);

  function handleSubmit() {
    onSubmit({
      firstName, lastName, email, username, password
    });
  }

  function handleToggleShowPassword() {
    setShowPassword(!showPassword);
  }

  return (
    <form>
      {/* first name field */}
      <div className="row g-3 align-items-center mb-3">
        <div className="col-3">
          <label className="col-form-label">First Name</label>
        </div>
        <div className="col-7">
          <input type="text" className="form-control" value={firstName} onChange={setFirstName}/>
        </div>
      </div>

      {/* last name field */}
      <div className="row g-3 align-items-center mb-3">
        <div className="col-3">
          <label className="col-form-label">Last Name<span className="red">*</span></label>
        </div>
        <div className="col-7">
          <input type="text" className="form-control" value={lastName} onChange={setLastName}/>
        </div>
      </div>


      {/* email field */}
      <div className="row g-3 align-items-center mb-3">
        <div className="col-3">
          <label className="col-form-label">Email</label>
        </div>
        <div className="col-7">
          <input type="email" className="form-control" value={email} onChange={setEmail}/>
        </div>
      </div>

      {/* username field */}
        <div className="row g-3 align-items-center mb-3">
        <div className="col-3">
          <label className="col-form-label">Username</label>
        </div>
        <div className="col-7">
          <input type="text" className="form-control" value={username} onChange={setUsername}/>
        </div>
      </div>

      {/* password field */}
      <div className="row g-3 align-items-center mb-3">
        <div className="col-3">
          <label className="col-form-label">Password</label>
        </div>
        <div className="col-7">
          <input type={showPassword ? 'text' : 'password'} className="form-control" value={password} onChange={setPassword}/>
        </div>
        <div className="col-2">
          <span onClick={handleToggleShowPassword}>Show</span>
        </div>
        <span className="form-text">
          Must be 8-20 characters long.
        </span>
      </div>

      <div className="row g-3 justify-content-end mb-3 mr-2">
        <div className="col-auto">
          <button type="button" className="btn btn-warning btn-signup" onClick={handleSubmit}>
            Signup
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
  onSubmit: _ => { console.log(_) },
};
