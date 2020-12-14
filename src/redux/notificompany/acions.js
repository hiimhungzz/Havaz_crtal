export const actions = {
    ONSEND_NOTI: 'ONSEND_NOTI',
    onSendNoti: (data) => ({
        type: actions.ONSEND_NOTI,
        payload: {
            data
        }
    }),

    ONSEND_ITEM: 'ONSEND_ITEM',
    onSendItem:  (data) => ({
        type: actions.ONSEND_ITEM,
        payload: {
            data
        }
    }),

    ON_LOADDING: 'ON_LOADDING',
    onLoadding: (data) => ({
        type: actions.ON_LOADDING,
        payload: {
            data
        }
    }),

    ONSET_PAGESIZE: 'ONSET_PAGESIZE',
    onSetPageSize: (data) => ({
        type: actions.ONSET_PAGESIZE,
        payload: {
            data
        }
    }),

    ONCHANGE_CURRENTPAGE: 'ONCHANGE_CURRENTPAGE',
    onChangeCurrentPage:(data) => ({
        type: actions.ONCHANGE_CURRENTPAGE,
        payload: {
            data
        }
    }),

    ONSAVE_NOTI: 'ONSAVE_NOTI',
    onSaveNoti: (data) => ({
        type: actions.ONSAVE_NOTI,
        payload: {
            data
        }
    }),
    ONSAVE_NOTI_SUCCESS: 'ONSAVE_NOTI_SUCCESS',
    onSaveSuccess: (data) => ({
        type: actions.ONSAVE_NOTI_SUCCESS,
        payload: {
            data
        }
    }),

    ONUPDATE_NOTI: 'ONUPDATE_NOTI',
    onUpdateNoti: (data) => ({
        type: actions.ONUPDATE_NOTI,
        payload: {
            data
        }
    }),

    READ_ITEM_NOTI: 'READ_ITEM_NOTI',
    readItemNoti: (data) => {
        return ({
            type: actions.READ_ITEM_NOTI,
            payload: {
                data: data
            },
        })
    },
    READ_ITEM_NOTI_SUCCESS: 'READ_ITEM_NOTI_SUCCESS',
    readItemNotiSuccess: (data) => {
        return ({
            type: actions.READ_ITEM_NOTI_SUCCESS,
            payload: {
                data: data
            },
        })
    },

    GET_LIST_NOTIFICOMPANY: 'GET_LIST_NOTIFICOMPANY',
    getListNotiCompany: (data) => ({
        type: actions.GET_LIST_NOTIFICOMPANY,
        payload: {
            pages: data.pages,
            pageSize: data.pageSize,
        },
    }),
    GET_LIST_NOTIFICOMPANY_SUCCESS: 'GET_LIST_NOTIFICOMPANY_SUCCESS',
    getListNotiCompanySuccess: (data, totalLength) => ({
        type: actions.GET_LIST_NOTIFICOMPANY_SUCCESS,
        data,
        totalLength,
    }),

    DELETE_NOTIFI_ITEM: 'DELETE_NOTIFI_ITEM',
    deleteNotifiItem: (data) => ({
        type: actions.DELETE_NOTIFI_ITEM,
        payload: {
            data: data,
        },
    }),

    FILTER_NOTI: 'FILTER_NOTI',
    filterNotifi: (title) => ({
        type: actions.FILTER_NOTI,
        payload: {
            title: title,
        },
    }),
};