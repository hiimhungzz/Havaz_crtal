import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import { createBrowserHistory } from "history";
import { routerReducer, routerMiddleware } from "react-router-redux";
import thunk from "redux-thunk";
import logger from "redux-logger";
import createSagaMiddleware from "redux-saga";
import reducers from "../redux/reducers";
import rootSaga from "../redux/sagas";
import io from "socket.io-client";
import { WEB_SOCKET_URL } from "@Constants";
import Globals from "../globals";
import { Modal } from "antd";
import { SCHEDULER_STATUS } from "@Constants/common";
import { initialSocket, setActiveUser } from "./app/actions";
import { Ui } from "@Helpers/Ui";

const createSocketMiddleware = () => {
  const emitSocket = (socket, status, uuid) => {
    socket.emit(`LDH-${Globals.currentUser.organizationUuid}`, {
      status: status,
      uuid: uuid,
      organizationUuid: Globals.currentUser.organizationUuid,
    });
  };
  return (storeAPI) => {
    if (Globals.session.private.token) {
      let socket = io.connect(WEB_SOCKET_URL, {
        transports: ["websocket"],
        upgrade: false,
        reconnection: true, // tự động kết nối lại
        reconnectionAttempts: 5, // số lần kết nối lại khi mất kết nối
        // autoConnect: true,
        secure: true,
        query: `token=${Globals.session.private.token}`,
      });
      socket.once("connect", () => {
        storeAPI.dispatch(initialSocket(socket));
        socket.on(`LDH-${Globals.currentUser.organizationUuid}`, (message) => {
          if (message.type === "INFO") {
            storeAPI.dispatch(setActiveUser(message));
          } else if (message.type === "WARNING") {
            if (message["isApproved"]) {
              Ui.showSuccess({ message: message.message });
            } else {
              Ui.showWarning({ message: message.message });
            }
          } else {
            let secondsToGo = 20;
            const modal = Modal.confirm({
              onOk: () =>
                emitSocket(
                  socket,
                  SCHEDULER_STATUS.APPROVE_PERMISSTION,
                  message.uuid
                ),
              onCancel: () =>
                emitSocket(
                  socket,
                  SCHEDULER_STATUS.REJECT_PERMISSTION,
                  message.uuid
                ),
              cancelText: "Hủy",
              okText: "Đồng ý",
              content: message.message,
            });
            const timer = setInterval(() => {
              secondsToGo -= 1;
              if (secondsToGo < 15) {
                modal.update({
                  title: message.message,
                  content: `Yêu cầu sẽ tự động xác nhận sau ${secondsToGo} second.`,
                  onOk: () =>
                    emitSocket(
                      socket,
                      SCHEDULER_STATUS.APPROVE_PERMISSTION,
                      message.uuid
                    ),
                  onCancel: () =>
                    emitSocket(
                      socket,
                      SCHEDULER_STATUS.REJECT_PERMISSTION,
                      message.uuid
                    ),
                  cancelText: "Hủy",
                  okText: "Đồng ý",
                });
              }
            }, 1000);
            setTimeout(() => {
              clearInterval(timer);
              // modal.destroy();
            }, secondsToGo * 1000);
          }
          // storeAPI.dispatch(setActiveUser(message));
        });
        // _this.props.initialSocket(socket);
      });
    }
    return (next) => (action) => {
      return next(action);
    };
  };
};
const history = createBrowserHistory();
const sagaMiddleware = createSagaMiddleware();
const routeMiddleware = routerMiddleware(history);

let middlewares = [
  thunk,
  sagaMiddleware,
  routeMiddleware,
  logger,
  createSocketMiddleware(),
];
if (process.env.NODE_ENV === "production") {
  middlewares = [
    thunk,
    sagaMiddleware,
    routeMiddleware,
    createSocketMiddleware(),
  ];
}
const store = createStore(
  combineReducers({
    ...reducers,
    router: routerReducer,
  }),
  compose(
    applyMiddleware(...middlewares),
    window.devToolsExtension ? window.devToolsExtension() : (f) => f
  )
);
sagaMiddleware.run(rootSaga);
export { store, history };
