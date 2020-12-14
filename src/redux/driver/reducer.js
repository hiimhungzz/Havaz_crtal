import { Map } from "immutable";
import { actions } from "./actions";
import moment from "moment";
import { STATUS } from "@Constants/common";
import { checkStatus } from "@Helpers/utility";
const initState = new Map({
  pageSize: 5,
  externalPageLimit: 5,
  pages: 0,
  orderBy: {
    name: 1
  },
  searchInput: "",
  // "query": {
  //     "uuids": []
  // }
  tabId: "1",
  listDriver: [],
  listDriverSuccess: [],
  query: {
    code: "",
    fullName: "",
    birthday: "",
    CMND: "",
    driversLicenseClass: "",
    licenseExpireAt: "",
    doanhnghiep: "",
    driversLicenseCode: "",
    status: "",
    rating: "",
    type: ""
  },
  queryType: {
    code: "",
    fullName: "",
    birthday: "",
    CMND: "",
    driversLicenseClass: "",
    licenseExpireAt: "",
    organizationId: "",
    driversLicenseCode: "",
    status: "",
    rating: "",
    organId: "",
    typePartner: ""
  },
  organization: [],
  isShow: false,
  actionName: "",
  rowData: {},
  rowDataType: {},
  totalLength: 0,
  loading: false,
  error: false
});

export default function reducer(state = initState, action) {
  switch (action.type) {
    case actions.DRIVER_SHOW_MODAL:
      return state
        .set("isShow", action.payload.isShow)
        .set("actionName", action.payload.actionName)
        .set("rowData", action.payload.rowData ? action.payload.rowData : {});
    case actions.DRIVER_SEARCH:
      return state
        .set("loading", true)
        .set("query", action.payload.query)
        .set("tabId", action.payload.tabId);
    case actions.DRIVER_SUCCESS_RESULT:
      if (window.location.pathname === "/driverManagement") {
        let appParam = {};
        appParam["Driver"] = action.param;
        localStorage.setItem("AppParam", JSON.stringify(appParam));
      }
      let listDriver = [];
      action.docs.forEach((value, index) => {
        let temp = {
          key: null,
          col_1: {
            code: "-",
            createdDate: "-"
          },
          col_2: {
            refCode: "-",
          },

          col_3: {
            driverName: "-",
            phoneNumber: "-",
            email: "-"
          },
          col_4: {
            subDriver: "-"
          },
          col_5: {
            organizatio: "-"
          },
          col_6: {
            driverBrithday: "-"
          },
          col_7: {
            driverCmnd: "-"
          },
          col_8: {
            driverlb: "-",
            driversb: "-",
            driverth: "-"
          },
          col_9: {
            subFullName: "-"
          },
         
          col_10: {
            rating: 0
          },
          col_11: {
            status: "-"
          },
          col_12: {
            action: [
              {
                name: "edit",
                title: "Xem chi tiết",
                icon: "fa-eye",
                handle: "handleEditDriver"
              },
              {
                name: "delete",
                title: "Xóa",
                icon: "fa-trash",
                handle: "handleDeleteDriver"
              }
            ]
          },
          point: []
        };
        temp.key = value.uuid;
        temp.col_1 = {
          code: value.code || "-",
          createdDate: value.createdAt
            ? moment(value.createdAt, "YYYY-MM-DD").format("DD-MM-YYYY")
            : "-"
        };
        temp.col_2 = {
          refCode: value.refCode || "-",
        };
        temp.col_3 = {
          driverName: value.fullName || "-",
          phoneNumber: value.phone || "-",
          email: value.email || "-"
        };
        temp.col_4 = {
          subDriver: value.type === "SUBDRIVER" ? "Phụ xe" : "Lái xe"
        };
        temp.col_5 = {
          organizatio:
            value.organName
              ? value.organName
              : "-"
        };
        temp.col_6 = {
          driverBrithday: value.birthday
            ? moment(value.birthday, "YYYY-MM-DD").format("DD-MM-YYYY")
            : "-"
        };
        temp.col_7 = {
          driverCmnd: value.CMND || "-"
        };
        temp.col_8 = {
          driverlb: value.driversLicenseClass || "-",
          driversb: value.driversLicenseCode || "-",
          driverth: value.lastUpdatedAt
            ? moment(value.lastUpdatedAt, "YYYY-MM-DD").format("DD-MM-YYYY")
            : "-"
        };
        temp.col_9 = {
          subFullName: value.subFullName ? value.subFullName : "-"
        };
      
        temp.col_10 = {
          rating: value.rating || 0
        };
        temp.col_11 = {
          status: checkStatus(value.status.toString()),
          color: STATUS.find(x => x.value == value.status)
            ? STATUS.find(x => x.value == value.status).color
            : "red",
          icon: STATUS.find(x => x.value == value.status)
            ? STATUS.find(x => x.value == value.status).icon
            : "question-circle"
        };
        listDriver.push(temp);
      });
      return state
        .set("listDriverSuccess", action.docs || [])
        .set("listDriver", listDriver || [])
        .set("total", action.total)
        .set("pageSize", action.pageSize)
        .set("selectStatus", action.status)
        .set("pages", action.pages)
        .set("param", action.param)
        .set("query", action.param.query)
        .set("tabId", action.tabId)
        .set("loading", false)
        .set("error", false);
    case actions.DRIVER_PARNER_SHOW_MODAL:
      return state
        .set("isShowType", action.payload.isShowType)
        .set("actionName", action.payload.actionName)
        .set(
          "rowDataType",
          action.payload.rowDataType ? action.payload.rowDataType : {}
        );
    case actions.DIVER_PARNER_SEARCH:
      return state
        .set("loading", true)
        .set("queryType", action.payload.queryType);
    case actions.DRIVER_PARNER_SUCCESS:
      if (window.location.pathname === "/driverManagement") {
        let appParam = {};
        appParam["Driver"] = action.param;
        localStorage.setItem("AppParam", JSON.stringify(appParam));
      }
      let listDriverParner = [];
      action.docs.forEach((value, index) => {
        let temp = {
          key: null,
          col_1: {
            code: "-",
            createdDate: "-"
          },
          col_2: {
            driverName: "-",
            phoneNumber: "-",
            email: "-"
          },
          col_3: {
            subDriver: "-"
          },
          col_4: {
            organizatio: "-"
          },
          col_5: {
            driverBrithday: "-"
          },
          col_6: {
            driverCmnd: "-"
          },
          col_7: {
            driverlb: "-",
            driversb: "-",
            driverth: "-"
          },
          col_8: {
            categoryName: "-"
          },
          
          col_9: {
            subFullName: "-"
          },
          col_10: {
            rating: 0
          },
          col_11: {
            status: "-"
          },
          col_12: {
            action: [
              {
                name: "edit",
                title: "Xem chi tiết",
                icon: "fa-eye",
                handle: "handleEditDriverParner"
              },
              {
                name: "delete",
                title: "Xóa",
                icon: "fa-trash",
                handle: "handleDeleteParnerDriver"
              }
            ]
          },
          point: []
        };
        temp.key = value.uuid;
        temp.col_1 = {
          code: value.code || "-",
          createdDate: value.createdAt
            ? moment(value.createdAt, "YYYY-MM-DD").format("DD-MM-YYYY")
            : "-"
        };
        temp.col_2 = {
          driverName: value.fullName || "-",
          phoneNumber: value.phone || "-",
          email: value.email || "-"
        };
        temp.col_3 = {
          subDriver: value.type === "SUBDRIVER" ? "Phụ xe" : "Lái xe"
        };
        temp.col_4 = {
          organizatio:
            value.organName 
              ? value.organName
              : "-"
        };
        temp.col_5 = {
          driverBrithday: value.birthday
            ? moment(value.birthday, "YYYY-MM-DD").format("DD-MM-YYYY")
            : "-"
        };
        temp.col_6 = {
          driverCmnd: value.CMND || "-"
        };
        temp.col_7 = {
          driverlb: value.driversLicenseClass || "-",
          driversb: value.driversLicenseCode || "-",
          driverth: value.licenseExpireAt
            ? moment(value.licenseExpireAt, "YYYY-MM-DD").format("DD-MM-YYYY")
            : "-"
        };
        temp.col_8 = {
          categoryName: value.categoryName ? value.categoryName : "-"
        };
       
        temp.col_9 = {
          subFullName: value.subFullName || "-"
        };
        temp.col_10 = {
          rating: value.rating || 0
        };
        temp.col_11 = {
          status: checkStatus(value.status.toString()),
          color: STATUS.find(x => x.value == value.status)
            ? STATUS.find(x => x.value == value.status).color
            : "red",
          icon: STATUS.find(x => x.value == value.status)
            ? STATUS.find(x => x.value == value.status).icon
            : "question-circle"
        };
        listDriverParner.push(temp);
      });
      return state
        .set("listDriverParnerSuccess", action.docs || [])
        .set("listDriverParner", listDriverParner || [])
        .set("total", action.total)
        .set("pageSize", action.pageSize)
        .set("selectStatus", action.status)
        .set("pages", action.pages)
        .set("param", action.param)
        .set("queryType", action.param.queryType)
        .set("loading", false)
        .set("tabId", action.tabId)
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
    case actions.DRIVER_ERROR_RESULT:
      return state
        .set("listDriver", [])
        .set("loading", false)
        .set("error", false);
    default:
      return state;
  }
}
