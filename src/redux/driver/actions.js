export const actions = {
    SHOW_MODAL: 'SHOW_MODAL',
    showModal: (isShow, actionName, rowData = null) => ({
        type: actions.SHOW_MODAL,
        payload: {
            isShow,
            actionName,
            rowData
        }
    }),
    DRIVER_SHOW_MODAL: 'DRIVER_SHOW_MODAL',
    driveShowModal: (isShow, actionName, rowData = null) => ({
        type: actions.DRIVER_SHOW_MODAL,
        payload: {
            isShow,
            actionName,
            rowData
        }
    }),
    ACTION_CREATE_DRIVER: 'ACTION_CREATE_DRIVER',
    driverCreate: (data) => ({
        type: actions.ACTION_CREATE_DRIVER,
        payload: {
            data,
        }
    }),
    DRIVER_SEARCH: 'DRIVER_SEARCH',
    DRIVER_SUCCESS_RESULT: 'DRIVER_SUCCESS_RESULT',
    DRIVER_ERROR_RESULT: 'DRIVER_ERROR_RESULT',
    ACTION_ORGANIZATION_DRIVER: 'ACTION_ORGANIZATION_DRIVER',
    driver_organization: (docs, total, pages) => ({
        type: actions.ACTION_ORGANIZATION_DRIVER,
        docs,
        total,
        pages
    }),
    driverSearch: ({ query = { code: "", fullName: "", birthday: "", CMND: "", driversLicenseClass: "", licenseExpireAt: "", doanhnghiep: "", driversLicenseCode: "", status: "", rating: "",type:"" }, searchInput = '', pageSize = 5, pages = 0, tabId = '1' }) => ({
        type: actions.DRIVER_SEARCH,
        payload: {
            searchInput,
            pages,
            pageSize,
            order: 'createdAt DESC',
            tabId,
            query,
            param: {
                pageSize: pageSize,
                pages: pages,
                query,
                code:query.code,
                fullName:query.fullName,
                birthday:query.birthday,
                CMND:query.CMND,
                driversLicenseClass:query.driversLicenseClass,
                licenseExpireAt:query.licenseExpireAt,
                doanhnghiep:query.doanhnghiep,
                driversLicenseCode:query.driversLicenseCode,
                status:query.status,
                rating:query.rating,
                type:query.type,
                // where: `code iLike ${query.code},fullName iLike ${query.fullName},birthday eq ${query.birthday},CMND iLike ${query.CMND},driversLicenseClass eq ${query.driversLicenseClass},driversLicenseCode iLike ${query.driversLicenseCode},licenseExpireAt eq ${query.licenseExpireAt},status eq ${query.status},rating eq ${query.rating}`,
                order: 'createdAt DESC',
            },
        }
    }),

    ACTION_SAVE_DRIVER: 'ACTION_SAVE_DRIVER',
    driverSaveDriver: (data) => ({
        type: actions.ACTION_SAVE_DRIVER,
        payload: {
            data
        }
    }),
    ACTION_DELETE_DRIVER: 'ACTION_DELETE_DRIVER',
    driverDelete: (data) => ({
        type: actions.ACTION_DELETE_DRIVER,
        payload: {
            data
        }
    }),
    ACTION_ERROR: 'ACTION_ERROR',
    driverError: (errMessage) => ({
        type: actions.ACTION_ERROR,
        payload: {
            errMessage
        }
    }),
    driverSearchSuccess: (docs, total, pages, pageSize, searchInput, param, status, tabId) => ({
        type: actions.DRIVER_SUCCESS_RESULT,
        docs,
        total,
        pages,
        pageSize,
        searchInput,
        param,
        status,
        tabId
    }),
    driverSearchError: () => ({
        type: actions.DRIVER_ERROR_RESULT
    }),
    DIVER_PARNER_SEARCH: 'DIVER_PARNER_SEARCH',
    driverParnerSearch: ({ queryType = { code: "", fullName: "", birthday: "", CMND: "", driversLicenseClass: "", licenseExpireAt: "", doanhnghiep: "", driversLicenseCode: "", status: "", rating: "", organizationId: "",typePartner:"" }, searchInput = '', pageSize = 5, pages = 0, tabId = '2' }) => ({
        type: actions.DIVER_PARNER_SEARCH,
        payload: {
            searchInput,
            pages,
            pageSize,
            queryType,
            order: 'createdAt DESC',
            include: 'refOrganization',
            param: {
                pageSize: pageSize,
                pages: pages,
                queryType,
                code:queryType.code,
                fullName:queryType.fullName,
                birthday:queryType.birthday,
                CMND:queryType.CMND,
                driversLicenseClass:queryType.driversLicenseClass,
                licenseExpireAt:queryType.licenseExpireAt,
                doanhnghiep:queryType.doanhnghiep,
                driversLicenseCodeType:queryType.driversLicenseCode,
                status:queryType.status,
                organizationId:queryType.organizationId,
                rating:queryType.rating,
                typePartner:queryType.typePartner,
                // where: `code iLike ${queryType.code},fullName iLike ${queryType.fullName},birthday eq ${queryType.birthday},CMND iLike ${queryType.CMND},driversLicenseClass eq ${queryType.driversLicenseClass},driversLicenseCode iLike ${queryType.driversLicenseCode},licenseExpireAt eq ${queryType.licenseExpireAt},status eq ${queryType.status},rating eq ${queryType.rating},organizationId eq ${queryType.organizationId}`,
                order: 'createdAt DESC',
                include: 'refOrganization',
            },
            tabId
        }
    }),
    DRIVER_PARNER_SUCCESS: 'DRIVER_PARNER_SUCCESS',
    driverParnerSuccess: (docs, total, pages, pageSize, searchInput, param, tabId) => ({
        type: actions.DRIVER_PARNER_SUCCESS,
        docs,
        total,
        pages,
        pageSize,
        searchInput,
        param,
        tabId
    }),
    DRIVER_PARNER_SHOW_MODAL: 'DRIVER_PARNER_SHOW_MODAL',
    driverParnerShowModal: (isShowType, actionName, rowDataType = null) => ({
        type: actions.DRIVER_PARNER_SHOW_MODAL,
        payload: {
            isShowType,
            actionName,
            rowDataType
        }
    }),
    DRIVER_PARNER_CREATE: 'DRIVER_PARNER_CREATE',
    driverParnerCreate: (data) => ({
        type: actions.DRIVER_PARNER_CREATE,
        payload: {
            data
        }
    }),
    DRIVER_PARNER_SAVE: 'DRIVER_PARNER_SAVE',
    driverParnerSaveDriver: (data) => ({
        type: actions.DRIVER_PARNER_SAVE,
        payload: {
            data
        }
    }),
    DRIVER_PARNER_DELETE: 'DRIVER_PARNER_DELETE',
    driverParnerDelete: (data) => ({
        type: actions.DRIVER_PARNER_DELETE,
        payload: {
            data
        }
    }),
    onPageChange: (searchInput, pageSize, pages, query, tabId) => ({
        type: actions.DRIVER_SEARCH,
        payload: {
            searchInput,
            pageSize,
            pages,
            query,
            tabId,
            param: { query: query, pageSize: pageSize, pages: pages, order: 'createdAt DESC', code:query.code,
            fullName:query.fullName,
            birthday:query.birthday,
            CMND:query.CMND,
            driversLicenseClass:query.driversLicenseClass,
            licenseExpireAt:query.licenseExpireAt,
            doanhnghiep:query.doanhnghiep,
            driversLicenseCode:query.driversLicenseCode,
            status:query.status,
            rating:query.rating, 
            type:query.type, 
            searchInput: searchInput }
        }
    }),
    onPageChangeParner: (searchInput, pageSize, pages, queryType, tabId) => ({
        type: actions.DIVER_PARNER_SEARCH,
        payload: {
            searchInput,
            pageSize,
            pages,
            queryType,
            tabId,
            param: { queryType: queryType, pageSize: pageSize, pages: pages, order: 'createdAt DESC', code:queryType.code,
            fullName:queryType.fullName,
            birthday:queryType.birthday,
            CMND:queryType.CMND,
            driversLicenseClass:queryType.driversLicenseClass,
            licenseExpireAt:queryType.licenseExpireAt,
            doanhnghiep:queryType.doanhnghiep,
            driversLicenseCodeType:queryType.driversLicenseCode,
            status:queryType.status,
            organizationId:queryType.organizationId,
            rating:queryType.rating,
            typePartner:queryType.typePartner,
             searchInput: searchInput }
        }
    }),

    DRIVER_CHANGE_TAB: 'DRIVER_CHANGE_TAB',
    changeTab: (tabId) => ({
        type: actions.DRIVER_CHANGE_TAB,
        payload: {
            tabId
        }
    }),
};
// export const getListOrganizationCustomer = (param,callback) => {
//     return (dispatch, getState) => {
//         const {products, productQuantity} = getState().Ecommerce.toJS();
//         const objectID = product.objectID;
//         productQuantity.push({objectID, quantity: 1});
//         products[objectID] = product;
//         dispatch({
//             type: ecommerceActions.ADD_TO_CART,
//             products,
//             productQuantity
//         });
//     };
// };