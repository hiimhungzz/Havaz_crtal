export const actions = {
    BROWSE_READY_COMMAND: 'BROWSE_READY_COMMAND',
    BROWSE_READY_COMMAND_SUCCESS_RESULT: 'BROWSE_READY_COMMAND_SUCCESS_RESULT',
    BROWSE_READY_COMMAND_ERROR_RESULT: 'BROWSE_READY_COMMAND_ERROR_RESULT',
    browseReadyCommand: ({
        searchInput = '',
        pageLimit = 5,
        currentPage = 0,
        orderBy = {
            lastUpdatedAt: 1
        },
        query = {}
    }) => ({
        type: actions.BROWSE_READY_COMMAND,
        payload: {
            param: {
                pageLimit,
                currentPage,
                orderBy,
                query,
                searchInput
            }
        }
    }),
    browseReadyCommandSuccess: (data, param) => ({
        type: actions.BROWSE_READY_COMMAND_SUCCESS_RESULT,
        payload: {
            data,
            param
        }
    }),
    browseReadyCommandError: () => ({
        type: actions.BROWSE_READY_COMMAND_ERROR_RESULT
    }),
    onPageChange: ({
        searchInput = '',
        pageLimit = 5,
        currentPage = 0,
        orderBy = {
            lastUpdatedAt: 1
        },
        query = {}
    }) => ({
        type: actions.BROWSE_READY_COMMAND,
        payload: {
            param: {
                pageLimit,
                currentPage,
                orderBy,
                query,
                searchInput
            }
        }
    })
};