import React, { PureComponent } from "react";
import { Checkbox } from 'antd';
import { Collapse } from "react-bootstrap";
import IntlMessages from '../../../../components/Utility/intlMessages.js'
import classNames from "classnames";
// actions

// component
import MenuChild from './MenuChild';

//styles
import "../../styles.scss";


class MenuParentList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
    };
  }

  onChangeChild = (val) => {
    const {itemParent, onChangeParent, index} = this.props;
    const itemChildArrayNew = [...itemParent.items];
    itemChildArrayNew[val.index] = val;

    if( itemChildArrayNew.filter(item => item.checked).length === itemParent.items.length) {
      // Truờng hợp tích hết thằng con
      onChangeParent({...itemParent, index, items: itemChildArrayNew, checked: true });
    } else if (itemChildArrayNew.filter(item => item.checked).length === 0) {
      // Trường hợp tất cả thằng con đều ko được tích
      onChangeParent({...itemParent, index, items: itemChildArrayNew, checked: false });
    } else {
      // trường hợp chỉ tích một số thằng con
      onChangeParent({...itemParent, index, items: itemChildArrayNew, checked: true });
    }
    
  };

  onChangeItemPrarent = () => {
    const {itemParent, onChangeParent, index} = this.props;
    if(itemParent.checked) {
      // Truong hop tich disable
      let itemChild = [];
      itemParent.items.map((item) => {
        return itemChild.push({...item, checked: false})
      });
      onChangeParent({...itemParent, index, checked: !itemParent.checked, items: itemChild });
    } else {
      let itemChild = [];
      itemParent.items.map((item) => {
        return itemChild.push({...item, checked: true})
      });
      onChangeParent({...itemParent, index, checked: !itemParent.checked, items: itemChild });
    }
  };

  render() {
    const {isOpen} = this.state;
    const {itemParent} = this.props;
    return (
      <div>
        <div
          style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',  marginVertical: 20}}
        >
          <div
            style={{display: 'flex', flexDirection: 'row', marginBottom: 2.5, marginTop: 2.5,
              alignItems: 'center', flex: 1, color: '#646c9a', cursor: 'pointer'}}
          >
            <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
              <i
                onClick={() => {
                  this.setState({isOpen: !this.state.isOpen})
                }}
                style={{minWidth: 30}}
                className={classNames({
                  "fa fa-chevron-right": !isOpen,
                  "fa fa-chevron-down": isOpen,
                })}
              />
              <div style={{minWidth: 30, display: 'flex', justifyContent: 'flex-start'}}>
                <Checkbox onChange={this.onChangeItemPrarent} checked={itemParent.checked}/>
              </div>
            </div>
            <div
              onClick={() => {
                this.setState({isOpen: !this.state.isOpen})
              }}
              style={{fontWeight: 'bold', fontSize: 18, flex: 1}}>
              <IntlMessages className="kt-menu__link-text" id={itemParent.name} />
            </div>
          </div>
        </div>
        <Collapse in={isOpen}>
          <div style={{marginLeft: 30}}>
            {
              itemParent.items.map((item, index) => (
                <MenuChild key={index} index={index} itemChild={item} onChangeChild={this.onChangeChild}/>
              ))
            }
          </div>
        </Collapse>
      </div>
    );
  }
}

export default MenuParentList;