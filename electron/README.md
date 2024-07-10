## Description

有时候国内访问文档特别慢，所以做了一个镜像，方便本地查看文档。

## electron

electron 文档

## 本地启动方式

```shell
docker run -ti --rm --init -p 8080:80 docworld/electron:latest
```

然后本地访问 http://localhost:8080 即可访问
