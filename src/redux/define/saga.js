import { all, takeEvery, put, call, select, delay } from "redux-saga/effects";
import { actions } from "./actions";
import {
    requestJsonPost,
    requestJsonGet,
    requestJsonPut,
    requestJsonDelete
} from "@Services/base";
import { HTTP_STATUS } from "@Constants/common";
import { notification } from "antd";

const onSearchDefineRequest = async param => {
    return requestJsonGet({
        url: `/category-survey`,
        method: "GET",
        data: param
    });
};

const onTypeDefineRequest = async param => {
    return requestJsonGet({
        url: `/category-survey-attributes`,
        method: "GET",
        data: param
    });
};
const onCreateDefineRequest = async param => {
    return requestJsonPost({
        url: `/category-survey`,
        method: "POST",
        data: param
    });
};
const onSaveDefineRequest = async param => {
    return requestJsonPut({
        url: `/category-survey/${param.id}`,
        method: "PUT",
        data: param.params
    });
};
const onShowDefineRequest = async param => {
    return requestJsonGet({
        url: `/category-survey/${param}`,
        method: "GET",
        data: param
    });
};
const onDeleteDefineRequest = async param => {
    return requestJsonDelete({
        url: `/category-survey/${param}`,
        method: "DELETE",
        data: param
    });
};

//define
function* searchDefineRequest({ payload }) {
    const { param, tabId, query } = payload;
    try {
        const searchResult = yield call(onSearchDefineRequest, param);
        const typeDefine = yield call(onTypeDefineRequest);
        yield put(
            actions.defineSuccess(
                searchResult.data.docs,
                searchResult.data.total,
                searchResult.data.pages,
                searchResult.data.pageSize,
                tabId,
                query,
                param,
                typeDefine.data
            )
        );

    } catch (error) {
        yield put(actions.defineSuccess());
    }
}

function* createDefineRequest({ payload }) {
    const { data, tabId } = payload;
    try {
        const searchResult = yield call(onCreateDefineRequest, data, 0);
        if (searchResult.status === HTTP_STATUS.OK) {
            notification.success({
                className: 'toast toast-success',
                message: 'HAVAZ',
                description: 'Tạo  thành công !'
            });
        }
        yield put(actions.showModalDefine((false)));
        let initParam = {};
        if (localStorage.getItem('AppParam')) {
            let appParam = JSON.parse(localStorage.getItem('AppParam'));
            if (appParam['Define']) {
                initParam = appParam['Define'];
            }
        }
        yield put(actions.defineSearch(initParam))

    } catch (error) {
        yield put(actions.defineSuccess());
    }
}

function* showfineRequest({ payload }) {
    const { data, tabId } = payload;
    try {
        const searchResult = yield call(onShowDefineRequest, data);
        yield put(actions.showDefineSuccess(searchResult.data))
        let initParam = {};
        if (localStorage.getItem('AppParam')) {
            let appParam = JSON.parse(localStorage.getItem('AppParam'));
            if (appParam['Define']) {
                initParam = appParam['Define'];
            }
        }
        yield put(actions.defineSearch(initParam))

    } catch (error) {
        yield put(actions.defineSuccess());
    }
}

function* saveDefineRequest({ payload }) {
    const { data, tabId } = payload;
    try {
        const searchResult = yield call(onSaveDefineRequest, data, 0);
        if (searchResult.status === HTTP_STATUS.OK) {
            notification.success({
                className: 'toast toast-success',
                message: 'HAVAZ',
                description: 'Sửa thành công !'
            });
        }
        yield put(actions.showModalDefine((false)));
        let initParam = {};
        if (localStorage.getItem('AppParam')) {
            let appParam = JSON.parse(localStorage.getItem('AppParam'));
            if (appParam['Define']) {
                initParam = appParam['Define'];
            }
        }
        yield put(actions.defineSearch(initParam))

    } catch (error) {
        yield put(actions.defineSuccess());
    }
}

function* deleteDefineRequest({ payload }) {
    const { data, tabId } = payload;
    try {
        const searchResult = yield call(onDeleteDefineRequest, data, 0);
        if (searchResult.status === HTTP_STATUS.OK) {
            notification.success({
                className: 'toast toast-success',
                message: 'HAVAZ',
                description: 'Xóa thành công !'
            });
        }
        let initParam = {};
        if (localStorage.getItem('AppParam')) {
            let appParam = JSON.parse(localStorage.getItem('AppParam'));
            if (appParam['Define']) {
                initParam = appParam['Define'];
            }
        }
        yield put(actions.defineSearch(initParam))

    } catch (error) {
        yield put(actions.defineSuccess());
    }
}


function* changeTab({ payload }) {
    const { tabId } = payload;

    try {
        if (tabId === "1") {
            yield put(actions.defineSearch("", 5, 0, "1"));
        }
    } catch (error) {
        // yield put(actions.costCustomerSearchSuccess());
    }
}

export default function* rootSaga() {
    yield all([
        takeEvery(actions.DEFINE_SEARCH, searchDefineRequest),
        takeEvery(actions.CREATE_DEFINE_USER, createDefineRequest),
        takeEvery(actions.DELETE_DEFINE_USER, deleteDefineRequest),
        takeEvery(actions.SAVE_DEFINE_USER, saveDefineRequest),
        takeEvery(actions.SHOW_DEFINE_USER, showfineRequest),
        takeEvery(actions.DEFINE_CHANGE_TAB, changeTab)
    ]);
}