import _ from "lodash";
import { STATUS, DATE_TIME_FORMAT } from "@Constants/common";
import moment from "moment";
import format from "string-format";
import { $LocalStorage } from "./localStorage";
import { APP_PROFILE, APP_PARAM, CURRENT_USER, JWT_TOKEN } from "@Constants";
import Globals from "../globals";
import { $Cookies } from "./cookies";
import clone from "clone";
import hash from "object-hash";
import { v4 as uuidv4 } from "uuid";
const phoneNumberRegex = /^[+]*[(]{0,1}[0-9]{1,2}[)]*[0-9]{9}$/g;
const phoneNumber8DigitRegex = /^[+]*[(]{0,1}[0-9]{1,2}[)]*[0-9]{7,9}$/g;
const timeFormatRegex = /^$|^(([01][0-9])|(2[0-3])):[0-5][0-9]$/;

const momentRange = {
  "Hôm nay": [moment(), moment()],
  "Tuần hiện tại": [moment().startOf("week"), moment().endOf("week")],
  "Tháng hiện tại": [moment().startOf("month"), moment().endOf("month")],
  "Tuần trước": [
    moment().add(-1, "weeks").startOf("week"),
    moment().add(-1, "weeks").endOf("week"),
  ],
  "Tháng trước": [
    moment().add(-1, "months").startOf("month"),
    moment().add(-1, "months").endOf("month"),
  ],
};

const timeDifference = (givenTime) => {
  givenTime = new Date(givenTime);
  const milliseconds = new Date().getTime() - givenTime.getTime();
  const numberEnding = (number) => {
    return number > 1 ? "s" : "";
  };
  const number = (num) => (num > 9 ? "" + num : "0" + num);
  const getTime = () => {
    let temp = Math.floor(milliseconds / 1000);
    const years = Math.floor(temp / 31536000);
    if (years) {
      const month = number(givenTime.getUTCMonth() + 1);
      const day = number(givenTime.getUTCDate());
      const year = givenTime.getUTCFullYear() % 100;
      return `${day}-${month}-${year}`;
    }
    const days = Math.floor((temp %= 31536000) / 86400);
    if (days) {
      if (days < 28) {
        return days + " day" + numberEnding(days);
      } else {
        const months = [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ];
        const month = months[givenTime.getUTCMonth()];
        const day = number(givenTime.getUTCDate());
        return `${day} ${month}`;
      }
    }
    const hours = Math.floor((temp %= 86400) / 3600);
    if (hours) {
      return `${hours} hour${numberEnding(hours)} ago`;
    }
    const minutes = Math.floor((temp %= 3600) / 60);
    if (minutes) {
      return `${minutes} minute${numberEnding(minutes)} ago`;
    }
    return "a few seconds ago";
  };
  return getTime();
};

const checkStatus = (status) => {
  let finded = STATUS.find((x) => x.value === status || x.value === status * 1);
  if (finded) {
    return finded.label;
  } else {
    return "";
  }
};

const checkMoment = (input) => {
  if (_.isEmpty(input)) {
    return undefined;
  } else {
    if (moment.isMoment(input)) {
      return input;
    } else {
      return moment(input).clone();
    }
  }
};

const formatDateTime = (source) => {
  return (
    (source ? moment(source).format(DATE_TIME_FORMAT.DD_MM_YYYY) : null) || ""
  );
};
const isEmpty = (value, defaultValue) => {
  if (value) return clone(value);
  else return defaultValue;
};
const findAndReplace = (array, find, replace) => {
  let rows = _.cloneDeep(array);
  let index = _.findIndex(rows, find);
  rows.splice(index, 1, replace);
  return rows;
};
const isNode = () => {
  return (
    typeof process === "object" && process.version && !!process.version.node
  );
};
const setupSession = () => {
  if (!isNode()) {
    Globals.reset();
    const token = $Cookies.get(JWT_TOKEN);
    const currentUser = $Cookies.get(CURRENT_USER);
    Globals.init({
      public: {
        currentUser,
      },
      private: {
        token,
      },
    });
  }
};
const actionCreator = (moduleName, actionName) => {
  if (!actionName) return false;
  return `${moduleName}${actionName}`;
};
const buildClassName = (template, destination) => {
  if (!destination) return "";
  return format(template, destination);
};
const calculateTotalPage = (totalLength, pageLimit) => {
  if (!_.isNumber(totalLength)) {
    totalLength = _.parseInt(totalLength);
  }
  if (!_.isNumber(pageLimit)) {
    pageLimit = _.parseInt(pageLimit);
  }
  if (totalLength === 0 || pageLimit === 0) {
    return 0;
  } else {
    return _.parseInt(
      totalLength % pageLimit > 0
        ? totalLength / pageLimit + 1
        : totalLength / pageLimit
    );
  }
};
const calculatePageInfo = (currentPage, pageLimit, totalLength) => {
  if (!_.isNumber(currentPage)) {
    currentPage = _.parseInt(currentPage);
  }
  if (!_.isNumber(pageLimit)) {
    pageLimit = _.parseInt(pageLimit);
  }
  if (!_.isNumber(totalLength)) {
    totalLength = _.parseInt(totalLength);
  }
  if (currentPage === 0 && pageLimit === 0) {
    return `0-0 của ${totalLength}`;
  } else {
    let start = currentPage * pageLimit + 1;
    let end = start + pageLimit - 1;
    if (end > totalLength) {
      end = totalLength;
    }
    return `${start}-${end} của ${totalLength}`;
  }
};
const getCurrentStep = (status) => {
  switch (status) {
    case 100:
      return 0;
    case 300:
      return 1;
    case 101:
      return 2;
    case 901:
      return 3;
    case 302:
      return 4;
    case 200:
      return 5;
    case 600:
      return 6;
    case 500:
      return 7;

    default:
      return 0;
  }
};
const debounce = (func, wait = 300) => {
  return _.debounce(func, wait);
};
const insertToArrayByIndex = (arr, index, newItem) => [
  ...arr.slice(0, index).map((ar, arId) => {
    ar.key = arId + 1;
    return ar;
  }),
  ...[newItem],
  ...arr.slice(index).map((ar, arId) => {
    ar.key = arId + newItem.key + 1;
    return ar;
  }),
];
const getError = (errors, path) => {
  return _.get(errors, path, null);
};
const hasError = (errors, path = "") => {
  return (
    (path ? _.has(errors, path) : false) ||
    !(_.isEmpty(errors) || _.isUndefined(errors) || _.isNull(errors))
  );
};
const getContainer = (id) => {
  return () => {
    if (!id || typeof document === "undefined") return "body";
    return document.getElementById(id);
  };
};
const disabledDate = (currentDate, dateIn, dateOut) => {
  return (
    currentDate &&
    (currentDate < checkMoment(dateIn) || currentDate > checkMoment(dateOut))
  );
};
const areEqual = (prev, next) => {
  return _.isEqual(prev, next);
};
const arrayToObjectKey = (arr, key = "key") => {
  return _.reduce(arr, (prev, cur) => (prev[cur[key]] = cur), {});
};
const hashByTimeStamp = (span = 0) => {
  let timeStamp = moment();
  timeStamp.add(span, "second");
  return hash(
    { timeStamp: timeStamp.unix(), uuid: uuidv4() },
    { algorithm: "md5", encoding: "base64" }
  );
};
const convertArrayToObject = (array, key) => {
  const initialValue = {};
  return array.reduce((obj, item) => {
    return {
      ...obj,
      [item[key]]: item,
    };
  }, initialValue);
};

const appProfile = isEmpty($LocalStorage.sls.getObject(APP_PROFILE), {});
const appParam = isEmpty($LocalStorage.sls.getObject(APP_PARAM), {});

export {
  momentRange,
  phoneNumberRegex,
  phoneNumber8DigitRegex,
  timeFormatRegex,
  timeDifference,
  checkStatus,
  checkMoment,
  formatDateTime,
  isEmpty,
  findAndReplace,
  isNode,
  appProfile,
  appParam,
  setupSession,
  actionCreator,
  buildClassName,
  calculateTotalPage,
  calculatePageInfo,
  getCurrentStep,
  debounce,
  insertToArrayByIndex,
  getError,
  hasError,
  getContainer,
  areEqual,
  disabledDate,
  arrayToObjectKey,
  hashByTimeStamp,
  convertArrayToObject,
};
