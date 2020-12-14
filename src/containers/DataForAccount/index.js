import React, { Component } from 'react'
import { Input } from 'antd';
import Info from './Info';
import { requestJsonGet } from "@Services/base";
const { Search } = Input;
// actions
//styles
class DataForAccount extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      data: null
    }
  }

  // componentDidMount() {
  //   requestJsonGet({ url: 'analysis-account?q=0707646287', data: {} }).then(response => {
  //     this.setState ({
  //       data: response.data,
  //     })
  //   });
  // }

  onSearch = (value) => {
    requestJsonGet({ url: `analysis-account?q=${value}`, data: {} }).then(response => {
     this.setState ({
       data: response.data,
     })
    });
  }

  render() {
    return (
      <div className="col-lg-12 kt-portlet kt-portlet--mobile">
        <Search
          placeholder="Nhập account, nhập sdt"
          enterButton="Search"
          size="large"
          onSearch={this.onSearch}
        />
        {
          this.state.data && <Info data={this.state.data}/>
        }
      </div>
    );
  }
}

export default DataForAccount;