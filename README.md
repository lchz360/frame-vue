# vue版本的qframe，前端部分

本框架在iview-admin的基础上修改而来。

## 安装

```shell
npm install
```

## 目录结构

~~~file
root                    项目根目录
├─extend                扩展文件
│  └─autoRouter.js      路由注入文件
|
├─public                公共文件
│
├─src                   代码目录
│  ├─assets             资源文件
|  ├─components         自定义组件
|  |  ├─singleImage     图片上传
|  |  └─...             其他组件参考iview-admin文档和示例
|  |
|  ├─config             配置文件
|  |
|  ├─directive          自定义指令
|  |  └─module
|  |     ├─auth         权限控制
|  |     └─...          其他指令参考iview-admin文档和示例
|  |
|  ├─libs               库方法
|  |
|  ├─mixins             混入文件
|  |  ├─addPage.js      添加页公共方法
|  |  ├─editPage.js     修改页公共方法
|  |  └─indexPage.js    列表页公共方法
|  |
|  ├─router             路由相关文件
|  |
|  ├─store              vuex相关文件
|  |
|  ├─theme              主题文件
|  ├─views              视图文件（页面所在目录）
|  |  ├─example         示例目录
|  |  |  ├─index.vue    列表页
|  |  |  ├─add.vue      添加页
|  |  |  ├─edit.vue     修改页
|  |  |  ├─meta.yml     路由注入的meta字段配置
|  |  |  └─...          更多页面
|  |  └─...             更多
|  |
|  └─main.js
│
├─.env                  环境配置文件
│
└─package.json          依赖 定义文件
~~~

## 环境配置

项目根目录中有`.env`文件，为项目环境配置，详细介绍如下：

```env
VUE_APP_SERVER_DOMAIN='http://www.qwangluo.net' //项目域名
VUE_APP_SITE_NAME='qframe-vue' //项目名，在网页title中使用
```

因不同开发者配置的域名不同，提供开发版本配置方式，自行在项目根目录创建`.env.development.local`文件，配置项与`.env`内一致，此配置仅开发版本有效。

## 路由自动注入

程序监测`src/views`中的`.vue`文件，一旦发生变化则自动重新生成路由，路由文件在`src/router/route.js`中，针对此文件的任何修改都是无效的。

生成的路由path为`目录名/文件名`,当文件名为index时则只包含目录名；路由name为`首字母大写的目录名/首字母大写的文件名`；同时，读取同目录下的`meta.yml`作为路由的meta字段。详见示例：

假设有以下目录结构：

```file
views              视图文件（页面所在目录）
├─example         示例目录
|  ├─index.vue    列表页
|  ├─add.vue      添加页
|  ├─edit.vue     修改页
|  ├─meta.yml     路由注入的meta字段配置
|  └─...          更多页面
```

其中meta.yml内容为：

```yml
index:
 title: 示例页面
add:
 title: 添加
edit:
 title: 修改
```

则生成的路由为：

```js
{
    name: "Example",
    path: "/example",
    component: () => import('../views/example/index.vue'),
    meta: {
        title: "示例页面",
        breadcrumb: [{name: "示例页面"}]
    }
},
{
    name: "ExampleAdd",
    path: "/example/add",
    component: () => import('../views/example/add.vue'),
    meta: {
        title: "添加",
        breadcrumb: [{name:"示例页面",to:"/example"},{name: "添加"}]
    }
},
{
    name: "ExampleEdit",
    path: "/example/edit",
    component: () => import('../views/example/edit.vue'),
    meta: {
        title: "修改",
        breadcrumb: [{name:"示例页面",to:"/example"},{name: "修改"}]
    }
}
```

## 权限控制

在需要根据权限显示的组件上增加`v-auth`指令，这个指令会读取同组件的`to`属性的值用作判断，如果需要自定义权限值，则向指令中传入即可，详见下方示例（**此功能仅控制相关组件的显隐，后台必须进行权限控制**）：

```html
<router-link v-auth :to="'member'" ></router-link>
<!-- 对应权限为'member/index' -->
```

```html
<router-link v-auth :to="'member/edit?id=3'" ></router-link>
<!-- 对应权限为'member/edit' -->
```

```html
<router-link v-auth="'member/add?type=3'" :to="'member'"></router-link>
<!-- 对应权限为'member/add?type=3' -->
```

```html
<span v-auth="'member/add?type=3'" ></span>
<!-- 对应权限为'member/add?type=3' -->
```

## 启动

```shell
//开发版本
npm run serve

//发布版本，将在dist目录生成
npm run build
```

## 基于GitLab的自动部署

使用GitLab CI/CD功能实现代码自动打包部署，以下文档认为已配置好gitlab执行器（`GitLab Runner`）

* 将项目根目录下的`.gitlab-ci.yml.example`重命名为`.gitlab-ci.yml`;
* 将文件内的路径修改为项目路径，并配置执行器tag，具体如下

```shell
deploy_prod_job:
  stage: deploy_prod
  only:
    - master
  script:
    - cd dist
    #删除之前的文件
    - sudo -u www rm -rf [网站目录下，如果文件夹重名需注意不要删除多了]
    #复制打包的文件到网站目录
    - sudo -u www cp -r ./* [网站目录]
  tags:
    - [执行器tag]
```

## 相关文档

* [vue](https://cn.vuejs.org/v2/guide/)
* [iview](https://www.iviewui.com/docs/guide/install)
* [iview-admin代码](https://github.com/iview/iview-admin)
* [iview-admin文档](https://lison16.github.io/iview-admin-doc/#/) (**仅【全局指令】和【组件】部分有效，其他功能已被更改**)
* [iview-admin预览](https://admin.iviewui.com)
* [安装GitLab Runner](https://docs.gitlab.com/runner/install/)
* [注册GitLab Runners](https://docs.gitlab.com/runner/register/)
