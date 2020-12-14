import { all, takeEvery, put, call, delay } from "redux-saga/effects";
import { actions } from "./actions";
import { API_URI } from "@Constants";
import {
  requestJsonPost,
  requestJsonGet,
  requestJsonPut,
  requestJsonDelete
} from "@Services/base";
import { HTTP_STATUS } from "@Constants/common";
import { Ui } from "@Helpers/Ui";

const onSearchVehicleRequest = async param => {
  return requestJsonGet({
    url: `vehicle`,
    method: "GET",
    data: param
  });
};
const onCreateVehicleRequest = async param => {
  return requestJsonPost({
    url: `vehicle`,
    method: "POST",
    data: param
  });
};
const onSaveVehicleRequest = async param => {
  return requestJsonPut({
    url: `/vehicle/${param.uuid}`,
    method: "PUT",
    data: param.params
  });
};
const onDeleteVehicleRequest = async param => {
  return requestJsonDelete({
    url: `/vehicle/${param}`,
    method: "DELETE",
    data: param.params
  });
};

// Vehicle type
const onSearchVehicleTypeRequest = async param => {
  return requestJsonGet({
    url: `vehicle-type`,
    method: "GET",
    data: param
  });
};
const onCreateVehicleTypeRequest = async param => {
  return requestJsonPost({
    url: `vehicle-type`,
    method: "POST",
    data: param
  });
};
const onSaveVehicleTypeRequest = async param => {
  return requestJsonPut({
    url: `vehicle-type/${param.uuid}`,
    method: "PUT",
    data: param.params
  });
};
const onDeleteVehicleTypeRequest = async param => {
  return requestJsonDelete({
    url: `vehicle-type/${param}`,
    method: "DELETE",
    data: param.params
  });
};
const onCheckDriverVehicle = async param => {
  return requestJsonGet({
    url: `driver-vehicle/${param}`,
    method: "GET",
    data: param.params
  });
};
// Vehicle Tem
const onVehicleTem = async param => {
  return requestJsonGet({
    url: `business-vehicle-license`,
    method: "GET",
    data: param
  });
};
const onVehicleFillTem = async param => {
  return requestJsonGet({
    url: `business-vehicle-license/${param}/vehicle`,
    method: "GET"
    // data: param
  });
};
const onCreateVehicleTem = async param => {
  return requestJsonPost({
    url: `business-vehicle-license`,
    method: "POST",
    data: param
  });
};
const onSaveVehicleTem = async param => {
  return requestJsonPut({
    url: `business-vehicle-license/${param.id}`,
    method: "PUT",
    data: param.params
  });
};
const onDeleteVehicleTem = async param => {
  return requestJsonDelete({
    url: `business-vehicle-license/${param}`,
    method: "DELETE"
    // data: param.params
  });
};
// Vehicle Class
const onVehicleClass = async param => {
  return requestJsonGet({
    url: API_URI.GET_VEHICLE_CLASS,
    method: "GET",
    data: param
  });
};

const onCreateVehicleClass = async param => {
  return requestJsonPost({
    url: API_URI.CREATE_VEHICLE_CLASS,
    method: "POST",
    data: param
  });
};
const onSaveVehicleClass = async param => {
  return requestJsonPut({
    url: `vehicle-class/${param.id}`,
    method: "PUT",
    data: param.params
  });
};
const onDeleteVehicleClass = async param => {
  return requestJsonDelete({
    url: `vehicle-class/${param}`,
    method: "DELETE"
    // data: param.params
  });
};

function* searchVehicleTypeRequest({ payload }) {
  const {
    tabId,
    param
  } = payload;
  try {
    const searchResult = yield call(onSearchVehicleTypeRequest, param, 0);
    if (searchResult.status === HTTP_STATUS.OK) {
      yield put(
        actions.vehicleTypeSearchSuccess(
          searchResult.data.docs,
          searchResult.data.total,
          searchResult.data.pages,
          searchResult.data.pageSize,
          tabId,
          param
        )
      );
      // yield put(actions.vehicleTypeShowModal(true, ''));
    } else {
      Ui.showError({ message: searchResult.message });
      yield put(actions.vehicleTypeSearchSuccess());
    }
  } catch (error) {
    yield put(actions.vehicleTypeSearchSuccess());
  }
}

function* deleteDeleteRequest({ payload }) {
  const { data } = payload;
  try {
    const searchResult = yield call(onDeleteVehicleRequest, data);
    if (searchResult.status === HTTP_STATUS.OK) {
      Ui.showSuccess({
        message: "Xóa xe thành công."
      });
      // yield put(actions.driveShowModal(searchResult.data));
      let initParam = {};
      if (localStorage.getItem("AppParam")) {
        let appParam = JSON.parse(localStorage.getItem("AppParam"));
        if (appParam["Vehicle"]) {
          initParam = appParam["Vehicle"];
        }
      }
      yield put(actions.vehicleSearch(initParam));
    } else if (searchResult.status === 400) {
    }
  } catch (error) {
    yield put(actions.driverError());
  }
}

function* createVehicleRequest({ payload }) {
  const { data } = payload;
  try {
    const searchResult = yield call(onCreateVehicleRequest, data);
    if (searchResult.status === HTTP_STATUS.OK) {
      Ui.showSuccess({
        message: "Tạo xe thành công."
      });
      yield put(actions.vehicleShowModal(false, "", "", ""));
      let initParam = {};
      if (localStorage.getItem("AppParam")) {
        let appParam = JSON.parse(localStorage.getItem("AppParam"));
        if (appParam["Vehicle"]) {
          initParam = appParam["Vehicle"];
        }
      }
      yield put(actions.vehicleSearch(initParam));
      // yield put(actions.showModal(false, ''));
    } else if (searchResult.status === 400) {
    }
  } catch (error) {
    // yield put(actions.costCustomerSearchSuccess());
  }
}

function* saveVehicleRequest({ payload }) {
  const { data } = payload;
  try {
    const searchResult = yield call(onSaveVehicleRequest, data);
    if (searchResult.status === HTTP_STATUS.OK) {
      Ui.showSuccess({
        message: "Sửa xe thành công."
      });
      yield put(actions.vehicleShowModal(false, "", "", ""));
      // resetForm();
      let initParam = {};
      if (localStorage.getItem("AppParam")) {
        let appParam = JSON.parse(localStorage.getItem("AppParam"));
        if (appParam["Vehicle"]) {
          initParam = appParam["Vehicle"];
        }
      }
      yield put(actions.vehicleSearch(initParam));
    } else if (searchResult.status === 400) {
    }
  } catch (error) {
    // yield put(actions.driverError());
  }
}

function* searchVehicleRequest({ payload }) {
  const { tabId, param } = payload;
  try {
    const searchResult = yield call(onSearchVehicleRequest, param, 0);
    if (searchResult.status === HTTP_STATUS.OK) {
      yield put(
        actions.vehicleSearchSuccess(
          searchResult.data.docs,
          searchResult.data.total,
          searchResult.data.pages,
          searchResult.data.pageSize,
          tabId,
          param
        )
      );
    } else {
      Ui.showError({ message: searchResult.message });
      yield put(actions.vehicleSearchSuccess());
    }
  } catch (error) {
    yield put(actions.vehicleSearchSuccess());
  }
}

function* createVehicleTypeRequest({ payload }) {
  const { data } = payload;
  try {
    const searchResult = yield call(onCreateVehicleTypeRequest, data);
    if (searchResult.status === HTTP_STATUS.OK) {
      Ui.showSuccess({
        message: "Tạo loại xe thành công."
      });
      yield put(actions.vehicleTypeShowModal(false, ""));
      let initParam = {};
      if (localStorage.getItem("AppParam")) {
        let appParam = JSON.parse(localStorage.getItem("AppParam"));
        if (appParam["Vehicle"]) {
          initParam = appParam["Vehicle"];
        }
      }
      yield put(actions.vehicleTypeSearch(initParam));
      // yield put(actions.showModal(false, ''));
    } else if (searchResult.status === 400) {
    }
  } catch (error) {
    // yield put(actions.costCustomerSearchSuccess());
  }
}

function* saveVehicleTypeRequest({ payload }) {
  const { data } = payload;
  try {
    const searchResult = yield call(onSaveVehicleTypeRequest, data);
    if (searchResult.status === HTTP_STATUS.OK) {
      Ui.showSuccess({
        message: "Sửa loại xe thành công."
      });
      yield put(actions.vehicleTypeShowModal(false, ""));
      // resetForm();
      let initParam = {};
      if (localStorage.getItem("AppParam")) {
        let appParam = JSON.parse(localStorage.getItem("AppParam"));
        if (appParam["Vehicle"]) {
          initParam = appParam["Vehicle"];
        }
      }
      yield put(actions.vehicleTypeSearch(initParam));
    } else if (searchResult.status === 400) {
    }
  } catch (error) {
    yield put(actions.driverError());
  }
}

function* deleteVehicleTypeRequest({ payload }) {
  const { data } = payload;
  try {
    const searchResult = yield call(onDeleteVehicleTypeRequest, data);
    if (searchResult.status === HTTP_STATUS.OK) {
      Ui.showSuccess({
        message: "Xóa loại xe thành công."
      });
      let initParam = {};
      if (localStorage.getItem("AppParam")) {
        let appParam = JSON.parse(localStorage.getItem("AppParam"));
        if (appParam["Vehicle"]) {
          initParam = appParam["Vehicle"];
        }
      }
      yield put(actions.vehicleTypeSearch(initParam));
      // yield put(actions.showModal(false, ''));
    } else if (searchResult.status === 400) {
    }
  } catch (error) {
    yield put(actions.driverError());
  }
}
// Vehicle Tem

function* searchVehicleTemRequest({ payload }) {
  const { tabId, param } = payload;
  try {
    const searchResult = yield call(onVehicleTem, param, 0);
    if (searchResult.status === HTTP_STATUS.OK) {
      yield put(
        actions.vehicleTemSearchSuccess(
          searchResult.data.docs,
          searchResult.data.total,
          searchResult.data.pages,
          searchResult.data.pageSize,
          tabId,
          param
        )
      );
    } else {
      Ui.showError({ message: searchResult.message });
      yield put(actions.vehicleTemSearchSuccess());
    }
  } catch (error) {
    yield put(actions.vehicleTemSearchSuccess());
  }
}

function* vehicleFillTemRequest({ payload }) {
  const { uuid } = payload;
  try {
    const searchResult = yield call(onVehicleFillTem, uuid.key);
    if (searchResult.status === HTTP_STATUS.OK) {
      yield put(actions.vehicleFillTemSuccess(searchResult.data));
    } else {
      Ui.showError({ message: searchResult.message });
      yield put(
        actions.vehicleFillTemSuccess({
          refVehicle: {
            uuid: uuid.key,
            plate: uuid.label
          }
        })
      );
    }
  } catch (error) {
    yield put(
      actions.vehicleFillTemSuccess({
        refVehicle: {
          uuid: uuid.key,
          plate: uuid.label
        }
      })
    );
  }
}

function* createVehicleTemRequest({ payload }) {
  const { data } = payload;

  try {
    const searchResult = yield call(onCreateVehicleTem, data);
    if (searchResult.status === HTTP_STATUS.OK) {
      Ui.showSuccess({
        message: "Tạo tem xe thành công."
      });
      yield put(actions.vehicleTemShowModal(false, ""));
      let initParam = {};
      if (localStorage.getItem("AppParam")) {
        let appParam = JSON.parse(localStorage.getItem("AppParam"));
        if (appParam["Vehicle"]) {
          initParam = appParam["Vehicle"];
        }
      }
      yield put(actions.vehicleTemSearch(initParam));
      // yield put(actions.showModal(false, ''));
    } else if (searchResult.status === 400) {
    }
  } catch (error) {
    // yield put(actions.costCustomerSearchSuccess());
  }
}

function* saveVehicleTemRequest({ payload }) {
  const { data } = payload;
  try {
    const searchResult = yield call(onSaveVehicleTem, data);
    if (searchResult.status === HTTP_STATUS.OK) {
      Ui.showSuccess({
        message: "Sửa tem xe thành công."
      });
      yield put(actions.vehicleTemShowModal(false, ""));
      // resetForm();
      let initParam = {};
      if (localStorage.getItem("AppParam")) {
        let appParam = JSON.parse(localStorage.getItem("AppParam"));
        if (appParam["Vehicle"]) {
          initParam = appParam["Vehicle"];
        }
      }
      yield put(actions.vehicleTemSearch(initParam));
    } else if (searchResult.status === 400) {
    }
  } catch (error) {
    // yield put(actions.driverError());
  }
}

function* deleteVehicleTemRequest({ payload }) {
  const { data } = payload;
  try {
    const searchResult = yield call(onDeleteVehicleTem, data);
    if (searchResult.status === HTTP_STATUS.OK) {
      Ui.showSuccess({
        message: "Xóa tem xe thành công."
      });
      let initParam = {};
      if (localStorage.getItem("AppParam")) {
        let appParam = JSON.parse(localStorage.getItem("AppParam"));
        if (appParam["Vehicle"]) {
          initParam = appParam["Vehicle"];
        }
      }
      yield put(actions.vehicleTemSearch(initParam));
      // yield put(actions.showModal(false, ''));
    } else if (searchResult.status === 400) {
    }
  } catch (error) {
    // yield put(actions.driverError());
  }
}
// Vehicle Class
function* vehicleClassSearchRequest({ payload }) {
  const { tabId, param } = payload;
  try {
    const searchResult = yield call(onVehicleClass, param, 0);
    if (searchResult.status === HTTP_STATUS.OK) {
      yield put(
        actions.vehicleClassSearchSuccess(
          searchResult.data.docs,
          searchResult.data.total,
          searchResult.data.pages,
          searchResult.data.pageSize,
          tabId,
          param
        )
      );
    } else {
      Ui.showError({ message: searchResult.message });
      yield put(actions.vehicleClassSearchSuccess());
    }
  } catch (error) {
    yield put(actions.vehicleClassSearchSuccess());
  }
}

function* createVehicleClassRequest({ payload }) {
  const { data } = payload;

  try {
    const searchResult = yield call(onCreateVehicleClass, data);
    if (searchResult.status === HTTP_STATUS.OK) {
      Ui.showSuccess({
        message: "Tạo hạng xe thành công."
      });
      yield put(actions.vehicleClassShowModal(false, ""));
      let initParam = {};
      if (localStorage.getItem("AppParam")) {
        let appParam = JSON.parse(localStorage.getItem("AppParam"));
        if (appParam["Vehicle"]) {
          initParam = appParam["Vehicle"];
        }
      }
      yield put(actions.vehicleClassSearch(initParam));
      // yield put(actions.showModal(false, ''));
    } else if (searchResult.status === 400) {
    }
  } catch (error) {
    // yield put(actions.costCustomerSearchSuccess());
  }
}

function* saveVehicleClassRequest({ payload }) {
  const { data } = payload;
  try {
    const searchResult = yield call(onSaveVehicleClass, data);
    if (searchResult.status === HTTP_STATUS.OK) {
      Ui.showSuccess({
        message: "Sửa hạng xe thành công."
      });
      yield put(actions.vehicleClassShowModal(false, ""));
      let initParam = {};
      if (localStorage.getItem("AppParam")) {
        let appParam = JSON.parse(localStorage.getItem("AppParam"));
        if (appParam["Vehicle"]) {
          initParam = appParam["Vehicle"];
        }
      }
      yield put(actions.vehicleClassSearch(initParam));
    } else if (searchResult.status === 400) {
    }
  } catch (error) {
    // yield put(actions.driverError());
  }
}

function* deleteVehicleClassRequest({ payload }) {
  const { data } = payload;
  try {
    const searchResult = yield call(onDeleteVehicleClass, data);
    if (searchResult.status === HTTP_STATUS.OK) {
      Ui.showSuccess({
        message: "Xóa hạng xe thành công."
      });
      let initParam = {};
      if (localStorage.getItem("AppParam")) {
        let appParam = JSON.parse(localStorage.getItem("AppParam"));
        if (appParam["Vehicle"]) {
          initParam = appParam["Vehicle"];
        }
      }
      yield put(actions.vehicleClassSearch(initParam));
      // yield put(actions.showModal(false, ''));
    } else if (searchResult.status === 400) {
    }
  } catch (error) {
    // yield put(actions.driverError());
  }
}

function* changeTab({ payload }) {
  const { tabId } = payload;
  try {
    if (tabId === "1") {
      yield put(actions.vehicleSearch("", 5, 0, false, "1"));
    } else if (tabId === "2") {
      yield put(actions.vehicleTypeSearch("", 5, 0, "2"));
    } else if (tabId === "3") {
      yield put(actions.vehicleTemSearch("", 5, 0, "3"));
    } else if (tabId === "4") {
      yield put(actions.vehicleClassSearch("", 5, 0, "4"));
    }
  } catch (error) {
    // yield put(actions.costCustomerSearchSuccess());
  }
}

export default function* rootSaga() {
  yield all([
    takeEvery(actions.VEHICLE_SEARCH, searchVehicleRequest),
    takeEvery(actions.VEHICLE_TYPE_SEARCH, searchVehicleTypeRequest),
    takeEvery(actions.VEHICLE_CHANGE_TAB, changeTab),
    takeEvery(actions.ACTION_VEHICLE_CREATE, createVehicleRequest),
    takeEvery(actions.ACTION_VEHICLE_SAVE, saveVehicleRequest),
    takeEvery(actions.ACTION_VEHICLE_DELETE, deleteDeleteRequest),
    takeEvery(actions.VIHECLE_TYPE_CREATE, createVehicleTypeRequest),
    takeEvery(actions.VIHECLE_TYPE_SAVE, saveVehicleTypeRequest),
    takeEvery(actions.VEHICLE_TYPE_DELETE, deleteVehicleTypeRequest),
    takeEvery(actions.VEHICLE_TEM_SEARCH, searchVehicleTemRequest),
    takeEvery(actions.VIHECLE_TEM_CREATE, createVehicleTemRequest),
    takeEvery(actions.VIHECLE_TEM_SAVE, saveVehicleTemRequest),
    takeEvery(actions.VEHICLE_TEM_DELETE, deleteVehicleTemRequest),
    takeEvery(actions.VEHICLE_FILL_TEM, vehicleFillTemRequest),
    takeEvery(actions.VEHICLE_CLASS_SEARCH, vehicleClassSearchRequest),
    takeEvery(actions.VIHECLE_CLASS_CREATE, createVehicleClassRequest),
    takeEvery(actions.VIHECLE_CLASS_SAVE, saveVehicleClassRequest),
    takeEvery(actions.VEHICLE_CLASS_DELETE, deleteVehicleClassRequest)
  ]);
}
