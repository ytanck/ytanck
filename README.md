## 基础命令


```
hexo new [layout] <title>
```
新建一篇文章,如果没有设置 layout 的话，默认使用 _config.yml 中的 default_layout 参数代替。


新建目录/页面，默认情况下，Hexo 会使用文章的标题来决定文章文件的路径。对于独立页面来说，Hexo 会创建一个以标题为名字的目录，并在目录中放置一个 index.md 文件。你可以使用 --path 参数来覆盖上述行为、自行决定文件的目录：
```
hexo new page --path about/me "About me"
```
以上命令会创建一个 source/about/me.md 文件，同时 Front Matter 中的 title 为 "About me"