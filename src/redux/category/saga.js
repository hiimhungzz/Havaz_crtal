import { all, takeEvery, put, call } from "redux-saga/effects";
import { actions } from "./actions";
import {
    requestJsonPost,
    requestJsonGet,
    requestJsonPut,
    requestJsonDelete
} from "../../services/base";
import { HTTP_STATUS } from "@Constants/common";
import { Ui } from "@Helpers/Ui";

const onSearchCategoryRequest = async param => {
    return requestJsonGet({
        url: "catalog-fee",
        method: "GET",
        data: param
    });
};
const onCreateRequest = async param => {
    return requestJsonPost({
        url: `catalog-fee`,
        method: "POST",
        data: param
    });
};
const onSaveRequest = async param => {
    return requestJsonPut({
        url: `catalog-fee/${param.uuid}`,
        method: "PUT",
        data: param.params
    });
};
const onDeleteRequest = async param => {
    return requestJsonDelete({
        url: `catalog-fee/${param}`,
        method: "DELETE"
            // data:param
    });
};

function* searchCategoryRequest({ payload }) {
    const { searchInput, query, pageSize, externalPageLimit, param } = payload;
    try {
        const searchResult = yield call(onSearchCategoryRequest, param, 0);
        if (searchResult.status === HTTP_STATUS.OK) {
            yield put(
                actions.categorySearchSuccess(
                    searchResult.data.docs,
                    searchResult.data.total,
                    searchResult.data.pages,
                    searchResult.data.pageSize,
                    "",
                    param
                )
            );
        } else {
            yield put(actions.categorySearchSuccess());
        }
    } catch (error) {
        yield put(actions.categorySearchSuccess());
    }
}

function* createCategoryRequest({ payload }) {
    const { data } = payload;
    try {
        const searchResult = yield call(onCreateRequest, data, 0);
        if (searchResult.status === HTTP_STATUS.OK) {
            Ui.showSuccess({
                message: "Tạo chi phí thành công."
            });
            yield put(actions.showModel(false));
            let initParam = {};
            if (localStorage.getItem("AppParam")) {
                let appParam = JSON.parse(localStorage.getItem("AppParam"));
                if (appParam["Category"]) {
                    initParam = appParam["Category"];
                }
            }
            yield put(actions.categorySearch(initParam));
        } else {
            yield put(actions.categorySearch());
        }
    } catch (error) {
        yield put(actions.categorySearch());
    }
}

function* saveCategoryRequest({ payload }) {
    const { data } = payload;
    try {
        const searchResult = yield call(onSaveRequest, data, 0);
        if (searchResult.status === HTTP_STATUS.OK) {
            Ui.showSuccess({
                message: "Sửa chi phí thành công."
            });

        }
        yield put(actions.showModel(false));
        let initParam = {};
        if (localStorage.getItem("AppParam")) {
            let appParam = JSON.parse(localStorage.getItem("AppParam"));
            if (appParam["Category"]) {
                initParam = appParam["Category"];
            }
        }
        yield put(actions.categorySearch(initParam));
    } catch (error) {
        yield put(actions.categorySearch());
    }
}

function* deleteCategoryRequest({ payload }) {
    const { data } = payload;
    try {
        const searchResult = yield call(onDeleteRequest, data, 0);
        if (searchResult.status === HTTP_STATUS.OK) {
            Ui.showSuccess({
                message: "Xóa chi phí thành công"
            });
            yield put(actions.showModel(false));
            let initParam = {};
            if (localStorage.getItem("AppParam")) {
                let appParam = JSON.parse(localStorage.getItem("AppParam"));
                if (appParam["Category"]) {
                    initParam = appParam["Category"];
                }
            }
            yield put(actions.categorySearch(initParam));
        } else {
            yield put(actions.categorySearch());
        }
    } catch (error) {
        yield put(actions.categorySearch());
    }
}

export default function* rootSaga() {
    yield all([
        takeEvery(actions.CATEGORY_SEARCH, searchCategoryRequest),
        takeEvery(actions.CATEGORY_CREATE, createCategoryRequest),
        takeEvery(actions.CATEGORY_SAVE, saveCategoryRequest),
        takeEvery(actions.CATEGORY_DELETE, deleteCategoryRequest)
    ]);
}