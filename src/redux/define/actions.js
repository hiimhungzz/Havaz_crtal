export const actions = {
    SHOW_MODAL: "SHOW_MODAL",
    showModalDefine: (isShow, actionName, rowData = null) => ({
        type: actions.SHOW_MODAL,
        payload: {
            isShow,
            actionName,
            rowData
        }
    }),
    DEFINE_SEARCH: "DEFINE_SEARCH",
    DEFINE_SUCCESS_RESULT: "DEFINE_SUCCESS_RESULT",
    defineSearch: ({
        query = { name: "" },
        pageSize = 5,
        pages = 0,
        tabId = "1"
    }) => ({
        type: actions.DEFINE_SEARCH,
        payload: {
            pages,
            pageSize,
            tabId,
            query,
            param: {
                pageSize: pageSize,
                pages: pages,
                name: query.name
            }
        }
    }),

    // ACTION_ERROR: "ACTION_ERROR",
    // taskSheduleError: errMessage => ({
    //     type: actions.ACTION_ERROR,
    //     payload: {
    //         errMessage
    //     }
    // }),
    defineSuccess: (
        docs,
        total,
        pages,
        pageSize,
        tabId,
        query,
        param,
        typeDefine
    ) => ({
        type: actions.DEFINE_SUCCESS_RESULT,
        docs,
        total,
        pages,
        pageSize,
        tabId,
        query,
        param,
        typeDefine
    }),
    CREATE_DEFINE_USER: "CREATE_DEFINE_USER",
    createDefine: (data) => ({
        type: actions.CREATE_DEFINE_USER,
        payload: {
            data
        }
    }),
    SAVE_DEFINE_USER: "SAVE_DEFINE_USER",
    saveDefine: (data) => ({
        type: actions.SAVE_DEFINE_USER,
        payload: {
            data
        }
    }),
    SHOW_DEFINE_USER: "SHOW_DEFINE_USER",
    showDefine: (data) => ({
        type: actions.SHOW_DEFINE_USER,
        payload: {
            data
        }
    }),
    SHOW_DEFINE_USER_SUCCESS: "SHOW_DEFINE_USER_SUCCESS",
    showDefineSuccess: (rowData) => ({
        type: actions.SHOW_DEFINE_USER_SUCCESS,
        payload: {
            rowData
        }
    }),
    DELETE_DEFINE_USER: "DELETE_DEFINE_USER",
    deleteDefine: (data) => ({
        type: actions.DELETE_DEFINE_USER,
        payload: {
            data
        }
    }),
    DEFINE_CHANGE_TAB: "DEFINE_CHANGE_TAB",
    changeTab: tabId => ({
        type: actions.DEFINE_CHANGE_TAB,
        payload: {
            tabId
        }
    }),
    onPageChange: (searchInput, pageSize, pages, tabId, query) => ({
        type: tabId == "1" ?
            actions.DEFINE_SEARCH : "",
        payload: {
            searchInput,
            pageSize,
            pages,
            query,
            tabId,
            param: {
                name: query.name,
                pageSize: pageSize,
                pages: pages,
                order: "createdAt DESC"
            }
        }
    }),

};

export default actions;