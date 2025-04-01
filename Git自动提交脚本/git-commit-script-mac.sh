#!/bin/bash

# 检查是否在 Git 仓库中
if ! git rev-parse --is-inside-work-tree > /dev/null 2>&1; then
    echo "当前目录不是一个 Git 仓库，请检查。"
    exit 1
fi

# 检查是否有文件变更
if git diff --quiet --exit-code; then
    echo "没有可提交的文件变更，无需提交和推送。"
    exit 0
fi

echo "本次将提交的变更文件列表："
git diff --name-only

read -p "请输入提交描述: " commit_msg
if ! git add .; then
    echo "git add 操作失败，请检查文件权限或 Git 配置。"
    exit 1
fi

if ! git commit -m "$commit_msg"; then
    echo "git commit 操作失败，请检查提交描述或 Git 配置。"
    exit 1
fi

if ! git push; then
    echo "git push 操作失败，请检查网络连接或远程仓库配置。"
    exit 1
fi

echo "提交和推送完成"    