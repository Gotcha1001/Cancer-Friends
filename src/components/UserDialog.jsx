import React from 'react';
import './UserDialog.css'; // Add your dialog CSS here

const UserDialog = ({ user, onClose }) => {
    if (!user) return null;

    return (
        <div className="dialog-overlay mt-20  ">
            <div className="dialog shadow-sky">
                <h2 className='zoom bg-black rounded-lg p-1 text-white'>{user.name}</h2>
                <p>Send this user a message, they need your love and positivity!</p>
                <button className='shadow-neon' onClick={onClose}>Close</button>
            </div>
        </div>
    );
};

export default UserDialog;
