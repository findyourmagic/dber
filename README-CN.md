# DBER | 基于实体连接图的数据库设计工具

[English](README.md)

## 网址及演示

https://dber.tech

![Demo Gif](./dber.gif)

## 功能

1. 可视化数据库结构设计
2. 拖拽生成模型引用关系
3. 一键导出 SQL 语句

## 技术栈

SVG

Next.js(React)

DBML

ArcoDesign

Dexie(indexDB)

Soul CLI(sqlite db)

## 开始

克隆本仓库或者下载代码.

安装依赖.

```bash
npm install
# or
yarn install
```

启动开发服务:

```bash
npm run dev
# or
yarn dev
```

使用浏览器打开 [http://localhost:3000](http://localhost:3000) 查看结果.

在生产模式下运行:

```bash
npm run build && npm run start
```

导出静态页面:

```bash
npm run gen
```

避免刷新时出现 404，服务器需做以下设置(以 `Nginx` 为例)：

```
server {
    listen       80;
    server_name  dber.local.yes-hr.com;
    root   /{you_projects}/dber/out;
    index index.html;

    location /graphs {
        try_files $uri $uri.html /graphs/[id].html;
    }
}
```

## 使用 docker 构建

使用以下命令来构建 Docker 镜像:

```
docker build -t dber .
```

然后可以用 Docker 或者 Docker Compose 来启动服务:

```
docker run -p 3000:3000 dber
```

或者

```bash
docker-compose up -d
```

使用浏览器打开 [http://localhost:3000](http://localhost:3000) 查看结果.

## 协作（简单）功能

使用 [Soul CLI](https://github.com/thevahidal/soul) 实现简单的在线协作功能，使用的是 `sqlite` 数据库。注意：

-   暂时没有权限管理功能，如数据库接口公开，意味着任何人都具有读取、写入权限
-   不支持编辑操作后的实时同步功能
-   启动方式：
    -   安装 Soul CLI 包 `np install -D soul-cli`
    -   编辑 `package.json` 中的 `dbAdaptor` 为 `soul`，并根据实际情况设置 `soulUrl`
    -   执行 `npm run dev` 或者 `npm run build && npm run start` (docker 方式未经测试)

## 受到以下作品启发

[dbdiagram](https://dbdiagram.io/)

[antv x6](https://x6.antv.vision/)
