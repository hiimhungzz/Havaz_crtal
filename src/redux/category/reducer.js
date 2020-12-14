import { Map } from 'immutable';
import { actions } from './actions'
import { STATUS } from "@Constants/common";


const initState = new Map({
    pageSize: 5,
    externalPageLimit: 5,
    pages: 0,
    orderBy: {
        name: 1
    },
    isShow: false,
    actionName: '',
    rowData: {},
    listCategory: [],
    totalLength: 0,
    loading: false,
    error: false
});
export default function reducer(state = initState, action) {
    switch (action.type) {
        case actions.CATEGORY_SHOW_MODEL:
            return state
                .set('isShow', action.payload.isShow)
                .set('actionName', action.payload.actionName)
                .set('rowData', action.payload.rowData ? action.payload.rowData : {});
        case actions.CATEGORY_SEARCH:
            return state
                .set('loading', true);
        case actions.CATEGORY_SEARCH_SUCCESS:
            if (window.location.pathname === '/categoryManagement') {
                let appParam = {};
                appParam['Category'] = action.param;
                localStorage.setItem('AppParam', JSON.stringify(appParam));
            }
            let listCategory = [];
            action.docs.forEach((value, index) => {
                let temp = {
                    key: null,
                    col_1: {
                        id: "-",
                    },
                    col_2: {
                        name: "-",
                    },
                    col_3: {
                        refCode: "-"
                    },
                    col_4: {
                        refAcount: "-"
                    },
                    col_5: {
                        desShort: "-",
                    },
                    col_6: {
                        refParent: "-",
                    },
                    col_7: {
                        status: "-"
                    },
                    col_8: {
                        action: [{
                                name: "edit",
                                icon: "fa-eye",
                                title: "Xem chi tiết",
                                handle: "handleEditCategory"
                            },
                            {
                                name: "delete",
                                icon: "fa-trash",
                                title: "Xóa",
                                handle: "handleDeleteCategory"
                            }

                        ]
                    },
                    point: []
                };
                temp.key = value.uuid;
                temp.col_1 = {
                    id: value.id || "-",
                };
                temp.col_2 = {
                    name: value.name || "-",
                };
                temp.col_3 = {
                    refCode: value.refCode || "",
                };
                temp.col_4 = {
                    refAcount: value.refAcount || "-"
                };
                temp.col_5 = {
                    desShort: value.desShort || "-",
                    description: value.description || "-",
                };
                temp.col_6 = {
                    refParent: value.refParent ? value.refParent.name : "-"
                };
                temp.col_7 = {
                    status: value.status || "-",
                    color: STATUS.find(x => x.value == value.status) ? STATUS.find(x => x.value == value.status).color : 'red',
                    icon: STATUS.find(x => x.value == value.status) ? STATUS.find(x => x.value == value.status).icon : 'fa-question-circle'
                };
                listCategory.push(temp);
            })
            return state
                .set('listCategory', listCategory)
                .set('listCategorySuccess', action.docs)
                .set('total', action.total)
                .set('pageSize', action.pageSize)
                .set('selectStatus', action.status)
                .set('pages', action.pages)
                .set('param', action.param)
                .set('query', action.param.query)
                .set('loading', false)
                .set('error', false);
        default:
            return state;
    }
}