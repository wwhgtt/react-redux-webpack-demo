import {createAction} from 'redux-actions';
exports.setChildView = createAction('SET_CHILDVIEW', viewHash => viewHash);