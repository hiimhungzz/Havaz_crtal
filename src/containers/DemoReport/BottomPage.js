import React,{memo} from "react";
import { Pagination } from "antd";

const BottomPage = memo(({pages, pageSize, count, setParams, isShow}) => {
  if(!isShow) {
    return null;
  }
  return (
    <div className="kt-portlet__head">
      <div className="kt-portlet__head-label">{`Tổng: ${count}`}</div>
      <Pagination
        style={{paddingTop: 20, marginRight: 40}}
        current={pages}
        total={count}
        // total={data.length}
        pageSize={pageSize}
        showSizeChanger
        onChange={(pages, pageSize) => {
          setParams(prevState => {
            let nextState= {...prevState};
            nextState.pages = pages;
            return nextState;
          })
        }}
        onShowSizeChange={(current, size) => {
          setParams(prevState=>{
          let nextState= {...prevState};
            nextState.pages = 1;
            nextState.pageSize = size;
            return nextState;
          })
        }}
      />
    </div>
  );
});
export default BottomPage;