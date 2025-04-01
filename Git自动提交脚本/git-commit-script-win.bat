@echo off
chcp 65001 >nul

rem 检查是否在 Git 仓库中
git rev-parse --is-inside-work-tree >nul 2>&1
if %errorlevel% neq 0 (
    echo 当前目录不是一个 Git 仓库，请检查。
    pause
    exit /b
)

rem 检查是否有文件变更
git diff --quiet --exit-code
if %errorlevel% equ 0 (
    echo 没有可提交的文件变更，无需提交和推送。
    pause
    exit /b
)

echo 本次将提交的变更文件列表：
git diff --name-only

set /p commit_msg=请输入提交描述: 
git add .
if %errorlevel% neq 0 (
    echo "git add 操作失败，请检查文件权限或 Git 配置。"
    pause
    exit /b
)

git commit -m "%commit_msg%"
if %errorlevel% neq 0 (
    echo "git commit 操作失败，请检查提交描述或 Git 配置。"
    pause
    exit /b
)

git push
if %errorlevel% neq 0 (
    echo "git push 操作失败，请检查网络连接或远程仓库配置。"
    pause
    exit /b
)

echo 提交和推送完成
pause    