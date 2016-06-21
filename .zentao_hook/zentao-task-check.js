#!/usr/bin/env node
/* eslint-disable */
const http = require('http');
const lib = require('./zentao-lib.js');
const config = require(process.cwd() + '/.zentaorc.js');

const commitMSG = lib.getCommitMSGFromFile(process.cwd() + '/' + process.argv[2]);
if (!commitMSG) {
  process.stderr.write('Parse commit message failed. The following lines MUST be included\n');
  process.stderr.write(lib.getCommitMSGTemplate());
  process.exit(1);
}

lib.getSession().
  then(lib.doLogin).
  then(session => lib.checkTaskStatus(commitMSG.taskID,session)).
  then(taskStatus => taskStatus ? process.exit(0) : false ).
  catch(e => {process.stderr.write(e.message + '\n');process.exit(1);});
