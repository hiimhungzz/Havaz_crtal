export const actions = {
    WARNING_DIRVER_SEARCH: "WARNING_DIRVER_SEARCH",
    WARNING_DIRVER_SUCCESS_RESULT: "WARNING_DIRVER_SUCCESS_RESULT",
    warning_driver_Search: ({
        query = { driverId: "" },
        pageSize = 5,
        pages = 0,
        tabId = "1"
    }) => ({
        type: actions.WARNING_DIRVER_SEARCH,
        payload: {
            pages,
            pageSize,
            tabId,
            query,
            param: {
                pageSize: pageSize,
                pages: pages,
                driverId: query.driverId
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
    warningDriverSuccess: (
        docs,
        total,
        pages,
        pageSize,
        tabId,
        query,
        param
    ) => ({
        type: actions.WARNING_DIRVER_SUCCESS_RESULT,
        docs,
        total,
        pages,
        pageSize,
        tabId,
        query,
        param
    }),

    onPageChange: (searchInput, pageSize, pages, tabId, query) => ({
        type: tabId == "1" ?
            actions.WARNING_DIRVER_SEARCH : actions.WARNING_VEHICLE_SEARCH,
        payload: {
            searchInput,
            pageSize,
            pages,
            query,
            tabId,
            param: {
                driverId: query.driverId,
                pageSize: pageSize,
                pages: pages,
                order: "createdAt DESC"
            }
        }
    }),

    // DRIVER_CHANGE_TAB: "DRIVER_CHANGE_TAB",
    // changeTab: tabId => ({
    //     type: actions.DRIVER_CHANGE_TAB,
    //     payload: {
    //         tabId
    //     }
    // }),
    //warning vehicle

    WARNING_VEHICLE_SEARCH: "WARNING_VEHICLE_SEARCH",
    WARNING_VEHICLE_SUCCESS_RESULT: "WARNING_VEHICLE_SUCCESS_RESULT",
    warning_Vehicle_Search: ({
        queryVehicle = { vehicleId: "" },
        pageSize = 5,
        pages = 0,
        tabId = "2"
    }) => ({
        type: actions.WARNING_VEHICLE_SEARCH,
        payload: {
            pages,
            pageSize,
            tabId,
            queryVehicle,
            param: {
                pageSize: pageSize,
                pages: pages,
                vehicleId: queryVehicle.vehicleId
            }
        }
    }),

    ACTION_ERROR: "ACTION_ERROR",
    taskSheduleError: errMessage => ({
        type: actions.ACTION_ERROR,
        payload: {
            errMessage
        }
    }),
    warningVehicleSuccess: (
        docs,
        total,
        pages,
        pageSize,
        tabId,
        queryVehicle,
        param
    ) => ({
        type: actions.WARNING_VEHICLE_SUCCESS_RESULT,
        docs,
        total,
        pages,
        pageSize,
        tabId,
        queryVehicle,
        param
    }),
    WARNING_CHANGE_TAB: "WARNING_CHANGE_TAB",
    changeTab: tabId => ({
        type: actions.WARNING_CHANGE_TAB,
        payload: {
            tabId
        }
    }),

    onPageChangeVehicle: (searchInput, pageSize, pages, tabId, queryVehicle) => ({
        type: tabId == "2" ?
            actions.WARNING_VEHICLE_SEARCH : actions.WARNING_DIRVER_SEARCH,
        payload: {
            searchInput,
            pageSize,
            pages,
            queryVehicle,
            tabId,
            param: {
                vehicleId: queryVehicle.vehicleId,
                pageSize: pageSize,
                pages: pages,
                order: "createdAt DESC"
            }
        }
    }),
    // warning tem


    WARNING_TEM_SEARCH: "WARNING_TEM_SEARCH",
    WARNING_TEM_SUCCESS_RESULT: "WARNING_TEM_SUCCESS_RESULT",
    warning_Tem_Search: ({
        queryTem = { vehicleId: "" },
        pageSize = 5,
        pages = 0,
        tabId = "3"
    }) => ({
        type: actions.WARNING_TEM_SEARCH,
        payload: {
            pages,
            pageSize,
            tabId,
            queryTem,
            param: {
                pageSize: pageSize,
                pages: pages,
                vehicleId: queryTem.vehicleId
            }
        }
    }),

    warningTemSuccess: (
        docs,
        total,
        pages,
        pageSize,
        tabId,
        queryTem,
        param
    ) => ({
        type: actions.WARNING_TEM_SUCCESS_RESULT,
        docs,
        total,
        pages,
        pageSize,
        tabId,
        queryTem,
        param
    }),

    onPageChangeTem: (searchInput, pageSize, pages, tabId, queryTem) => ({
        type: tabId == "3" ?
            actions.WARNING_TEM_SEARCH : "",
        payload: {
            searchInput,
            pageSize,
            pages,
            queryTem,
            tabId,
            param: {
                vehicleId: queryTem.vehicleId,
                pageSize: pageSize,
                pages: pages,
                order: "createdAt DESC"
            }
        }
    })
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
// };s
export default actions;