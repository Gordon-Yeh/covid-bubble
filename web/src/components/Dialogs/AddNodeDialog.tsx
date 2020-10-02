import React, { useState } from 'react';

export default function AddNodeDialog({
  onSubmit, onBack
}) {
  const [name, setName] = useField('');
  const [username, setUsername] = useField('');
  const [email, setEmail] = useField('');
  const [knowUsername, setKnowUsername] = useState(true);

  function handleSetKnowUserNameNo() {
    setKnowUsername(false);
  }

  function handleSetKnowUserNameYes() {
    setKnowUsername(true);
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit(name, username.length > 0 ? username : null);
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        {/* name field */}
        <div className="row g-3 align-items-center mb-3">
          <div className="col-2">
            <label className="col-form-label">Name<span className="red">*</span></label>
          </div>
          <div className="col-7">
            <input type="text" className="form-control" value={name} onChange={setName} placeholder="name of person"/>
          </div>
        </div>

        {/* know username? field */}
        <div className="row g-3 align-items-center mb-3">
          <div className="col-auto">
            <label className="col-form-label">Do you know their username?</label>
          </div>
          <div className="col-auto">
            <input className="form-check-input mr-1" type="radio" onChange={handleSetKnowUserNameYes} checked={knowUsername}/>
            <label>
              Yes
            </label>
          </div>
          <div className="col-auto">
            <input className="form-check-input mr-1" type="radio" onChange={handleSetKnowUserNameNo} checked={!knowUsername}/>
            <label>
              No
            </label>
          </div>
        </div>

        {/* user name field */}
        { knowUsername && (
          <div className="row g-3 align-items-center mb-3">
            <div className="col-2">
              <label className="col-form-label">Username</label>
            </div>
            <div className="col-7">
              <input type="text" className="form-control" value={username} onChange={setUsername} placeholder="username of person"/>
            </div>
            <span className="form-text">
              providing their username allows you to see their bubble, if you don't know you can always set it later
            </span>
          </div>
        )}

        { !knowUsername && (
          <div className="row g-3 align-items-center mb-3">
            <div>Invite them by email (optional)?</div>
            <div className="col-3">
              <label className="col-form-label">Their email</label>
            </div>
            <div className="col-6">
              <input type="email" className="form-control" value={email} onChange={setEmail}/>
            </div>
            <div className="col-3">
              <button type="button" className="btn btn-warning btn-signup">
                Invite
              </button>
            </div>
          </div>
        )}


        <div className="row g-3 justify-content-end mt-3 mb-3 mr-2">
          <div className="col-auto">
            <button type="button" className="btn btn-light btn-custom" onClick={onBack}>
              Back
            </button>
          </div>
          <div className="col-auto">
            <button type="submit" className="btn btn-primary btn-signup">
              Add
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

function useField(initial) {
  let [state, setState] = useState(initial);
  function setStateFromInput(e) {
    setState(e.target.value);
  }
  return [state, setStateFromInput];
}

AddNodeDialog.defaultProps = {
  onSubmit: () => {},
  onBack: () => {}
};
