toolkit-site
======

### 目录结构

```
.
├── locales (整站i18n文件)
├── static (静态资源目录)
├── tmp (临时文件目录)
├── tools (工具目录)
├── views (视图模板)
├── i18n.js (i18n模块)
├── loader.js (工具加载模块)
├── package.json
├── README.md
├── renderer.js (渲染器模块)
├── render.js
└── server.js (服务器入口)

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

目录结构

```
└── [tool] (根目录名，即为tool)
    ├── index.ejs (工具前端模板)
    ├── locales (语言文件目录)
    │   ├── en_US.json (默认语言，必须完整存在)
    │   └── zh_CN.json
    ├── static (静态资源目录，可以使用@加文件名引入)
    │   └── script.js
    └── tool.json (配置文件，必须存在)

```

配置文件

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

语言文件

 - 必须存在`toolname`和`description`两个条目用于父级模板中工具名和简介的显示
 - `description`可以为一个字符串数组，分类页的工具卡片将会取其中第一个字符串为子标题。而工具页则会以一个无序列表输出该数组
 - 其他条目会在模板中自动加载可以直接使用`<%= 变量名 %>`
