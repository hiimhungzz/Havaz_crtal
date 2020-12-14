import config from "../config";

export const API_BASE_URL = config.apiUrl;
export const REPORT_BASE_URL = config.reportUrl;
export const WEB_SOCKET_URL = config.baseUrl;
export const ACCESS_TOKEN = "accessToken";
export const CURRENT_USER = "currentUser";
export const ACTIVE_USER = "activeUser";
export const JWT_TOKEN = "jwtToken";
export const APP_PROFILE = "appProfile";
export const APP_PARAM = "appParam";
export const API_URI = {
  SEND_NOTIFICATION_DRIVER: "/scheduler/save-draft/send/create",
  GET_LIST_USER: "/users/list",
  MAKE_REPORT: "/make_report",
  GET_LIST_USER_FILTER: "/users/filter/list",
  GET_LIST_CITY: "/cities/list",
  BROWSE_DISTRICTS: "/districts/all",
  GET_LIST_ROLE: "/users/role/list",
  SAVE_ROUTE_COST: "/organizations/route/costs",
  SAVE_ROUTE_COST_PER: "/organizations/distance/costs",
  GET_LIST_COMPANY: "/customer/organizations/list",
  BROWSE_NO_TYPE_CUSTOMER: "/customer/list",
  GET_LIST_CUSTOMER_PERSONAL: "/customer/personal/list",
  GET_LIST_COMPANY_COST: "/organizations/route/costs/list",
  SCHEDULER_FILTER: "/scheduler/filter/list",
  BOOKING_TRIPS_PATH: "/booking/trips/path",
  AUTO_SCHEDULER_FILTER: "/scheduler/planning/create",
  SCHEDULER_UPDATE: "/scheduler/trip/update",
  BOOKING_STATUS_UPDATE: "/booking/status/update",
  GET_LIST_BOOKING: "/booking/list",
  BROWSE_TOUR: "/routes/tour/list",
  BROWSE_READY_COMMAND: "/readyCommand/list",
  BROWSE_COMMAND: "/scheduler/trip/list",
  COMMAND_SEND_MESSAGE: "/scheduler/send/notification/create",
  COMMAND_SEND_SMS: "/trip/guider/send-sms",
  BROWSE_BOOKING_STATUS: "/booking/stats/status",
  READ_BOOKING_ADDITIONAL: "/booking/additional/read",
  ADD_BOOKING_ADDITIONAL: "/booking/additional/create",
  DELETE_ORGANIZATION: "/partners/delete",
  GET_LIST_VEHICLE_TYPE: "/vehicles/type/list",
  GET_LIST_VEHICLE: "/vehicles/list",
  GET_LIST_DRIVER: "/users/vehicles/list",
  GET_LIST_ROUTE: "/routes/list",
  BROWSE_TOUR_ROUTE: "/routes/fixed-routes/tour/list",
  BROWSE_HIGH_WAY: "/routes/highway/list",
  ADD_HIGH_WAY: "/routes/highway/create",
  EDIT_HIGH_WAY: "/routes/highway/update",
  READ_HIGH_WAY: "/routes/highway/read",
  DELETE_HIGH_WAY: "/routes/highway/delete",
  VIEW_ROUTE: "/routes/read",
  GET_LIST_ROUTE_PLACE: "/routes/places/list",
  GET_LIST_ROUTE_BY_CUSTOMER_ID: "/routes/booking/list",
  BROWSE_ROUTE_BOOKING_LIST: "/routes/v1/booking/list",
  READ_ROUTE_BOOKING: "/routes/v1/booking/read",
  ROUTE_PATH_CREATE: "/routes/path/create",
  ACTION_GET_LIST_DRIVER: "/driver",
  ACTION_CREATE_DRIVER: "/driver",
  ACTION_SAVE_DRIVER: "/driver/:uuid",
  ACTION_DELETE_DRIVER: "/driver/:uuid",
  ACTION_VEHICLE_CREATE: "/vehicle",
  ACTION_ORGANIZATION_DRIVER: "organization",
  ACTITON_GET_LIST_VEHICLE: "/vehicle",
  ACTION_VEHICLE_SAVE: "/vehicle/:uuid",
  ACTION_VEHICLE_DELETE: "/vehicle/:uuid",
  GET_LIST_ORGANIZATION_PARTNER: "/partners/organizations/list",
  GET_LIST_PERSONAL_PARTNER: "/partners/personal/list",
  GET_ROUTE_BY_UUID: "/routes/read",
  ASSIGN_VEHICLE_TO_DRIVER: "/vehicles/user/create",
  GET_BOOKING_BY_UUID: "/booking/read",
  GET_BOOKING_LINKED_TRIP: "/booking/linked/trips/list",
  CREATE_NEW_COMPANY_CUSTOMER: "/customer/organizations/create",
  CREATE_ORGANIZATION_PARTNER_CUSTOMER: "/partners/organizations/create",
  CREATE_PERSONAL_PARTNER_CUSTOMER: "/partners/personal/create",
  CREATE_NEW_ACCOUNT: "/users/create",
  SAVE_ACCOUNT: "/users/update",
  SAVE_ROLE: "/roles/update",
  GET_ROLE_BY_UUID: "/roles/read",
  GET_ACCOUNT_BY_UUID: "/users/read",
  CREATE_ROUTE: "/routes/create",
  CREATE_PLACE: "/place",
  UPDATE_ROUTE: "/routes/update",
  CREATE_BOOKING: "/booking/create",
  SAVE_BOOKING: "/booking/update",
  DELETE_ROUTE: "/routes/delete",
  DELETE_BOOKING: "/booking/delete",
  SAVE_COMPANY_CUSTOMER: "/partners/update",
  SAVE_PARTNER_CUSTOMER: "/partners/update",
  VALIDATE_PHONE_NUMBER: "/auth/singin/mobile",
  SIGN_IN_OTP: "/auth/singin/verify",
  SIGN_IN_DEFAULT: "/auth/singin",

  // UPLOAD_IMAGES
  UPLOAD_IMAGE: "/upload/images",
  UPLOAD_FILE: "/upload/multi/files",

  //Partner
  SAVE_PERSONAL_PARTNER: "/partners/personal/update",
  SAVE_ORGANIZATION_PARTNER: "/partners/organizations/update",
  CREATE_ORGANIZATION_PARTNER: "/partners/organizations/create",
  CREATE_PERSONAL_PARTNER: "/partners/personal/create",
  READ_ORGANIZATION_PARTNER: "/partners/organizations/read",
  READ_PERSONAL_PARTNER: "/partners/personal/read",
  DELETE_ORGANIZATION_PARTNER: "/partners/organizations/delete",
  DELETE_PERSONAL_PARTNER: "/partners/personal/delete",

  //Customer
  SAVE_PERSONAL_CUSTOMER: "/customer/personal/update",
  SAVE_ORGANIZATION_CUSTOMER: "/customer/organizations/update",
  CREATE_ORGANIZATION_CUSTOMER: "/customer/organizations/create",
  CREATE_PERSONAL_CUSTOMER: "/customer/personal/create",
  READ_ORGANIZATION_CUSTOMER: "/customer/organizations/read",
  READ_PERSONAL_CUSTOMER: "/customer/personal/read",
  DELETE_ORGANIZATION_CUSTOMER: "/customer/organizations/delete",
  DELETE_PERSONAL_CUSTOMER: "/customer/personal/delete",

  //     VALIDATE_PHONE_NUMBER: '/auth/singin/mobile',
  //     SIGN_IN_OTP: '/auth/singin/verify',
  //     SIGN_IN_DEFAULT: '/auth/singin',
  // };

  //Save giá CTV
  PARTNER_SAVE_ROUTE_COST: "/partners/route/costs/create",
  PARTNER_SAVE_ROUTE_COST_PER: "/partners/distance/costs/create",

  //Save giá KH
  CUSTOMER_SAVE_ROUTE_COST: "/customer/route/costs/create",
  CUSTOMER_SAVE_ROUTE_COST_PER: "/customer/distance/costs/create",

  //Get giá CTV
  GET_ORGANIZATION_PARTNER_COST: "/partners/route/costs/read",
  //Get giá CTV
  GET_ORGANIZATION_CUSTOMER_COST: "/customer/route/costs/read",

  //Global
  GET_GLOBAL_CONFIG: "/entry",

  //Tour
  READ_TOUR: "/routes/tour/read",
  ADD_TOUR: "/routes/tour/create",
  EDIT_TOUR: "/routes/tour/update",
  DELETE_TOUR: "/routes/tour/delete",
  // DASHBOARD
  FILTER_CHART: "/dashboard/scheduler/list",
  FILTER_CHART_DRIVER: "/dashboard/driver/list",
  GET_REPORT_FOR_MONTH: "dashboard/stats/revenue",
  GET_REPORT_FOR_DAY: "dashboard/stats/revenue",

  // NOTIFICOMPANY
  ON_SAVE_ITEM_NOTI: "notify-driver/create",
  ON_READ_ITEM_NOTI: "notify-driver",
  ON_DELETE_NOTI: "notify-driver",
  GET_LIST_NOTI: "notify-driver/index",
  ON_UPDATE_NOTI: "update-notify",
  ON_SEND_ITEM_NOTI: "notify-driver/create",
  ON_SEND_DRIVER: "send-notify",

  // BOOKING HISTORY
  GET_BOOKING_HISTORY: "booking/log/list",
  GET_DETAIL_CONTENT: "booking/log/read",

  // REPORT INCIDENT
  GET_LIST_REPORT_INCIDENT: "feedback-breakdown",
  GET_DETAIL_REPORT_INCIDENT: "feedback-breakdown",
  EXPORTS_BOOKING: "exports/booking",
  // EXTRACT
  EXTRACT_REPORT_COMMAND: "report/trips",
  //LICH TRUC
  DRIVER_TABLE: "/driver-time-table",
  DRIVER_TABLE_UPDATE: "driver-time-table/update",
  DRIVER_TABLE_UPDATE_SABBATICAL: "sabbatical/update",
  DRIVER_TABLE_UPDATE_COMFIRM: "sabbatical/confirm",
  // warning tem xe
  WARNING_VEHICLE_TEM: "business-vehicle-license-warning",
  // Nghiem thu
  GET_STATISTICAL_FOR_TRIP: "/booking/nghiem-thu/read",
  ON_ACCEPT_STATISTICAL_COST: "booking/status/update",
  // HANG XE
  GET_VEHICLE_CLASS: "vehicle-class",
  CREATE_VEHICLE_CLASS: "vehicle-class",
  BROWSE_ROUTE_IN_BOOKING: "/all-fixedRoutes",
  BROWSE_CATOLOG_FEE: "/autocomplete/catolog-fee?q=",
  BROWSE_CATEGORY_PAY: "/index-category-pay/",

  // ENTERPRISE
  GET_LIST_ENTERPRISE: "partners/branch/list",
  CREATE_ENTERPRISE: "partners/branch/create",
  UPDATE_ENTERPRISE: "customer/organizations/update",
  GET_LIST_COMPANY_FOR_ENTERPRISE: "partners/branch/list",

  // GET_LIST_ENTERPRISE: 'customer/organizations/list',
  // CREATE_ENTERPRISE: 'customer/organizations/create',
  // GET_LIST_COMPANY_FOR_ENTERPRISE: 'customer/list',

  GET_DETAIL_ITEM_ENTERPRISE: "customer/organizations/read",
  ON_DELETE_ITEM_ENTERPRISE: "customer/organizations/delete",
  GET_MENU_ENTERPRISE: "organizations/attibute/read",
  GET_DETAIL_ITEM_ATTRIBUTE: "organizations/attibute/read",
  ON_CREATE_ORGANIZATION_ATTRIBUTE: "organizations/attibute/create",
  // QUAN LY LAI XE
  GET_GROUP_XE: "category-driver-vehicle-all",
  // Report
  GET_CODE_STAFF: "autocomplete/employer",
  GET_CODE_DOAN: "autocomplete/booking",
  GET_CODE_CUSTOMER: "autocomplete/customer",
  GET_BKS: "autocomplete/vehicle",
  GET_LIST_DRIVER_REPORT: "autocomplete/driver/all",
  GET_CODE_CTV: "autocomplete/supplier",

  // Lich truc nghi
  ON_UPDATE_WORKING: "driver-time-table/type",
  ON_UPDATE_SABBATICAL: "driver-time-table/type-vacation",

  //holiday
  GET_LIST_HOLIDAY: "/list-holiday?month=2020",
};
