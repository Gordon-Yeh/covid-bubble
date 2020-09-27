import React from 'react';
import './DialogBox.scss';

export default function DialogBox({
  children
}) {
  return (
    <div className="box">
      {children}
    </div>
  );
}