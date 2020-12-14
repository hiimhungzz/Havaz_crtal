import React, { PureComponent } from "react";
import { Checkbox } from 'antd';
// actions

// component

//styles
import "../../styles.scss";


class MenuMobile extends PureComponent {
  constructor(props) {
    super(props);
  }

  onChange = () => {
    const {itemMobile, index} = this.props;
    this.props.onChangeMenuMobile({...itemMobile, index, checked: !itemMobile.checked, });
  };

  render() {
    const {itemMobile} = this.props;
    return (
      <div onClick={this.onChange} style={{ display: 'flex', marginBottom: 2.5, marginTop: 2.5, alignItems: 'center'}}>
        <div style={{minWidth: 50, display: 'flex', justifyContent: 'center'}}>
          <Checkbox checked={itemMobile.checked}/>
        </div>
        <div style={{fontWeight: 'bold', fontSize: 18, color: '#646c9a'}}>{itemMobile.label}</div>
      </div>
    );
  }
}

export default MenuMobile;