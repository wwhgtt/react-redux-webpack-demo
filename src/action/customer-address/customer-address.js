const createAction = require('redux-actions').createAction;
require('es6-promise');
require('isomorphic-fetch');
exports.setChildView = createAction('SET_CHILDVIEW', viewHash => viewHash);
