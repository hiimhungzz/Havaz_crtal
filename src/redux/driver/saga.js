import { all, takeEvery, put, call } from 'redux-saga/effects';
import { actions } from './actions';
import { API_URI } from "@Constants";
import { requestJsonPost, requestJsonGet, requestJsonPut, requestJsonDelete } from "../../services/base";
import { HTTP_STATUS } from "@Constants/common";
import { Ui } from '@Helpers/Ui';

const onSearchDriverRequest = async(param) => {
    return requestJsonGet({
        url: API_URI.ACTION_GET_LIST_DRIVER,
        method: 'GET',
        data: param
    });
};
const onSearchDriverStatus = async(param) => {
    return requestJsonGet({
        url: `obj-entries`,
        method: 'GET',
        // data: param
    });
};

function* changeTab({ payload }) {
    const { tabId } = payload;

    try {
        if (tabId === '1') {
            yield put(actions.driverSearch('', 5, 0, false, '1'));
        } else {
            yield put(actions.driverParnerSearch('', 5, 0, '', '2'));
        }
    } catch (error) {
        // yield put(actions.costCustomerSearchSuccess());
    }
}

function* searchDriverRequest({ payload }) {
    const { param, tabId } = payload;
    try {
        const searchResult = yield call(onSearchDriverRequest, param, 0);
        const searchResultStatus = yield call(onSearchDriverStatus, param, 0);
        if (searchResult.status === HTTP_STATUS.OK) {
            yield put(actions.driverSearchSuccess(searchResult.data.docs, searchResult.data.total, searchResult.data.pages, searchResult.data.pageSize, '', param, searchResultStatus.data.statusUser, tabId));
        } else {
            yield put(actions.driverSearchSuccess());
        }
    } catch (error) {
        yield put(actions.driverSearchSuccess());
    }
}
const onCreateDriverRequest = async(param) => {
    return requestJsonPost({
        url: API_URI.ACTION_CREATE_DRIVER,
        method: 'POST',
        data: param,
    });
};
const onSaveDriverRequest = async(param) => {
    return requestJsonPut({
        url: `/driver/${param.uuid}`,
        method: 'PUT',
        data: param.params,
    });
};
const onDeleteDriverRequest = async(param) => {
    return requestJsonDelete({
        url: `/driver/${param}`,
        method: 'PUT',
        // data: param.params,
    });
};
//CTV
const onDriverParnerSearch = async(param) => {
    return requestJsonGet({
        url: `driver-partner`,
        method: 'GET',
        data: param
    })
}
const onDriverParnerCreate = async(param) => {
    return requestJsonPost({
        url: `driver-partner`,
        method: 'POST',
        data: param
    })
}
const onDriverParnerSave = async(param) => {
    return requestJsonPut({
        url: `driver-partner/${param.uuid}`,
        method: 'PUT',
        data: param.params
    })
}
const onDriverParnerDelete = async(param) => {
    return requestJsonDelete({
        url: `driver-partner/${param}`,
        method: 'DELETE',
    })
}

function* createDriverRequest({ payload }) {
    const { data } = payload;
    try {
        const searchResult = yield call(onCreateDriverRequest, data);
        if (searchResult.status === HTTP_STATUS.OK) {
            Ui.showSuccess({
                message: "Tạo lái xe thành công."
              });
            yield put(actions.driveShowModal((false)));
            let initParam = {};
            if (localStorage.getItem('AppParam')) {
                let appParam = JSON.parse(localStorage.getItem('AppParam'));
                if (appParam['Driver']) {
                    initParam = appParam['Driver'];
                }
            }
            yield put(actions.driverSearch(initParam));
            // yield put(actions.showModal(false, ''));
        } else if (searchResult.status === 400) {}
    } catch (error) {
        // yield put(actions.costCustomerSearchSuccess());
    }
}

function* saveDriverRequest({ payload }) {
    const { data } = payload;
    try {
        // console.log(call(onSaveDriverRequest, data))
        const searchResult = yield call(onSaveDriverRequest, data);
        if (searchResult.status === HTTP_STATUS.OK) {
            Ui.showSuccess({
                message: "Sửa lái xe thành công."
              });
            yield put(actions.driveShowModal((false)));
            let initParam = {};
            if (localStorage.getItem('AppParam')) {
                let appParam = JSON.parse(localStorage.getItem('AppParam'));
                if (appParam['Driver']) {
                    initParam = appParam['Driver'];
                }
            }
            yield put(actions.driverSearch(initParam));
            // yield put(actions.showModal(false, ''));
        } else if (searchResult.status === 400) {}
    } catch (error) {
        yield put(actions.driverError());
    }
}

function* deleteDriverRequest({ payload }) {
    const { data } = payload;
    try {
        const searchResult = yield call(onDeleteDriverRequest, data);
        if (searchResult.status === HTTP_STATUS.OK) {
            Ui.showSuccess({
                message: "Xóa lái xe thành công."
              });
            let initParam = {};
            if (localStorage.getItem('AppParam')) {
                let appParam = JSON.parse(localStorage.getItem('AppParam'));
                if (appParam['Driver']) {
                    initParam = appParam['Driver'];
                }
            }
            yield put(actions.driverSearch(initParam));
        } else if (searchResult.status === 400) {}
    } catch (error) {
        yield put(actions.driverError());
    }
}

function* driverParnerSearchRequest({ payload }) {
    const { tabId, param } = payload;
    try {
        const searchResult = yield call(onDriverParnerSearch, param, 0);
        if (searchResult.status === HTTP_STATUS.OK) {
            yield put(actions.driverParnerSuccess(searchResult.data.docs, searchResult.data.total, searchResult.data.pages, searchResult.data.pageSize, '', param, tabId));
        } else {
            yield put(actions.driverParnerSuccess());
        }
    } catch (error) {
        yield put(actions.driverParnerSuccess());
    }
}

function* createDriverParnerRequest({ payload }) {
    const { data } = payload;
    try {
        const searchResult = yield call(onDriverParnerCreate, data);
        if (searchResult.status === HTTP_STATUS.OK) {
            Ui.showSuccess({
                message: "Tạo lái xe thành công."
              });
            yield put(actions.driverParnerShowModal((false)));
            let initParam = {};
            if (localStorage.getItem('AppParam')) {
                let appParam = JSON.parse(localStorage.getItem('AppParam'));
                if (appParam['Driver']) {
                    initParam = appParam['Driver'];
                }
            }
            yield put(actions.driverParnerSearch(initParam));
            // yield put(actions.showModal(false, ''));
        } else if (searchResult.status === 400) {}
    } catch (error) {
        // yield put(actions.costCustomerSearchSuccess());
    }
}

function* saveDriverParnerRequest({ payload }) {
    const { data } = payload;
    try {
        const searchResult = yield call(onDriverParnerSave, data);
        if (searchResult.status === HTTP_STATUS.OK) {
            Ui.showSuccess({
                message: "Sửa lái xe thành công."
              });
            yield put(actions.driverParnerShowModal((false)));
            let initParam = {};
            if (localStorage.getItem('AppParam')) {
                let appParam = JSON.parse(localStorage.getItem('AppParam'));
                if (appParam['Driver']) {
                    initParam = appParam['Driver'];
                }
            }
            yield put(actions.driverParnerSearch(initParam));
            // yield put(actions.showModal(false, ''));
        } else if (searchResult.status === 400) {}
    } catch (error) {
        // yield put(actions.costCustomerSearchSuccess());
    }
}

function* deleteDriverParnerRequest({ payload }) {
    const { data } = payload;
    try {
        const searchResult = yield call(onDriverParnerDelete, data);
        if (searchResult.status === HTTP_STATUS.OK) {
            Ui.showSuccess({
                message: "Xóa lái xe thành công."
              });
            let initParam = {};
            if (localStorage.getItem('AppParam')) {
                let appParam = JSON.parse(localStorage.getItem('AppParam'));
                if (appParam['Driver']) {
                    initParam = appParam['Driver'];
                }
            }
            yield put(actions.driverParnerSearch(initParam));
        }
    } catch {}
}

export default function* rootSaga() {
    yield all([takeEvery(actions.DRIVER_SEARCH, searchDriverRequest)]);
    yield all([takeEvery(actions.DIVER_PARNER_SEARCH, driverParnerSearchRequest)]);
    yield all([takeEvery(actions.DRIVER_PARNER_CREATE, createDriverParnerRequest)]);
    yield all([takeEvery(actions.DRIVER_PARNER_DELETE, deleteDriverParnerRequest)]);
    yield all([takeEvery(actions.DRIVER_PARNER_SAVE, saveDriverParnerRequest)]);
    yield all([takeEvery(actions.DRIVER_CHANGE_TAB, changeTab)]);
    yield all([takeEvery(actions.ACTION_CREATE_DRIVER, createDriverRequest)]);
    yield all([takeEvery(actions.ACTION_SAVE_DRIVER, saveDriverRequest)]);
    yield all([takeEvery(actions.ACTION_DELETE_DRIVER, deleteDriverRequest)]);
}