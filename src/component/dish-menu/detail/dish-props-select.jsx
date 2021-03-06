const React = require('react');
const Immutable = require('seamless-immutable');
const classnames = require('classnames');
const ActiveSelect = require('../../mui/select/active-select.jsx');
const DishPropsOption = require('./dish-props-option.jsx');

require('./dish-props-select.scss');

module.exports = React.createClass({
  displayName: 'DishPropsSelect',
  propTypes: {
    dish:React.PropTypes.object.isRequired,
    dishData:React.PropTypes.object,
    onSelectPropsOption: React.PropTypes.func,
    onDishRuleChecked:React.PropTypes.func,
  },
  onSelectPropsOption(recipeData, optionData) {
    this.props.onSelectPropsOption(recipeData, optionData);
  },
  onDishRuleChecked(id, dishOptions, immutableDish) {
    const { onDishRuleChecked } = this.props;
    if (dishOptions.clearStatus) {
      return false;
    }
    onDishRuleChecked(id, dishOptions, immutableDish);
    return true;
  },
  buildRule(dish) {
    if (!dish || !dish.sameRuleDishes) {
      return false;
    }
    let ruleElements = [];
    let ruleCollection = dish.dishPropertyTypeInfos.filter(property => property.type === 4);
    for (let i = 0; i < ruleCollection.length; i++) {
      let elementCollection = [];
      // 规格内容
      let ruleTitle = ruleCollection[i].id;
      dish.sameRuleDishes.map(ruleDish =>
        ruleDish.dishPropertyTypeInfos.filter(property => property.type === 4).map(
          property => {
            if (property.id === ruleTitle) {
              property.properties.map(prop =>
                elementCollection.push(
                  <button
                    className={classnames('dish-porps-option', { 'is-checked':prop.isChecked, 'is-disable':ruleDish.clearStatus })}
                    onTouchTap={evt => this.onDishRuleChecked(prop.id, ruleDish, dish)}
                    key={+prop.id + Math.random() * 10000 + 1}
                  >
                    <span className="extra">{prop.reprice ? `+${prop.reprice}元` : false}</span>
                    <span className="name ellipsis">{prop.name}</span>
                  </button>
                )
              );
            }
            return false;
          }
        )
      );
      ruleElements.push(
        <div className="recipe-group clearfix" key={ruleCollection[i].id}>
          <span className="recipe-title">{ruleCollection[i].name}</span>
          <button
            className={
              classnames('dish-porps-option',
                { 'is-checked':ruleCollection[i].properties[0].isChecked, 'is-disable':dish.clearStatus }
              )}
            onTouchTap={evt => this.onDishRuleChecked(ruleCollection[i].properties[0].id, dish, dish)}
            key={+ruleCollection[i].properties[0].id + Math.random() * 10000 + 1}
          >
            <span className="extra">{
              ruleCollection[i].properties[0].reprice ?
                `+${ruleCollection[i].properties[0].reprice}元`
                :
                false
            }</span>
            <span className="name ellipsis">{ruleCollection[i].properties[0].name}</span>
          </button>
          {elementCollection.length ?
            elementCollection.map(element => element)
            :
            false
          }
        </div>
      );
    }
    return ruleElements;
  },
  buildRecipe(props) {
    const recipesData = props.filter((propData => propData.type === 1));
    if (recipesData.length === 0) {
      return false;
    }
    return recipesData.map(recipeData => (
      <div className="recipe-group" key={recipeData.id}>
        <span className="recipe-title">{recipeData.name}</span>
        <ActiveSelect
          optionsData={recipeData.properties} optionComponent={DishPropsOption}
          onSelectOption={(evt, optionData) => this.onSelectPropsOption(recipeData, optionData)}
        />
      </div>
    ));
  },
  buildNote(props) {
    const notesData = props.filter((propData => propData.type === 3));
    if (notesData.length === 0) {
      return false;
    }
    return notesData.map(noteData => (
      <div className="note-group" key={noteData.id}>
        <span className="note-title">{noteData.name}</span>
        <ActiveSelect
          optionsData={noteData.properties} optionComponent={DishPropsOption}
          onSelectOption={(evt, optionData) => this.onSelectPropsOption(noteData, optionData)}
        />
      </div>
    ));
  },
  buildIngredient(ingredients) {
    const wrappedIngredientsData = Immutable.from([{ name:'配料', type: -1, properties:ingredients }]);
    if (wrappedIngredientsData[0].properties.length === 0) {
      return false;
    }
    return wrappedIngredientsData.map(wrappedIngredientData => (
      <div className="ingredient-group" key={'ingredient'}>
        <span className="ingredient-title">{wrappedIngredientData.name}</span>
        <ActiveSelect
          optionsData={wrappedIngredientData.properties} optionComponent={DishPropsOption}
          onSelectOption={(evt, optionData) => this.onSelectPropsOption(wrappedIngredientData, optionData)}
        />
      </div>
    ));
  },
  render() {
    const { dish, dishData } = this.props;
    const ruleElement = this.buildRule(dishData);
    const recipeElement = !dish.clearStatus ? this.buildRecipe(dish.order[0].dishPropertyTypeInfos || []) : false;
    const noteElement = !dish.clearStatus ? this.buildNote(dish.order[0].dishPropertyTypeInfos || []) : false;
    const buildIngredientElement = !dish.clearStatus ? this.buildIngredient(dish.order[0].dishIngredientInfos || []) : false;
    return (
      <div className="dish-props-select flex-rest">
        {ruleElement ? ruleElement.map(ele => ele) : false}
        <div className="clearfix"></div>
        {recipeElement}
        {buildIngredientElement}
        {noteElement}
      </div>
    );
  },
});
