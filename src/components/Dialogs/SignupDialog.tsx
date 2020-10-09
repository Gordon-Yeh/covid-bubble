import React, { useState } from 'react';

export default function SignupDialog({
  onSubmit, onBack
}) {
  const [firstName, setFirstName] = useField('');
  const [lastName, setLastName] = useField('');
  const [email, setEmail] = useField('');
  const [username, setUsername] = useField('');
  const [password, setPassword] = useField('');
  const [showPassword, setShowPassword] = useState(false);

console.log('new state!', firstName, lastName, email, username, password, showPassword);

  function handleSubmit(e) {
    e.preventDefault();

    onSubmit({
      firstName, lastName, email, username, password
    });
  }

  function handleToggleShowPassword() {
    setShowPassword(!showPassword);
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* first name field */}
      <div className="row g-3 align-items-center mb-3">
        <div className="col-4 col-md-3">
          <label htmlFor="firstname" className="col-form-label">
            First Name
          </label>
        </div>
        <div className="col-8 col-md-7">
          <input
            id="firstname"
            type="text"
            className="form-control"
            value={firstName}
            onChange={setFirstName}
            required
          />
        </div>
      </div>

      {/* last name field */}
      <div className="row g-3 align-items-center mb-3">
        <div className="col-4 col-md-3">
          <label htmlFor="lastname" className="col-form-label">
            Last Name
          </label>
        </div>
        <div className="col-8 col-md-7">
          <input
            id="lastname"
            type="text"
            className="form-control"
            value={lastName}
            onChange={setLastName}
            required
          />
        </div>
      </div>


      {/* email field */}
      <div className="row g-3 align-items-center mb-3">
        <div className="col-4 col-md-3">
          <label htmlFor="email" className="col-form-label">
            Email
          </label>
        </div>
        <div className="col-8 col-md-7">
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

      {/* username field */}
        <div className="row g-3 align-items-center mb-3">
        <div className="col-4 col-md-3">
          <label htmlFor="username" className="col-form-label">
            Username
          </label>
        </div>
        <div className="col-8 col-md-7">
          <input 
            id="username"
            type="text" 
            className="form-control" 
            value={username} 
            onChange={setUsername}
            required
          />
        </div>
      </div>

      {/* password field */}
      <div className="row g-3 align-items-center mb-3">
        <div className="col-4 col-md-3">
          <label htmlFor="password" className="col-form-label">
            Password
          </label>
        </div>
        <div className="col-6 col-md-7">
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
        <span className="form-text">
          Must be 8-20 characters long.
        </span>
      </div>

      <div className="row g-3 justify-content-end mb-3">
        <div className="col-auto">
          <button type="button" className="btn btn-light mr-3" onClick={onBack}>
            Back
          </button>
          <button type="submit" className="btn btn-warning text-white">
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
  onBack: _ => { console.log(_) },
};
