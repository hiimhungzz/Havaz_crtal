import { Map } from "immutable";
import { actions } from "./actions";
import moment from "moment";
import _ from "lodash";
import { STATUS } from "../../constants/common";
import { checkStatus } from "../../helpers/utility";
const initState = new Map({
  pageSize: 5,
  externalPageLimit: 5,
  pages: 0,
  orderBy: {
    name: 1
  },
  searchInput: "",
  tabId: "1",
  listSchedule: [],
  listScheduleSuccess: [],
  query: {
    month: "",
    year: "",
    phoneDriver: "",
    codeDriver: "",
    nameDriver: "",
    date: "",
    categorySurvey: undefined,
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
  let listSchedule = [];
  switch (action.type) {
    case actions.TASK_SCHEDULE_SHOW_MODAL:
      return state
        .set("isShow", action.payload.isShow)
        .set("actionName", action.payload.actionName)
        .set("rowData", action.payload.rowData ? action.payload.rowData : {});
    case actions.TASK_SCHEDULE_SEARCH:
      return state
        .set("loading", true)
        .set("query", action.payload.query)
        .set("tabId", action.payload.tabId);
    case actions.TASK_SCHEDULE_SUCCESS_RESULT:
      // if (window.location.pathname === '/taskScheduleManagement') {
      //     let appParam = {};
      //     appParam['taskSchedule'] = action.param;
      //     localStorage.setItem('AppParam', JSON.stringify(appParam));
      // }
      // debugger;
      return state
        .set("listScheduleSuccess", action.headers || [])
        .set("listSchedule", action.docs)
        .set("total", action.total || "")
        .set("pageSize", action.pageSize || "")
        .set("selectStatus", action.status || "")
        .set("pages", action.pages || "")
        .set("param", action.param || "")
        .set("query", action.query || "")
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
    case actions.DRIVER_ERROR_RESULT:
      return state
        .set("listDriver", [])
        .set("loading", false)
        .set("error", false);
    default:
      return state;
  }
}

// import { Map } from 'immutable';
// import { actions } from './actions'
// import moment from "moment";
// import _ from "lodash";
// import { STATUS } from "../../constants/common";
// import { checkStatus } from "../../helpers/utility";
// const initState = new Map({
//     pageSize: 5,
//     externalPageLimit: 5,
//     pages: 0,
//     orderBy: {
//         name: 1
//     },
//     searchInput: "",
//     // "query": {
//     //     "uuids": []
//     // }
//     tabId: '1',
//     listSchedule: [],
//     listScheduleSuccess: [],
//     query: { code: "", fullName: "", birthday: "", CMND: "", driversLicenseClass: "", licenseExpireAt: "", doanhnghiep: "", driversLicenseCode: "", status: "", rating: "" },
//     organization: [],
//     isShow: false,
//     actionName: '',
//     rowData: {},
//     rowDataType: {},
//     totalLength: 0,
//     loading: false,
//     error: false
// });

// export default function reducer(state = initState, action) {
//     let listSchedule = [];
//     switch (action.type) {
//         case actions.DRIVER_SHOW_MODAL:
//             return state
//                 .set('isShow', action.payload.isShow)
//                 .set('actionName', action.payload.actionName)
//                 .set('rowData', action.payload.rowData ? action.payload.rowData : {});
//         case actions.TASK_SCHEDULE_SEARCH:
//             return state
//                 .set('loading', true)
//                 .set('query', action.payload.query)
//                 .set('tabId', action.payload.tabId);
//         case actions.TASK_SCHEDULE_SUCCESS_RESULT:
//             if (window.location.pathname === '/taskScheduleManagement') {
//                 let appParam = {};
//                 appParam['taskSchedule'] = action.param;
//                 localStorage.setItem('AppParam', JSON.stringify(appParam));
//             }
//             let data = [{
//                     name: "Vũ minh ước",
//                     title: "col_1",
//                     key: "1",
//                     width: 150,
//                 },
//                 {
//                     name: "Nguyễn hoàng anh",
//                     title: "col_2",
//                     key: "2",
//                     width: 150,
//                 },
//                 {
//                     name: "Đào đăng sơn",
//                     title: "col_3",
//                     key: "3",
//                     width: 150,
//                 },
//                 {
//                     name: "Bùi anh tú",
//                     title: "col_4",
//                     key: "4",
//                     width: 150,
//                 },
//                 {
//                     name: "Trương tiến đức",
//                     title: "col_5",
//                     key: "5",
//                     width: 150,
//                 },

//             ]
//             let header = [{
//                     title: ['Họ và Tên'],
//                     name: 'col_1',

//                 },
//                 {
//                     title: ['Thứ 2 (27/8)'],
//                     name: 'col_2',

//                 },
//                 {
//                     title: ['Thứ 3 (27/8)'],
//                     name: 'col_3',

//                 },
//                 {
//                     title: ['Thứ 4 (27/8)'],
//                     name: 'col_4',

//                 },
//                 {
//                     title: ['Thứ 5 (27/8)'],
//                     name: 'col_5',

//                 },
//                 {
//                     title: ['Thứ 6 (27/8)'],
//                     name: 'col_6',

//                 },
//                 {
//                     title: ['Thứ 7 (27/8)'],
//                     name: 'col_7',

//                 },
//                 {
//                     title: ['Chủ nhật (27/8)'],
//                     name: 'col_8',

//                 },
//                 {
//                     title: ['Thứ 2 (27/8)'],
//                     name: 'col_9',

//                 },
//                 {
//                     title: ['Thứ 3 (27/8)'],
//                     name: 'col_10',

//                 },
//                 {
//                     title: ['Thứ 4 (27/8)'],
//                     name: 'col_11',

//                 },
//                 {
//                     title: ['Thứ 5 (27/8)'],
//                     name: 'col_12',

//                 },
//                 {
//                     title: ['Thứ 6 (27/8)'],
//                     name: 'col_13',

//                 },
//                 {
//                     title: ['Thứ 7 (27/8)'],
//                     name: 'col_14',

//                 },
//                 {
//                     title: ['Chủ nhật (27/8)'],
//                     name: 'col_15',

//                 },
//                 {
//                     title: ['Thứ 2 (27/8)'],
//                     name: 'col_16',

//                 },
//                 {
//                     title: ['Thứ 3 (27/8)'],
//                     name: 'col_17',

//                 },
//                 {
//                     title: ['Thứ 4 (27/8)'],
//                     name: 'col_18',

//                 },
//                 {
//                     title: ['Thứ 5 (27/8)'],
//                     name: 'col_19',

//                 },
//                 {
//                     title: ['Thứ 6 (27/8)'],
//                     name: 'col_20',

//                 },
//                 {
//                     title: ['Thứ 7 (27/8)'],
//                     name: 'col_21',

//                 },
//                 {
//                     title: ['Chủ nhật (27/8)'],
//                     name: 'col_22',

//                 },
//             ]
//             data.forEach((value, index) => {
//                 var col = value.title;
//                 let temp = {
//                     key: value.key,
//                     [col]: value.name,
//                 };
//                 // console.log("temp", temp)
//                 listSchedule.push(temp);
//             });
//             console.log("hoanganh", listSchedule)
//             return state
//                 .set('listScheduleSuccess', header || [])
//                 .set('listSchedule', [])
//                 .set('total', action.total || '')
//                 .set('pageSize', action.pageSize || '')
//                 .set('selectStatus', action.status || '')
//                 .set('pages', action.pages || '')
//                 .set('param', action.param || '')
//                 .set('query', action.param.query || '')
//                 .set('tabId', action.tabId || '')
//                 .set('loading', false)
//                 .set('error', false);

//         case actions.ACTION_ORGANIZATION_DRIVER:
//             return state
//                 .set('organization', action.docs || [])
//                 .set('total', action.total)
//                 .set('pages', action.pages)
//                 .set('param', action.param)
//                 .set('loading', false)
//                 .set('error', false);
//         case actions.ACTION_ERROR:
//             return state
//                 .set('loading', false)
//                 .set('listDriver', [])
//                 .set('errMessage', action.payload.errMessage)
//                 .set('error', true);
//         case actions.DRIVER_ERROR_RESULT:
//             return state
//                 .set('listDriver', [])
//                 .set('loading', false)
//                 .set('error', false);
//         default:
//             return state;
//     }
//
