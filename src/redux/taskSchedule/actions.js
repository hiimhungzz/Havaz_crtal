export const actions = {
  TASK_SCHEDULE_SHOW_MODAL: "TASK_SCHEDULE_SHOW_MODAL",
  taskSchedule_ShowModal: (isShow, actionName, rowData = null) => ({
    type: actions.TASK_SCHEDULE_SHOW_MODAL,
    payload: {
      isShow,
      actionName,
      rowData
    }
  }),
  ACTION_DELETE_TASK_SCHEDULE: "ACTION_DELETE_TASK_SCHEDULE",
  deleteTaskSchudule: data => ({
    type: actions.ACTION_DELETE_TASK_SCHEDULE,
    payload: {
      data
    }
  }),
  TASK_SCHEDULE_SEARCH: "TASK_SCHEDULE_SEARCH",
  TASK_SCHEDULE_SUCCESS_RESULT: "TASK_SCHEDULE_SUCCESS_RESULT",
  DRIVER_ERROR_RESULT: "DRIVER_ERROR_RESULT",

  taskSchedule_Search: ({
    query = {
      month: "",
      year: "",
      phoneDriver: "",
      codeDriver: "",
      nameDriver: "",
      driverId: "",
      date: "",
      categorySurvey: "",
      organizationId: ""
    },
    searchInput = "",
    pageSize = 5,
    pages = 0,
    tabId = "1"
  }) => ({
    type: actions.TASK_SCHEDULE_SEARCH,
    payload: {
      searchInput,
      pages,
      pageSize,
      order: "createdAt DESC",
      query,
      param: {
        pageSize: pageSize,
        pages: pages,
        month: query.month,
        date: query.date,
        year: query.year,
        codeDriver: query.codeDriver,
        phoneDriver: query.phoneDriver,
        nameDriver: query.nameDriver,
        driverId: query.driverId,
        order: "createdAt DESC",
        categorySurvey: query.categorySurvey,
        organizationId: query.organizationId
      }
    }
  }),

  ACTION_SAVE_SCHEDULE: "ACTION_SAVE_SCHEDULE",
  saveSchudule: data => ({
    type: actions.ACTION_SAVE_SCHEDULE,
    payload: {
      data
    }
  }),
  ACTION_COMFIRM_SCHEDULE: "ACTION_COMFIRM_SCHEDULE",
  comfirmchudule: data => ({
    type: actions.ACTION_COMFIRM_SCHEDULE,
    payload: {
      data
    }
  }),
  ACTION_SAVE_SABBATICAL_SCHEDULE: "ACTION_SAVE_SABBATICAL_SCHEDULE",
  saveSabbaticalChudule: data => ({
    type: actions.ACTION_SAVE_SABBATICAL_SCHEDULE,
    payload: {
      data
    }
  }),
  ACTION_DELETE_DRIVER: "ACTION_DELETE_DRIVER",
  driverDelete: data => ({
    type: actions.ACTION_DELETE_DRIVER,
    payload: {
      data
    }
  }),
  ACTION_ERROR: "ACTION_ERROR",
  taskSheduleError: errMessage => ({
    type: actions.ACTION_ERROR,
    payload: {
      errMessage
    }
  }),
  scheduleSearchSuccess: (
    docs,
    headers,
    total,
    pages,
    pageSize,
    searchInput,
    param,
    status,
    query
  ) => ({
    type: actions.TASK_SCHEDULE_SUCCESS_RESULT,
    docs,
    headers,
    total,
    pages,
    pageSize,
    searchInput,
    param,
    status,
    query
  }),

  onPageChange: (searchInput, pageSize, pages, query) => ({
    type: actions.TASK_SCHEDULE_SEARCH,
    payload: {
      searchInput,
      pageSize,
      pages,
      query,
      param: {
        date: query.date,
        month: query.month,
        year: query.year,
        codeDriver: query.codeDriver,
        phoneDriver: query.phoneDriver,
        nameDriver: query.nameDriver,
        driverId: query.driverId,
        pageSize: pageSize,
        pages: pages,
        order: "createdAt DESC",
        categorySurvey: query.categorySurvey,
        organizationId: query.organizationId
      }
    }
  }),

  DRIVER_CHANGE_TAB: "DRIVER_CHANGE_TAB",
  changeTab: tabId => ({
    type: actions.DRIVER_CHANGE_TAB,
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
