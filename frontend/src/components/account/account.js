import React from 'react';
import './account.module.css';

function AccountComponent() {
  return (
    <div className="account-container">
      <h2 className="account-header">Account & Settings</h2>
      
      <div className="account-section">
        <h3>Account Details</h3>
        <div className="account-info">
          <p>JohnDoe@mail.com</p>
          <button className="edit-button">Edit</button>
        </div>
        <div className="account-info">
          <p>Password: ********</p>
          <button className="edit-button">Edit</button>
        </div>
      </div>
      
      <div className="account-section">
        <h3>Subscription</h3>
        <div className="subscription-info">
          <p>Basic Plan With Ads</p>
          <button className="next-button"></button>
        </div>
        <div className="subscription-info">
          <p>Billing History</p>
          <button className="next-button"></button>
        </div>
        <div className="subscription-info">
          <p>Change your plan</p>
          <button className="next-button"></button>
        </div>
      </div>
      
      <button className="sign-out-button">Sign Out</button>
    </div>
  );
}

export default AccountComponent;
