import { Map } from "immutable";
import { actions } from "./actions";
import moment from "moment";
import _ from "lodash";
const initState = new Map({
    pageSize: 5,
    pageSizeType: 5,
    pages: 0,
    pagesType: 0,
    tabId: "1",
    orderBy: {
        name: 1
    },
    searchInput: "",
    // "query": {
    //     "uuids": []
    // }
    listVehicle: [],
    listVehicleType: [],
    listVehicleFillTem: {},
    listVehicleTem: [],
    listVehicleClass: [],
    isShowVehicle: false,
    isShowVehicleType: false,
    isShowVehicleTem: false,
    isShowVehicleClass: false,
    actionName: "",
    rowData: {},
    totalLength: 0,
    length: 0,
    loading: false,
    error: false,
    dataCheckName: "",
    query: {
        code: "",
        vehicleType: "",
        seats: "",
        chassisNo: "",
        manufactureYear: "",
        plate: "",
        engineNo: ""
    },
    queryType: { type: "", seats: "", name: "" },
    queryTem: { vehicleId: "", startReg: "", endReg: "", startEx: "", endEx: "" },
    queryClass: { name: "" }
});

export default function reducer(state = initState, action) {
    switch (action.type) {
        case actions.VEHICLE_SHOW_MODAL:
            return state
                .set("isShowVehicle", action.payload.isShow)
                .set("actionName", action.payload.actionName)
                .set("rowData", action.payload.rowData ? action.payload.rowData : {});
        case actions.VEHICLE_SEARCH:
            return state
                .set("loading", true)
                .set("searchInput", action.payload.searchInput)
                .set("query", action.payload.query);
      
        case actions.VEHICLE_SUCCESS_RESULT:
            if (window.location.pathname === "/vehicleManagement") {
                let appParam = {};
                appParam["Vehicle"] = action.param;
                localStorage.setItem("AppParam", JSON.stringify(appParam));
            }
            let listVehicle = [];
            action.docs.forEach((value, index) => {
                let temp = {
                    key: index,
                    col_1: {
                        vehicleName: "-"
                    },
                    col_2: {
                        vehicleTypeCode: "-",
                        vehicleTypeBKS: "-"
                    },
                    col_3: {
                        vahicleType: "-"
                    },

                    col_5: {
                        vehiclechassisNo: "-",
                        vehicleengineNo: "-"
                    },
                    col_6: {
                        vehicleYear: "-"
                            // vehicle: "-"
                    },
                    col_7: {
                        parent: "-",
                    },
                    // col_8: {
                    //   manufactureYear: "-"
                    // },
                    col_9: {
                        plate: "-"
                    },
                    // col_10: {
                    //   driverName: "-",
                    //   phoneNumber: "-"
                    // },
                    // col_11: {
                    //   checkingDate: "-"
                    // },
                    col_12: {
                        action: [{
                                name: "view",
                                icon: "fa-eye",
                                title: "Xem chi tiết",
                                handle: "handleEditVehicle"
                            },
                            {
                                name: "delete",
                                title: "Xóa",
                                icon: "fa-trash",
                                handle: "handleDeleteVehicle"
                            }
                        ]
                    },
                    point: []
                };
                temp.key = value.uuid;
                temp.col_1 = {
                    vehicleName: value.refOrganization ? value.refOrganization.name : "-"
                };
                temp.col_2 = {
                    vehicleTypeCode: value.code || "-",
                    vehicleTypeBKS: value.plate || "-"
                };
                temp.col_3 = {
                    vahicleType: value.refVehicleType.name || "-"
                };

                temp.col_5 = {
                    vehiclechassisNo: value.chassisNo || "-",
                    vehicleengineNo: value.engineNo || "-"
                };
                temp.col_6 = {
                    vehicleYear: value.manufactureYear || "-"
                };
                temp.col_7 = {
                    parent: value.refParent ? value.refParent.name : "-",
                };
                // temp.col_8 = {
                //   manufactureYear: value.manufactureYear || "-"
                // };
                temp.col_9 = {
                    plate: value.refDriver[0] ? value.refDriver[0].fullName : "-"
                };
                // temp.col_10 = {
                //   driverName: value.driverName || "-",
                //   phoneNumber: value.phoneNumber || "-"
                // };
                // temp.col_11 = {
                //   checkingDate: value.checkingDate || "-"
                // };


                listVehicle.push(temp);
            });
            return state
                .set("listVehicle", listVehicle || [])
                .set("listVehicleSuccess", action.docs || [])
                .set("total", action.total)
                .set("pages", action.pages)
                .set("pageSize", action.pageSize)
                .set("tabId", action.tabId)
                .set("query", action.param.query)
                .set("loading", false)
                .set("error", false);
        case actions.VEHICLE_TYPE_SHOW_MODAL:
            return state
                .set("isShowVehicleType", action.payload.isShow)
                .set("actionName", action.payload.actionName)
                .set("rowData", action.payload.rowData ? action.payload.rowData : {});
        case actions.VEHICLE_ERROR_RESULT:
            return state
                .set("listVehicle", [])
                .set("loading", false)
                .set("error", false);
        case actions.VEHICLE_TYPE_SEARCH:
            return state
                .set("loading", true)
                .set("queryType", action.payload.queryType);
        case actions.VEHICLE_TYPE_SUCCESS_RESULT:
            if (window.location.pathname === "/vehicleManagement") {
                let appParam = {};
                appParam["VehicleType"] = action.param;
                localStorage.setItem("AppParam", JSON.stringify(appParam));
            }
            let listVehicleType = [];
            action.docs.forEach((value, index) => {
                let temp = {
                    key: null,

                    col_2: {
                        name: "-"
                    },
                    col_3: {
                        seats: "-"
                    },
                    col_4: {
                        numberSeatEu: "-"
                    },
                    col_5: {
                        color: "-"
                    },
                    col_6: {
                        speed: "-"
                    },

                    col_7: {
                        type: "-"
                    },
                    col_8: {
                        parent: "-"
                    },

                    col_9: {
                        action: [{
                                name: "view",
                                icon: "fa-eye",
                                title: "Xem chi tiết",
                                handle: "handleEditVehicleType"
                            },
                            {
                                name: "delete",
                                title: "Xóa",
                                icon: "fa-trash",
                                handle: "handleDeleteVehicleType"
                            }
                        ]
                    },
                    point: []
                };
                temp.key = value.uuid;

                temp.col_2 = {
                    name: value.name || "-"
                };
                temp.col_3 = {
                    seats: value.seats || "-"
                };
                temp.col_4 = {
                    numberSeatEu: value.numberSeatEu || "-"
                };
                temp.col_5 = {
                    color: value.color || "-"
                };
                temp.col_6 = {
                    speed: value.avgSpeed || "-"
                };
                temp.col_7 = {
                    type: value.type || "-"
                };
                temp.col_8 = {
                    parent: value.refParent ? value.refParent.name : "-",

                };
                listVehicleType.push(temp);
            });
            
            return state
                .set("listVehicleTypeSuccess", action.docs || [])
                .set("listVehicleType", listVehicleType || [])
                .set("totalType", action.total)
                .set("pagesType", action.pages)
                .set("pageSizeType", action.pageSize)
                .set("queryType", action.param.queryType)
                .set("tabId", action.tabId)
                .set("loading", false)
                .set("error", false);

            // Vehicle Tem
        case actions.VEHICLE_TEM_SHOW_MODAL:
            return state
                .set("isShowVehicleTem", action.payload.isShow)
                .set("actionName", action.payload.actionName)
                .set("rowData", action.payload.rowData ? action.payload.rowData : {})
                .set("listVehicleFillTem", {});
        case actions.VEHICLE_FILL_TEM_SUCCESS:
            return state.set(
                "listVehicleFillTem",
                action.payload.listVehicleFillTem || {}
            );
        case actions.VEHICLE_TEM_SEARCH:
            return state
                .set("loading", true)
                .set("queryTem", action.payload.queryTem);
        case actions.VEHICLE_TEM_SUCCESS_RESULT:
            if (window.location.pathname === "/vehicleManagement") {
                let appParam = {};
                appParam["VehicleType"] = action.param;
                localStorage.setItem("AppParam", JSON.stringify(appParam));
            }
            let listVehicleTem = [];
            action.docs.forEach((value, index) => {
                let temp = {
                    key: null,
                    id: null,

                    col_1: {
                        plate: "-"
                    },
                    col_2: {
                        typeText: "-"
                    },
                    col_3: {
                        startDate: "-"
                    },
                    col_4: {
                        endDate: "-"
                    },
                    col_5: {
                        parent: "-"
                    },

                    col_6: {
                        action: [{
                                name: "view",
                                icon: "fa-eye",
                                title: "Xem chi tiết",
                                handle: "handleEditVehicleTem"
                            },
                            {
                                name: "delete",
                                title: "Xóa",
                                icon: "fa-trash",
                                handle: "handleDeleteVehicleTem"
                            }
                        ]
                    },
                    point: []
                };
                temp.key = value.vehicleId;
                temp.id = value.id;

                temp.col_1 = {
                    plate: value.refVehicle ? value.refVehicle.plate : ""
                };
                temp.col_2 = {
                    typeText: value.typeText ? value.typeText : ""
                };
                temp.col_3 = {
                    startDate: value.startDate ?
                        moment.utc(value.startDate).format("DD-MM-YYYY") : ""
                };
                temp.col_4 = {
                    endDate: value.endDate ?
                        moment.utc(value.endDate).format("DD-MM-YYYY") : ""
                };
                temp.col_5 = {
                    parent: value.refParent ? value.refParent.name : "-",

                };

                listVehicleTem.push(temp);
            });
            return state
                .set("listVehicleTemSuccess", action.docs || [])
                .set("listVehicleTem", listVehicleTem || [])
                .set("totalTem", action.total)
                .set("pagesTem", action.pages)
                .set("pageSizeTem", action.pageSize)
                .set("queryTem", action.param.queryTem)
                .set("tabId", action.tabId)
                .set("loading", false)
                .set("error", false);

            //Vehicle Class

        case actions.VEHICLE_CLASS_SHOW_MODAL:
            return state
                .set("isShowVehicleClass", action.payload.isShow)
                .set("actionName", action.payload.actionName)
                .set("rowData", action.payload.rowData ? action.payload.rowData : {});
        case actions.VEHICLE_CLASS_SEARCH:
            return state
                .set("loading", true)
                .set("queryClass", action.payload.queryClass);
        case actions.VEHICLE_CLASS_SUCCESS_RESULT:
            if (window.location.pathname === "/vehicleManagement") {
                let appParam = {};
                appParam["VehicleType"] = action.param;
                localStorage.setItem("AppParam", JSON.stringify(appParam));
            }
            let listVehicleClass = [];

            action.docs.forEach((value, index) => {
                let temp = {
                    key: null,
                    id: null,

                    col_1: {
                        name: "-"
                    },
                    col_2: {
                        description: "-"
                    },
                    col_3: {
                        parent: "-"
                    },

                    col_4: {
                        action: [{
                                name: "view",
                                icon: "fa-eye",
                                title: "Xem chi tiết",
                                handle: "handleEditVehicleClass"
                            },
                            {
                                name: "delete",
                                title: "Xóa",
                                icon: "fa-trash",
                                handle: "handleDeleteVehicleClass"
                            }
                        ]
                    },
                    point: []
                };
                temp.key = value.id;
                temp.id = value.id;

                temp.col_1 = {
                    name: value.name ? value.name : ""
                };
                temp.col_2 = {
                    description: value.description ? value.description : ""
                };
                temp.col_3 = {
                    parent: value.refParent ? value.refParent.name : "-",
                };

                listVehicleClass.push(temp);
            });

            return state
                .set("listVehicleClassSuccess", action.docs || [])
                .set("listVehicleClass", listVehicleClass || [])
                .set("totalClass", action.total)
                .set("pagesClass", action.pages)
                .set("pageSizeClass", action.pageSize)
                .set("queryClass", action.param.queryClass)
                .set("tabId", action.tabId)
                .set("loading", false)
                .set("error", false);
        case actions.VEHICLE_TYPE_ERROR_RESULT:
            return state
                .set("listVehicleType", [])
                .set("loading", false)
                .set("error", false);
        default:
            return state;
    }
}