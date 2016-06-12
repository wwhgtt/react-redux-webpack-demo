const React = require('react');
const Immutable = require('seamless-immutable');
const helper = require('../../../../helper/dish-hepler');
const DishDetailItem = require('../dish-detail-item.jsx');
const GroupDishGroupsBar = require('./group-dish-groups-bar.jsx');
const GroupDishChildItem = require('./group-dish-child-item.jsx');

module.exports = React.createClass({
  displayName: 'GroupDishDetail',
  propTypes:{
    dishData: React.PropTypes.object.isRequired,
    onAddToCarBtnTap: React.PropTypes.func.isRequired,
  },
  getInitialState() {
    const { dishData } = this.props;
    const dishDataForDetail = dishData.setIn(
      ['order'],
      Immutable.from([
        {
          count:0,
          groups: dishData.groups,
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
                  dishIngredientInfos:dishData.dishIngredientInfos,
                 }]
              ));
            }
          )
        )
      )
    );
    return {
      activeGroupIdx:0,
      dishData: dishDataForDetail,
    };
  },
  componentDidUpdate() {
  },
  onGroupDishCountChange(increment) {
    const dishDataForDetail = this.state.dishData;
    const oldDishDataForCart = this.props.dishData;
    const oldCountForDetail = helper.getDishesCount([dishDataForDetail]);
    const oldCountForCart = helper.getDishesCount([oldDishDataForCart]);
    let newCountForDetail;
    if (oldCountForDetail === 0 && oldCountForCart === 0) {
      // if never ordered this dish;
      newCountForDetail = dishDataForDetail.dishIncreaseUnit;
    } else if (oldCountForCart === 0 && oldCountForDetail + increment < dishDataForDetail.dishIncreaseUnit) {
      // if never ordered this dish and now want to order a count that is smaller thant dishIncreaseUnit;
      newCountForDetail = 0;
    } else {
      newCountForDetail = oldCountForDetail + increment;
    }
    this.setState({ dishData: dishDataForDetail.setIn(
      ['order', 0, 'count'],
      newCountForDetail
    ) });
  },
  onChildDishCountChange(dishData, increment) {
    const { activeGroupIdx } = this.state;
    const groupDish = this.state.dishData;
    const oldCount = helper.getDishesCount([dishData]);
    let newCount;
    if (oldCount === 0) {
      newCount = dishData.leastCellNum;
    } else if (oldCount + increment < dishData.leastCellNum) {
      newCount = 0;
    } else {
      newCount = oldCount + increment;
    }
    this.setState({ dishData:groupDish.updateIn(
      ['order', 0, 'groups', activeGroupIdx, 'childInfos'],
      childDishes => childDishes.flatMap(childDish => {
        if (childDish.id === dishData.id) {
          console.log(childDish);
          return helper.isSingleDishWithoutProps(childDish) ? childDish.set('order', newCount) : childDish.setIn(['order', 0, 'count'], newCount);
        }
        return childDish;
      })),
    });
  },
  onGroupItemTap(evt) {
    const idx = evt.currentTarget.getAttribute('data-idx');
    this.setState({ activeGroupIdx:parseInt(idx, 10) });
  },
  onSelectPropsOption(propData, optionData) {
    const dishDataForDetail = this.state.dishData;
    let propIdx = -1;
    switch (propData.type) {
      case 1:
        propIdx = _findIndex(
          dishDataForDetail.order[0].dishPropertyTypeInfos,
          { id:propData.id }
        );
        this.setState({
          dishData: dishDataForDetail.updateIn(
            ['order', 0, 'dishPropertyTypeInfos', propIdx, 'properties'],
            options => options.flatMap(option => {
              if (option.id === optionData.id) {
                return option.set('isChecked', !option.isChecked);
              } else if (option.id !== optionData.id && option.isChecked === true) {
                return option.set('isChecked', false);
              }
              return option;
            })
          ),
        });
        break;
      case 3:
        propIdx = _findIndex(
          dishDataForDetail.order[0].dishPropertyTypeInfos,
          { id:propData.id }
        );
        this.setState({
          dishData: dishDataForDetail.updateIn(
            ['order', 0, 'dishPropertyTypeInfos', propIdx, 'properties'],
            options => options.flatMap(option => {
              if (option.id === optionData.id) {
                return option.set('isChecked', !option.isChecked);
              }
              return option;
            })
          ),
        });
        break;
      case -1: // this is a client workround for ingredientsData, we don't have this value of type on serverside
        this.setState({
          dishData: dishDataForDetail.updateIn(
            ['order', 0, 'dishIngredientInfos'],
            options => options.flatMap(option => {
              if (option.id === optionData.id) {
                return option.set('isChecked', !option.isChecked);
              }
              return option;
            })
          ),
        });
        break;
      default:
    }
  },
  buildGroupDishes(groupData) {
    const remainCount = groupData.orderMax - helper.getDishesCount(groupData.childInfos);
    return groupData.childInfos.map(childDish => (
      <GroupDishChildItem
        key={childDish.id} dishData={childDish} remainCount={remainCount} onDishItemCountChange={this.onChildDishCountChange}
      />
    ));
  },
  render() {
    const { activeGroupIdx, dishData } = this.state;
    const activeGroupDishes = this.buildGroupDishes(dishData.order[0].groups[activeGroupIdx]);
    return (
      <div className="group-dish-detail">
        <DishDetailItem dishData={dishData} onCountChange={this.onGroupDishCountChange} />
        <GroupDishGroupsBar groupsData={dishData.order[0].groups} activeGroupIdx={activeGroupIdx} onGroupItemTap={this.onGroupItemTap} />
        <div className="dishes-container">
          {activeGroupDishes}
        </div>
      </div>
    );
  },
});
