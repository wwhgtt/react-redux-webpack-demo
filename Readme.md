# 客如云微信点餐前端项目

## 项目介绍

客如云微信点餐项目（onPortal）前后端分离后，前端部分采用 React + Redux 为主要框架基础进行了重构，并配合 Webpack 为主相关工具建立了单机开发环境。

### 开发环境搭建

#### 前置条件：
1. 已通过 homebrew 安装好 nondejs;  
http://brew.sh/
2. 已通过 ruby gem 安装好 overcommit;  
https://github.com/brigade/overcommit#installation

1. clone 项目 git repo 到本地,并进入到项目根目录
2. 执行 ｀npm install｀，并确认安装过程成功完成
3. 执行  
 `overcommit --install && overcommit --sign && overcommit --sign pre-commit && overcommit --sign post-commit && overcommit --sign commit-msg`   

4. 创建 .zentaorc.js 文件，并输入以下内容
 ```
 module.exports = {
   account: ${你的禅道ID},
   password: ${你的禅道密码}
 };
 ```
5. 在 .git/config 文件尾部添加如下内容：
```
[commit]
    template=.zentao_hook/zentao-template.txt
```
6. 执行 `export DEV_HOST=${你的本机 IP}`
7. 执行 `npm run start`，并使用
