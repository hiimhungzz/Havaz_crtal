import React, { Component } from 'react'

//styles

class OrganizationList extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    const {dataList} = this.props;
    return (
      <div className="col-lg-12 kt-portlet kt-portlet--mobile">
       {
         dataList && dataList.length > 0 && dataList.map((item) => (
           <div>
             <div>{item.name}</div>
              <div>{`types = ${item.types}`}</div>
              <hr/>
           </div>
         ))
       }
      </div>
    );
  }
}

export default OrganizationList;