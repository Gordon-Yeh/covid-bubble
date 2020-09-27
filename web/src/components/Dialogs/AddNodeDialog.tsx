import React, { useState } from 'react';

export default function AddNodeDialog() {
  const [name, setName] = useState('');
  const [knowUsername, setKnowUsername] = useState(true);
  const [username, setUsername] = useState('');

  function handleSetKnowUserNameNo() {
    setKnowUsername(false);
  }

  function handleSetKnowUserNameYes() {
    setKnowUsername(true);
  }

  return (
    <div>
      <form>
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
            <input className="form-check-input mr-1" type="radio" onClick={handleSetKnowUserNameYes} checked={knowUsername}/>
            <label>
              Yes
            </label>
          </div>
          <div className="col-auto">
            <input className="form-check-input mr-1" type="radio" onClick={handleSetKnowUserNameNo} checked={!knowUsername}/>
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
              <input type="email" className="form-control" value={username} onChange={setUsername}/>
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
            <button type="button" className="btn btn-primary btn-signup">
              Add
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}