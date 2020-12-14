import { Map } from "immutable";
import { actions } from "./actions";
import { STATUS } from "@Constants/common";
const initState = new Map({
  pageSize: 5,
  externalPageLimit: 5,
  pages: 0,
  orderBy: {
    name: 1
  },
  searchInput: "",
  tabId: "1",
  listCategoryUser: [],
  listCategoryUserSuccess: [],
  listCategoryCtv: [],
  listCategoryCtvSuccess: [],
  listCategoryPartner: [],
  listCategoryPartnerSuccess: [],
  listCategoryVehicle: [],
  listCategoryVehicleSuccess: [],

  query: {
    name: ""
  },
  queryCtv: {
    name: ""
  },
  queryPartner: {
    name: ""
  },
  queryVehicle: {
    name: ""
  },

  organization: [],
  isShow: false,
  isShowCtv: false,
  isShowPartner: false,
  isShowVehicle: false,
  actionName: "",
  rowData: {},
  totalLength: 0,
  loading: false,
  error: false
});

export default function reducer(state = initState, action) {
  switch (action.type) {
    case actions.SHOW_MODAL:
      return state
        .set("isShow", action.payload.isShow)
        .set("actionName", action.payload.actionName)
        .set("rowData", action.payload.rowData ? action.payload.rowData : {});
    case actions.CATEGORY_USER_SEARCH:
      return state.set("loading", true).set("query", action.payload.query);

    case actions.CATEGORY_USER_SUCCESS_RESULT:
      // if (window.location.pathname === '/taskScheduleManagement') {
      //     let appParam = {};
      //     appParam['taskSchedule'] = action.param;
      //     localStorage.setItem('AppParam', JSON.stringify(appParam));
      // }
      let listCategoryUser = [];
      action.docs.forEach((value, index) => {
        let temp = {
          key: index,

          col_1: {
            name: "-"
          },
          col_2: {
            description: "-"
          },
          col_3: {
            refParent: "-"
          },

          col_4: {
            status: "-"
          },
          col_5: {
            action: [
              {
                name: "edit",
                title: "Xem chi tiết",
                icon: "fa-eye",
                handle: "handleEditCategoryUser"
              },
              {
                name: "delete",
                title: "Xóa",
                icon: "fa-trash",
                handle: "handleDeleteCategoryUser"
              }
            ]
          },

          point: []
        };
        temp.key = value.id;

        temp.col_1 = {
          name: value.name ? value.name : "-"
        };
        temp.col_2 = {
          description: value.description || "-"
        };
        temp.col_3 = {
          refParent: value.refParent ? value.refParent.name : "-"
        };
        temp.col_4 = {
          status: value.status || "-",
          color: STATUS.find(x => x.value == value.status)
            ? STATUS.find(x => x.value == value.status).color
            : "red",
          icon: STATUS.find(x => x.value == value.status)
            ? STATUS.find(x => x.value == value.status).icon
            : "fa-question-circle"
        };
        listCategoryUser.push(temp);
      });
      return state
        .set("listCategoryUser", listCategoryUser || [])
        .set("listCategoryUserSuccess", action.docs || [])
        .set("total", action.total || "")
        .set("pageSize", action.pageSize || "")
        .set("pages", action.pages || "")
        .set("param", action.param || "")
        .set("query", action.query || "")
        .set("tabId", action.tabId || "1")
        .set("loading", false)
        .set("error", false);

    //category Ctv
    case actions.SHOW_MODAL_CTV:
      return state
        .set("isShowCtv", action.payload.isShowCtv)
        .set("actionName", action.payload.actionName)
        .set("rowData", action.payload.rowData ? action.payload.rowData : {});
    case actions.CATEGORY_CTV_SEARCH:
      return state
        .set("loading", true)
        .set("queryCtv", action.payload.queryCtv);
    case actions.CATEGORY_CTV_SUCCESS_RESULT:
      // if (window.location.pathname === '/taskScheduleManagement') {
      //     let appParam = {};
      //     appParam['taskSchedule'] = action.param;
      //     localStorage.setItem('AppParam', JSON.stringify(appParam));
      // }
      let listCategoryCtv = [];
      action.docs.forEach((value, index) => {
        let temp = {
          key: index,
          col_1: {
            name: "-"
          },
          col_2: {
            description: "-"
          },

          col_3: {
            sort: "-"
          },
          col_4: {
            status: "-"
          },
          col_6: {
            parentName: "-"
          },
          col_5: {
            action: [
              {
                name: "edit",
                title: "Xem chi tiết",
                icon: "fa-eye",
                handle: "handleEditCategoryCtv"
              },
              {
                name: "delete",
                title: "Xóa",
                icon: "fa-trash",
                handle: "handleDeleteCategoryCtv"
              }
            ]
          },

          point: []
        };
        temp.key = value.id;

        temp.col_1 = {
          name: value.name ? value.name : "-"
        };
        temp.col_2 = {
          description: value.description || "-"
        };
        temp.col_3 = {
          sort: value.sort || "-"
        };
        temp.col_6 = {
          parentName: value.refParent.name || "-"
        };
        temp.col_4 = {
          status: value.status || "-",
          color: STATUS.find(x => x.value == value.status)
            ? STATUS.find(x => x.value == value.status).color
            : "red",
          icon: STATUS.find(x => x.value == value.status)
            ? STATUS.find(x => x.value == value.status).icon
            : "fa-question-circle"
        };

        listCategoryCtv.push(temp);
      });
      return state
        .set("listCategoryCtv", listCategoryCtv || [])
        .set("listCategoryCtvSuccess", action.docs || [])
        .set("totalCtv", action.totalCtv || "")
        .set("pageSizeCtv", action.pageSizeCtv || "")
        .set("pagesCtv", action.pagesCtv || "")
        .set("param", action.param || "")
        .set("queryCtv", action.queryCtv || "")
        .set("tabId", action.tabId || "2")
        .set("loading", false)
        .set("error", false);

    //category Partner
    case actions.SHOW_MODAL_PARTNER:
      return state
        .set("isShowPartner", action.payload.isShowPartner)
        .set("actionName", action.payload.actionName)
        .set("rowData", action.payload.rowData ? action.payload.rowData : {});
    case actions.CATEGORY_PARTNER_SEARCH:
      return state
        .set("loading", true)
        .set("queryPartner", action.payload.queryPartner);
    case actions.CATEGORY_PARTNER_SUCCESS_RESULT:
      // if (window.location.pathname === '/taskScheduleManagement') {
      //     let appParam = {};
      //     appParam['taskSchedule'] = action.param;
      //     localStorage.setItem('AppParam', JSON.stringify(appParam));
      // }
      let listCategoryPartner = [];
      action.docs.forEach((value, index) => {
        let temp = {
          key: index,
          col_1: {
            name: "-"
          },
          col_2: {
            description: "-"
          },

          col_3: {
            refParent: "-"
          },
          col_4: {
            status: "-"
          },
          col_5: {
            action: [
              {
                name: "edit",
                title: "Xem chi tiết",
                icon: "fa-eye",
                handle: "handleEditCategoryPartner"
              },
              {
                name: "delete",
                title: "Xóa",
                icon: "fa-trash",
                handle: "handleDeleteCategoryPartner"
              }
            ]
          },

          point: []
        };
        temp.key = value.id;

        temp.col_1 = {
          name: value.name ? value.name : "-"
        };
        temp.col_2 = {
          description: value.description || "-"
        };
        temp.col_3 = {
          refParent: value.refParent ? value.refParent.name : "-"
        };
        temp.col_4 = {
          status: value.status || "-",
          color: STATUS.find(x => x.value == value.status)
            ? STATUS.find(x => x.value == value.status).color
            : "red",
          icon: STATUS.find(x => x.value == value.status)
            ? STATUS.find(x => x.value == value.status).icon
            : "fa-question-circle"
        };

        listCategoryPartner.push(temp);
      });
      return state
        .set("listCategoryPartner", listCategoryPartner || [])
        .set("listCategoryPartnerSuccess", action.docs || [])
        .set("totalPartner", action.totalPartner || "")
        .set("pageSizePartner", action.pageSizePartner || "")
        .set("pagesPartner", action.pagesPartner || "")
        .set("param", action.param || "")
        .set("queryPartner", action.queryPartner || "")
        .set("tabId", action.tabId || "3")
        .set("loading", false)
        .set("error", false);

    //CATEGORY_VEHICLE_SEARCH
    case actions.CATEGORY_VEHICLE_SEARCH:
      return state
        .set("loading", true)
        .set("queryVehicle", action.payload.queryVehicle);
    case actions.SHOW_MODAL_VEHICLE:
      return state
        .set("isShowVehicle", action.payload.isShowVehicle)
        .set("actionName", action.payload.actionName)
        .set("rowData", action.payload.rowData ? action.payload.rowData : {});
    case actions.CATEGORY_VEHICLE_SUCCESS_RESULT:
      let listCategoryVehicle = [];
      action.docs.forEach((value, index) => {
        let temp = {
          key: index,
          col_1: {
            name: "-"
          },
          col_2: {
            description: "-"
          },

          col_3: {
            sort: "-"
          },
          col_4: {
            status: "-"
          },
          col_5: {
            action: [
              {
                name: "edit",
                title: "Xem chi tiết",
                icon: "fa-eye",
                handle: "handleEditCategoryVehicle"
              },
              {
                name: "delete",
                title: "Xóa",
                icon: "fa-trash",
                handle: "handleDeleteCategoryVehicle"
              }
            ]
          },
          col_6: {
            parentName: "-"
          },
          point: []
        };
        temp.key = value.id;

        temp.col_1 = {
          name: value.name ? value.name : "-"
        };
        temp.col_2 = {
          description: value.description || "-"
        };
        temp.col_3 = {
          sort: value.sort || "-"
        };
        temp.col_4 = {
          status: value.status || "-",
          color: STATUS.find(x => x.value == value.status)
            ? STATUS.find(x => x.value == value.status).color
            : "red",
          icon: STATUS.find(x => x.value == value.status)
            ? STATUS.find(x => x.value == value.status).icon
            : "fa-question-circle"
        };
        temp.col_6 = {
          parentName: value.refParent ? value.refParent.name : ""
        };

        listCategoryVehicle.push(temp);
      });
      return state
        .set("listCategoryVehicle", listCategoryVehicle || [])
        .set("listCategoryVehicleSuccess", action.docs || [])
        .set("totalVehicle", action.totalVehicle || "")
        .set("pageSizeVehicle", action.pageSizeVehicle || "")
        .set("pagesVehicle", action.pagesVehicle || "")
        .set("param", action.param || "")
        .set("queryVehicle", action.queryVehicle || "")
        .set("tabId", action.tabId || "4")
        .set("loading", false)
        .set("error", false);

    case actions.ACTION_ERROR:
      return state
        .set("loading", false)
        .set("listDriver", [])
        .set("errMessage", action.payload.errMessage)
        .set("error", true);

    default:
      return state;
  }
}
