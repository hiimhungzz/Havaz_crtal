import React, { PureComponent } from "react";
import { Checkbox } from 'antd';
import IntlMessages from '../../../../components/Utility/intlMessages.js'
// actions

// component

//styles
import "../../styles.scss";


class MenuChild extends PureComponent {
  constructor(props) {
    super(props);
  }

  onChange = () => {
    const {itemChild, index} = this.props;
    this.props.onChangeChild({...itemChild, index, checked: !itemChild.checked, });
  };

  render() {
    const {itemChild} = this.props;
    return (
      <div style={{ display: 'flex', paddingTop: 5}}>
        <div style={{minWidth: 30, display: 'flex', justifyContent: 'flex-start'}}>
          <Checkbox onChange={this.onChange} checked={itemChild.checked}/>
        </div>
        <div style={{fontSize: 15, paddingLeft: 5}}>
          <IntlMessages className="kt-menu__link-text" id={itemChild.name} />
        </div>
      </div>
    );
  }
}

export default MenuChild;