import { Map } from "immutable";
import { actions } from "./actions";
import moment from "moment";

const initState = new Map({
    pageSize: 5,
    externalPageLimit: 5,
    pages: 0,
    orderBy: {
        name: 1
    },
    searchInput: "",
    tabId: "1",
    listWarningDriver: [],
    listWarningDriverSuccess: [],
    listWarningVehicle: [],
    listWarningVehicleSuccess: [],
    listWarningTem: [],
    listWarningTemSuccess: [],
    query: {
        driverId: ""
    },
    queryVehicle: {
        vehicleId: ""
    },
    queryTem: {
        vehicleId: ""
    },
    organization: [],
    isShow: false,
    actionName: "",
    rowData: {},
    totalLength: 0,
    loading: false,
    error: false
});

export default function reducer(state = initState, action) {
    switch (action.type) {
        case actions.WARNING_DIRVER_SEARCH:
            return state.set("loading", true).set("query", action.payload.query);

        case actions.WARNING_DIRVER_SUCCESS_RESULT:
            // if (window.location.pathname === '/taskScheduleManagement') {
            //     let appParam = {};
            //     appParam['taskSchedule'] = action.param;
            //     localStorage.setItem('AppParam', JSON.stringify(appParam));
            // }
            let listWarningDriver = [];
            action.docs.forEach((value, index) => {
                let temp = {
                    key: index,

                    col_1: {
                        code: "-",
                        fullName: "-"
                    },
                    col_2: {
                        phone: "-"
                    },

                    col_3: {
                        licenseExpireAt: "-"
                    },
                    col_4: {
                        driverContractAt: "-"
                    },
                    col_5: {
                        fireCardAt: "-"
                    },
                    col_6: {
                        trainingAt: "-"
                    },

                    point: []
                };
                temp.key = value.id;

                temp.col_1 = {
                    code: value.code ? value.code : "-",
                    fullName: value.fullName ? value.fullName : "-"
                };
                temp.col_2 = {
                    phone: value.phone || "-"
                };

                temp.col_3 = {
                    licenseExpireAt: value.licenseExpireAt ?
                        moment(value.licenseExpireAt).format("DD-MM-YYYY") : "-",
                    licenseExpireStatus: {
                        value: value.licenseExpireStatus || ""
                    }
                };
                temp.col_4 = {
                    driverContractAt: value.driverContractAt ?
                        moment(value.driverContractAt).format("DD-MM-YYYY") : "-",
                    driverContractStatus: {
                        value: value.driverContractStatus || ""
                    }
                };
                temp.col_5 = {
                    fireCardAt: value.fireCardAt ?
                        moment(value.fireCardAt).format("DD-MM-YYYY") : "-",
                    fireCardStatus: {
                        value: value.fireCardStatus || ""
                    }
                };
                temp.col_6 = {
                    trainingAt: value.trainingAt ?
                        moment(value.trainingAt).format("DD-MM-YYYY") : "-",
                    trainingStatus: {
                        value: value.trainingStatus || ""
                    }
                };

                listWarningDriver.push(temp);
            });
            return state
                .set("listWarningDriver", listWarningDriver || [])
                .set("listWarningDriverSuccess", action.docs)
                .set("total", action.total || "")
                .set("pageSize", action.pageSize || "")
                .set("pages", action.pages || "")
                .set("param", action.param || "")
                .set("query", action.query || "")
                .set("tabId", action.tabId || "")
                .set("loading", false)
                .set("error", false);

            //warning vehicle

        case actions.WARNING_VEHICLE_SEARCH:
            return state
                .set("loading", true)
                .set("queryVehicle", action.payload.queryVehicle);
        case actions.WARNING_VEHICLE_SUCCESS_RESULT:
            // if (window.location.pathname === '/taskScheduleManagement') {
            //     let appParam = {};
            //     appParam['taskSchedule'] = action.param;
            //     localStorage.setItem('AppParam', JSON.stringify(appParam));
            // }
            let listWarningVehicle = [];
            action.docs.forEach((value, index) => {
                let temp = {
                    key: index,
                    col_1: {
                        plate: "-"
                    },
                    col_2: {
                        bank: "-"
                    },
                    col_3: {
                        circulatedAt: "-"
                    },
                    col_4: {
                        civilInsuranceaAt: "-",
                        civilInsuranceSupplier: "-"
                    },
                    col_5: {
                        hullInsuranceAt: "-",
                        hullInsuranceSupllier: "-"
                    },
                    col_6: {
                        roadFeeAt: "-"
                    },
                    col_7: {
                        registeredAt: "-"
                    },

                    point: []
                };
                temp.key = value.uuid;
                temp.col_1 = {
                    plate: value.plate ? value.plate : "-"
                };
                temp.col_2 = {
                    bank: value.bank || "-"
                };

                temp.col_3 = {
                    circulatedAt: value.circulatedAt ?
                        moment(value.circulatedAt).format("DD-MM-YYYY") : "-",
                    circulatedStatus: {
                        value: value.circulatedStatus || ""
                    }
                };
                temp.col_4 = {
                    civilInsuranceaAt: value.civilInsuranceaAt ?
                        moment(value.civilInsuranceaAt).format("DD-MM-YYYY") : "-",
                    civilInsuranceSupplier: value.civilInsuranceSupplier || "",
                    civilInsuranceaStatus: {
                        value: value.civilInsuranceaStatus || ""
                    }
                };
                temp.col_5 = {
                    hullInsuranceAt: value.hullInsuranceAt ?
                        moment(value.hullInsuranceAt).format("DD-MM-YYYY") : "-",

                    hullInsuranceSupllier: value.hullInsuranceSupllier || "",
                    hullInsuranceStatus: {
                        value: value.hullInsuranceStatus || ""
                    }
                };
                temp.col_6 = {
                    roadFeeAt: value.roadFeeAt ?
                        moment(value.roadFeeAt).format("DD-MM-YYYY") : "-",
                    roadFeeStatus: {
                        value: value.roadFeeStatus || ""
                    }
                };
                temp.col_7 = {
                    registeredAt: value.registeredAt ?
                        moment(value.registeredAt).format("DD-MM-YYYY") : "-",
                    registeredStatus: {
                        value: value.registeredStatus || ""
                    }
                };

                listWarningVehicle.push(temp);
            });
            return state
                .set("listWarningVehicle", listWarningVehicle || [])
                .set("listWarningVehicleSuccess", action.docs)
                .set("totalVehicle", action.total || "")
                .set("pageSizeVehicle", action.pageSize || "")
                .set("selectStatusVehicle", action.status || "")
                .set("pagesVehicle", action.pages || "")
                .set("param", action.param || "")
                .set("queryVehicle", action.queryVehicle || "")
                .set("tabId", action.tabId || "")
                .set("loading", false)
                .set("error", false);

            //Warning Tem
        case actions.WARNING_TEM_SEARCH:
            return state
                .set("loading", true)
                .set("queryTem", action.payload.queryTem);
        case actions.WARNING_TEM_SUCCESS_RESULT:
            // if (window.location.pathname === '/taskScheduleManagement') {
            //     let appParam = {};
            //     appParam['taskSchedule'] = action.param;
            //     localStorage.setItem('AppParam', JSON.stringify(appParam));
            // }
            let listWarningTem = [];
            action.docs.forEach((value, index) => {
                let temp = {
                    key: index,
                    col_1: {
                        plate: "-"
                    },
                    col_2: {
                        name: "-"
                    },
                    col_3: {
                        startDate: "-"
                    },
                    col_4: {
                        endDate: "-",
                    },


                    point: []
                };
                temp.key = value.uuid;
                temp.col_1 = {
                    plate: value.refVehicle ? value.refVehicle.plate : "-"
                };
                temp.col_2 = {
                    name: value.refType ? value.refType.name : "-"
                };

                temp.col_3 = {
                    startDate: value.startDate ?
                        moment(value.startDate).format("DD-MM-YYYY") : "-",
                    statusEndDate: {
                        value: value.statusEndDate || "",
                    }

                };
                temp.col_4 = {
                    endDate: value.endDate ?
                        moment(value.endDate).format("DD-MM-YYYY") : "-",
                    statusEndDate: {
                        value: value.statusEndDate || "",
                    }
                };
                listWarningTem.push(temp);
            });
            return state
                .set("listWarningTem", listWarningTem || [])
                .set("listWarningTemSuccess", action.docs)
                .set("totalTem", action.total || "")
                .set("pageSizeTem", action.pageSize || "")
                .set("selectStatusTem", action.status || "")
                .set("pagesTem", action.pages || "")
                .set("param", action.param || "")
                .set("queryTem", action.queryTem || "")
                .set("tabId", action.tabId || "")
                .set("loading", false)
                .set("error", false);
        case actions.ACTION_ORGANIZATION_DRIVER:
            return state
                .set("organization", action.docs || [])
                .set("total", action.total)
                .set("pages", action.pages)
                .set("param", action.param)
                .set("loading", false)
                .set("error", false);
        case actions.ACTION_ERROR:
            return state
                .set("loading", false)
                .set("listDriver", [])
                .set("errMessage", action.payload.errMessage)
                .set("error", true);
        case actions.WARNING_ERROR_RESULT:
            return state
                .set("listWarningVehicle", [])
                .set("loading", false)
                .set("error", false);
        default:
            return state;
    }
}