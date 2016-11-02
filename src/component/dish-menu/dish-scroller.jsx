const React = require('react');
const { findDOMNode } = require('react-dom');
const shallowCompare = require('react-addons-shallow-compare');
const _find = require('lodash.find');
const IScroll = require('iscroll/build/iscroll-lite');
const classnames = require('classnames');
const DishListItem = require('./dish-list-item.jsx');
const setErrorMsg = require('../../action/dish-menu/dish-menu.js').setErrorMsg;
const helper = require('../../helper/dish-hepler');
const imagePlaceholder = require('../../asset/images/dish-placeholder.png');

require('./dish-scroller.scss');

module.exports = React.createClass({
  displayName: 'DishScroller',
  propTypes: {
    activeDishTypeId: React.PropTypes.number.isRequired,
    dishTypesData: React.PropTypes.array.isRequired,
    dishesData: React.PropTypes.array.isRequired,
    onScroll: React.PropTypes.func.isRequired,
    onOrderBtnTap: React.PropTypes.func.isRequired,
    onPropsBtnTap: React.PropTypes.func.isRequired,
    onImageBtnTap: React.PropTypes.func.isRequired,
    marketList: React.PropTypes.object,
    diningForm: React.PropTypes.bool,
    marketListUpdate:React.PropTypes.array,
  },
  getInitialState() {
    return { distance:window.innerHeight - 84 };
  },
  componentWillMount() {
    this._counter = 1;
    this._distance = 0;
  },
  componentDidMount() {
    const { onScroll } = this.props;
    const cache = this._cache = {};
    const iScroll = cache.iScroll = new IScroll(findDOMNode(this), {
      click: true,
      tap: true,
    });
    iScroll.on('scrollStart', () => {
      cache.isScrolling = true;
      if (cache.timer) {
        window.clearTimeout(cache.timer);
        cache.timer = null;
      }
    });
    iScroll.on('scrollEnd', () => {
      const { diningForm, marketListUpdate } = this.props;
      let dishTypeId = '';
      if (diningForm && marketListUpdate.length !== 0) {
        dishTypeId = this.findCurrentDishTypeId(iScroll.y - 34);
      } else {
        dishTypeId = this.findCurrentDishTypeId(iScroll.y);
      }
      if (!window.__activeTypeByTap__ && dishTypeId) {
        if (cache.timer) {
          window.clearTimeout(cache.timer);
        }
        cache.timer = setTimeout(() => onScroll(null, dishTypeId), 150);
      }
      cache.isScrolling = false;
      window.__activeTypeByTap__ = false;
      this.lazyFormat(iScroll);
    });
  },
  shouldComponentUpdate(nextProps, nextState) {
    const cache = this._cache;
    return !cache.isScrolling && shallowCompare(this, nextProps, nextState);
  },
  componentDidUpdate() {
    const cache = this._cache;
    const iScroll = cache.iScroll;
    iScroll.refresh();
    const activeDishType = findDOMNode(this).querySelector('.active');
    if (window.__activeTypeByTap__) { // if update is not caused by scrolling or touching in dish-scroller.
      iScroll.scrollToElement(activeDishType, 300);             // that mean it's caused by activeDishType, so scrollTo the according dish type
    }
  },
  componentWillUnmount() {
    this._cache.iScroll.destroy();
    this._cache = null;
  },
  onDishBtnTap(dishData, action) {
    const { onOrderBtnTap, onPropsBtnTap } = this.props;
    // this._cache.isTaping = true;
    if (action) {
      onOrderBtnTap(dishData, action);
    } else {
      onPropsBtnTap(dishData);
    }
    // setTimeout(() => this._cache.isTaping = false, 0); // set isTaping to false at nextTick of rendering;
  },
  lazyFormat(iScroll) {
    const distance = (iScroll.wrapperHeight) + Math.abs(iScroll.y);
    if (distance > this._distance) {
      this._distance = distance;
      this.setState({ distance });
    }
  },
  findCurrentDishTypeId(posY) {
    const dishTypes = findDOMNode(this).querySelectorAll('.dish-item-type');
    const showingDishTypes = Array.prototype.slice.call(dishTypes).filter(dishType => dishType.offsetTop < -posY + 5);
    this.showingDishLength = showingDishTypes.length;
    if (showingDishTypes.length) {
      return parseInt(showingDishTypes.pop().getAttribute('data-id'), 10);
    }
    return false;
  },
  buildDishElements(activeDishTypeId, dishTypesData, dishesData, onDishBtnTap) {
    this._counter = 1;
    console.log(dishesData);
    function getDishById(dishId) {
      const dish = _find(dishesData, { id:dishId });
      if (!dish) {
        setErrorMsg(`无法找到 ${dishId} 对应的子菜...`);
      }
      return dish;
    }

    function getDishTypeTitle(dishTypeData) {
      if (dishTypeData.desc) {
        return (<span>{dishTypeData.name} <span className="dish-type-desc">{`(${dishTypeData.desc})`}</span></span>);
      }

      return (<span>{dishTypeData.name}</span>);
    }

    return (
      <ul className="dish-list">
      {
        dishTypesData.map((dishTypeData, idx) => {
          if (!dishTypeData.dishIds) {
            return false;
          }
          if (dishTypeData.dishIds.length === 1 && _find(dishesData, { id:dishTypeData.dishIds[0] }).currRemainTotal === 0) {
            // 需要考虑length为1  且菜品信息clearStatus不为1的情况
            return false;
          }
          return (
            [
              <li
                key={`dish-type-${dishTypeData.id}`}
                data-id={dishTypeData.id}
                className={classnames('dish-item-type', { active:activeDishTypeId === dishTypeData.id })}
              >
                {getDishTypeTitle(dishTypeData)}
              </li>,
            ].concat(
              dishTypeData.dishIds.map(dishId => {
                this._counter++;
                const dishData = getDishById(dishId);
                const { distance } = this.state;
                return (
                  <li className="dish-item-dish">
                    {
                      this._counter - 1 <= ((distance - (Number(this.showingDishLength) || 1) * 30) / 88).toFixed(0) ?
                        <DishListItem
                          dishData={dishData}
                          onOrderBtnTap={onDishBtnTap}
                          onPropsBtnTap={onDishBtnTap}
                          onImageBtnTap={this.props.onImageBtnTap}
                          marketList={this.props.marketList}
                          diningForm={this.props.diningForm}
                        />
                      :
                        <div className="dish-on-selling">
                          <div className="dish-list-item dish-list-word">
                            <button
                              className={classnames('dish-item-img', { 'is-memberdish': dishData.isMember })}
                              style={{ backgroundImage: `url(${imagePlaceholder})` }}
                            ></button>
                            <div className="dish-item-content">
                              <span className="dish-item-name ellipsis">{helper.generateDishNameWithUnit(dishData)}</span>
                            </div>
                          </div>
                        </div>
                    }
                  </li>
                );
              })
            )
          );
        })
      }
      </ul>
    );
  },
  render() {
    const { activeDishTypeId, dishTypesData, dishesData } = this.props;
    const dishElements = this.buildDishElements(activeDishTypeId, dishTypesData, dishesData, this.onDishBtnTap);
    return (
      <div className="dish-scroller">
        {/* <div className="scroll-wrapper">*/}
          {dishElements}
        {/* </div>*/}
      </div>
    );
  },
});
