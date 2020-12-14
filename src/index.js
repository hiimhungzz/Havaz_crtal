import React from "react";
import ReactDOM from "react-dom";
import { store, history } from "./redux/store";
import { Provider } from "react-redux";
import "./styles/style.css";
import "./styles/style.scss"
import { IntlProvider } from "react-intl";
import { CookiesProvider } from "react-cookie";
import { unregister } from "./registerServiceWorker";
import fireBase from "@Helpers/firebase";
import AppLocale from "./languageProvider";
import App from "./containers/App";
import { ConfigProvider } from "antd";

const app = document.getElementById("root");
fireBase.init();
const currentAppLocale = AppLocale["vi"];
console.log("currentAppLocale", currentAppLocale)
console.log(
  "%c\n\n   _________    ____     ____  _______   ___________    __ \n  / ____/   |  / __ \\   / __ \\/ ____/ | / /_  __/   |  / / \n / /   / /| | / /_/ /  / /_/ / __/ /  |/ / / / / /| | / /  \n/ /___/ ___ |/ _, _/  / _, _/ /___/ /|  / / / / ___ |/ /___\n\\____/_/  |_/_/ |_|  /_/ |_/_____/_/ |_/ /_/ /_/  |_/_____/",
  "font-family:monospace;color:#f81d22;font-size:18px;"
);
ReactDOM.render(
  <Provider store={store}>
    <CookiesProvider>
      <ConfigProvider locale={currentAppLocale.antd}>
        <IntlProvider
          locale={currentAppLocale.locale}
          messages={currentAppLocale.messages}
        >
          <App history={history} />
        </IntlProvider>
      </ConfigProvider>
    </CookiesProvider>
  </Provider>,
  app
);
unregister();
