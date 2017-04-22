toolkit-site
======

### 变量说明

|变量名|说明|
|--|--|
|langpath|语言部分的uri|
|funcpath|除去语言部分的uri，包括/|
|sitename|站点名，不需要i18n|
|tool|工具的根目录名，工具的索引|
|lang|语言|
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
    │   ├── script.js
    │   └── vkbeautify.js
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
