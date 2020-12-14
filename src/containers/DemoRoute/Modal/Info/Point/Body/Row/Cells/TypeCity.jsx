import React, { memo } from "react";
import { withStyles } from "@material-ui/core/styles";
import { createStructuredSelector } from "reselect";
import { makeSelectAppConfig } from "redux/app/selectors";
import { connect } from "react-redux";
import { Select } from "antd";
const mapStateToProps = createStructuredSelector({
  appConfig: makeSelectAppConfig(),
});
const withConnect = connect(mapStateToProps, null);
const TypeCity = withConnect(
  memo(
    withStyles({
      col: {
        width: 150,
      },
    })(({ classes, setRoute, appConfig,rowId,value }) => {
      const onChange = (value) => {
        setRoute((state)=>{
          let nextState = state
          nextState = nextState.setIn(["point", rowId, "typePlace"], value);
        return nextState;
        })
      };
      const data = (appConfig.typePlace || []).map((item,index)=>{
        return{
          key:item.id,
          label:item.name
        }
      })
      return (
        <td
          className={`align-middle text-center kt-font-bold kt-font-lg ${classes.col}`}
        >
          <Select
            value={value}
            showSearch
            style={{ width: "100%" }}
            placeholder="Loại địa danh"
            onChange={onChange}
            filterOption={(input, option) =>
              option.props.children
                .toLowerCase()
                .indexOf(input.toLowerCase()) >= 0
            }
          >
            {(data || []).map((item, index) => {
              return (
                <Select.Option key={index} value={item.key}>
                  {item.label}
                </Select.Option>
              );
            })}
          </Select>
        </td>
      );
    })
  )
);
export default TypeCity;
