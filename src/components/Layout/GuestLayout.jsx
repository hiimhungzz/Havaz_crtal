import React from "react";


export default function GuestLayout({ location, children }) {
  return (
    <div
       className="kt-grid kt-grid--hor kt-grid--root kt-login kt-login--v4 kt-login--signin"
      id="kt_login"
    >
      <div
        className="kt-grid__item kt-grid__item--fluid kt-grid kt-grid--hor"
      >
        {children}
      </div>
    </div>
  );
}
