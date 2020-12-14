import { all, takeEvery, put, call } from "redux-saga/effects";
import { actions } from "./actions";
import {
  requestJsonPost,
  requestJsonGet,
  requestJsonPut,
  requestJsonDelete
} from "@Services/base";
import { HTTP_STATUS } from "@Constants/common";
import { notification } from "antd";

const onSearchCategoryUserRequest = async param => {
  return requestJsonGet({
    url: `/category-user`,
    method: "GET",
    data: param
  });
};
const onCreateCategoryUserRequest = async param => {
  return requestJsonPost({
    url: `/category-user`,
    method: "POST",
    data: param
  });
};
const onSaveCategoryUserRequest = async param => {
  return requestJsonPut({
    url: `/category-user/${param.id}`,
    method: "PUT",
    data: param.params
  });
};
const onDeleteCategoryUserRequest = async param => {
  return requestJsonDelete({
    url: `/category-user/${param}`,
    method: "DELETE",
    data: param
  });
};
//category Ctv
const onSearchCategoryCtvRequest = async param => {
  return requestJsonGet({
    url: `/category-ctv`,
    method: "GET",
    data: param
  });
};
const onCreateCategoryCtvRequest = async param => {
  return requestJsonPost({
    url: `/category-ctv`,
    method: "POST",
    data: param
  });
};
const onSaveCategoryCtvRequest = async param => {
  return requestJsonPut({
    url: `/category-ctv/${param.id}`,
    method: "PUT",
    data: param.params
  });
};
const onDeleteCategoryCtvRequest = async param => {
  return requestJsonDelete({
    url: `/category-ctv/${param}`,
    method: "DELETE",
    data: param
  });
};
//category Partner
const onSearchCategoryPartnerRequest = async param => {
  return requestJsonGet({
    url: `/category-driver-partner`,
    method: "GET",
    data: param
  });
};
const onCreateCategoryPartnerRequest = async param => {
  return requestJsonPost({
    url: `/category-driver-partner`,
    method: "POST",
    data: param
  });
};
const onSaveCategoryPartnerRequest = async param => {
  return requestJsonPut({
    url: `/category-driver-partner/${param.id}`,
    method: "PUT",
    data: param.params
  });
};
const onDeleteCategoryPartnerRequest = async param => {
  return requestJsonDelete({
    url: `/category-driver-partner/${param}`,
    method: "DELETE",
    data: param
  });
};
//category User
function* searchCategoryUserRequest({ payload }) {
  const { param, tabId } = payload;
  try {
    const searchResult = yield call(onSearchCategoryUserRequest, param, 0);
    yield put(
      actions.categoryUserSuccess(
        searchResult.data.docs,
        searchResult.data.total,
        searchResult.data.pages,
        searchResult.data.pageSize,
        tabId,
        param
      )
    );
  } catch (error) {
    yield put(actions.categoryUserSuccess());
  }
}

function* createCategoryUserRequest({ payload }) {
  const { data } = payload;
  try {
    const searchResult = yield call(onCreateCategoryUserRequest, data, 0);
    if (searchResult.status === HTTP_STATUS.OK) {
      notification.success({
        className: "toast toast-success",
        message: "HAVAZ",
        description: "Tạo khách hàng thành công !"
      });
    }
    yield put(actions.showModalCategoryUser(false));
    let initParam = {};
    if (localStorage.getItem("AppParam")) {
      let appParam = JSON.parse(localStorage.getItem("AppParam"));
      if (appParam["Category"]) {
        initParam = appParam["Category"];
      }
    }
    yield put(actions.category_User_Search(initParam));
  } catch (error) {
    yield put(actions.categoryUserSuccess());
  }
}

function* saveCategoryUserRequest({ payload }) {
  const { data } = payload;
  try {
    const searchResult = yield call(onSaveCategoryUserRequest, data, 0);
    if (searchResult.status === HTTP_STATUS.OK) {
      notification.success({
        className: "toast toast-success",
        message: "HAVAZ",
        description: "Sửa khách hàng thành công !"
      });
    }
    yield put(actions.showModalCategoryUser(false));
    let initParam = {};
    if (localStorage.getItem("AppParam")) {
      let appParam = JSON.parse(localStorage.getItem("AppParam"));
      if (appParam["Category"]) {
        initParam = appParam["Category"];
      }
    }
    yield put(actions.category_User_Search(initParam));
  } catch (error) {
    yield put(actions.categoryUserSuccess());
  }
}

function* deleteCategoryUserRequest({ payload }) {
  const { data } = payload;
  try {
    const searchResult = yield call(onDeleteCategoryUserRequest, data, 0);
    if (searchResult.status === HTTP_STATUS.OK) {
      notification.success({
        className: "toast toast-success",
        message: "HAVAZ",
        description: "Xóa khách hàng thành công !"
      });
    }
    let initParam = {};
    if (localStorage.getItem("AppParam")) {
      let appParam = JSON.parse(localStorage.getItem("AppParam"));
      if (appParam["Category"]) {
        initParam = appParam["Category"];
      }
    }
    yield put(actions.category_User_Search(initParam));
  } catch (error) {
    yield put(actions.categoryUserSuccess());
  }
}
//category Ctv
function* searchCategoryCtvRequest({ payload }) {
  const { param, tabId } = payload;
  try {
    const searchResult = yield call(onSearchCategoryCtvRequest, param, 0);
    yield put(
      actions.categoryCtvSuccess(
        searchResult.data.docs,
        searchResult.data.total,
        searchResult.data.pages,
        searchResult.data.pageSize,
        tabId,
        param
      )
    );
  } catch (error) {
    yield put(actions.categoryCtvSuccess());
  }
}

function* createCategoryCtvRequest({ payload }) {
  const { data } = payload;
  try {
    const searchResult = yield call(onCreateCategoryCtvRequest, data, 0);
    if (searchResult.status === HTTP_STATUS.OK) {
      notification.success({
        className: "toast toast-success",
        message: "HAVAZ",
        description: "Thêm nhóm CTV thành công !"
      });
    }
    yield put(actions.showModalCategoryCtv(false));
    let initParam = {};
    if (localStorage.getItem("AppParam")) {
      let appParam = JSON.parse(localStorage.getItem("AppParam"));
      if (appParam["Category"]) {
        initParam = appParam["Category"];
      }
    }
    yield put(actions.category_Ctv_Search(initParam));
  } catch (error) {
    yield put(actions.category_Ctv_Search());
  }
}

function* saveCategoryCtvRequest({ payload }) {
  const { data } = payload;
  try {
    const searchResult = yield call(onSaveCategoryCtvRequest, data, 0);
    if (searchResult.status === HTTP_STATUS.OK) {
      notification.success({
        className: "toast toast-success",
        message: "HAVAZ",
        description: "Sửa nhóm CTV thành công !"
      });
    }
    yield put(actions.showModalCategoryCtv(false));
    let initParam = {};
    if (localStorage.getItem("AppParam")) {
      let appParam = JSON.parse(localStorage.getItem("AppParam"));
      if (appParam["Category"]) {
        initParam = appParam["Category"];
      }
    }
    yield put(actions.category_Ctv_Search(initParam));
  } catch (error) {
    yield put(actions.category_Ctv_Search());
  }
}

function* deleteCategoryCtvRequest({ payload }) {
  const { data } = payload;
  try {
    const searchResult = yield call(onDeleteCategoryCtvRequest, data, 0);
    if (searchResult.status === HTTP_STATUS.OK) {
      notification.success({
        className: "toast toast-success",
        message: "HAVAZ",
        description: "Xóa nhóm CTV thành công !"
      });
    }
    let initParam = {};
    if (localStorage.getItem("AppParam")) {
      let appParam = JSON.parse(localStorage.getItem("AppParam"));
      if (appParam["Category"]) {
        initParam = appParam["Category"];
      }
    }
    yield put(actions.category_Ctv_Search(initParam));
  } catch (error) {
    yield put(actions.category_Ctv_Search());
  }
}
//category Partner
function* searchCategoryPartnerRequest({ payload }) {
  const { param, tabId } = payload;
  try {
    const searchResult = yield call(onSearchCategoryPartnerRequest, param, 0);
    yield put(
      actions.categoryPartnerSuccess(
        searchResult.data.docs,
        searchResult.data.total,
        searchResult.data.pages,
        searchResult.data.pageSize,
        tabId,
        param
      )
    );
  } catch (error) {
    yield put(actions.categoryPartnerSuccess());
  }
}

function* createCategoryPartnerRequest({ payload }) {
  const { data } = payload;
  try {
    const searchResult = yield call(onCreateCategoryPartnerRequest, data, 0);
    if (searchResult.status === HTTP_STATUS.OK) {
      notification.success({
        className: "toast toast-success",
        message: "HAVAZ",
        description: "Thêm nhóm lái xe CTV thành công !"
      });
    }
    yield put(actions.showModalCategoryPartner(false));
    let initParam = {};
    if (localStorage.getItem("AppParam")) {
      let appParam = JSON.parse(localStorage.getItem("AppParam"));
      if (appParam["Category"]) {
        initParam = appParam["Category"];
      }
    }
    yield put(actions.category_Partner_Search(initParam));
  } catch (error) {
    yield put(actions.category_Partner_Search());
  }
}

function* saveCategoryPartnerRequest({ payload }) {
  const { data } = payload;
  try {
    const searchResult = yield call(onSaveCategoryPartnerRequest, data, 0);
    if (searchResult.status === HTTP_STATUS.OK) {
      notification.success({
        className: "toast toast-success",
        message: "HAVAZ",
        description: "Sửa nhóm lái xe CTV thành công !"
      });
    }
    yield put(actions.showModalCategoryPartner(false));
    let initParam = {};
    if (localStorage.getItem("AppParam")) {
      let appParam = JSON.parse(localStorage.getItem("AppParam"));
      if (appParam["Category"]) {
        initParam = appParam["Category"];
      }
    }
    yield put(actions.category_Partner_Search(initParam));
  } catch (error) {
    yield put(actions.category_Partner_Search());
  }
}

function* deleteCategoryPartnerRequest({ payload }) {
  const { data } = payload;
  try {
    const searchResult = yield call(onDeleteCategoryPartnerRequest, data, 0);
    if (searchResult.status === HTTP_STATUS.OK) {
      notification.success({
        className: "toast toast-success",
        message: "HAVAZ",
        description: "Xóa nhóm lái xe CTV thành công !"
      });
    }
    let initParam = {};
    if (localStorage.getItem("AppParam")) {
      let appParam = JSON.parse(localStorage.getItem("AppParam"));
      if (appParam["Category"]) {
        initParam = appParam["Category"];
      }
    }
    yield put(actions.category_Partner_Search(initParam));
  } catch (error) {
    yield put(actions.category_Partner_Search());
  }
}

function* changeTab({ payload }) {
  const { tabId } = payload;
  console.log("SAGE", tabId)
  try {
    if (tabId === "1") {
      yield put(actions.category_User_Search("", 5, 0, "1"));
    } else if (tabId === "2") {
      yield put(actions.category_Ctv_Search("", 5, 0, "2"));
    } else if (tabId === "3") {
      yield put(actions.category_Partner_Search("", 5, 0, "3"));
    } else if (tabId === "4") {
      yield put(actions.category_Vehicle_Search("", 5, 0, "4"));
    }
  } catch (error) {
    // yield put(actions.costCustomerSearchSuccess());
  }
}

//category vehicle
const onSearchCategoryVehicleRequest = async param => {
  return requestJsonGet({
    url: `/category-driver-vehicle`,
    method: "GET",
    data: param
  });
};

function* searchCategoryVehicleRequest({ payload }) {
  const { param, tabId } = payload;
  try {
    const searchResult = yield call(onSearchCategoryVehicleRequest, param, 0);
    yield put(
      actions.categoryVehicleSuccess(
        searchResult.data.docs,
        searchResult.data.total,
        searchResult.data.pages,
        searchResult.data.pageSize,
        tabId,
        param
      )
    );
  } catch (error) {
    yield put(actions.categoryVehicleSuccess());
  }
}

const onDeleteCategoryVehicleRequest = async param => {
  return requestJsonDelete({
    url: `/category-driver-vehicle/${param}`,
    method: "DELETE",
    data: param
  });
};
function* deleteCategoryVehicleRequest({ payload }) {
  const { data } = payload;
  try {
    const searchResult = yield call(onDeleteCategoryVehicleRequest, data, 0);
    if (searchResult.status === HTTP_STATUS.OK) {
      notification.success({
        className: "toast toast-success",
        message: "HAVAZ",
        description: "Xóa nhóm xe thành công !"
      });
    }
    let initParam = {};
    if (localStorage.getItem("AppParam")) {
      let appParam = JSON.parse(localStorage.getItem("AppParam"));
      if (appParam["Category"]) {
        initParam = appParam["Category"];
      }
    }
    yield put(actions.category_Vehicle_Search(initParam));
  } catch (error) {
    yield put(actions.category_Vehicle_Search());
  }
}

const onCreateCategoryVehicleRequest = async param => {
  return requestJsonPost({
    url: `/category-driver-vehicle`,
    method: "POST",
    data: param
  });
};
function* createCategoryVehicleRequest({ payload }) {
  const { data } = payload;
  try {
    const searchResult = yield call(onCreateCategoryVehicleRequest, data, 0);
    if (searchResult.status === HTTP_STATUS.OK) {
      notification.success({
        className: "toast toast-success",
        message: "HAVAZ",
        description: "Thêm nhóm xe thành công !"
      });
    }
    yield put(actions.showModalCategoryVehicle(false));
    let initParam = {};
    if (localStorage.getItem("AppParam")) {
      let appParam = JSON.parse(localStorage.getItem("AppParam"));
      if (appParam["Category"]) {
        initParam = appParam["Category"];
      }
    }
    yield put(actions.category_Vehicle_Search(initParam));
  } catch (error) {
    yield put(actions.category_Vehicle_Search());
  }
}

const onSaveCategoryVehicleRequest = async param => {
  return requestJsonPut({
    url: `/category-driver-vehicle/${param.id}`,
    method: "PUT",
    data: param.params
  });
};
function* saveCategoryVehicleRequest({ payload }) {
  const { data } = payload;
  try {
    const searchResult = yield call(onSaveCategoryVehicleRequest, data, 0);
    if (searchResult.status === HTTP_STATUS.OK) {
      notification.success({
        className: "toast toast-success",
        message: "HAVAZ",
        description: "Sửa nhóm xe thành công !"
      });
    }
    yield put(actions.showModalCategoryVehicle(false));
    let initParam = {};
    if (localStorage.getItem("AppParam")) {
      let appParam = JSON.parse(localStorage.getItem("AppParam"));
      if (appParam["Category"]) {
        initParam = appParam["Category"];
      }
    }
    yield put(actions.category_Vehicle_Search(initParam));
  } catch (error) {
    yield put(actions.category_Vehicle_Search());
  }
}
export default function* rootSaga() {
  yield all([
    takeEvery(actions.CATEGORY_USER_SEARCH, searchCategoryUserRequest),
    takeEvery(actions.CATEGORY_CTV_SEARCH, searchCategoryCtvRequest),
    takeEvery(actions.CREATE_CATEGORY_USER, createCategoryUserRequest),
    takeEvery(actions.DELETE_CATEGORY_USER, deleteCategoryUserRequest),
    takeEvery(actions.SAVE_CATEGORY_USER, saveCategoryUserRequest),
    takeEvery(actions.CREATE_CATEGORY_CTV, createCategoryCtvRequest),
    takeEvery(actions.SAVE_CATEGORY_CTV, saveCategoryCtvRequest),
    takeEvery(actions.DELETE_CATEGORY_CTV, deleteCategoryCtvRequest),
    takeEvery(actions.CATEGORY_PARTNER_SEARCH, searchCategoryPartnerRequest),
    takeEvery(actions.CREATE_CATEGORY_PARTNER, createCategoryPartnerRequest),
    takeEvery(actions.SAVE_CATEGORY_PARTNER, saveCategoryPartnerRequest),
    takeEvery(actions.DELETE_CATEGORY_PARTNER, deleteCategoryPartnerRequest),

    takeEvery(actions.CATEGORY_CHANGE_TAB, changeTab),
    takeEvery(actions.CATEGORY_VEHICLE_SEARCH, searchCategoryVehicleRequest),
    takeEvery(actions.DELETE_CATEGORY_VEHICLE, deleteCategoryVehicleRequest),
    takeEvery(actions.CREATE_CATEGORY_VEHICLE, createCategoryVehicleRequest),
    takeEvery(actions.SAVE_CATEGORY_VEHICLE, saveCategoryVehicleRequest),
  ]);
}
