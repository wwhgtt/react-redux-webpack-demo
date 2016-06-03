const React = require('react');
const shallowCompare = require('react-addons-shallow-compare');
const classnames = require('classnames');
const _pickBy = require('lodash._pickbycallback');
const _mapKeys = require('lodash.mapkeys');

module.exports = function (Component) {
  return React.createClass({
    displayName:'DynamicClassHOC',
    propTypes: {
      className: React.PropTypes.string,
      children: React.PropTypes.any,
    },
    shouldComponentUpdate(nextProps, nextState) {
      return shallowCompare(this, nextProps, nextState);
    },
    componentWillUpdate() {
    },
    render() {
      const { className, children, ...props } = this.props;
      const classProps = _pickBy(props, (v, k) => /^is/.test(k));
      const transformedClassProps = _mapKeys(classProps, (v, k) => {
        const lowerKey = /^is(.*)/.exec(k)[1].toLowerCase();
        return `is-${lowerKey}`;
      });
      const otherProps = _pickBy(props, (v, k) => !/^is/.test(k));
      return (
        <Component className={classnames(className, transformedClassProps)} {...otherProps} >{children}</Component>
        // React.createElement(Component, Object.assign({}, { className:classnames(className, transformedClassProps) }, otherProps), children)
      );
    },
  });
};
