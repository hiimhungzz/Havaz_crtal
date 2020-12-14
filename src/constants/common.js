export const HTTP_STATUS = {
  OK: 200,
};
export const SCHEDULER_STATUS = {
  GET_INFO: 0,
  REQUEST_PERMISSTION: 1,
  APPROVE_PERMISSTION: 2,
  REJECT_PERMISSTION: 3,
};
export const STATUS = [
  {
    value: "0",
    color: "#f50",
    icon: "fa-times-circle",
    label: "Không hoạt động",
  },
  {
    value: "1",
    color: "#87d068",
    icon: "fa-check-circle",
    label: "Đang hoạt động",
  },
  {
    value: "2",
    color: "#108ee9",
    icon: "fa-exclamation-circle",

    label: "Đang xác nhận",
  },
];
export const READY_COMMAND_STATUS = {
  READY: "SẴN SÀNG",
  NOT_READY: "KHÔNG SẴN SÀNG",
};
export const CONTRACT_TYPE = {
  1: "Lộ trình cố định",
  1.1: "Đón trả nhân viên",
  1.2: "Đón trả học sinh",
  1.3: "Thuê xe tháng",
  1.4: "Trọn gói Km",
  2: "Lộ trình không cố định",
  2.1: "Thuê xe tour",
};

export const DataEntry = {
  NA: "",
};

export const DATE_TIME_FORMAT = {
  DD_MM_YYYY: "DD/MM/YYYY",
  DD_MM_YYYY__HH_MM: "DD/MM/YYYY HH:mm",
  YYYY_MM_DD: "YYYY-MM-DD",
  HH_MM: "HH:mm",
};
export const APP_MODULE = {
  USER: "USER",
  ROLE: "ROLE",
  SCHEDULER: "SCHEDULER",
  BOOKING: "BOOKING",
  READYCOMMAND: "READYCOMMAND",
  COMMAND: "COMMAND",
  HIGHWAY: "HIGHWAY",
  CUSTOMERS: "CUSTOMER",
  PARTNER: "PARTNER",
  ROUTE: "ROUTE",
  UTILITIES: "UTILITIES",
  CONFIGURATION: "CONFIGURATION",
  CORPORATE: "CORPORATE",
  CORPORATETRACKING: "CORPORATETRACKING",
  CORPORATE_RECONCILIATION: "CORPORATE_RECONCILIATION",
  CONTRACT_RECONCILIATION: "CONTRACT_RECONCILIATION",
};
export const COLOR = {
  STATE: {
    DARK: "#282a3c",
    LIGHT: "#ffffff",
    PRIMARY: "#5867dd",
    SUCCESS: "#34bfa3",
    INFO: "#36a3f7",
    WARNING: "#ffb822",
    DANGER: "#fd3995",
  },
};
export const DEFAULT_RESPONSE_MESSAGE = {
  500: "Không lấy được dữ liệu.",
};
let hours = [];
for (let index = 0; index < 24; index++) {
  hours.push(index);
}
export const hoursInDay = hours;
let minutes = [];
for (let index = 0; index < 60; index++) {
  minutes.push(index);
}
export const minutesInHour = minutes;
