import {
  all,
  takeEvery,
  put,
  call,
  delay,
  takeLatest,
} from "redux-saga/effects";
import { actions } from "./actions";
import { API_URI } from "@Constants";
import { requestJson } from "@Services/base";
import { HTTP_STATUS, APP_MODULE } from "@Constants/common";
import { appParam, isEmpty } from "@Helpers/utility";
import { Ui } from "@Helpers/Ui";

function* browseOrganizationRequest({ payload }) {
  const { param } = payload;
  try {
    let temp = {
      ...param,
      ...{
        query: {
          ...param.query,
          citys: [...param.query.citys],
        },
      },
    };
    temp.query.citys = temp.query.citys.map((x) => x.key);
    const searchResult = yield call(async (param) => {
      return requestJson({
        url: API_URI.GET_LIST_ORGANIZATION_PARTNER,
        method: "POST",
        data: param,
      });
    }, temp);
    if (searchResult.status === HTTP_STATUS.OK) {
      yield put(
        actions.browseOrganizationSuccess({
          data: searchResult.data.data,
          totalLength: searchResult.data.totalLength,
          param: param,
        })
      );
    } else {
      yield put(actions.browseOrganizationError(searchResult.toString()));
    }
  } catch (error) {
    yield put(actions.browseOrganizationError(error.toString()));
  }
}

function* browsePartnerRequest({ payload }) {
  const { param } = payload;
  try {
    let temp = {
      ...param,
      ...{
        query: {
          ...param.query,
          citys: [...param.query.citys],
        },
      },
    };
    temp.query.citys = temp.query.citys.map((x) => x.key);
    const searchResult = yield call(async (param) => {
      return requestJson({
        url: API_URI.GET_LIST_PERSONAL_PARTNER,
        method: "POST",
        data: param,
      });
    }, temp);
    if (searchResult.status === HTTP_STATUS.OK) {
      yield put(
        actions.browsePartnerSuccess({
          data: searchResult.data.data,
          totalLength: searchResult.data.totalLength,
          param: param,
        })
      );
    } else {
      yield put(actions.browsePartnerError(searchResult.toString()));
    }
  } catch (error) {
    yield put(actions.browsePartnerError(error.toString()));
  }
}

function* searchCostPartnerRequest({ payload }) {
  const { param } = payload;
  try {
    const searchResult = yield call(
      async (param) => {
        return requestJson({
          url: API_URI.GET_ORGANIZATION_PARTNER_COST,
          method: "POST",
          data: param,
        });
      },
      param,
      0
    );
    if (searchResult.status === HTTP_STATUS.OK) {
      yield put(actions.costPartnerSearchSuccess(searchResult.data.data));
    } else {
      yield put(actions.costPartnerSearchError());
    }
  } catch (error) {
    yield put(actions.costPartnerSearchError());
  }
}

function* savePartnerRouteCostRequest({ payload }) {
  const { param } = payload;
  try {
    const searchResult = yield call(async (param) => {
      return requestJson({
        url: API_URI.PARTNER_SAVE_ROUTE_COST,
        method: "POST",
        data: param,
      });
    }, param);
    if (searchResult.status === HTTP_STATUS.OK) {
    } else {
      // yield put(actions.costPARTNERSearchSuccess());
    }
  } catch (error) {
    // yield put(actions.costPARTNERSearchSuccess());
  }
}

function* savePartnerRouteCostPerRequest({ payload }) {
  const { param } = payload;
  try {
    const searchResult = yield call(async (param) => {
      return requestJson({
        url: API_URI.PARTNER_SAVE_ROUTE_COST_PER,
        method: "POST",
        data: param,
      });
    }, param);
    console.log("searchResult", searchResult);
    if (searchResult.status === HTTP_STATUS.OK) {
      // yield put(actions.costPersonalSearch(param.uuid));
    } else {
      // yield put(actions.costPARTNERSearchSuccess());
    }
  } catch (error) {
    // yield put(actions.costPARTNERSearchSuccess());
  }
}

function* deleteOrganizationRequest({ payload }) {
  const { param } = payload;
  try {
    const searchResult = yield call(async (param) => {
      return requestJson({
        url: API_URI.DELETE_ORGANIZATION_PARTNER,
        method: "POST",
        data: param,
      });
    }, param);
    if (searchResult.status === HTTP_STATUS.OK) {
      Ui.showSuccess({ message: "Xóa CTV thành công" });
      let initParam = appParam[APP_MODULE.PARTNER]
        ? isEmpty(appParam[APP_MODULE.PARTNER]["ORGANIZATION"], {})
        : {};
      yield put(actions.browseOrganization(initParam));
    } else {
      Ui.showError({ message: searchResult.message });
      // yield put(actions.costPARTNERSearchSuccess());
    }
  } catch (error) {
    // yield put(actions.costPARTNERSearchSuccess());
  }
}

function* deletePartnerRequest({ payload }) {
  const { param } = payload;
  try {
    const searchResult = yield call(async (param) => {
      return requestJson({
        url: API_URI.DELETE_PERSONAL_PARTNER,
        method: "POST",
        data: param,
      });
    }, param);
    if (searchResult.status === HTTP_STATUS.OK) {
      Ui.showSuccess({ message: "Xóa CTV cá nhân thành công" });
      let initParam = appParam[APP_MODULE.PARTNER]
        ? isEmpty(appParam[APP_MODULE.PARTNER]["PARTNER"], {})
        : {};
      yield put(actions.browsePartner(initParam));
    } else {
      Ui.showError({ message: searchResult.message });
    }
  } catch (error) {
    // yield put(actions.costPARTNERSearchSuccess());
  }
}

function* changeTab({ payload }) {
  const { tabId } = payload;
  try {
    if (tabId === 1) {
      yield put(actions.browseOrganization({}));
    } else {
      const params = {
        pageLimit: 5,
        currentPage: 0,
        orderBy: { createdAt: 1 },
        query: {
          codes: "",
          nameOrAdress: "",
          phone: "",
          email: "",
          citys: [],
          status: [],
          startDate: "",
          endDate: "",
          taxCode: "",
        },
        searchInput: "",
      };
      yield put(actions.browsePartner(params)); // ha
    }
  } catch (error) {}
}

function* addOrganizationRequest({ payload }) {
  const { data } = payload;
  try {
    const searchResult = yield call(async (param) => {
      return requestJson({
        url: API_URI.CREATE_ORGANIZATION_PARTNER,
        method: "POST",
        data: param,
      });
    }, data);
    if (searchResult.status === HTTP_STATUS.OK) {
      Ui.showSuccess({
        message: "Tạo CTV thành công.",
      });
      let initParam = appParam[APP_MODULE.PARTNER]
        ? isEmpty(appParam[APP_MODULE.PARTNER]["ORGANIZATION"], {})
        : {};
      yield delay(800);
      yield put(actions.browseOrganization(initParam));
    } else {
      // yield put(actions.costPARTNERSearchSuccess());
    }
  } catch (error) {
    // yield put(actions.costPARTNERSearchSuccess());
  }
}

function* addPartnerRequest({ payload }) {
  const { data } = payload;
  try {
    const searchResult = yield call(async (param) => {
      return requestJson({
        url: API_URI.CREATE_PERSONAL_PARTNER,
        method: "POST",
        data: param,
      });
    }, data);
    if (searchResult.status === HTTP_STATUS.OK) {
      Ui.showSuccess({
        message: "Thêm mới CTV thành công.",
      });
      let initParam = appParam[APP_MODULE.PARTNER]
        ? isEmpty(appParam[APP_MODULE.PARTNER]["PARTNER"], {})
        : {};
      yield delay(800);
      yield put(actions.browsePartner(initParam));
    } else {
      // yield put(actions.costPARTNERSearchSuccess());
    }
  } catch (error) {
    // yield put(actions.costPARTNERSearchSuccess());
  }
}

function* editPartnerRequest({ payload }) {
  const { data } = payload;
  try {
    const searchResult = yield call(async (param) => {
      return requestJson({
        url: API_URI.SAVE_PERSONAL_PARTNER,
        method: "POST",
        data: param,
      });
    }, data);
    if (searchResult.status === HTTP_STATUS.OK) {
      Ui.showSuccess({
        message: "Sửa CTV thành công.",
      });
      yield put(actions.showModal({ isShow: false, actionName: "" }));
      let initParam = appParam[APP_MODULE.PARTNER]
        ? isEmpty(appParam[APP_MODULE.PARTNER]["PARTNER"], {})
        : {};
      yield delay(800);
      yield put(actions.browsePartner(initParam));
    } else {
      // yield put(actions.costPARTNERSearchSuccess());
    }
  } catch (error) {
    // yield put(actions.costPARTNERSearchSuccess());
  }
}

function* editOrganizationRequest({ payload }) {
  const { data } = payload;
  try {
    const searchResult = yield call(async (param) => {
      return requestJson({
        url: API_URI.SAVE_ORGANIZATION_PARTNER,
        method: "POST",
        data: param,
      });
    }, data);
    if (searchResult.status === HTTP_STATUS.OK) {
      Ui.showSuccess({
        message: "Sửa CTV thành công.",
      });
      yield put(actions.showModal({ isShow: false, actionName: "" }));
      let initParam = appParam[APP_MODULE.PARTNER]
        ? isEmpty(appParam[APP_MODULE.PARTNER]["ORGANIZATION"], {})
        : {};
      yield delay(800);
      yield put(actions.browseOrganization(initParam));
    } else {
      // yield put(actions.costPARTNERSearchSuccess());
    }
  } catch (error) {
    // yield put(actions.costPARTNERSearchSuccess());
  }
}

function* readOrganizationRequest({ payload }) {
  const { param, filterDatetime } = payload;
  try {
    const searchResult = yield call(async (param) => {
      return requestJson({
        url: API_URI.READ_ORGANIZATION_PARTNER,
        method: "POST",
        data: param,
      });
    }, param);
    if (searchResult.status === HTTP_STATUS.OK) {
      yield put(actions.readOrganizationSuccess(searchResult.data.data));
      yield delay(500);
      yield put(actions.costPartnerSearch(param.uuid, filterDatetime));
    } else {
      yield put(actions.readOrganizationError(searchResult.toString()));
    }
  } catch (error) {
    yield put(actions.readOrganizationError(error.toString()));
  }
}

function* readPartnerRequest({ payload }) {
  const { param, filterDatetime } = payload;
  try {
    const searchResult = yield call(async (param) => {
      return requestJson({
        url: API_URI.READ_PERSONAL_PARTNER,
        method: "POST",
        data: param,
      });
    }, param);
    if (searchResult.status === HTTP_STATUS.OK) {
      yield all([
        put(actions.readPartnerSuccess(searchResult.data.data)),
        delay(500),
        put(actions.costPartnerSearch(param.uuid, filterDatetime)),
      ]);
    } else {
      yield put(actions.readPartnerError(searchResult.toString()));
    }
  } catch (error) {
    yield put(actions.readPartnerError(error.toString()));
  }
}

export default function* rootSaga() {
  yield all([
    takeEvery(actions.PARTNER_BROWSE_ORGANIZATION, browseOrganizationRequest),
    takeEvery(actions.PARTNER_BROWSE_PARTNER, browsePartnerRequest),
    takeLatest(actions.COST_PARTNER_SEARCH, searchCostPartnerRequest),

    takeEvery(actions.PARTNER_ADD_ORGANIZATION, addOrganizationRequest),
    takeEvery(actions.PARTNER_EDIT_ORGANIZATION, editOrganizationRequest),

    takeEvery(actions.PARTNER_ADD_PARTNER, addPartnerRequest),
    takeEvery(actions.PARTNER_EDIT_PARTNER, editPartnerRequest),

    takeEvery(actions.PARTNER_DELETE_ORGANIZATION, deleteOrganizationRequest),
    takeEvery(actions.PARTNER_DELETE_PARTNER, deletePartnerRequest),
    takeEvery(actions.PARTNER_READ_ORGANIZATION, readOrganizationRequest),
    takeEvery(actions.PARTNER_READ_PARTNER, readPartnerRequest),

    takeEvery(actions.SAVE_PARTNER_ROUTE_COST, savePartnerRouteCostRequest),
    takeEvery(
      actions.SAVE_PARTNER_ROUTE_COST_PER,
      savePartnerRouteCostPerRequest
    ),
    takeEvery(actions.PARTNER_CHANGE_TAB, changeTab),
  ]);
}
