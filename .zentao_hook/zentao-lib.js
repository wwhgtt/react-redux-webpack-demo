/* eslint-disable no-var,prefer-template,no-return-assign */
const fs = require('fs');
const http = require('http');
const config = require(process.cwd() + '/.zentaorc.js');
const URI = exports.URI = {
  DOMAIN: 'zentao.shishike.com',
  SESSION: '/index.php?m=api&f=getSessionID&t=json',
  LOGIN: '/index.php?m=user&f=login&t=json',
  TASK: '/index.php?m=task&f=view',
  WORK: '/index.php?m=task&f=recordEstimate',

};

exports.getCommitMSGFromFile = function (filePath) {
  var commitMSG = { taskID:0, workHour:0, remainHour:0, comment:'' };
  var commitMSGString = fs.readFileSync(filePath, { encoding:'utf8' }).split('\n');
  commitMSGString.forEach((ele, idx) => {
    Object.keys(commitMSG).forEach(key => {
      if (!commitMSG[key]) {
        commitMSG[key] = new RegExp('^' + key).test(ele) ? ele.split(':')[1].replace(/^\s+|\s+$/g, '') : false;
      }
    });
  });
  return !isNaN(parseInt(commitMSG.taskID, 10)) && !isNaN(parseFloat(commitMSG.workHour)) ? commitMSG : false;
};

exports.getCommitMSGTemplate = function () {
  return 'taskID:${Your Zentao Task ID} \n' +
         'workHour:${How long it takes for this commit} \n' +
         'remainHour:${How much longer will it take for this task}\n' +
         'comments:${Your comments} \n';
};

exports.getSession = function () {
  return new Promise((resolve, reject) => {
    var session = '';
    http.get('http://' + URI.DOMAIN + URI.SESSION, sessionRes => {
      sessionRes.on('data', chunk => { session = session + chunk; return session; });
      sessionRes.on('end', () => { session = JSON.parse(session); session.data = JSON.parse(session.data); resolve(session); return session; });
    }).on('error', e => reject(e));
  });
};

exports.doLogin = function (session) {
  return new Promise((resolve, reject) => {
    const account = config.account;
    const password = config.password;
    var login = '';
    if (!account || !password) {
      reject({ message:'Can not read account or password from .zentaorc.js' });
      return false;
    }
    const req = http.request(
      {
        host:URI.DOMAIN, path:URI.LOGIN + '&sid=' + session.data.sessionID, method:'POST',
        headers:{ 'content-type': 'application/x-www-form-urlencoded' },
      },
      loginRes => {
        loginRes.on('data', chunk => login = login + chunk);
        loginRes.on('end', () => {
          login = JSON.parse(login);
          if (login.status === 'failed') {
            reject({ message: 'Failed to login zentao system, ' + login.reason });
          } else {
            resolve(session);
          }
        });
      });
    req.end('account=' + account + '&password=' + password);
    return true;
  });
};
exports.checkTaskStatus = function (taskID, session) {
  return new Promise((resolve, reject) => {
    var task = '';
    http.get('http://' + URI.DOMAIN + URI.TASK + '&task=' + taskID + '&t=json&sid=' + session.data.sessionID, res => {
      res.on('data', chunk => task = task + chunk);
      res.on('end', () => {
        try {
          task = JSON.parse(task);
          task.data = JSON.parse(task.data);
        } catch (e) {
          reject({ message:'Check Task Failed!' });
          return;
        }
        if (task.data.task.status !== 'doing') {
          reject({ message:'Check Task Failed!' });
          return;
        }
        resolve(true);
        return;
      });
    });
  });
};

exports.recordWork = function (commitMSG, session) {
  return new Promise((resolve, reject) => {
    var work = '';
    const date = new Date();
    const req = http.request(
      {
        host:URI.DOMAIN, path:URI.WORK + '&taskID=' + commitMSG.taskID + '&sid=' + session.data.sessionID, method:'POST',
        headers:{ 'content-type': 'application/x-www-form-urlencoded' },
      }, res => {
      res.on('data', chunk => work = work + chunk);
      res.on('end', () => {
        resolve(true);
      });
    });
    req.end(
      'id[1]=1' +
      '&dates[1]=' + date.getFullYear() + '-' + date.getMonth() + '-' + date.getDate() +
      '&consumed[1]=' + commitMSG.workHour +
      '&left[1]=' + commitMSG.remainHour +
      '&work[1]=' + commitMSG.comment
    );
    req.on('error', e => {
      reject({ message:e.message });
    });
  });
};
