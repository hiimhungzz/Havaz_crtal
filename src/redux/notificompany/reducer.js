import {
    Map
} from 'immutable';
import {actions} from './acions';
const initState = new Map({
    listNoti: [],
    gridNoti: [],
    totalLength: 0,
    pageSize: 5,
    pages: 0,
    itemRead: {
        id: 1,
        driverUuid: [],
        title: "",
        editorHtml: "",
        date: new Date(),
        dataImage: [],
        status: false,
        quote: '',
        refParent: {
            key: '',
            label: '',
        }
    },
    loading: false,
});

export default function reducer(state = initState, action) {
    let listNoti = [];
    let gridNoti = [];
    switch (action.type) {
        case actions.ONSEND_NOTI:
            return state
                .set('listNoti', action.payload.data)
        case actions.GET_LIST_NOTIFICOMPANY_SUCCESS:
            listNoti = action.data.rows;

            listNoti.forEach((value, index) => {
                let temp = {
                    key: null,
                    ownerId: null,
                    col_0: {
                        status: '',
                    },
                    col_1: {
                        nameDriver: "",
                    },
                    col_2: {
                        title: ""
                    },
                    col_3: {
                        quote: ""
                    },
                    col_4: {
                        html: ""
                    },
                    col_5: {
                        dataImage: [],
                    },
                    col_6: {
                        refParent: {},
                    },
                    col_7: {
                        createdAt: ''
                    },
                    col_8: {
                        action: [{
                            name: "Xem chi tiết",
                            icon: "fa-eye",
                            handle: "handleViewNoti"
                        }, {
                            name: "Hủy",
                            icon: "fa-trash",
                            handle: "handleDeleteItem"
                        },
                        {
                            name: "Gửi",
                            icon: "fa-paper-plane",
                            handle: "handleSendItem"
                        }, ]
                    }
                };
                temp.key = value.id;
                temp.ownerId = value.id;
                temp.col_0 = {
                    status: value.status,
                    sentAt: value.sentAt,
                };
                temp.col_1 = {
                    driverUuid: value.refDriver,
                };
                temp.col_2 = {
                    title: value.title,
                };
                temp.col_3 = {
                    title: value.quote,
                };
                temp.col_4 = {
                    html: value.content,
                };
                temp.col_5 = {
                    dataImage: value.images,
                };
                temp.col_6 = {
                    refParent: value.refParent,
                };
                temp.col_7 = {
                    createdAt: value.createdAt,
                };
                temp.col_8 = {
                    action: [{
                        name: "Xem chi tiết",
                        icon: "fa-eye",
                        handle: "handleViewNoti"
                    }, {
                        name: "Hủy",
                        icon: "fa-trash",
                        handle: "handleDeleteItem"
                    },
                    {
                        name: "Gửi",
                        icon: "fa-paper-plane",
                        handle: "handleSendItem"
                    }, ],
                    status: value.status,
                    sentAt: value.sentAt,
                };
                gridNoti.push(temp);
            });
            return state
                .set('listNoti', listNoti)
                .set('gridNoti', gridNoti)
                .set('totalLength', action.data.count)
        case actions.ONSAVE_NOTI_SUCCESS:
            return state;
        case actions.ONSET_PAGESIZE:
            return state
                .set('pageSize', action.payload.data);
        case actions.READ_ITEM_NOTI_SUCCESS:
            const data = action.payload.data;
            return state
                .set('itemRead', data)
        case actions.ON_LOADDING:
            const loadding = action.payload.data;
            return state
                .set('loading', loadding)
        case actions.ONCHANGE_CURRENTPAGE:
            return state
                .set('pages', action.payload.data);
        default:
            return state;
    }
}
