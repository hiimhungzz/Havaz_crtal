import React from "react";
import AppRouter from "../../routers/AppRouter";
import GlobalStyle from "./global-styles";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const App = ({ history }) => {
  return (
    <div className="kt-grid kt-grid--hor kt-grid--root">
      <AppRouter history={history} />
      <div id="kt_scrolltop" className="kt-scrolltop">
        <i className="fa fa-arrow-up"></i>
      </div>
      <ToastContainer />
      <GlobalStyle />
    </div>
  );
};
export default App;
