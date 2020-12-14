import React, { Component } from 'react'
import { Row, Col } from 'antd';
// components
import OrganizationList from './OrganizationList';
//styles

class Info extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    const {data} = this.props;
    console.log("data", data)
    return (
      <Row gutter={16}>
        <Col className="gutter-row" span={6}>
            Thông tin Account
            {
              data.infoAccount && (
                <div>
                  <div>{data.infoAccount.fullName}</div>
                  <div>{data.infoAccount.phone}</div>
                  <div>{`type: ${data.infoAccount.type}`}</div>
                </div>
              )
            }
            Thông tin Parent
            {
              data.infoParent && (
                <div>
                  <div>{data.infoParent.name}</div>
                  <div>{data.infoParent.phone}</div>
                  <div>{`types: ${data.infoParent.types}`}</div>
                  <div>{`code: ${data.infoParent.code}`}</div>
                </div>
              )
            }
          </Col>
          <Col className="gutter-row" span={6}>
            Thông tin BR
            <OrganizationList dataList={data.listBr}/>
          </Col>
          <Col className="gutter-row" span={6}>
            Thông tin BP
            <OrganizationList dataList={data.listIpBp}/>
          </Col>
          <Col className="gutter-row" span={6}>
            Thông tin BC
            <OrganizationList dataList={data.listIcBc}/>
        </Col>
      </Row>
    );
  }
}

export default Info;