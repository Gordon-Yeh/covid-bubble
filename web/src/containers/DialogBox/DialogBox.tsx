import React, { useState } from 'react';
import './DialogBox.scss';
import { LoginDialog, LandingDialog, SignupDialog, AddNodeDialog, DashboardDialog } from 'components/Dialogs';
import * as userAPI from 'api/user';
import * as nodeAPI from 'api/node';

enum Dialog { Login, Landing, Signup, AddNode, Dashboard };

export default function DialogBox({
  selectedNode, bubbleSize, setBubble, setUser
}) {
  const [ dialog, setDialog ] = useState(Dialog.Landing);
  const [ error, setError ] = useState(null);

  async function handleSignup(form) {
    console.log('handleSignup');
    try {
      let data = await userAPI.signup(form);
      console.log(data);
      setUser(data.user);
      switchDialog(Dialog.Dashboard);
    } catch (e) {
      console.log(e);
      setError(e.message);
    }
  }

  async function handleLogin(email, password) {
    console.log('handleLogin');
    try {
      let data = await userAPI.login(email, password);
      setBubble(data.bubble);
      setUser(data.user);
      switchDialog(Dialog.Dashboard);
    } catch (e) {
      console.log(e);
      setError(e.message);
    }
  }

  async function handleAddNode(name, username) {
    console.log('handleAddNode');
    try {
      let data = await nodeAPI.addNode(name, username);
      setBubble(data.bubble);
      switchDialog(Dialog.Dashboard);
    } catch (e) {
      console.log(e);
      setError(e.message);
    }
  }

  function handleEmailInvite(email) {
    console.log('handleEmailInvite');
    // submit network request
    // always: show success message "Invite has been successfully sent"
  }

  function switchDialog(dlg: Dialog) {
    setError(null);
    setDialog(dlg);
  }

  let DialogToRender:JSX.Element;
  switch (dialog) {
    case Dialog.Login:
      DialogToRender =
        <LoginDialog
          onSubmit={handleLogin}
          onBack={() => switchDialog(Dialog.Landing)}
        />;
      break;
    case Dialog.Signup:
      DialogToRender =
        <SignupDialog
          onSubmit={handleSignup}
          onBack={() => switchDialog(Dialog.Landing)}
        />;
      break;
    case Dialog.AddNode:
      DialogToRender =
        <AddNodeDialog
          onSubmit={handleAddNode}
          onBack={() => switchDialog(Dialog.Dashboard)}
        />;
      break;
    case Dialog.Dashboard:
      DialogToRender =
        <DashboardDialog
          bubbleSize={bubbleSize}
          onAddNode={() => switchDialog(Dialog.AddNode)}
        />;
      break;
    default:
      DialogToRender =
        <LandingDialog
          onLogin={() => switchDialog(Dialog.Login)}
          onSignup={() => switchDialog(Dialog.Signup)}
          onNoAccount={() => switchDialog(Dialog.Dashboard)}
        />;
  }

  return (
    <div className="box">
      { error &&
          <div className="alert alert-warning">
            {error}
          </div>
      }
      {DialogToRender}
    </div>
  );
}

DialogBox.defaultProps = {
  selectedNode: null,
  bubbleSize: 1,
  setBubble: _ => {},
  setUser: () => {}
};
