import React, { useState } from 'react';
import './DialogBox.scss';
import { LoginDialog, LandingDialog, SignupDialog, AddNodeDialog, DashboardDialog } from 'components/Dialogs';

enum Dialog { Login, Landing, Signup, AddNode, Dashboard };

export default function DialogBox({
  selectedNode, bubbleSize
}) {
  const [ dialog, setDialog ] = useState(Dialog.Landing);

  function handleSignup(form) {
    console.log('handleSignup');
    // validate form
    // submit with network request
    // await for respond
    // success: store token, redirect to dashboard
    // failure: show error message
  }

  function handleAddNode(node) {
    console.log('handleAddNode');
    // validate name
    // submit network request
    // await for response
    // success: refresh graph
    // failure: show error message
  }

  function handleEmailInvite(email) {
    console.log('handleEmailInvite');
    // submit network request
    // always: show success message "Invite has been successfully sent"
  }

  let DialogToRender:JSX.Element;
  switch (dialog) {
    case Dialog.Login:
      DialogToRender =
        <LoginDialog
          onSubmit={handleSignup}
          onBack={() => setDialog(Dialog.Landing)}
        />;
      break;
    case Dialog.Signup:
      DialogToRender =
        <SignupDialog
          onSubmit={handleSignup}
          onBack={() => setDialog(Dialog.Landing)}
        />;
      break;
    case Dialog.AddNode:
      DialogToRender =
        <AddNodeDialog
          onSubmit={handleAddNode}
        />;
      break;
    case Dialog.Dashboard:
      DialogToRender =
        <DashboardDialog
          bubbleSize={bubbleSize}
          onAddNode={() => setDialog(Dialog.AddNode)}
        />;
      break;
    default:
      DialogToRender =
        <LandingDialog
          onLogin={() => setDialog(Dialog.Login)}
          onSignup={() => setDialog(Dialog.Signup)}
          onNoAccount={() => setDialog(Dialog.Dashboard)}
        />;
  }

  return (
    <div className="box">
      {DialogToRender}
    </div>
  );
}

DialogBox.defaultProps = {
  selectedNode: null,
  bubbleSize: 1
}