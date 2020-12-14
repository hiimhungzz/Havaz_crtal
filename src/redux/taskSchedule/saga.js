import { all, takeEvery, put, call, select } from "redux-saga/effects";
import { actions } from "./actions";
import { API_URI } from "../../constants";
import {
  requestJsonPost,
  requestJsonGet,
  requestJsonPut,
  requestJsonDelete
} from "../../services/base";
import { HTTP_STATUS } from "../../constants/common";
import { notification } from "antd";
// import { async } from 'q';
// selectors
import * as taskScheduleSelectors from "./selectors";
import { Ui } from "../../helpers/Ui";

const onSearchScheduleRequest = async param => {
  return requestJsonGet({
    url: API_URI.DRIVER_TABLE,
    method: "GET",
    data: param
  });
};

function* searchTaskScheduleRequest({ payload }) {
  const { param, query } = payload;
  try {
    const searchResult = yield call(onSearchScheduleRequest, param, 0);

    yield put(
      actions.scheduleSearchSuccess(
        searchResult.data.docs,
        searchResult.data.headers,
        searchResult.data.total,
        searchResult.data.pages,
        searchResult.data.pageSize,
        "",
        param,
        "",
        query
      )
    );
  } catch (error) {
    // yield put(actions.scheduleSearchSuccess());
  }
}
const onSaveSabbaticalRequest = async param => {
  return requestJsonPost({
    url: API_URI.DRIVER_TABLE_UPDATE_SABBATICAL,
    method: "POST",
    data: param
  });
};
const onTaskScheduleRequest = async param => {
  return requestJsonPost({
    url: API_URI.DRIVER_TABLE_UPDATE,
    method: "POST",
    data: param
  });
};
const onTaskComfirmRequest = async param => {
  return requestJsonPut({
    url: API_URI.DRIVER_TABLE_UPDATE_COMFIRM,
    method: "PUT",
    data: param
  });
};

const onDeleteTaskScheduleRequest = async param => {
  return requestJsonDelete({
    url: `/driver-time-table/${param}`,
    method: "DELETE"
    // data: param.params,
  });
};

function* saveTaskScheduleRequest({ payload }) {
  const { data } = payload;
  try {
    const searchResult = yield call(onTaskScheduleRequest, data);
    if (searchResult.status === HTTP_STATUS.OK) {
      Ui.showSuccess({
        message: "Thêm lịch trực thành công."
      });
      const query = yield select(taskScheduleSelectors.query);

      yield put(actions.taskSchedule_Search({ query: query }));
      // yield put(actions.showModal(false, ''));
    } else if (searchResult.status === 400) {
    }
  } catch (error) {
    yield put(actions.driverError());
  }
}

function* comfirmTaskScheduleRequest({ payload }) {
  const { data } = payload;
  try {
    const searchResult = yield call(onTaskComfirmRequest, data);
    if (searchResult.status === HTTP_STATUS.OK) {
      Ui.showSuccess({
        message: "Xác nhận thành công."
      });
      const query = yield select(taskScheduleSelectors.query);
      yield put(actions.taskSchedule_Search({ query: query }));
      // yield put(actions.showModal(false, ''));
    } else if (searchResult.status === 400) {
    }
  } catch (error) {
    yield put(actions.driverError());
  }
}

function* saveSabbticalTaskScheduleRequest({ payload }) {
  const { data } = payload;
  try {
    const searchResult = yield call(onSaveSabbaticalRequest, data);
    if (searchResult.status === HTTP_STATUS.OK) {
      Ui.showSuccess({
        message: "Thêm lịch nghỉ thành công."
      });
      const query = yield select(taskScheduleSelectors.query);
      yield put(actions.taskSchedule_Search({ query: query }));
    } else if (searchResult.status === 400) {
    }
  } catch (error) {
    yield put(actions.driverError());
  }
}

function* deleteTaskScheduleRequest({ payload }) {
  const { data } = payload;
  try {
    const searchResult = yield call(onDeleteTaskScheduleRequest, data);
    if (searchResult.status === HTTP_STATUS.OK) {
      notification.success({
        className: "toast toast-success",
        message: "HAVAZ",
        description: "Xóa lịch đi làm thành công !"
      });
      // let initParam = {};
      // if (localStorage.getItem('AppParam')) {
      //     let appParam = JSON.parse(localStorage.getItem('AppParam'));
      //     if (appParam['Driver']) {
      //         initParam = appParam['Driver'];
      //     }
      // }
      const query = yield select(taskScheduleSelectors.query);

      yield put(actions.taskSchedule_Search({ query: query }));
    } else if (searchResult.status === 400) {
    }
  } catch (error) {
    yield put(actions.driverError());
  }
}

export default function* rootSaga() {
  yield all([
    takeEvery(actions.TASK_SCHEDULE_SEARCH, searchTaskScheduleRequest)
  ]);
  yield all([takeEvery(actions.ACTION_SAVE_SCHEDULE, saveTaskScheduleRequest)]);
  yield all([
    takeEvery(actions.ACTION_COMFIRM_SCHEDULE, comfirmTaskScheduleRequest)
  ]);
  yield all([
    takeEvery(
      actions.ACTION_SAVE_SABBATICAL_SCHEDULE,
      saveSabbticalTaskScheduleRequest
    )
  ]);
  yield all([
    takeEvery(actions.ACTION_DELETE_TASK_SCHEDULE, deleteTaskScheduleRequest)
  ]);
}
