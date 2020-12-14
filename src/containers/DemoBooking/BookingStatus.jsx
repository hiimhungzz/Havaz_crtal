import React, { memo, useCallback } from "react";
import { Grid } from "@material-ui/core";
import _ from "lodash";
import CardStatistic from "@Components/CardStatistic";

const BookingStatusItem = ({item, setParam}) => {
  let cardBodyStyle = { padding: 5 };
  const _onChangePageSize = useCallback(
    () => {
      setParam(prevState => {
        let nextState = prevState;
        let arrayStatus = prevState.getIn(["query", "status"]);
        if(!arrayStatus.includes(item.status)) {
          arrayStatus.push(item.status);
        } else if(arrayStatus.includes(item.status)) {
          const arrayStatusNew = arrayStatus.filter(x => x !== item.status)
          arrayStatus = arrayStatusNew;
        }
        nextState = nextState.setIn(["query", "status"], [...arrayStatus]);
        return nextState;
      });
    },
    [item.status, setParam]
  );
  return (
    <div onClick={_onChangePageSize}>
      <CardStatistic
        title={item.name}
        value={item.quantity}
        precision={0}
        cardStyle={{ backgroundColor: item.color || 'orange' }}
        cardBodyStyle={cardBodyStyle}
      />
    </div>
  )
}
 

const BookingStatus = ({ data, setParam }) => {
  let cardBodyStyle = { padding: 5 };
  let bookingStatusJs = data.toJS();
  return (
    <Grid container>
      {bookingStatusJs.map(status => {
        return (
          <Grid
            item
            key={status.id}
            xs={_.includes([302, 300, 400], status.id) ? 2 : 1}
          >
            <BookingStatusItem
              item={status}
              setParam={setParam}
            />
          </Grid>
        );
      })}
      <Grid item xs={2}>
        <CardStatistic
          title="Toàn bộ"
          value={_.sumBy(bookingStatusJs, x => x.quantity)}
          precision={0}
          cardStyle={{ backgroundColor: "black" }}
          cardBodyStyle={cardBodyStyle}
        />
      </Grid>
    </Grid>
  );
};
export default memo(BookingStatus);
