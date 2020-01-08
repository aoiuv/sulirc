## 前言

笔者主要工作为前端工程师，技术栈为 Nodejs、TypeScript、React、Git 等。对 Bash、Haskell 等也十分感兴趣。
技术之外，音乐、素描、文学、心理学等等都有较为浓厚的兴趣。

## 目录

自己看吧

## 脚本

目录生成脚本

```bash
ls | grep -E '[^README|REFERENCE].*\.md' | sed -E 's/^(.*)(\.md)/- [\1](\.\/\1\2)/g'
```

## 备注

关于学习资料，整理在 REFERENCE.md 里，不定期更新。

and 若有相关问题，可在 issue 里提，感谢！
