import { actionCreator } from "@Helpers/utility";

const CONTRACT_RECONCILIATION = "CAR_RENTAL/CONTRACT_RECONCILIATION/";

const URI = {
  BROWSE_CONTRACT_RECONCILIATION: "/contract/reconciliations/list",
};
const ACTION = {
  SET_PARAM: actionCreator(CONTRACT_RECONCILIATION, "SET_PARAM"),
  CLEAR_PARAM: actionCreator(CONTRACT_RECONCILIATION, "CLEAR_PARAM"),
};

export { URI, ACTION };
