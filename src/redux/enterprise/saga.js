import { all, takeEvery, put, call, select } from "redux-saga/effects";
// import { notification } from "antd";
import { actions } from "./acions";
import { API_URI } from "../../constants";
import {
  requestJson,
} from "../../services/base";
import { Ui } from "../../helpers/Ui";
import { HTTP_STATUS } from "../../constants/common";
// selectors
import * as enterpriseSelectors from "./selectors";

const onGetListEnterprise = async param => {
  return requestJson({
    url: API_URI.GET_LIST_ENTERPRISE,
    method: "POST",
    data: param
  });
};
function* getListEnterpriseRequest({ payload }) {
  try {
    const searchResult = yield call(onGetListEnterprise, payload);
    if (searchResult.status === HTTP_STATUS.OK) {
      yield put(actions.onLoadding(false));
      yield put(actions.getListEnterpirseSuccess(searchResult.data));
    } else {
      console.log("error !200");
    }
  } catch (error) {
    console.log("error", error);
  }
}

const onCreateEnterprise = async param => {
  return requestJson({
    url: API_URI.CREATE_ENTERPRISE,
    method: "POST",
    data: param
  });
};
function* onCreateEnterpriseRequest ({ payload }) {
  const { data } = payload;
  try {
    const searchResult = yield call(onCreateEnterprise, data);
    if (searchResult.status === HTTP_STATUS.OK) {
      const currentPage = yield select(enterpriseSelectors.currentPage);
      const pageLimit = yield select(enterpriseSelectors.pageLimit);
      const data = {
        pageSize: pageLimit,
        currentPage: currentPage
      }
      yield put(actions.onLoadding(true));
      yield put(actions.getListEnterpirse(data));
      Ui.showSuccess({
        message: "Tạo thành công!"
      });
    } else {
      console.log("error !200");
    }
  } catch (error) {
    console.log("error", error);
  }
}

const onUpdateEnterprise = async param => {
  return requestJson({
    url: API_URI.UPDATE_ENTERPRISE,
    method: "POST",
    data: param
  });
};
function* onUpdateEnterpriseRequest ({ payload }) {
  const { data } = payload;
  try {
    const searchResult = yield call(onUpdateEnterprise, data);
    if (searchResult.status === HTTP_STATUS.OK) {
      const currentPage = yield select(enterpriseSelectors.currentPage);
      const pageLimit = yield select(enterpriseSelectors.pageLimit);
      const data = {
        pageSize: pageLimit,
        currentPage: currentPage
      }
      yield put(actions.onLoadding(true));
      yield put(actions.getListEnterpirse(data));
      Ui.showSuccess({
        message: "Sửa thành công!"
      });
    } else {
      console.log("error !200");
    }
  } catch (error) {
    console.log("error", error);
  }
}

const getDetailItemEnterprise = async param => {
  return requestJson({
    url: API_URI.GET_DETAIL_ITEM_ENTERPRISE,
    method: "POST",
    data: param
  });
};
function* getDetailItemEnterpriseRequest ({ payload }) {
  const { data } = payload;
  try {
    const searchResult = yield call(getDetailItemEnterprise, data);
    if (searchResult.status === HTTP_STATUS.OK) {
      yield put(actions.getDetailItemEnterpirseSuccess(searchResult.data));
      yield put(actions.onLoaddingFormUpdate(false));
    } else {
      console.log("error !200");
    }
  } catch (error) {
    console.log("error", error);
  }
}

const onDeleteItemEnterprise = async param => {
  return requestJson({
    url: API_URI.ON_DELETE_ITEM_ENTERPRISE,
    method: "POST",
    data: param
  });
};
function* onDeleteItemEnterpriseRequest ({ payload }) {
  const { data } = payload;
  try {
    const searchResult = yield call(onDeleteItemEnterprise, data);
    if (searchResult.status === HTTP_STATUS.OK) {
      const currentPage = yield select(enterpriseSelectors.currentPage);
      const pageLimit = yield select(enterpriseSelectors.pageLimit);
      const data = {
        pageSize: pageLimit,
        currentPage: currentPage
      }
      yield put(actions.getListEnterpirse(data));
      Ui.showSuccess({
        message: "Xóa thành công!"
      });
      yield put(actions.onLoadding(false));
    } else {
      yield put(actions.onLoadding(false));
    }
  } catch (error) {
    console.log("error", error);
  }
}

const getMenuEnterprise = async param => {
  return requestJson({
    url: API_URI.GET_MENU_ENTERPRISE,
    method: "POST",
    data: param
  });
};
function*  getMenuEnterpriseRequest ({ payload }) {
  const { data } = payload;
  try {
    const searchResult = yield call(getMenuEnterprise, data);
    if (searchResult.status === HTTP_STATUS.OK) {
      yield put (actions.getMenuPriseSuccess(searchResult.data))
    } else {
    }
  } catch (error) {
    console.log("error", error);
  }
}

const getDetailItemAttribute = async param => {
  return requestJson({
    url: API_URI.GET_DETAIL_ITEM_ATTRIBUTE,
    method: "POST",
    data: param
  });
};
function* getDetailItemAttributeRequest ({ payload }) {
  const { data } = payload;
  try {
    const searchResult = yield call(getDetailItemAttribute, data);
    if (searchResult.status === HTTP_STATUS.OK) {
      yield put (actions.getDetailItemAttributeSuccess(searchResult.data))
      yield put (actions.onLoaddingFormUpdate(false))
    } else {
      // yield put(actions.onLoadding(false));
    }
  } catch (error) {
    console.log("error", error);
  }
}

const onCreateOrganizationAttribute = async param => {
  return requestJson({
    url: API_URI.ON_CREATE_ORGANIZATION_ATTRIBUTE,
    method: "POST",
    data: param
  });
};
function* onCreateOrganizationAttributeRequest ({ payload }) {
  const { data } = payload;
  try {
    const searchResult = yield call(onCreateOrganizationAttribute, data);
    if (searchResult.status === HTTP_STATUS.OK) {
      const currentPage = yield select(enterpriseSelectors.currentPage);
      const pageLimit = yield select(enterpriseSelectors.pageLimit);
      const data = {
        pageSize: pageLimit,
        currentPage: currentPage
      }
      yield put(actions.getListEnterpirse(data));
      Ui.showSuccess({
        message: "Cập nhật thành công"
      });
    } else {
    }
  } catch (error) {
    console.log("error", error);
  }
}

export default function* rootSaga() {
  yield all([
    takeEvery(actions.GETLIST_ENTERPRISE, getListEnterpriseRequest),
    takeEvery(actions.ON_CREATE_ENTERPRISE, onCreateEnterpriseRequest),
    takeEvery(actions.GET_DETAIL_ITEM_ENTERPRISE, getDetailItemEnterpriseRequest),
    takeEvery(actions.ON_DELETE_ITEM_ENTERPRISE, onDeleteItemEnterpriseRequest),
    takeEvery(actions.ON_UPDATE_ENTERPRISE, onUpdateEnterpriseRequest),
    takeEvery(actions.GET_MENU_ENTERPRISE, getMenuEnterpriseRequest),
    takeEvery(actions.GET_DETAIL_ITEM_ATTRIBUTE, getDetailItemAttributeRequest),
    takeEvery(actions.ON_CREATE_ORGANIZATION_ATTRIBUTE, onCreateOrganizationAttributeRequest),
  ]);
}

