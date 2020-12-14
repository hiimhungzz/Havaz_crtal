import React, { PureComponent } from "react";
import { Col } from 'antd';

// actions

// component
import MenuParentList from './MenuParentList';

//styles
import "../../styles.scss";


class MenuGrandFather extends PureComponent {
  constructor(props) {
    super(props);
  }

  onChangeParent = (val) => {
    const {item, dataMenu, onChangeGrandFather, index} = this.props;
    const itemGrand = dataMenu[item];
    console.log("itemGrand", itemGrand)
    console.log("vall", val)
    itemGrand[val.index] = val;
    onChangeGrandFather(itemGrand, item);
  }

  render() {
    const {item, dataMenu} = this.props;
    console.log("dataMenu[item]", dataMenu[item])
    const styleLabelMenuWeb = {
        paddingLeft: 10,
        fontWeight: 'bold', fontSize: 18,
      }
    return (
        <Col span={8}>
            <div style={styleLabelMenuWeb}>{item} </div>
            <div style={{padding: 10}}>
                {
                dataMenu[item] && dataMenu[item].map((item, index) => (
                    <MenuParentList key={index} index={index} itemParent={item} onChangeParent={this.onChangeParent}/>
                    ))
                }
            </div>
        </Col>
    );
  }
}

export default MenuGrandFather;