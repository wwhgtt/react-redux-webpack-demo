#!/usr/bin/env node
/* eslint-disable */
const styleLint = require('stylelint');

styleLint.lint({
  files: './src/**/*.scss',
  formatter: 'string',
  syntax: 'scss'
}).then(data => {
  if (!!data.output) {
    process.stderr.write('\nStyleLint Failed.\n');
    process.stderr.write(data.output);
    process.exit(1);
  }
}).catch(err => {
  process.stderr.write(err.stack);
  process.exit(1);
});
