export const actions = {
    CUSTOMER_SHOW_MODAL: 'CUSTOMER_SHOW_MODAL',
    showModal: ({
        isShow,
        actionName
    }) => ({
        type: actions.CUSTOMER_SHOW_MODAL,
        payload: {
            isShow,
            actionName
        }
    }),
    CUSTOMER_BROWSE_ORGANIZATION: 'CUSTOMER_BROWSE_ORGANIZATION',
    CUSTOMER_BROWSE_ORGANIZATION_SUCCESS: 'CUSTOMER_BROWSE_ORGANIZATION_SUCCESS',
    CUSTOMER_BROWSE_ORGANIZATION_ERROR: 'CUSTOMER_BROWSE_ORGANIZATION_ERROR',
    browseOrganization: ({
        searchInput = '',
        pageLimit = 5,
        currentPage = 0,
        orderBy = {
            createdAt: 1
        },
        query = {
            codes: "",
            nameOrAdress: "",
            phone: '',
            email: '',
            citys: [],
            status: [],
            startDate: '',
            endDate: '',
            taxCode: '',
        }
    }) => ({
        type: actions.CUSTOMER_BROWSE_ORGANIZATION,
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
    browseOrganizationSuccess: ({
        data,
        totalLength,
        param
    }) => ({
        type: actions.CUSTOMER_BROWSE_ORGANIZATION_SUCCESS,
        payload: {
            data,
            totalLength,
            param
        }
    }),
    browseOrganizationError: (errorMessage) => ({
        type: actions.CUSTOMER_BROWSE_ORGANIZATION_ERROR,
        payload: {
            errorMessage
        }
    }),

    CUSTOMER_READ_ORGANIZATION: 'CUSTOMER_READ_ORGANIZATION',
    CUSTOMER_READ_ORGANIZATION_SUCCESS: 'CUSTOMER_READ_ORGANIZATION_SUCCESS',
    CUSTOMER_READ_ORGANIZATION_ERROR: 'CUSTOMER_READ_ORGANIZATION_ERROR',
    readOrganization: ({
        param,
        actionName = '',
        filterDatetime,
    }) => ({
        type: actions.CUSTOMER_READ_ORGANIZATION,
        payload: {
            actionName,
            param,
            filterDatetime
        }
    }),
    readOrganizationSuccess: ({
        data
    }) => ({
        type: actions.CUSTOMER_READ_ORGANIZATION_SUCCESS,
        payload: {
            data
        }
    }),
    readOrganizationError: (errorMessage) => ({
        type: actions.CUSTOMER_READ_ORGANIZATION_ERROR,
        payload: {
            errorMessage
        }
    }),
    CUSTOMER_READ_PARTNER: 'CUSTOMER_READ_PARTNER',
    CUSTOMER_READ_PARTNER_SUCCESS: 'CUSTOMER_READ_PARTNER_SUCCESS',
    CUSTOMER_READ_PARTNER_ERROR: 'CUSTOMER_READ_PARTNER_ERROR',
    readPartner: ({
        param,
        filterDatetime,
    }) => ({
        type: actions.CUSTOMER_READ_PARTNER,
        payload: {
            param,
            filterDatetime,
        }
    }),
    readPartnerSuccess: ({
        data
    }) => ({
        type: actions.CUSTOMER_READ_PARTNER_SUCCESS,
        payload: {
            data
        }
    }),
    readPartnerError: (errorMessage) => ({
        type: actions.CUSTOMER_READ_PARTNER_ERROR,
        payload: {
            errorMessage
        }
    }),

    CUSTOMER_BROWSE_PARTNER: 'CUSTOMER_BROWSE_PARTNER',
    CUSTOMER_BROWSE_PARTNER_SUCCESS: 'CUSTOMER_BROWSE_PARTNER_SUCCESS',
    CUSTOMER_BROWSE_PARTNER_ERROR: 'CUSTOMER_BROWSE_PARTNER_ERROR',
    browsePartner: ({
        searchInput = '',
        pageLimit = 5,
        currentPage = 0,
        orderBy = {
            createdAt: 1
        },
        query = {
            userCode: "",
            fullnamePhoneEmail: "",
            organizationIds: [],
            rolesIds: [],
            status: []
        }
    }) => ({
        type: actions.CUSTOMER_BROWSE_PARTNER,
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
    browsePartnerSuccess: ({
        data,
        totalLength,
        param
    }) => ({
        type: actions.CUSTOMER_BROWSE_PARTNER_SUCCESS,
        payload: {
            data,
            totalLength,
            param
        }
    }),
    browsePartnerError: (errorMessage) => ({
        type: actions.CUSTOMER_BROWSE_PARTNER_ERROR,
        payload: {
            errorMessage
        }
    }),

    CUSTOMER_DELETE_ORGANIZATION: 'CUSTOMER_DELETE_ORGANIZATION',
    deleteOrganization: (param) => ({
        type: actions.CUSTOMER_DELETE_ORGANIZATION,
        payload: {
            param
        }
    }),
    CUSTOMER_DELETE_PARTNER: 'CUSTOMER_DELETE_PARTNER',
    deletePartner: (param) => ({
        type: actions.CUSTOMER_DELETE_PARTNER,
        payload: {
            param
        }
    }),

    COST_CUSTOMER_SEARCH: 'COST_CUSTOMER_SEARCH',
    COST_CUSTOMER_SUCCESS_RESULT: 'COST_CUSTOMER_SUCCESS_RESULT',
    COST_CUSTOMER_ERROR_RESULT: 'COST_CUSTOMER_ERROR_RESULT',
    costCustomerSearch: (uuid, filterDatetime) => ({
        type: actions.COST_CUSTOMER_SEARCH,
        payload: {
            param: {
                uuid,
                filterDatetime
            }
        }
    }),
    costCustomerSearchSuccess: (data) => ({
        type: actions.COST_CUSTOMER_SUCCESS_RESULT,
        payload: {
            data
        }

    }),
    costCustomerSearchError: () => ({
        type: actions.COST_CUSTOMER_ERROR_RESULT
    }),
    CUSTOMER_ADD_ORGANIZATION: 'CUSTOMER_ADD_ORGANIZATION',
    addOrganization: (data) => ({
        type: actions.CUSTOMER_ADD_ORGANIZATION,
        payload: {
            data
        }
    }),
    CUSTOMER_ADD_PARTNER: 'CUSTOMER_ADD_PARTNER',
    addPartner: (data) => ({
        type: actions.CUSTOMER_ADD_PARTNER,
        payload: {
            data
        }
    }),
    CUSTOMER_EDIT_ORGANIZATION: 'CUSTOMER_EDIT_ORGANIZATION',
    editOrganization: (data) => ({
        type: actions.CUSTOMER_EDIT_ORGANIZATION,
        payload: {
            data
        }
    }),
    CUSTOMER_EDIT_PARTNER: 'CUSTOMER_EDIT_PARTNER',
    editPartner: (data) => ({
        type: actions.CUSTOMER_EDIT_PARTNER,
        payload: {
            data
        }
    }),
    SAVE_CUSTOMER_ROUTE_COST_PER: 'SAVE_CUSTOMER_ROUTE_COST_PER',
    saveCustomerRouteCostPer: (param) => ({
        type: actions.SAVE_CUSTOMER_ROUTE_COST_PER,
        payload: {
            param
        }
    }),
    SAVE_CUSTOMER_ROUTE_COST: 'SAVE_CUSTOMER_ROUTE_COST',
    saveCustomerRouteCost: (param) => ({
        type: actions.SAVE_CUSTOMER_ROUTE_COST,
        payload: {
            param
        }
    }),

    onPageChange: (param, tabId) => ({
        type: tabId === 1 ? actions.CUSTOMER_BROWSE_ORGANIZATION : actions.CUSTOMER_BROWSE_PARTNER,
        payload: {
            currentPage: param.currentPage,
            pageLimit: param.pageLimit,
            param
        }
    }),
    CUSTOMER_CHANGE_TAB: 'CUSTOMER_CHANGE_TAB',
    changeTab: (tabId) => ({
        type: actions.CUSTOMER_CHANGE_TAB,
        payload: {
            tabId
        }
    }),

    CITY_SEARCH: 'CITY_SEARCH',
    CITY_SUCCESS_RESULT: 'CITY_SUCCESS_RESULT',
    CITY_ERROR_RESULT: 'CITY_ERROR_RESULT',
    citySearch: (searchInput = '', pageLimit = 5) => ({
        type: actions.CITY_SEARCH,
        payload: {
            searchInput,
            currentPage: 0,
            pageLimit,
            param: {
                pageLimit: pageLimit,
                currentPage: 0,
                orderBy: {
                    name: 1
                },
                searchInput: searchInput
            }
        }
    }),
    citySearchSuccess: (data, totalLength, currentPage) => ({
        type: actions.CITY_SUCCESS_RESULT,
        data,
        totalLength,
        currentPage
    }),
    citySearchError: () => ({
        type: actions.CITY_ERROR_RESULT
    }),
};