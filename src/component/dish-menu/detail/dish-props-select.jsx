const React = require('react');
const ActiveSelect = require('../../mui/select/active-select.jsx');
const DishPropsOption = require('./dish-props-option.jsx');
module.exports = React.createClass({
  displayName: 'DishPropsSelect',
  propTypes: {
    propsData: React.PropTypes.array,
    ingredientsData: React.PropTypes.array,
  },
  buildRecipe(propsData) {
    const recipesData = propsData.filter((propData => propData.type === 1));
    return recipesData.map(recipeData => (
      <div className="recipe-group" key={recipeData.id}>
        <span className="recipe-title">{recipeData.name}</span>
        <ActiveSelect optionsData={recipeData.properties} optionComponent={DishPropsOption} onSelectOption={evt => {}} />
      </div>
    ));
  },
  buildNote(propsData) {
    const notesData = propsData.filter((propData => propData.type === 3));
    return notesData.map(noteData => (
      <div className="note-group" key={noteData.id}>
        <span className="note-title">{noteData.name}</span>
        <ActiveSelect optionsData={noteData.properties} optionComponent={DishPropsOption} onSelectOption={evt => {}} />
      </div>
    ));
  },
  buildIngredient(ingredientsData) {

  },
  render() {
    const { propsData } = this.props;
    const recipeElement = this.buildRecipe(propsData);
    const noteElement = this.buildNote(propsData);
    return (
      <div className="dish-props-select">
        {recipeElement}
        {noteElement}
      </div>
    );
  },
});
