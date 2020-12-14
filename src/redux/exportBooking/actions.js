export const actions = {
    EXPORT_SEARCH: 'EXPORT_SEARCH',
    exportSearch: () => ({
        type: actions.EXPORT_SEARCH,

    }),

    ACTION_ERROR: 'ACTION_ERROR',
    driverError: (errMessage) => ({
        type: actions.ACTION_ERROR,
        payload: {
            errMessage
        }
    }),
    EXPORT_SUCCESS_RESULT: 'EXPORT_SUCCESS_RESULT',
    exportSearchSuccess: (docs) => ({
        type: actions.EXPORT_SUCCESS_RESULT,
        docs,

    }),
    driverSearchError: () => ({
        type: actions.DRIVER_ERROR_RESULT
    }),
}
export default actions;