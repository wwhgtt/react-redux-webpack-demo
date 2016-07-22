const React = require('react');
const Immutable = require('seamless-immutable');
const helper = require('../../../../helper/dish-hepler');
const DishDetailHead = require('../dish-detail-head.jsx');
const GroupsBar = require('./groups-bar.jsx');
const ChildDish = require('./child-dish.jsx');

module.exports = React.createClass({
  displayName: 'GroupDishDetail',
  propTypes:{
    dish: React.PropTypes.object.isRequired,
    onAddToCarBtnTap: React.PropTypes.func.isRequired,
  },
  getInitialState() {
    const { dish } = this.props;
    const dishForDetail = dish.setIn(
      ['order'],
      Immutable.from([
        {
          count:0,
          groups: dish.groups,
        },
      ])
    ).updateIn( // process each childDish, if it is default dish, make its order count to its leastCellNum.
      ['order', 0, 'groups'],
      groups => groups.flatMap(
        group => group.update(
          'childInfos', childDishes => childDishes.flatMap(
            childDish => {
              const count = childDish.isDefault || childDish.isReplace ? childDish.leastCellNum : 0;
              if (helper.isSingleDishWithoutProps(childDish)) {
                return childDish.set('isChildDish', true).set('order', count);
              }
              return childDish.set('isChildDish', true).set('order', Immutable.from(
                [{ count,
                  dishPropertyTypeInfos:childDish.dishPropertyTypeInfos,
                  dishIngredientInfos: childDish.dishIngredientInfos,
                 }]
              ));
            }
          )
        )
      )
    );
    return {
      activeGroupIdx:0,
      dish: dishForDetail,
      toast: 0,
      toastText: ''
    };
  },
  componentDidUpdate() {
  },
  onChildDishChange(targetDish) {
    const { activeGroupIdx, dish } = this.state;
    this.setState({
      dish: dish.updateIn(
        ['order', 0, 'groups', activeGroupIdx, 'childInfos'],
        childInfos => childInfos.flatMap(childDish => childDish.id === targetDish.id ? targetDish : childDish)
      ),
    });
  },
  onGroupDishCountChange(increment) {
    const dishForDetail = this.state.dish;
    const oldDishDataForCart = this.props.dish;
    const oldCountForDetail = helper.getDishesCount([dishForDetail]);
    const oldCountForCart = helper.getDishesCount([oldDishDataForCart]);
    let newCountForDetail;
    if (oldCountForDetail === 0 && oldCountForCart === 0) {
      // if never ordered this dish;
      newCountForDetail = dishForDetail.dishIncreaseUnit;
    } else if (oldCountForCart === 0 && oldCountForDetail + increment < dishForDetail.dishIncreaseUnit) {
      // if never ordered this dish and now want to order a count that is smaller thant dishIncreaseUnit;
      newCountForDetail = 0;
    } else {
      newCountForDetail = oldCountForDetail + increment;
    }
    this.setState({ dish: dishForDetail.setIn(
      ['order', 0, 'count'],
      newCountForDetail
    ) });
  },
  onGroupTap(evt) {
    const idx = evt.currentTarget.getAttribute('data-idx');
    this.setState({ activeGroupIdx:parseInt(idx, 10) });
  },
  onAddToCarBtnTap() {
    const { onAddToCarBtnTap } = this.props;
    const { dish } = this.state;
    const firstOrder = dish.order[0];
    if(!firstOrder){
      return;
    }

    if (helper.getDishesCount([dish]) <= 0) {
      this.showToast('请选择套餐份数');
      return false;
    }

    let invalidRets = [];
    firstOrder.groups.forEach(dishGroup => {
      const orderedCount = helper.getDishesCount(helper.getOrderedDishes(dishGroup.childInfos));
      let isValid = true;
      let message = '';
      if(orderedCount > dishGroup.orderMax){
        message = '子菜份数超出可选范围';
        isValid = false;
      }
      else if(orderedCount < dishGroup.orderMin){
        message = '请选择足够的子菜份数';
        isValid = false;
      }
      if(!isValid){
        invalidRets.push({message, isValid});
      }
    });

    if(invalidRets.length){
      this.showToast(invalidRets.shift().message);
      return false;
    }

    onAddToCarBtnTap(dish);
    return true;
  },
  showToast(text) {
    this.setState({ toast:1, toastText: text });

    setTimeout(() => {
      this.setState({ toast:0, toastText: '' });
    }, 3000);
  },
  buildGroupDishes(groupData) {
    const remainCount = groupData.orderMax - helper.getDishesCount(groupData.childInfos);
    return groupData.childInfos.map(childDish => (
      <ChildDish
        key={childDish.id} dish={childDish} remainCount={remainCount} onDishChange={this.onChildDishChange}
      />
    ));
  },
  render() {
    const { activeGroupIdx, dish } = this.state;
    const activeGroupDishes = this.buildGroupDishes(dish.order[0].groups[activeGroupIdx]);
    return (
      <div className="group-dish-detail flex-columns">
        <DishDetailHead dish={dish} onCountChange={this.onGroupDishCountChange} />
        <GroupsBar groups={dish.order[0].groups} activeGroupIdx={activeGroupIdx} onGroupTap={this.onGroupTap} />
        <div className="dishes-container flex-rest">
          {activeGroupDishes}
        </div>
        <button className="dish-detail-addtocart btn--yellow flex-none" onTouchTap={this.onAddToCarBtnTap}>加入购物车</button>
        {
          this.state.toast === 1 ?
            <div className="toast"><span className="toast-content">{this.state.toastText}</span></div>
          :
          false
        }
      </div>
    );
  },
});

