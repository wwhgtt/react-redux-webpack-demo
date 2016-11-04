const React = require('react');
const Immutable = require('seamless-immutable');
const ActiveSelect = require('../../mui/select/active-select.jsx');
const DishPropsOption = require('./dish-props-option.jsx');

require('./dish-props-select.scss');

module.exports = React.createClass({
  displayName: 'DishPropsSelect',
  propTypes: {
    dish:React.PropTypes.object.isRequired,
    props: React.PropTypes.array,
    ingredients: React.PropTypes.array,
    onSelectPropsOption: React.PropTypes.func,
    onDishRuleChecked:React.PropTypes.func.isRequired,
  },
  getDefaultProps() {
    return {
      props: [],
      ingredients: [],
    };
  },
  onSelectPropsOption(recipeData, optionData) {
    this.props.onSelectPropsOption(recipeData, optionData);
  },
  buildRule(dish) {
    if (!dish.sameRuleDishes) {
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
                  <button className="dish-porps-option" onTouchTap={evt => this.props.onDishRuleChecked(prop.id, dish)} key={prop.id}>
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
            className="dish-porps-option"
            onTouchTap={evt => this.props.onDishRuleChecked(ruleCollection[i].properties[0].id, dish)}
            key={ruleCollection[i].properties[0].id}
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
    const { props, ingredients, dish } = this.props;
    const ruleElement = this.buildRule(dish);
    const recipeElement = this.buildRecipe(props);
    const noteElement = this.buildNote(props);
    const buildIngredientElement = this.buildIngredient(ingredients);
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
