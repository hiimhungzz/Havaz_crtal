import React, { useEffect, useState, useCallback } from "react";
import { Skeleton } from "antd";
import _ from "lodash";
import { Ui } from "@Helpers/Ui";
import { memo } from "react";
import { debounce } from "@Helpers/utility";
import ServiceBase from "@Services/ServiceBase";
import { URI } from "containers/DemoBooking/constants";
import { Grid } from "@material-ui/core";
import ExpensesList from "./ExpensesList";
import { Map, fromJS } from "immutable";
import classNames from "classnames";
import { Collapse, Icon } from "antd";
const { Panel } = Collapse;

const customPanelStyle = {
  background: "#f7f7f7",
  borderRadius: 4,
  marginBottom: 5,
  border: 0,
  overflow: "hidden"
};

const BookingExpenses = ({ bookingId, onClose }) => {
  const [
    readBookingExpensesFetching,
    setReadBookingExpensesFetching
  ] = useState(() => false);
  const [bookingExpenses, setBookingExpenses] = useState(
    Map({ expenses: Map(), trips: Map() })
  );
  useEffect(() => {
    if (bookingId) {
      let _onReadBookingExpenses = debounce(async () => {
        setReadBookingExpensesFetching(true);
        let result = await ServiceBase.requestJson({
          url: URI.READ_BOOKING_ADDITIONAL,
          method: "POST",
          data: { uuid: bookingId, isCosts: true }
        });
        if (!result.hasErrors) {
          setBookingExpenses(prevState => {
            let nextState = prevState;
            let data = [];
            let expenses = result.value;
            let trips = expenses.pop();
            _.forEach(expenses, (d, dId) => {
              d.rowId = dId;
              d.items = d.items.map((i, iId) => {
                return {
                  ...i,
                  date: d.date,
                  itemId: iId,
                  rowId: dId,
                  fixedRoutesName: d.fixedRoutesName
                };
              });
              if (d.plate) {
                return data.push(d);
              }
            });
            data = _.groupBy(data, x => x.plate);
            nextState = nextState.set("expenses", fromJS(data));
            nextState = nextState.set("trips", fromJS(trips));
            return nextState;
          });
        } else {
          Ui.showErrors(result.errors);
        }
        setReadBookingExpensesFetching(false);
      }, 300);
      _onReadBookingExpenses();
    }
  }, [bookingId]);
  const handleChangeField = useCallback(payload => {
    setBookingExpenses(prevState => {
      let newState = prevState;
      let rowIndex = _.findIndex(
        prevState.getIn(["expenses", payload.plate]).toJS(),
        x => x.rowId === payload.rowId
      );
      let itemIndex = _.findIndex(
        prevState.getIn(["expenses", payload.plate, rowIndex, "items"]).toJS(),
        x => x.itemId === payload.itemId
      );
      newState = newState.setIn(
        ["expenses", payload.plate, rowIndex, "items", itemIndex, payload.name],
        payload.value
      );
      return newState;
    });
  }, []);
  const handleAddExpenses = useCallback(payload => {
    setBookingExpenses(prevState => {
      let nextState = prevState;
      let rowIndex = _.findIndex(
        nextState.getIn(["expenses", payload.plate]).toJS(),
        x => x.rowId === payload.rowId
      );
      nextState = nextState.updateIn(
        ["expenses", payload.plate, rowIndex, "items"],
        x => {
          let pushItem = fromJS({
            itemId: x.size,
            userId: payload.userId,
            driverName: payload.driverName,
            fixedRoutesName: payload.fixedRoutesName,
            tripId: payload.tripId,
            rowId: payload.rowId,
            date: payload.date,
            value: 0,
            note: "",
            confirmNote: "",
            confirm: true
          });
          x = x.unshift(pushItem);
          return x;
        }
      );
      return nextState;
    });
  }, []);
  const handleDeleteExpense = useCallback(payload => {
    setBookingExpenses(prevState => {
      let nextState = prevState;
      let rowIndex = _.findIndex(
        nextState.getIn(["expenses", payload.plate]).toJS(),
        x => x.rowId === payload.rowId
      );
      let itemIndex = _.findIndex(
        prevState.getIn(["expenses", payload.plate, rowIndex, "items"]).toJS(),
        x => x.itemId === payload.itemId
      );
      nextState = nextState.deleteIn([
        "expenses",
        payload.plate,
        rowIndex,
        "items",
        itemIndex
      ]);
      return nextState;
    });
  }, []);
  const keysInExpenses = bookingExpenses.get("expenses").size;
  const [...plates] = bookingExpenses.get("expenses").keys();
  return (
    <>
      {keysInExpenses > 0 ? (
        <Skeleton loading={readBookingExpensesFetching} active>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              {bookingExpenses
                .get("expenses")
                .entrySeq()
                .map(([plate, expen]) => {
                  return (
                    <Collapse
                      bordered={false}
                      defaultActiveKey={plates}
                      expandIcon={({ isActive }) => (
                        <Icon type="caret-right" rotate={isActive ? 90 : 0} />
                      )}
                    >
                      <Panel
                        header={
                          <h6 className="mb-0">
                            <i className="fa fa-shuttle-van mr-2" />
                            {plate}
                          </h6>
                        }
                        key={plate}
                        style={customPanelStyle}
                      >
                        <ExpensesList
                          dataSource={expen}
                          plate={plate}
                          trips={bookingExpenses
                            .getIn(["trips", "items"])
                            .filter(x => x.get("plate") === plate)}
                          bookingId={bookingId}
                          onChangeField={handleChangeField}
                          onAddExpenses={handleAddExpenses}
                          onDeleteExpense={handleDeleteExpense}
                        />
                      </Panel>
                    </Collapse>
                  );
                })}
            </Grid>
            {keysInExpenses > 0 && (
              <div className="bookingInfo__action p-2">
                <Grid item xs={12}>
                  <button
                    className={classNames({
                      "btn btn-secondary btn-icon-sm": true,
                      "kt-spinner kt-spinner--v2 kt-spinner--sm kt-spinner--danger disabled": false
                    })}
                    onClick={async () => {
                      let data = [];
                      _.forEach(bookingExpenses.get("expenses").toJS(), ex => {
                        _.forEach(ex, x => {
                          _.forEach(x.items, y => {
                            let picked = _.pick(y, [
                              "uuid",
                              "userId",
                              "name",
                              "value",
                              "tripId",
                              "note",
                              "type",
                              "typeId",
                              "confirm",
                              "confirmNote",
                              "fixedRoutesName"
                            ]);
                            data.push(picked);
                          });
                        });
                      });
                      let result = await ServiceBase.requestJson({
                        url: URI.EDIT_ADDITION_EXPENSES,
                        method: "POST",
                        data: { items: data }
                      });
                      if (result.hasErrors) {
                        Ui.showErrors(result.errors);
                      } else {
                        Ui.showSuccess({
                          message: "Xác nhận chi phí thành công."
                        });
                        _.delay(() => {
                          onClose();
                        }, 500);
                      }
                    }}
                    type="button"
                  >
                    <i className="fa fa-check" />
                    Xác nhận
                  </button>
                </Grid>
              </div>
            )}
          </Grid>
        </Skeleton>
      ) : (
        <h5>Chưa có chi phí</h5>
      )}
    </>
  );
};
export default memo(BookingExpenses);
