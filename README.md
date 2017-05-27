toolkit-site
======

## TODO

 - [ ] tool verify tool
 - [ ] server proccess manager
 - [ ] config i18n
 - [ ] DevOps auto deplay
 - [ ] webhooks auto send twitter
 - [ ] switch to [materialize](https://github.com/dogfalo/materialize/)

## Developer Document

### 目录结构

```
.
├── locales (整站i18n文件)
├── src
|   ├── controllers.js (控制器模块)
|   ├── helper.js (辅助函数)
|   ├── i18n.js (国际化模块)
|   ├── install.js (安装脚本)
|   ├── loader.js (工具加载模块)
|   ├── renderer.js (渲染器模块)
|   └── server.js (服务器入口)
├── public (公开目录)
├── static (静态资源目录)
├── tmp (临时文件目录)
├── tools (工具目录)
├── package.json
├── README.md
└── index.js

```

### 变量说明

|变量名|说明|
|--|--|
|req.langpath|语言部分的uri|
|req.funcpath|除去语言部分的uri，包括/|
|req.lang|语言，在中间件中加入|
|sitename|站点名，不需要i18n|
|tool|工具的根目录名，工具的索引|
|langlist|语言列表，对象数组|
|tools|工具列表，索引为tool的对象|
|cates|分类列表，索引为分类的对象|
|tags|标签列表，索引为标签的对象|
|__|整站i18n的翻译函数|

### 工具规范

#### 目录结构

```
└── [tool] (根目录名，即为tool)
    ├── api.js (工具的后端部分)
    ├── index.ejs (工具前端模板)
    ├── locales (语言文件目录)
    │   ├── en_US.json (默认语言，必须完整存在)
    │   └── zh_CN.json
    ├── static (静态资源目录，可以在`tool.json`中使用@加文件名引入)
    │   └── script.js
    └── tool.json (配置文件，必须存在)

```

#### 配置文件

```js
{
  "date": "2017-04-17", // 更新日期，推荐时使用，必须
  "css": [ // 引入的css资源
  ],
  "script": [ // 映入的js资源
    "@script.js"
  ],
  "tag": [ // 标签，为标签列表中所存在的
    "base64",
    "converter"
  ],
  "cate": [ // 分类，为分类列表中所存在的，作为工具的链接入口。必须存在
    "developer"
  ],
  "display": "none" // 如果存在此条则忽略此工具，临时隐藏使用
}

```

#### api.js文件

 - 作为一个模块，最终导出一个express router类型的对象
 - 路由实际为`/${toolname}/api/`的子路由，可以自行设置各种路由规则，前端的xhr请求路径正确即可

#### 语言文件

 - 必须存在`toolname`和`description`两个条目用于父级模板中工具名和简介的显示
 - `description`可以为一个字符串数组，分类页的工具卡片将会取其中第一个字符串为子标题。而工具页则会以一个无序列表输出该数组
 - 其他条目会在模板中自动加载可以直接使用`<%= 变量名 %>`
 - 字段名应当全部为小写字母

### Usage

暂时如下

0. 执行 `npm install`
0. 修改 `config.json`
0. 执行 `npm start`

### 配置文件

```js
{
    debug: false, // 开发模式
    gaid: '0', // Google Analytics ID
    domain: 'localhost', // 域名
}
```
