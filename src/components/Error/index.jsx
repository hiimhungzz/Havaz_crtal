import React from "react";
import A from "../A";
import { Result, Button } from "antd";

export default function Error({ componentStack, error }) {
  let secondsToGo = 5;
  const timer = setInterval(() => {
    secondsToGo -= 1;
   
  }, 1000);
  setTimeout(() => {
    clearInterval(timer);
    document.location.href = "/";
  }, secondsToGo * 1000);
  console.log('secondsToGo',secondsToGo)
  return (
    // <div
    //   className="kt-grid__item kt-grid__item--fluid kt-grid kt-error-v1"
    //   style={{
    //     height: "calc(100vh - 110px)"
    //   }}
    // >
    //   <div className="kt-error-v1__container">
    //     <h1 className="kt-error-v1__number">404</h1>
    //     <p className="kt-error-v1__desc">
    //       OOPS! Có lỗi xảy ra.&nbsp;
    //       <code>
    //         <A
    //           onClick={() => {
    //             document.location.href = "/";
    //           }}
    //         >
    //           Trang chủ
    //         </A>
    //       </code>
    //       &nbsp;
    //     </p>
    //   </div>
    // </div>
    <Result
      status="404"
      title="404"
      subTitle="Vui lòng chờ trong giây lát."
      extra={
        <div className="d-flex justify-content-center">
          <A
            onClick={() => {
              document.location.href = "/";
            }}
          >
            <h3 className="text-primary">Trang chủ {secondsToGo}</h3>
          </A>
        </div>
      }
    />
  );
}
