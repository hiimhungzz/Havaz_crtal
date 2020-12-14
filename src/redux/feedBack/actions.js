export const actions = {
    FEEDBACK_SHOW_MODEL: 'FEEDBACK_SHOW_MODEL',
    showModel: (isShow, actionName, rowData = null) => ({
        type: actions.FEEDBACK_SHOW_MODEL,
        payload: {
            isShow,
            actionName,
            rowData
        }
    }),
    FEEDBACK_SEARCH: 'FEEDBACK_SEARCH',
    feedBackSearch: ({ query = { userType: "" }, pageSize = 5, pages = 0, }) => ({
        type: actions.FEEDBACK_SEARCH,
        payload: {
            query,
            pageSize,
            pages,
            param: {
                pageSize: pageSize,
                pages: pages,
                query: query,
                where: `userType eq ${query.userType}`,
                order: 'createdAt DESC'
            }
        }
    }),
    FEEDBACK_SEARCH_SUCCESS: 'FEEDBACK_SEARCH_SUCCESS',
    feedBackSearchSuccess: (docs, total, pages, pageSize, tabId, param) => ({
        type: actions.FEEDBACK_SEARCH_SUCCESS,
        docs,
        total,
        pages,
        pageSize,
        tabId,
        param
    }),
    UPDATE_FEEDBACK: 'UPDATE_FEEDBACK',
    updateFeedBack: (id) => ({
        type: actions.UPDATE_FEEDBACK,
        payload: {
            id
        }
    }),
    onPageChange: (pageSize, pages, query) => ({
        type: actions.FEEDBACK_SEARCH,
        payload: {
            pageSize,
            pages,
            query,
            param: {
                pageSize: pageSize,
                pages: pages,
                query: query,
                where: `userType iLike ${query.userType}`,
                order: 'createdAt DESC',
            }
        }
    })
}