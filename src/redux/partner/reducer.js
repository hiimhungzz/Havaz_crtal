import { Map } from "immutable";
import { actions } from "./actions";
import { STATUS, APP_MODULE } from "@Constants/common";
import { checkStatus, formatDateTime, appParam } from "@Helpers/utility";
import { $LocalStorage } from "@Helpers/localStorage";
import { APP_PARAM } from "@Constants";

const initState = new Map({
  organization: {
    pageLimit: 5,
    currentPage: 0,
    totalLength: 0,
    query: {},
    grid: [],
    isShow: false,
    loading: false,
    spinning: false,
    fetching: false,
  },
  partner: {
    pageLimit: 5,
    currentPage: 0,
    totalLength: 0,
    query: {},
    grid: [],
    isShow: false,
    loading: false,
    spinning: false,
    fetching: false,
  },

  listPartnerCost: [],
  isShow: false,
  isShowCtv: false,
  organizationLoadingCtv: false,
  actionName: "",
  partnerData: {},
  loading: false,
  error: false,
  tabId: 1,
});

export default function reducer(state = initState, action) {
  let organization = {
    ...state.get("organization"),
  };
  let partner = {
    ...state.get("partner"),
  };
  let { payload } = action;
  let listPartnerCost = [];
  let partnerData = {};
  switch (action.type) {
    case actions.PARTNER_SHOW_MODAL:
      if (payload.actionName === "create") {
        return state
          .set("isShow", payload.isShow)
          .set("partnerData", partnerData)
          .set("actionName", payload.actionName);
      }
      return state
        .set("isShow", payload.isShow)
        .set("actionName", payload.actionName);
    case actions.PARTNER_BROWSE_ORGANIZATION:
      organization.loading = true;
      return state.set("organization", organization);
    case actions.PARTNER_BROWSE_ORGANIZATION_SUCCESS:
      if (appParam[APP_MODULE.PARTNER]) {
        appParam[APP_MODULE.PARTNER]["ORGANIZATION"] = payload.param;
      } else {
        appParam[APP_MODULE.PARTNER] = {
          ORGANIZATION: payload.param,
        };
      }
      $LocalStorage.sls.setObject(APP_PARAM, appParam);
      organization.pageLimit = payload.param.pageLimit;
      organization.currentPage = payload.param.currentPage;
      organization.totalLength = payload.totalLength;
      organization.query = payload.param.query;
      organization.loading = false;
      organization.grid = payload.data.map((value, index) => {
        let temp = {
          key: value.uuid,
          ownerId: value.ownerId,
          taxCode: value.taxCode,
          managerId: value.managerId,
          cityid: value.cityid,
          col_1: {
            code: value.code,
            registerDate: formatDateTime(value.registerDate),
          },
          col_2: {
            ownerName: value.ownerName,
            ownerPhone: value.ownerPhone,
          },
          col_3: {
            managerName: value.managerName || "",
            managerPhone: value.managerPhone || "",
          },
          col_4: {
            name: value.name,
            phoneNumber: value.phone,
            email: value.email,
          },
          col_5: {
            unit: value.unit,
            cityname: value.cityname,
          },
          col_6: {
            taxCode: value.taxCode,
          },
          col_7: {
            status: checkStatus(value.status),
            color: STATUS.find((x) => x.value == value.status)
              ? STATUS.find((x) => x.value == value.status).color
              : "red",
            icon: STATUS.find((x) => x.value == value.status)
              ? STATUS.find((x) => x.value == value.status).icon
              : "fa-question-circle",
          },
          col_8: {
            numberDriver: value.numberDriver,
          },
          col_9: {
            numberVehicle: value.numberVehicle,
          },
          col_11: {
            refCode: value.refCode,
          },
          col_12: {
            parentName: value.parentName,
          },
          col_10: {
            action: [
              {
                name: "Xem chi tiết",
                icon: "fa-eye",
                handle: "handleReadPartner",
              },
              {
                name: "Xóa",
                icon: "fa-trash",
                handle: "handleDeletePartner",
              },
            ],
          },
        };
        return temp;
      });
      return state.set("organization", organization);
    case actions.PARTNER_BROWSE_ORGANIZATION_ERROR:
      organization.grid = [];
      organization.loading = false;
      return state.set("organization", organization);
    case actions.PARTNER_BROWSE_PARTNER:
      partner.loading = true;
      return state.set("partner", partner);
    case actions.PARTNER_BROWSE_PARTNER_SUCCESS:
      if (appParam[APP_MODULE.PARTNER]) {
        appParam[APP_MODULE.PARTNER]["PARTNER"] = payload.param;
      } else {
        appParam[APP_MODULE.PARTNER] = {
          PARTNER: payload.param,
        };
      }
      $LocalStorage.sls.setObject(APP_PARAM, appParam);
      partner.pageLimit = payload.param.pageLimit;
      partner.currentPage = payload.param.currentPage;
      partner.totalLength = payload.totalLength;
      partner.query = payload.param.query;
      partner.loading = false;
      partner.grid = payload.data.map((value, index) => {
        let matchedStatus = STATUS.find((x) => x.value == value.status);
        let temp = {
          key: value.uuid,
          ownerId: value.ownerId,
          managerId: value.managerId,

          cityid: value.cityid,
          col_1: {
            code: value.code,
            registerDate: formatDateTime(value.registerDate),
          },
          col_2: {
            ownerName: value.ownerName,
            ownerPhone: value.ownerPhone,
          },
          col_3: {
            managerName: value.managerName,
            managerPhone: value.managerPhone,
          },
          col_4: {
            name: value.name,
            phoneNumber: value.phone,
            email: value.email,
          },
          col_5: {
            unit: value.unit,
            cityname: value.cityname,
          },
          col_6: {
            taxCode: value.taxCode,
          },
          col_7: {
            status: checkStatus(value.status),
            color: matchedStatus ? matchedStatus.color : "red",
            icon: matchedStatus ? matchedStatus.icon : "question-circle",
          },
          col_8: {
            numberDriver: value.numberDriver,
          },
          col_9: {
            numberVehicle: value.numberVehicle,
          },
          col_11: {
            refCode: value.refCode,
          },
          col_12: {
            parentName: value.parentName,
          },
          col_10: {
            action: [
              {
                name: "view",
                icon: "fa-eye",
                handle: "handleReadPartner",
              },
              {
                name: "delete",
                icon: "fa-trash",
                handle: "handleDeletePartner",
              },
            ],
          },
        };

        return temp;
      });
      return state.set("partner", partner);
    case actions.PARTNER_BROWSE_PARTNER_ERROR:
      partner.grid = [];
      partner.loading = false;
      return state.set("partner", partner);
    case actions.COST_PARTNER_SEARCH:
      return state.set("costLoading", true);
    case actions.COST_PARTNER_SUCCESS_RESULT:
      listPartnerCost = payload.data
        ? payload.data.map((value, index) => {
            return {
              ...value,
              key: index,
            };
          })
        : [];
      return state
        .set("listPartnerCost", listPartnerCost)
        .set("costLoading", false);
    case actions.COST_PARTNER_ERROR_RESULT:
      return state.set("listPartnerCost", []).set("costLoading", false);

    case actions.PARTNER_READ_ORGANIZATION:
      organization.spinning = true;
      return state.set("organization", organization);
    case actions.PARTNER_READ_ORGANIZATION_SUCCESS:
      organization.spinning = false;
      organization.data = payload.data;
      return state
        .set("organization", organization)
        .set("partnerData", payload.data);
    case actions.PARTNER_READ_ORGANIZATION_ERROR:
      organization.spinning = false;
      return state.set("organization", organization).set("partnerData ", {});
    case actions.PARTNER_READ_PARTNER:
      partner.spinning = true;
      return state.set("partner", partner);
    case actions.PARTNER_READ_PARTNER_SUCCESS:
      partner.spinning = false;
      partner.data = payload.data;
      return state.set("partner", partner).set("partnerData", payload.data);
    case actions.PARTNER_READ_PARTNER_ERROR:
      partner.spinning = false;
      return state.set("partner", partner).set("partnerData ", {});
    case actions.PARTNER_CHANGE_TAB:
      return state.set("tabId", payload.tabId);
    default:
      return state;
  }
}
