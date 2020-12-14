export const actions = {
    CATEGORY_SHOW_MODEL: 'CATEGORY_SHOW_MODEL',
    showModel: (isShow, actionName, rowData = null) => ({
        type: actions.CATEGORY_SHOW_MODEL,
        payload: {
            isShow,
            actionName,
            rowData
        }
    }),
    CATEGORY_SEARCH: 'CATEGORY_SEARCH',
    categorySearch: ({ query = { name: "", refCode: "", refAcount: "" }, pageSize = 5, pages = 0, }) => ({
        type: actions.CATEGORY_SEARCH,
        payload: {
            query,
            pageSize,
            pages,
            param: {
                pageSize: pageSize,
                pages: pages,
                query: query,
                where: `name iLike ${query.name},refCode eq ${query.refCode},refAcount eq ${query.refAcount},`,
                order: 'createdAt DESC'
            }
        }
    }),
    CATEGORY_SEARCH_SUCCESS: 'CATEGORY_SEARCH_SUCCESS',
    categorySearchSuccess: (docs, total, pages, pageSize, tabId, param) => ({
        type: actions.CATEGORY_SEARCH_SUCCESS,
        docs,
        total,
        pages,
        pageSize,
        tabId,
        param
    }),
    CATEGORY_CREATE: 'CATEGORY_CREATE',
    categoryCreate: (data) => ({
        type: actions.CATEGORY_CREATE,
        payload: {
            data
        }
    }),
    CATEGORY_SAVE: 'CATEGORY_SAVE',
    categorySave: (data) => ({
        type: actions.CATEGORY_SAVE,
        payload: {
            data
        }
    }),
    CATEGORY_DELETE: 'CATEGORY_DELETE',
    categoryDelete: (data) => ({
        type: actions.CATEGORY_DELETE,
        payload: {
            data
        }
    }),
    onPageChange: (pageSize, pages, query) => ({
        type: actions.CATEGORY_SEARCH,
        payload: {
            pageSize,
            pages,
            query,
            param: {
                pageSize: pageSize,
                pages: pages,
                query: query,
                where: `name iLike ${query.name},refCode eq ${query.refCode},refAcount eq ${query.refAcount}`,
                order: 'createdAt DESC',
            }
        }
    })
}