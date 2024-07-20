## Documents

将一些文档制作成文档镜像，方便本地启动预览

## Features

说明：

1. 启动后可浏览支持的文档

2. 页面均尽可能去除广告追踪等外链，但部分 `playground` 依赖外部服务无法静态化

3. 镜像中只包含静态文件和一个非常小的静态服务器(仅2MB左右)

## Supports

支持的文档有：

<!-- supports table start -->

| Name | UpdatedAt | Status | Docker Image Tag | Docker Pulls |
| ------ | ------ | ------ | ------ | ------ |
| vue | [![vue](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fmeta.ikrong.workers.dev%2Fdockerhub%2Fmanifest%2Fdocworld%2Fvue%3Flang%3Dzh-cn&query=%24.last_updated&style=flat-square&label=&color=%2325c2a0)](https://hub.docker.com/r/docworld/vue) | [![vue workflow](https://img.shields.io/github/actions/workflow/status/ikrong/documents/vue.yml?style=flat-square)](https://github.com/ikrong/documents/actions/workflows/vue.yml) | docworld/vue:latest<br/>docworld/vue:zh-latest<br/>docworld/vue:2<br/>docworld/vue:zh-2 | [![vue pulls](https://img.shields.io/docker/pulls/docworld/vue?color=%232d9cec&label=%2B&style=flat-square)](https://hub.docker.com/r/docworld/vue) |
| react | [![react](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fmeta.ikrong.workers.dev%2Fdockerhub%2Fmanifest%2Fdocworld%2Freact%3Flang%3Dzh-cn&query=%24.last_updated&style=flat-square&label=&color=%2325c2a0)](https://hub.docker.com/r/docworld/react) | [![react workflow](https://img.shields.io/github/actions/workflow/status/ikrong/documents/react.yml?style=flat-square)](https://github.com/ikrong/documents/actions/workflows/react.yml) | docworld/react:latest<br/>docworld/react:zh-latest | [![react pulls](https://img.shields.io/docker/pulls/docworld/react?color=%232d9cec&label=%2B&style=flat-square)](https://hub.docker.com/r/docworld/react) |
| angular | [![angular](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fmeta.ikrong.workers.dev%2Fdockerhub%2Fmanifest%2Fdocworld%2Fangular%3Flang%3Dzh-cn&query=%24.last_updated&style=flat-square&label=&color=%2325c2a0)](https://hub.docker.com/r/docworld/angular) | [![angular workflow](https://img.shields.io/github/actions/workflow/status/ikrong/documents/angular.yml?style=flat-square)](https://github.com/ikrong/documents/actions/workflows/angular.yml) | docworld/angular:latest | [![angular pulls](https://img.shields.io/docker/pulls/docworld/angular?color=%232d9cec&label=%2B&style=flat-square)](https://hub.docker.com/r/docworld/angular) |
| docker | [![docker](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fmeta.ikrong.workers.dev%2Fdockerhub%2Fmanifest%2Fdocworld%2Fdocker%3Flang%3Dzh-cn&query=%24.last_updated&style=flat-square&label=&color=%2325c2a0)](https://hub.docker.com/r/docworld/docker) | [![docker workflow](https://img.shields.io/github/actions/workflow/status/ikrong/documents/docker.yml?style=flat-square)](https://github.com/ikrong/documents/actions/workflows/docker.yml) | docworld/docker:latest | [![docker pulls](https://img.shields.io/docker/pulls/docworld/docker?color=%232d9cec&label=%2B&style=flat-square)](https://hub.docker.com/r/docworld/docker) |
| echarts | [![echarts](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fmeta.ikrong.workers.dev%2Fdockerhub%2Fmanifest%2Fdocworld%2Fecharts%3Flang%3Dzh-cn&query=%24.last_updated&style=flat-square&label=&color=%2325c2a0)](https://hub.docker.com/r/docworld/echarts) | [![echarts workflow](https://img.shields.io/github/actions/workflow/status/ikrong/documents/echarts.yml?style=flat-square)](https://github.com/ikrong/documents/actions/workflows/echarts.yml) | docworld/echarts:latest | [![echarts pulls](https://img.shields.io/docker/pulls/docworld/echarts?color=%232d9cec&label=%2B&style=flat-square)](https://hub.docker.com/r/docworld/echarts) |
| element-plus | [![element-plus](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fmeta.ikrong.workers.dev%2Fdockerhub%2Fmanifest%2Fdocworld%2Felement-plus%3Flang%3Dzh-cn&query=%24.last_updated&style=flat-square&label=&color=%2325c2a0)](https://hub.docker.com/r/docworld/element-plus) | [![element-plus workflow](https://img.shields.io/github/actions/workflow/status/ikrong/documents/element-plus.yml?style=flat-square)](https://github.com/ikrong/documents/actions/workflows/element-plus.yml) | docworld/element-plus:latest | [![element-plus pulls](https://img.shields.io/docker/pulls/docworld/element-plus?color=%232d9cec&label=%2B&style=flat-square)](https://hub.docker.com/r/docworld/element-plus) |
| electron | [![electron](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fmeta.ikrong.workers.dev%2Fdockerhub%2Fmanifest%2Fdocworld%2Felectron%3Flang%3Dzh-cn&query=%24.last_updated&style=flat-square&label=&color=%2325c2a0)](https://hub.docker.com/r/docworld/electron) | [![electron workflow](https://img.shields.io/github/actions/workflow/status/ikrong/documents/electron.yml?style=flat-square)](https://github.com/ikrong/documents/actions/workflows/electron.yml) | docworld/electron:latest | [![electron pulls](https://img.shields.io/docker/pulls/docworld/electron?color=%232d9cec&label=%2B&style=flat-square)](https://hub.docker.com/r/docworld/electron) |
| sass | [![sass](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fmeta.ikrong.workers.dev%2Fdockerhub%2Fmanifest%2Fdocworld%2Fsass%3Flang%3Dzh-cn&query=%24.last_updated&style=flat-square&label=&color=%2325c2a0)](https://hub.docker.com/r/docworld/sass) | [![sass workflow](https://img.shields.io/github/actions/workflow/status/ikrong/documents/sass.yml?style=flat-square)](https://github.com/ikrong/documents/actions/workflows/sass.yml) | docworld/sass:latest | [![sass pulls](https://img.shields.io/docker/pulls/docworld/sass?color=%232d9cec&label=%2B&style=flat-square)](https://hub.docker.com/r/docworld/sass) |
| gorm | [![gorm](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fmeta.ikrong.workers.dev%2Fdockerhub%2Fmanifest%2Fdocworld%2Fgorm%3Flang%3Dzh-cn&query=%24.last_updated&style=flat-square&label=&color=%2325c2a0)](https://hub.docker.com/r/docworld/gorm) | [![gorm workflow](https://img.shields.io/github/actions/workflow/status/ikrong/documents/gorm.yml?style=flat-square)](https://github.com/ikrong/documents/actions/workflows/gorm.yml) | docworld/gorm:latest | [![gorm pulls](https://img.shields.io/docker/pulls/docworld/gorm?color=%232d9cec&label=%2B&style=flat-square)](https://hub.docker.com/r/docworld/gorm) |
| gin | [![gin](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fmeta.ikrong.workers.dev%2Fdockerhub%2Fmanifest%2Fdocworld%2Fgin%3Flang%3Dzh-cn&query=%24.last_updated&style=flat-square&label=&color=%2325c2a0)](https://hub.docker.com/r/docworld/gin) | [![gin workflow](https://img.shields.io/github/actions/workflow/status/ikrong/documents/gin.yml?style=flat-square)](https://github.com/ikrong/documents/actions/workflows/gin.yml) | docworld/gin:latest | [![gin pulls](https://img.shields.io/docker/pulls/docworld/gin?color=%232d9cec&label=%2B&style=flat-square)](https://hub.docker.com/r/docworld/gin) |
| tailwindcss | [![tailwindcss](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fmeta.ikrong.workers.dev%2Fdockerhub%2Fmanifest%2Fdocworld%2Ftailwindcss%3Flang%3Dzh-cn&query=%24.last_updated&style=flat-square&label=&color=%2325c2a0)](https://hub.docker.com/r/docworld/tailwindcss) | [![tailwindcss workflow](https://img.shields.io/github/actions/workflow/status/ikrong/documents/tailwindcss.yml?style=flat-square)](https://github.com/ikrong/documents/actions/workflows/tailwindcss.yml) | docworld/tailwindcss:latest | [![tailwindcss pulls](https://img.shields.io/docker/pulls/docworld/tailwindcss?color=%232d9cec&label=%2B&style=flat-square)](https://hub.docker.com/r/docworld/tailwindcss) |

<!-- supports table end -->

目前部分镜像也发布在阿里云上了，如：

```shell
docker pull docworld/gin:latest
# 阿里云拉取命令为：
docker pull registry.cn-beijing.aliyuncs.com/docworld/gin:latest
```

## LICENSE

MIT LICENSE