import { all, takeEvery, put, call, select } from "redux-saga/effects";
import { actions } from "./acions";
import { API_URI } from "@Constants";
import {
  requestJson,
  requestJsonGet,
  requestJsonPut,
  requestJsonDelete
} from "@Services/base";
import { HTTP_STATUS } from "@Constants/common";

// selectors
import * as notifiCompanySelectors from "./selectors";
import { Ui } from "@Helpers/Ui";

const onSaveNotifi = async param => {
  return requestJson({
    url: API_URI.ON_SAVE_ITEM_NOTI,
    method: "POST",
    data: param
  });
};

const onReadNotifi = async param => {
  return requestJsonGet({
    url: `${API_URI.ON_READ_ITEM_NOTI}/${param}`,
    method: "GET"
  });
};

const getListNoti = async (param, pages) => {
  return requestJsonGet({
    url: `${API_URI.GET_LIST_NOTI}?pages=${pages}&pageSize=${param}`,
    method: "GET"
  });
};

const deleteItemNoti = async param => {
  return requestJsonDelete({
    url: `${API_URI.ON_READ_ITEM_NOTI}/${param}`,
    method: "DELETE",
    data: param
  });
};

const onUpdateNoti = async param => {
  return requestJsonPut({
    url: API_URI.ON_UPDATE_NOTI,
    method: "PUT",
    data: param
  });
};
const onSendNoti = async param => {
  return requestJson({
    url: API_URI.ON_SEND_ITEM_NOTI,
    method: "POST",
    data: param
  });
};

function* getListNotiCompanyRequest({ payload }) {
  const { pages, pageSize } = payload;
  try {
    const searchResult = yield call(getListNoti, pageSize, pages);
    if (searchResult.status === HTTP_STATUS.OK) {
      yield put(actions.onLoadding(false));
      yield put(actions.getListNotiCompanySuccess(searchResult.data));
    } else {
      console.log("error !200");
    }
  } catch (error) {
    console.log("error", error);
  }
}

function* deleteItemNotiRequest({ payload }) {
  const { data } = payload;
  try {
    const searchResult = yield call(deleteItemNoti, data.uuid);
    if (searchResult.status === HTTP_STATUS.OK) {
      Ui.showSuccess({
        message: "Xóa thông báo thành công."
      });
      const pageSize = yield select(notifiCompanySelectors.pageSize);
      const pages = yield select(notifiCompanySelectors.pages);
      const data = {
        pageSize: pageSize,
        pages: pages
      };
      yield put(actions.getListNotiCompany(data));
    } else {
      console.log("error DELETENOTI !200");
    }
  } catch (error) {
    console.log("error", error);
  }
}

function* readItemNoti({ payload }) {
  const { data } = payload;
  try {
    const searchResult = yield call(onReadNotifi, data);
    if (searchResult.status === HTTP_STATUS.OK) {
      let arrayDriver = [];
      searchResult.data.refDriver.map(item => {
        const itemDriver = {
          key: item.uuid,
          label: item.name
        };
        return arrayDriver.push(itemDriver);
      });
      const itemRead = {
        id: searchResult.data.id,
        driverUuid: arrayDriver,
        title: searchResult.data.title,
        editorHtml: searchResult.data.content,
        date: searchResult.data.createdAt,
        dataImage: searchResult.data.images,
        status: searchResult.data.status,
        quote: searchResult.data.quote,
        refParent: searchResult.data.refParent,
      };
      yield put(actions.onLoadding(false));
      yield put(actions.readItemNotiSuccess(itemRead));
    } else {
      console.log("readAPI E !200");
    }
  } catch (error) {
    console.log("error", error);
  }
}

function* onSaveNotiRequest({ payload }) {
  const { data } = payload;
  try {
    const searchResult = yield call(onSaveNotifi, data);
    if (searchResult.status === HTTP_STATUS.OK) {
        Ui.showSuccess({
            message: "Tạo thông báo thành công."
          });
      const pageSize = yield select(notifiCompanySelectors.pageSize);
      const pages = yield select(notifiCompanySelectors.pages);
      const data = {
        pageSize: pageSize,
        pages: pages
      };
      yield put(actions.getListNotiCompany(data));
    } else {
      console.log("readAPI E !200");
    }
  } catch (error) {
    console.log("error", error);
  }
}

function* onSendNotiRequest({ payload }) {
  const { data } = payload;
  try {
    const searchResult = yield call(onSendNoti, data);
    if (searchResult.status === HTTP_STATUS.OK) {
      const pageSize = yield select(notifiCompanySelectors.pageSize);
      const pages = yield select(notifiCompanySelectors.pages);
      const data = {
        pageSize: pageSize,
        pages: pages
      };
      Ui.showSuccess({
        message: "Gửi thành công."
      });
      yield put(actions.getListNotiCompany(data));
    } else {
      console.log("readAPI E !200");
    }
  } catch (error) {
    console.log("error", error);
  }
}

function* onUpdateNotiRequest({ payload }) {
  const { data } = payload;
  try {
    const searchResult = yield call(onUpdateNoti, data);
    if (searchResult.status === HTTP_STATUS.OK) {
        Ui.showSuccess({
            message: payload.data.isSendNow
            ? "Gửi thành công"
            : "Sửa thành công"
          });
      const pageSize = yield select(notifiCompanySelectors.pageSize);
      const pages = yield select(notifiCompanySelectors.pages);
      const data = {
        pageSize: pageSize,
        pages: pages
      };

      yield put(actions.getListNotiCompany(data));
    } else {
      console.log("readAPI E !200");
    }
  } catch (error) {
    console.log("error", error);
  }
}

const filterNotiTitle = async (param, title) => {
  return requestJsonGet({
    url: `${API_URI.GET_LIST_NOTI}?pages=0&pageSize=${param}&title=${title}`,
    method: "GET"
  });
};
function* onFilterNotiRequest({ payload }) {
  const { title } = payload;
  try {
    const pageSize = yield select(notifiCompanySelectors.pageSize);
    const searchResult = yield call(filterNotiTitle, pageSize, title);
    if (searchResult.status === HTTP_STATUS.OK) {
      yield put(actions.onLoadding(false));
      yield put(actions.getListNotiCompanySuccess(searchResult.data));
    } else {
      console.log("error !200");
    }
  } catch (error) {
    console.log("error", error);
  }
}

const onSendItem = async param => {
  return requestJson({
    url: API_URI.ON_SEND_DRIVER,
    method: "POST",
    data: param
  });
};
function* onSendItemRequest({ payload }) {
  const { data } = payload;
  try {
    const searchResult = yield call(onSendItem, data);
    if (searchResult.status === HTTP_STATUS.OK) {
      const pageSize = yield select(notifiCompanySelectors.pageSize);
      const pages = yield select(notifiCompanySelectors.pages);
      const data = {
        pageSize: pageSize,
        pages: pages
      };
      yield put(actions.getListNotiCompany(data));
    } else {
      console.log("error !200");
    }
  } catch (error) {
    console.log("error", error);
  }
}

export default function* rootSaga() {
  yield all([
    takeEvery(actions.GET_LIST_NOTIFICOMPANY, getListNotiCompanyRequest),
    takeEvery(actions.DELETE_NOTIFI_ITEM, deleteItemNotiRequest),
    takeEvery(actions.READ_ITEM_NOTI, readItemNoti),
    takeEvery(actions.ONSAVE_NOTI, onSaveNotiRequest),
    takeEvery(actions.ONUPDATE_NOTI, onUpdateNotiRequest),
    takeEvery(actions.ONSEND_NOTI, onSendNotiRequest),
    takeEvery(actions.FILTER_NOTI, onFilterNotiRequest),
    takeEvery(actions.ONSEND_ITEM, onSendItemRequest)
  ]);
}
