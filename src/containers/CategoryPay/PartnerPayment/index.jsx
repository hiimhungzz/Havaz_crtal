import React, { useEffect, useState, useCallback } from "react";
import { Skeleton, Button } from "antd";
import _ from "lodash";
import { Ui } from "@Helpers/Ui";
import { memo } from "react";
import { debounce } from "@Helpers/utility";
import ServiceBase from "@Services/ServiceBase";
import { Grid } from "@material-ui/core";
import PaymentList from "./PaymentList";
import PaymentTitle from "./PaymentTitle";
import { Map, fromJS } from "immutable";

const actionStyle = {
  position: "absolute",
  right: 0,
  bottom: 0,
  width: "100%",
  borderTop: "1px solid #e9e9e9",
  padding: "10px 16px",
  background: "#fff",
  textAlign: "left"
};
const PartnerPayment = ({ vehicleId, month, year, onClose }) => {
  const [readPaymentFetching, setReadPaymentFetching] = useState(() => false);
  const [confirmPaymentFetching, setConfirmPaymentFetching] = useState(
    () => false
  );
  const [payment, setPayment] = useState(Map({ info: Map(), data: Map() }));
  useEffect(() => {
    if (vehicleId) {
      let _onReadBookingExpenses = debounce(async () => {
        setReadPaymentFetching(true);
        let result = await ServiceBase.requestJson({
          url: "/category-pay/",
          method: "GET",
          data: {
            vehicleId: vehicleId,
            month: month,
            year: year
          }
        });
        if (!result.hasErrors) {
          setPayment(prevState => {
            let nextState = prevState;
            nextState = nextState.set("info", Map(result.value.objUserVehicle));
            nextState = nextState.set("data", fromJS(result.value.docs));
            return nextState;
          });
        } else {
          Ui.showErrors(result.errors);
        }
        _.delay(() => {
          setReadPaymentFetching(false);
        }, 200);
      }, 300);
      _onReadBookingExpenses();
    }
  }, [month, vehicleId, year]);
  const handleChangeField = useCallback(payload => {
    setPayment(preState => {
      let nextState = preState;
      if (payload.ytemId) {
        nextState = nextState.setIn(
          [
            "data",
            payload.categoryId,
            payload.rowId,
            "items",
            payload.itemId,
            "items",
            payload.ytemId,
            payload.name
          ],
          payload.value
        );
      } else {
        nextState = nextState.setIn(
          [
            "data",
            payload.categoryId,
            payload.rowId,
            "items",
            payload.itemId,
            payload.name
          ],
          payload.value
        );
      }

      return nextState;
    });
  }, []);
  const handleConfirmCategoryPay = useCallback(async () => {
    let jsPayment = payment.toJS();
    let param = {
      objUserVehicle: jsPayment.info,
      docs: jsPayment.data
    };
    console.log(param);
    setConfirmPaymentFetching(true);
    let result = await ServiceBase.requestJson({
      url: "/create-category-pay/",
      method: "POST",
      data: param
    });
    if (!result.hasErrors) {
      Ui.showSuccess({ message: "Xác nhận thành công." });
      _.delay(() => {
        onClose();
      }, 500);
    } else {
      Ui.showErrors(result.errors);
    }
    _.delay(() => {
      setConfirmPaymentFetching(false);
    }, 200);
  }, [onClose, payment]);
  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12} className="d-flex justify-content-center">
          <PaymentTitle info={payment.get("info")} />
        </Grid>
        <Grid item xs={12}>
          <Skeleton loading={readPaymentFetching} active>
            <PaymentList
              dataSource={payment.get("data")}
              onChangeField={handleChangeField}
            />
          </Skeleton>
        </Grid>
      </Grid>
      <div style={actionStyle}>
        <Button
          loading={confirmPaymentFetching}
          onClick={handleConfirmCategoryPay}
          type="primary"
        >
          Xác nhận
        </Button>
      </div>
    </>
  );
};
export default memo(PartnerPayment);
