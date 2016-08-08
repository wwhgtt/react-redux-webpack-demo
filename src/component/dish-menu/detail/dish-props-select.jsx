const React = require('react');
const Immutable = require('seamless-immutable');
const ActiveSelect = require('../../mui/select/active-select.jsx');
const DishPropsOption = require('./dish-props-option.jsx');

require('./dish-props-select.scss');

module.exports = React.createClass({
  displayName: 'DishPropsSelect',
  propTypes: {
    props: React.PropTypes.array,
    ingredients: React.PropTypes.array,
    onSelectPropsOption: React.PropTypes.func,
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
    const { props, ingredients } = this.props;
    const recipeElement = this.buildRecipe(props);
    const noteElement = this.buildNote(props);
    const buildIngredientElement = this.buildIngredient(ingredients);
    return (
      <div className="dish-props-select flex-rest">
        {recipeElement}
        {buildIngredientElement}
        {noteElement}
      </div>
    );
  },
});
