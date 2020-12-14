export const actions = {
    SHOW_MODAL: "SHOW_MODAL",
    showModalCategoryUser: (isShow, actionName, rowData = null) => ({
      type: actions.SHOW_MODAL,
      payload: {
        isShow,
        actionName,
        rowData
      }
    }),
    CATEGORY_USER_SEARCH: "CATEGORY_USER_SEARCH",
    CATEGORY_USER_SUCCESS_RESULT: "CATEGORY_USER_SUCCESS_RESULT",
    category_User_Search: ({
      query = { name: "" },
      pageSize = 5,
      pages = 0,
      tabId = "1"
    }) => ({
      type: actions.CATEGORY_USER_SEARCH,
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
    categoryUserSuccess: (docs, total, pages, pageSize, tabId, query, param) => ({
      type: actions.CATEGORY_USER_SUCCESS_RESULT,
      docs,
      total,
      pages,
      pageSize,
      tabId,
      query,
      param
    }),
    CREATE_CATEGORY_USER: "CREATE_CATEGORY_USER",
    createCategoryUser: data => ({
      type: actions.CREATE_CATEGORY_USER,
      payload: {
        data
      }
    }),
    SAVE_CATEGORY_USER: "SAVE_CATEGORY_USER",
    saveCategoryUser: data => ({
      type: actions.SAVE_CATEGORY_USER,
      payload: {
        data
      }
    }),
    DELETE_CATEGORY_USER: "DELETE_CATEGORY_USER",
    deleteCategoryUser: data => ({
      type: actions.DELETE_CATEGORY_USER,
      payload: {
        data
      }
    }),
  
    onPageChange: (searchInput, pageSize, pages, tabId, query) => ({
      type: tabId == "1" ? actions.CATEGORY_USER_SEARCH : "",
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
  
    //category Ctv
    SHOW_MODAL_CTV: "SHOW_MODAL_CTV",
    showModalCategoryCtv: (isShowCtv, actionName, rowData = null) => ({
      type: actions.SHOW_MODAL_CTV,
      payload: {
        isShowCtv,
        actionName,
        rowData
      }
    }),
    CATEGORY_CTV_SEARCH: "CATEGORY_CTV_SEARCH",
    CATEGORY_CTV_SUCCESS_RESULT: "CATEGORY_CTV_SUCCESS_RESULT",
    category_Ctv_Search: ({
      queryCtv = { name: "" },
      pageSize = 5,
      pages = 0,
      tabId = "2"
    }) => ({
      type: actions.CATEGORY_CTV_SEARCH,
      payload: {
        pages,
        pageSize,
        tabId,
        queryCtv,
        param: {
          pageSize: pageSize,
          pages: pages,
          name: queryCtv.name
        }
      }
    }),
  
    categoryCtvSuccess: (
      docs,
      totalCtv,
      pagesCtv,
      pageSizeCtv,
      tabId,
      queryCtv,
      param
    ) => ({
      type: actions.CATEGORY_CTV_SUCCESS_RESULT,
      docs,
      totalCtv,
      pagesCtv,
      pageSizeCtv,
      tabId,
      queryCtv,
      param
    }),
    CREATE_CATEGORY_CTV: "CREATE_CATEGORY_CTV",
    createCategoryCtv: data => ({
      type: actions.CREATE_CATEGORY_CTV,
      payload: {
        data
      }
    }),
    SAVE_CATEGORY_CTV: "SAVE_CATEGORY_CTV",
    saveCategoryCtv: data => ({
      type: actions.SAVE_CATEGORY_CTV,
      payload: {
        data
      }
    }),
    DELETE_CATEGORY_CTV: "DELETE_CATEGORY_CTV",
    deleteCategoryCtv: data => ({
      type: actions.DELETE_CATEGORY_CTV,
      payload: {
        data
      }
    }),
    onPageChangeCtv: (searchInput, pageSizeCtv, pagesCtv, tabId, queryCtv) => ({
      type: tabId == "2" ? actions.CATEGORY_CTV_SEARCH : "",
      payload: {
        searchInput,
        pageSizeCtv,
        pagesCtv,
        queryCtv,
        tabId,
        param: {
          name: queryCtv.name,
          pageSize: pageSizeCtv,
          pages: pagesCtv,
          order: "createdAt DESC"
        }
      }
    }),
    //category partner
    SHOW_MODAL_PARTNER: "SHOW_MODAL_PARTNER",
    showModalCategoryPartner: (isShowPartner, actionName, rowData = null) => ({
      type: actions.SHOW_MODAL_PARTNER,
      payload: {
        isShowPartner,
        actionName,
        rowData
      }
    }),
    CATEGORY_PARTNER_SEARCH: "CATEGORY_PARTNER_SEARCH",
    CATEGORY_PARTNER_SUCCESS_RESULT: "CATEGORY_PARTNER_SUCCESS_RESULT",
    category_Partner_Search: ({
      queryPartner = { name: "" },
      pageSize = 5,
      pages = 0,
      tabId = "3"
    }) => ({
      type: actions.CATEGORY_PARTNER_SEARCH,
      payload: {
        pages,
        pageSize,
        tabId,
        queryPartner,
        param: {
          pageSize: pageSize,
          pages: pages,
          name: queryPartner.name
        }
      }
    }),
  
    categoryPartnerSuccess: (
      docs,
      totalPartner,
      pagesPartner,
      pageSizePartner,
      tabId,
      queryPartner,
      param
    ) => ({
      type: actions.CATEGORY_PARTNER_SUCCESS_RESULT,
      docs,
      totalPartner,
      pagesPartner,
      pageSizePartner,
      tabId,
      queryPartner,
      param
    }),
    CREATE_CATEGORY_PARTNER: "CREATE_CATEGORY_PARTNER",
    createCategoryPartner: data => ({
      type: actions.CREATE_CATEGORY_PARTNER,
      payload: {
        data
      }
    }),
    SAVE_CATEGORY_PARTNER: "SAVE_CATEGORY_PARTNER",
    saveCategoryPartner: data => ({
      type: actions.SAVE_CATEGORY_PARTNER,
      payload: {
        data
      }
    }),
    DELETE_CATEGORY_PARTNER: "DELETE_CATEGORY_PARTNER",
    deleteCategoryPartner: data => ({
      type: actions.DELETE_CATEGORY_PARTNER,
      payload: {
        data
      }
    }),
  
    onPageChangePartner: (
      searchInput,
      pageSizePartner,
      pagesPartner,
      tabId,
      queryPartner
    ) => ({
      type: tabId == "3" ? actions.CATEGORY_PARTNER_SEARCH : "",
      payload: {
        searchInput,
        pageSizePartner,
        pagesPartner,
        queryPartner,
        tabId,
        param: {
          name: queryPartner.name,
          pageSize: pageSizePartner,
          pages: pagesPartner,
          order: "createdAt DESC"
        }
      }
    }),
    //category vehicle
    SHOW_MODAL_VEHICLE: "SHOW_MODAL_VEHICLE",
    showModalCategoryVehicle: (isShowVehicle, actionName, rowData = null) => ({
      type: actions.SHOW_MODAL_VEHICLE,
      payload: {
        isShowVehicle,
        actionName,
        rowData
      }
    }),
    CATEGORY_VEHICLE_SEARCH: "CATEGORY_VEHICLE_SEARCH",
    CATEGORY_VEHICLE_SUCCESS_RESULT: "CATEGORY_VEHICLE_SUCCESS_RESULT",
    category_Vehicle_Search: ({
      queryVehicle = { name: "" },
      pageSize = 5,
      pages = 0,
      tabId = "4"
    }) => ({
      type: actions.CATEGORY_VEHICLE_SEARCH,
      payload: {
        pages,
        pageSize,
        tabId,
        queryVehicle,
        param: {
          pageSize: pageSize,
          pages: pages,
          name: queryVehicle.name
        }
      }
    }),
  
    categoryVehicleSuccess: (
      docs,
      totalVehicle,
      pagesVehicle,
      pageSizeVehicle,
      tabId,
      queryVehicle,
      param
    ) => ({
      type: actions.CATEGORY_VEHICLE_SUCCESS_RESULT,
      docs,
      totalVehicle,
      pagesVehicle,
      pageSizeVehicle,
      tabId,
      queryVehicle,
      param
    }),
    CREATE_CATEGORY_VEHICLE: "CREATE_CATEGORY_VEHICLE",
    createCategoryVehicle: data => ({
      type: actions.CREATE_CATEGORY_VEHICLE,
      payload: {
        data
      }
    }),
    SAVE_CATEGORY_VEHICLE: "SAVE_CATEGORY_VEHICLE",
    saveCategoryVehicle: data => ({
      type: actions.SAVE_CATEGORY_VEHICLE,
      payload: {
        data
      }
    }),
    DELETE_CATEGORY_VEHICLE: "DELETE_CATEGORY_VEHICLE",
    deleteCategoryVehicle: data => ({
      type: actions.DELETE_CATEGORY_VEHICLE,
      payload: {
        data
      }
    }),
  
    onPageChangeVehicle: (
      searchInput,
      pageSizeVehicle,
      pagesVehicle,
      tabId,
      queryVehicle
    ) => ({
      type: tabId == "4" ? actions.CATEGORY_VEHICLE_SEARCH : "",
      payload: {
        searchInput,
        pageSizeVehicle,
        pagesVehicle,
        queryVehicle,
        tabId,
        param: {
          name: queryVehicle.name,
          pageSize: pageSizeVehicle,
          pages: pagesVehicle,
          order: "createdAt DESC"
        }
      }
    }),
    CATEGORY_CHANGE_TAB: "CATEGORY_CHANGE_TAB",
    changeTab: tabId => ({
      type: actions.CATEGORY_CHANGE_TAB,
      payload: {
        tabId
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
  