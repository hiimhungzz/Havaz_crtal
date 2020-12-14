import { all, takeEvery, put, call, select, delay } from "redux-saga/effects";
import { actions } from "./actions";
import { API_URI } from "@Constants";
import {
    requestJsonGet
} from "@Services/base";
// import { async } from 'q';

const onSearchDriverRequest = async param => {
    return requestJsonGet({
        url: `/driver-warning`,
        method: "GET",
        data: param
    });
};
const onSearchVehicleRequest = async param => {
    return requestJsonGet({
        url: `/vehicle-warning`,
        method: "GET",
        data: param
    });
};
const onSearchTemRequest = async param => {
    return requestJsonGet({
        url: API_URI.WARNING_VEHICLE_TEM,
        method: "GET",
        data: param
    });
};

function* searchwarningVehicleRequest({ payload }) {
    const { param, tabId } = payload;
    try {
        const searchResult = yield call(onSearchVehicleRequest, param, 0);
        yield put(
            actions.warningVehicleSuccess(
                searchResult.data.docs,
                searchResult.data.total,
                searchResult.data.pages,
                searchResult.data.pageSize,
                tabId,
                param
            )
        );
    } catch (error) {
        yield put(actions.warningVehicleSuccess());
    }
}

function* searchwarningDriverRequest({ payload }) {
    const { param, tabId } = payload;
    try {
        const searchResult = yield call(onSearchDriverRequest, param, 0);
        yield put(
            actions.warningDriverSuccess(
                searchResult.data.docs,
                searchResult.data.total,
                searchResult.data.pages,
                searchResult.data.pageSize,
                tabId,
                param
            )
        );
    } catch (error) {
        yield put(actions.warningDriverSuccess());
    }
}

function* searchwarningTemRequest({ payload }) {
    const { param, tabId } = payload;
    try {
        const searchResult = yield call(onSearchTemRequest, param, 0);
        yield put(
            actions.warningTemSuccess(
                searchResult.data.docs,
                searchResult.data.total,
                searchResult.data.pages,
                searchResult.data.pageSize,
                tabId,
                param
            )
        );
    } catch (error) {
        yield put(actions.warningTemSuccess());
    }
}

function* changeTab({ payload }) {
    const { tabId } = payload;
    try {
        if (tabId === "1") {
            yield put(actions.warning_driver_Search("", 5, 0, "1"));
        } else if (tabId === "2") {
            yield put(actions.warning_Vehicle_Search("", 5, 0, "2"));
        } else if (tabId === "3") {
            yield put(actions.warning_Tem_Search("", 5, 0, "3"));
        }
    } catch (error) {
        // yield put(actions.costCustomerSearchSuccess());
    }
}

export default function* rootSaga() {
    yield all([
        takeEvery(actions.WARNING_VEHICLE_SEARCH, searchwarningVehicleRequest),
        takeEvery(actions.WARNING_DIRVER_SEARCH, searchwarningDriverRequest),
        takeEvery(actions.WARNING_TEM_SEARCH, searchwarningTemRequest),
        takeEvery(actions.WARNING_CHANGE_TAB, changeTab)
    ]);
}