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
    listDefine: [],
    listDefineSuccess: [],
    typeDefine: [],
    query: {
        name: ""
    },
    organization: [],
    isShow: false,
    isShowCtv: false,
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
                .set('isShow', action.payload.isShow)
                .set('actionName', action.payload.actionName)
                .set('rowData', action.payload.rowData ? action.payload.rowData : {});
        case actions.SHOW_DEFINE_USER_SUCCESS:
            return state
                .set('rowData', action.payload.rowData ? action.payload.rowData : {});
        case actions.DEFINE_SEARCH:
            return state.set("loading", true).set("query", action.payload.query);

        case actions.DEFINE_SUCCESS_RESULT:
            // if (window.location.pathname === '/taskScheduleManagement') {
            //     let appParam = {};
            //     appParam['taskSchedule'] = action.param;
            //     localStorage.setItem('AppParam', JSON.stringify(appParam));
            // }
            let listDefine = [];

            action.docs.forEach((value, index) => {
                let temp = {
                    key: index,

                    col_1: {
                        name: "-",
                    },
                    col_2: {
                        description: "-"
                    },

                    col_3: {
                        status: "-"
                    },
                    col_4: {
                        action: [{
                                name: "edit",
                                title: "Xem chi tiết",
                                icon: "fa-eye",
                                handle: "handleEditDefine"
                            },
                            {
                                name: "delete",
                                title: "Xóa",
                                icon: "fa-trash",
                                handle: "handleDeleteDefine"
                            }
                        ]
                    },


                    point: []
                };
                temp.key = value.id;

                temp.col_1 = {
                    name: value.name ? value.name : "-",
                };
                temp.col_2 = {
                    description: value.description || "-"
                };
                temp.col_3 = {
                    status: value.status || "-",
                    color: STATUS.find(x => x.value == value.status) ? STATUS.find(x => x.value == value.status).color : 'red',
                    icon: STATUS.find(x => x.value == value.status) ? STATUS.find(x => x.value == value.status).icon : 'fa-question-circle'
                };
                listDefine.push(temp);
            });
            let typeDefine = action.typeDefine.map((item) => {
                let data = {
                    label: item.lable,
                    value: item.value,
                    name: `col_${item.value}`
                }
                return data

            })
            let dataDocs = action.docs.map((item, index) => {
                item.col = typeDefine
                item.childs.map((_item, _index) => {
                    _item.col = typeDefine
                })
                return item
            })
            return state
                .set("listDefine", listDefine || [])
                .set("listDefineSuccess", action.docs || [])
                .set("total", action.total || "")
                .set("pageSize", action.pageSize || "")
                .set("pages", action.pages || "")
                .set("param", action.param || "")
                .set("query", action.query || "")
                .set("tabId", action.tabId || "1")
                .set("typeDefine", typeDefine || [])
                .set("loading", false)
                .set("error", false);

        default:
            return state;
    }
}