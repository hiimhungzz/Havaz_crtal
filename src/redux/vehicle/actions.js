export const actions = {
    SHOW_MODAL: "SHOW_MODAL",
    showModal: (isShow, actionName, rowData = null) => ({
        type: actions.SHOW_MODAL,
        payload: {
            isShow,
            actionName,
            rowData
        }
    }),
    VEHICLE_SHOW_MODAL: "VEHICLE_SHOW_MODAL",
    vehicleShowModal: (isShow, actionName, rowData = null, dataCheckName) => ({
        type: actions.VEHICLE_SHOW_MODAL,
        payload: {
            isShow,
            actionName,
            rowData,
            dataCheckName
        }
    }),
    VEHICLE_TYPE_SHOW_MODAL: "VEHICLE_TYPE_SHOW_MODAL",
    vehicleTypeShowModal: (isShow, actionName, rowData = null) => ({
        type: actions.VEHICLE_TYPE_SHOW_MODAL,
        payload: {
            isShow,
            actionName,
            rowData
        }
    }),
    VEHICLE_SEARCH: "VEHICLE_SEARCH",
    VEHICLE_SUCCESS_RESULT: "VEHICLE_SUCCESS_RESULT",
    VEHICLE_ERROR_RESULT: "VEHICLE_ERROR_RESULT",
    vehicleSearch: ({
        query = {
            code: "",
            vehicleType: "",
            seats: "",
            chassisNo: "",
            manufactureYear: "",
            plate: "",
            engineNo: ""
        },
        searchInput = "",
        pageSize = 5,
        pages = 0,
        tabId = "1"
    }) => ({
        type: actions.VEHICLE_SEARCH,
        payload: {
            searchInput,
            pages: pages,
            pageSize,
            tabId,
            query,
            param: {
                pageSize: pageSize,
                pages: pages,
                query,
                searchInput: searchInput,
                include: "refVehicleType,refOwner,refDriver,refOrganization",
                order: "createdAt DESC",
                where: `code iLike ${query.code},vehicleType eq ${query.vehicleType},seats eq ${query.seats},chassisNo iLike ${query.chassisNo},manufactureYear eq ${query.manufactureYear},plate iLike ${query.plate},engineNo iLike ${query.engineNo}`
            }
        }
    }),
    ACTION_VEHICLE_CREATE: "ACTION_VEHICLE_CREATE",
    vehicleCreate: data => ({
        type: actions.ACTION_VEHICLE_CREATE,
        payload: {
            data
        }
    }),
  
    ACTION_VEHICLE_SAVE: "ACTION_VEHICLE_SAVE",
    vehicleSave: (data, func) => ({
        type: actions.ACTION_VEHICLE_SAVE,
        payload: {
            data,
            func
        }
    }),
    ACTION_VEHICLE_DELETE: "ACTION_VEHICLE_DELETE",
    vehicleDelte: data => ({
        type: actions.ACTION_VEHICLE_DELETE,
        payload: {
            data
        }
    }),
    vehicleSearchSuccess: (docs, total, pages, pageSize, tabId, param) => ({
        type: actions.VEHICLE_SUCCESS_RESULT,
        docs,
        total,
        pages,
        pageSize,
        tabId,
        param
    }),
    VIHECLE_TYPE_CREATE: "VIHECLE_TYPE_CREATE",
    vehicleCreateType: data => ({
        type: actions.VIHECLE_TYPE_CREATE,
        payload: {
            data
        }
    }),
    VIHECLE_TYPE_SAVE: "VIHECLE_TYPE_SAVE",
    vehicleTypeSave: data => ({
        type: actions.VIHECLE_TYPE_SAVE,
        payload: {
            data
        }
    }),
    VEHICLE_TYPE_DELETE: "VEHICLE_TYPE_DELETE",
    vehicleTypeDelete: data => ({
        type: actions.VEHICLE_TYPE_DELETE,
        payload: {
            data
        }
    }),
    vehicleSearchError: () => ({
        type: actions.VEHICLE_ERROR_RESULT
    }),
    VEHICLE_TYPE_SEARCH: "VEHICLE_TYPE_SEARCH",
    VEHICLE_TYPE_SUCCESS_RESULT: "VEHICLE_TYPE_SUCCESS_RESULT",
    VEHICLE_TYPE_ERROR_RESULT: "VEHICLE_TYPE_ERROR_RESULT",
    vehicleTypeSearch: ({
        queryType = { type: "", seats: "", name: "" },
        pageSize = 5,
        pages = 0,
        tabId = "2"
    }) => ({
        type: actions.VEHICLE_TYPE_SEARCH,
        payload: {
            pageSize,
            pages,
            tabId,
            queryType,
            param: {
                pageSize: pageSize,
                pages: pages,
                queryType,
                where: `type eq ${queryType.type},seats eq ${queryType.seats},name iLike ${queryType.name}`,
                order: "createdAt DESC"
            }
        }
    }),
    vehicleTypeSearchSuccess: (docs, total, pages, pageSize, tabId, param) => ({
        type: actions.VEHICLE_TYPE_SUCCESS_RESULT,
        docs,
        total,
        pages,
        pageSize,
        tabId,
        param
    }),
    //vehicle tem
    VEHICLE_FILL_TEM: "VEHICLE_FILL_TEM",
    vehicleFillTem: uuid => ({
        type: actions.VEHICLE_FILL_TEM,
        payload: {
            uuid
        }
    }),
    VEHICLE_FILL_TEM_SUCCESS: "VEHICLE_FILL_TEM_SUCCESS",
    vehicleFillTemSuccess: listVehicleFillTem => ({
        type: actions.VEHICLE_FILL_TEM_SUCCESS,
        payload: {
            listVehicleFillTem
        }
    }),
    VEHICLE_TEM_SHOW_MODAL: "VEHICLE_TEM_SHOW_MODAL",
    vehicleTemShowModal: (isShow, actionName, rowData = null) => ({
        type: actions.VEHICLE_TEM_SHOW_MODAL,
        payload: {
            isShow,
            actionName,
            rowData
        }
    }),
    VIHECLE_TEM_CREATE: "VIHECLE_TEM_CREATE",
    vehicleCreateTem: data => ({
        type: actions.VIHECLE_TEM_CREATE,
        payload: {
            data
        }
    }),
    VIHECLE_TEM_SAVE: "VIHECLE_TEM_SAVE",
    vehicleSaveTem: data => ({
        type: actions.VIHECLE_TEM_SAVE,
        payload: {
            data
        }
    }),
    VEHICLE_TEM_DELETE: "VEHICLE_TEM_DELETE",
    vehicleTemDelete: data => ({
        type: actions.VEHICLE_TEM_DELETE,
        payload: {
            data
        }
    }),
    VEHICLE_TEM_SEARCH: "VEHICLE_TEM_SEARCH",
    vehicleTemSearch: ({
        queryTem = { vehicleId: "", startReg: "", endReg: "", startEx: "", endEx: "" },
        pageSize = 5,
        pages = 0,
        tabId = "3"
    }) => ({
        type: actions.VEHICLE_TEM_SEARCH,
        payload: {
            pageSize,
            pages,
            tabId,
            queryTem,
            param: {
                pageSize: pageSize,
                pages: pages,
                vehicleId: queryTem.vehicleId,
                startReg: queryTem.startReg,
                endReg: queryTem.endReg,
                startEx: queryTem.startEx,
                endEx: queryTem.endEx,
                queryTem: queryTem
            }
        }
    }),
    VEHICLE_TEM_SUCCESS_RESULT: "VEHICLE_TEM_SUCCESS_RESULT",
    vehicleTemSearchSuccess: (docs, total, pages, pageSize, tabId, param) => ({
        type: actions.VEHICLE_TEM_SUCCESS_RESULT,
        docs,
        total,
        pages,
        pageSize,
        tabId,
        param
    }),
    // Vehicle Class
    VEHICLE_CLASS_SHOW_MODAL: "VEHICLE_CLASS_SHOW_MODAL",
    vehicleClassShowModal: (isShow, actionName, rowData = null) => ({
        type: actions.VEHICLE_CLASS_SHOW_MODAL,
        payload: {
            isShow,
            actionName,
            rowData
        }
    }),
    VIHECLE_CLASS_CREATE: "VIHECLE_CLASS_CREATE",
    vehicleCreateClass: data => ({
        type: actions.VIHECLE_CLASS_CREATE,
        payload: {
            data
        }
    }),
    VIHECLE_CLASS_SAVE: "VIHECLE_CLASS_SAVE",
    vehicleSaveClass: data => ({
        type: actions.VIHECLE_CLASS_SAVE,
        payload: {
            data
        }
    }),
    VEHICLE_CLASS_DELETE: "VEHICLE_CLASS_DELETE",
    vehicleClassDelete: data => ({
        type: actions.VEHICLE_CLASS_DELETE,
        payload: {
            data
        }
    }),
    VEHICLE_CLASS_SEARCH: "VEHICLE_CLASS_SEARCH",
    vehicleClassSearch: ({
        queryClass = { name: "" },
        pageSize = 5,
        pages = 0,
        tabId = "4"
    }) => ({
        type: actions.VEHICLE_CLASS_SEARCH,
        payload: {
            pageSize,
            pages,
            tabId,
            queryClass,
            param: {
                pageSize: pageSize,
                pages: pages,
                name: queryClass.name,
                queryClass: queryClass
            }
        }
    }),
    VEHICLE_CLASS_SUCCESS_RESULT: "VEHICLE_CLASS_SUCCESS_RESULT",
    vehicleClassSearchSuccess: (docs, total, pages, pageSize, tabId, param) => ({
        type: actions.VEHICLE_CLASS_SUCCESS_RESULT,
        docs,
        total,
        pages,
        pageSize,
        tabId,
        param
    }),

    vehicleTypeSearchError: () => ({
        type: actions.VEHICLE_TYPE_ERROR_RESULT
    }),
    onPageChange: (searchInput, pageSize, pages, tabId, query) => ({
        type: tabId === "1" ? actions.VEHICLE_SEARCH : actions.VEHICLE_TYPE_SEARCH,
        payload: {
            searchInput,
            pageSize,
            pages,
            tabId,
            query,
            param: {
                pageSize: pageSize,
                pages: pages,
                query: query,
                aa: "sdsdsd",
                include: "refVehicleType,refOwner,refDriver,refOrganization",
                order: "createdAt DESC",
                where: `code iLike ${query.code},vehicleType eq ${query.vehicleType},seats eq ${query.seats},chassisNo iLike ${query.chassisNo},manufactureYear eq ${query.manufactureYear},plate iLike ${query.plate},engineNo iLike ${query.engineNo}`
            }
        }
    }),
    onPageChangeType: (searchInput, pageSize, pages, tabId, queryType) => ({
        type: tabId === "2" ? actions.VEHICLE_TYPE_SEARCH : actions.VEHICLE_SEARCH,
        payload: {
            searchInput,
            pageSize,
            pages,
            tabId,
            queryType,
            param: {
                pageSize: pageSize,
                pages: pages,
                queryType: queryType,
                where: `type eq ${queryType.type},seats eq ${queryType.seats},name iLike ${queryType.name}`,
                order: "createdAt DESC"
            }
        }
    }),
    onPageChangeTem: (searchInput, pageSize, pages, tabId, queryTem) => ({
        type: tabId === "3" ? actions.VEHICLE_TEM_SEARCH : "",
        payload: {
            searchInput,
            pageSize,
            pages,
            tabId,
            queryTem,
            param: {
                pageSize: pageSize,
                pages: pages,
                queryTem: queryTem,
                vehicleId: queryTem.vehicleId,
                startReg: queryTem.startReg,
                endReg: queryTem.endReg,
                startEx: queryTem.startEx,
                endEx: queryTem.endEx
            }
        }
    }),
    onPageChangeClass: (searchInput, pageSize, pages, tabId, queryClass) => ({
        type: tabId === "4" ? actions.VEHICLE_CLASS_SEARCH : "",
        payload: {
            searchInput,
            pageSize,
            pages,
            tabId,
            queryClass,
            param: {
                pageSize: pageSize,
                pages: pages,
                queryClass: queryClass,
                name: queryClass.name,
            }
        }
    }),
    VEHICLE_CHANGE_TAB: "VEHICLE_CHANGE_TAB",
    changeTab: tabId => ({
        type: actions.VEHICLE_CHANGE_TAB,
        payload: {
            tabId
        }
    }),
    
};