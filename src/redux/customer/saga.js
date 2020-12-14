import { all, takeEvery, takeLatest, put, call } from "redux-saga/effects";
import { actions } from "./actions";
import { API_URI } from "@Constants";
import { requestJson } from "@Services/base";
import { HTTP_STATUS, APP_MODULE } from "@Constants/common";
import { appParam, isEmpty } from "@Helpers/utility";
import { Ui } from "@Helpers/Ui";

const onBrowseOrganizationRequest = async param => {
    return requestJson({
        url: API_URI.GET_LIST_COMPANY,
        method: "POST",
        data: param
    });
};
const onBrowsePartnerRequest = async param => {
    return requestJson({
        url: API_URI.GET_LIST_CUSTOMER_PERSONAL,
        method: "POST",
        data: param
    });
};
const onSearchCityRequest = async param => {
    return requestJson({
        url: API_URI.GET_LIST_CITY,
        method: "POST",
        data: param
    });
};
const onSearchCostCustomerRequest = async param => {
    return requestJson({
        url: API_URI.GET_ORGANIZATION_CUSTOMER_COST,
        method: "POST",
        data: param
    });
};
const onAddOrganizationRequest = async param => {
    return requestJson({
        url: API_URI.CREATE_ORGANIZATION_CUSTOMER,
        method: "POST",
        data: param
    });
};
const onEditOrganizationRequest = async param => {
    return requestJson({
        url: API_URI.SAVE_ORGANIZATION_CUSTOMER,
        method: "POST",
        data: param
    });
};
const onAddPartnerRequest = async param => {
    return requestJson({
        url: API_URI.CREATE_PERSONAL_CUSTOMER,
        method: "POST",
        data: param
    });
};
const onEditPartnerRequest = async param => {
    return requestJson({
        url: API_URI.SAVE_PERSONAL_CUSTOMER,
        method: "POST",
        data: param
    });
};

function* browseOrganizationRequest({ payload }) {
    const { param } = payload;
    try {
        const searchResult = yield call(onBrowseOrganizationRequest, param);
        if (searchResult.status === HTTP_STATUS.OK) {
            yield put(
                actions.browseOrganizationSuccess({
                    data: searchResult.data.data,
                    totalLength: searchResult.data.totalLength,
                    param
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
        const searchResult = yield call(onBrowsePartnerRequest, param);
        if (searchResult.status === HTTP_STATUS.OK) {
            yield put(
                actions.browsePartnerSuccess({
                    data: searchResult.data.data,
                    totalLength: searchResult.data.totalLength,
                    param
                })
            );
        } else {
            yield put(actions.browsePartnerError(searchResult.toString()));
        }
    } catch (error) {
        yield put(actions.browsePartnerError(error.toString()));
    }
}

function* searchCityRequest({ payload }) {
    const { currentPage, param } = payload;
    try {
        const searchResult = yield call(onSearchCityRequest, param, 0);
        if (searchResult.status === HTTP_STATUS.OK) {
            yield put(
                actions.citySearchSuccess(
                    searchResult.data.data,
                    searchResult.data.totalLength,
                    currentPage
                )
            );
        } else {
            Ui.showError({ message: searchResult.message });
        }
    } catch (error) {
        yield put(actions.citySearchSuccess());
    }
}

function* searchCostCustomerRequest({ payload }) {
    const { param } = payload;
    try {
        const searchResult = yield call(onSearchCostCustomerRequest, param);
        if (searchResult.status === HTTP_STATUS.OK) {
            yield put(actions.costCustomerSearchSuccess(searchResult.data.data));
        } else {
            Ui.showError({ message: searchResult.message });
        }
    } catch (error) {
        yield put(actions.costCustomerSearchSuccess());
    }
}

function* addOrganizationRequest({ payload }) {
    const { data } = payload;
    try {
        const searchResult = yield call(onAddOrganizationRequest, data);
        if (searchResult.status === HTTP_STATUS.OK) {
            Ui.showSuccess({
                message: "Thêm mới KH thành công."
            });
            yield put(
                actions.showModal({
                    isShow: false,
                    actionName: ""
                })
            );
            let initParam = appParam[APP_MODULE.CUSTOMERS] ?
                isEmpty(appParam[APP_MODULE.CUSTOMERS]["ORGANIZATION"], {}) : {};
            yield put(actions.browseOrganization(initParam));
        } else {
            Ui.showError({ message: searchResult.message });
        }
    } catch (error) {
        // yield put(actions.costCustomerSearchSuccess());
    }
}

function* editOrganizationRequest({ payload }) {
    const { data } = payload;
    try {
        const searchResult = yield call(onEditOrganizationRequest, data);
        if (searchResult.status === HTTP_STATUS.OK) {
            Ui.showSuccess({
                message: "Sửa KH thành công."
            });
            yield put(
                actions.showModal({
                    isShow: false,
                    actionName: ""
                })
            );
            let initParam = appParam[APP_MODULE.CUSTOMERS] ?
                isEmpty(appParam[APP_MODULE.CUSTOMERS]["ORGANIZATION"], {}) : {};
            yield put(actions.browseOrganization(initParam));
        } else {
            Ui.showError({ message: searchResult.message });
        }
    } catch (error) {
        // yield put(actions.costCustomerSearchSuccess());
    }
}

function* addPartnerRequest({ payload }) {
    const { data } = payload;
    try {
        const searchResult = yield call(onAddPartnerRequest, data);
        if (searchResult.status === HTTP_STATUS.OK) {
            Ui.showSuccess({
                message: "Thêm mới KH thành công."
            });
            yield put(
                actions.showModal({
                    isShow: false,
                    actionName: ""
                })
            );
            let initParam = appParam[APP_MODULE.CUSTOMERS] ?
                isEmpty(appParam[APP_MODULE.CUSTOMERS]["PARTNER"], {}) : {};
            yield put(actions.browsePartner(initParam));
        } else {
            Ui.showError({ message: searchResult.message });
        }
    } catch (error) {
        // yield put(actions.costCustomerSearchSuccess());
    }
}

function* editPartnerRequest({ payload }) {
    const { data } = payload;
    try {
        const searchResult = yield call(onEditPartnerRequest, data);
        if (searchResult.status === HTTP_STATUS.OK) {
            Ui.showSuccess({
                message: "Sửa KH thành công."
            });
            yield put(
                actions.showModal({
                    isShow: false,
                    actionName: ""
                })
            );
            let initParam = appParam[APP_MODULE.CUSTOMERS] ?
                isEmpty(appParam[APP_MODULE.CUSTOMERS]["PARTNER"], {}) : {};
            yield put(actions.browsePartner(initParam));
        } else {
            Ui.showError({ message: searchResult.message });
        }
    } catch (error) {
        // yield put(actions.costCustomerSearchSuccess());
    }
}

/***READ***/
function* readOrganizationRequest({ payload }) {
    const { param, filterDatetime } = payload;
    try {
        const searchResult = yield call(async param => {
            return requestJson({
                url: API_URI.READ_ORGANIZATION_CUSTOMER,
                method: "POST",
                data: param
            });
        }, param);
        if (searchResult.status === HTTP_STATUS.OK) {
            yield all([
                put(
                    actions.readOrganizationSuccess({
                        data: searchResult.data.data
                    })
                ),
                put(actions.costCustomerSearch(param.uuid, filterDatetime))
            ]);
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
            const searchResult = yield call(async param => {
                return requestJson({
                    url: API_URI.READ_PERSONAL_CUSTOMER,
                    method: "POST",
                    data: param
                });
            }, param);
            if (searchResult.status === HTTP_STATUS.OK) {
                yield all([
                    put(
                        actions.readPartnerSuccess({
                            data: searchResult.data.data
                        })
                    ),
                    put(actions.costCustomerSearch(param.uuid, filterDatetime))
                ]);
            } else {
                yield put(actions.readPartnerError(searchResult.toString()));
            }
        } catch (error) {
            yield put(actions.readPartnerError(error.toString()));
        }
    }
    /******/

/***DELETE***/
function* deleteOrganizationRequest({ payload }) {
    const { param } = payload;
    try {
        const searchResult = yield call(async param => {
            return requestJson({
                url: API_URI.DELETE_ORGANIZATION_CUSTOMER,
                method: "POST",
                data: param
            });
        }, param);
        if (searchResult.status === HTTP_STATUS.OK) {
            let initParam = appParam[APP_MODULE.CUSTOMERS] ?
                isEmpty(appParam[APP_MODULE.CUSTOMERS]["ORGANIZATION"], {}) : {};
            yield put(actions.browseOrganization(initParam));
        } else {}
    } catch (error) {
        // yield put(actions.costCustomerSearchSuccess());
    }
}

function* deletePartnerRequest({ payload }) {
    const { param } = payload;
    try {
        const searchResult = yield call(async param => {
            return requestJson({
                url: API_URI.DELETE_PERSONAL_CUSTOMER,
                method: "POST",
                data: param
            });
        }, param);
        if (searchResult.status === HTTP_STATUS.OK) {
            Ui.showSuccess({
                message: "Xóa khách hàng thành công"
            });
            let initParam = appParam[APP_MODULE.CUSTOMERS] ?
                isEmpty(appParam[APP_MODULE.CUSTOMERS]["PARTNER"], {}) : {};
            yield put(actions.browsePartner(initParam));
        } else {
            // notification.error({className: 'toast toast-error', message: 'HAVAZ', description: searchResult.message});
            // yield put(actions.costCustomerSearchSuccess());
        }
    } catch (error) {
        // yield put(actions.costCustomerSearchSuccess());
    }
}

/******/

/*** Customer cost ***/
function* saveCustomerRouteCostRequest({ payload }) {
    const { param } = payload;
    try {
        const searchResult = yield call(async param => {
            return requestJson({
                url: API_URI.CUSTOMER_SAVE_ROUTE_COST,
                method: "POST",
                data: param
            });
        }, param);
        if (searchResult.status === HTTP_STATUS.OK) {} else {
            // yield put(actions.costCustomerSearchSuccess());
        }
    } catch (error) {
        // yield put(actions.costCustomerSearchSuccess());
    }
}

function* saveCustomerRouteCostPerRequest({ payload }) {
    const { param } = payload;
    try {
        const searchResult = yield call(async param => {
            return requestJson({
                url: API_URI.CUSTOMER_SAVE_ROUTE_COST_PER,
                method: "POST",
                data: param
            });
        }, param);
        if (searchResult.status === HTTP_STATUS.OK) {
            // yield put(actions.costCustomerSearch(param.uuid));
        } else {
            // yield put(actions.costCustomerSearchSuccess());
        }
    } catch (error) {
        // yield put(actions.costCustomerSearchSuccess());
    }
}

/*******/
function* changeTab({ payload }) {
    const { tabId } = payload;
    try {
        if (tabId === 1) {
            yield put(actions.browseOrganization({}));
        } else {
            yield put(actions.browsePartner({}));
        }
    } catch (error) {}
}

export default function* rootSaga() {
    yield all([
        takeEvery(actions.CUSTOMER_BROWSE_ORGANIZATION, browseOrganizationRequest),
        takeEvery(actions.CUSTOMER_BROWSE_PARTNER, browsePartnerRequest),
        takeEvery(actions.CITY_SEARCH, searchCityRequest),
        takeLatest(actions.COST_CUSTOMER_SEARCH, searchCostCustomerRequest),

        takeEvery(actions.CUSTOMER_ADD_ORGANIZATION, addOrganizationRequest),
        takeEvery(actions.CUSTOMER_EDIT_ORGANIZATION, editOrganizationRequest),

        takeEvery(actions.CUSTOMER_ADD_PARTNER, addPartnerRequest),
        takeEvery(actions.CUSTOMER_EDIT_PARTNER, editPartnerRequest),

        takeEvery(actions.CUSTOMER_DELETE_ORGANIZATION, deleteOrganizationRequest),
        takeEvery(actions.CUSTOMER_DELETE_PARTNER, deletePartnerRequest),
        takeEvery(actions.CUSTOMER_READ_ORGANIZATION, readOrganizationRequest),
        takeEvery(actions.CUSTOMER_READ_PARTNER, readPartnerRequest),

        takeEvery(actions.SAVE_CUSTOMER_ROUTE_COST, saveCustomerRouteCostRequest),
        takeEvery(
            actions.SAVE_CUSTOMER_ROUTE_COST_PER,
            saveCustomerRouteCostPerRequest
        ),
        takeEvery(actions.CUSTOMER_CHANGE_TAB, changeTab)
    ]);
}