// ==UserScript==
// @name         Beautiful Scrollbar (Enhanced)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds a beautiful custom scrollbar with theme options to any webpage
// @author       You
// @match        *://*/*
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// ==/UserScript==

(function() {
    'use strict';
    
    // 默认设置
    const defaultSettings = {
        theme: 'default',       // 主题: default, dark, blue, purple, custom
        width: 12,              // 滚动条宽度(像素)
        opacity: 0.2,           // 滑块不透明度
        hoverOpacity: 0.4,      // 悬停时滑块不透明度
        radius: 10,             // 圆角半径(像素)
        customColor: '#6e8efb', // 自定义主题颜色
    };

    // 从存储中获取设置，如果没有则使用默认设置
    let settings = GM_getValue('scrollbarSettings', defaultSettings);

    // 获取主题颜色
    function getThemeColors(theme) {
        const themes = {
            default: {
                thumb: `rgba(0, 0, 0, ${settings.opacity})`,
                thumbHover: `rgba(0, 0, 0, ${settings.hoverOpacity})`,
                track: 'rgba(0, 0, 0, 0.05)'
            },
            dark: {
                thumb: `rgba(255, 255, 255, ${settings.opacity})`,
                thumbHover: `rgba(255, 255, 255, ${settings.hoverOpacity})`,
                track: 'rgba(255, 255, 255, 0.05)'
            },
            blue: {
                thumb: `rgba(30, 144, 255, ${settings.opacity})`,
                thumbHover: `rgba(30, 144, 255, ${settings.hoverOpacity})`,
                track: 'rgba(30, 144, 255, 0.05)'
            },
            purple: {
                thumb: `rgba(128, 0, 128, ${settings.opacity})`,
                thumbHover: `rgba(128, 0, 128, ${settings.hoverOpacity})`,
                track: 'rgba(128, 0, 128, 0.05)'
            },
            custom: {
                thumb: hexToRgba(settings.customColor, settings.opacity),
                thumbHover: hexToRgba(settings.customColor, settings.hoverOpacity),
                track: hexToRgba(settings.customColor, 0.05)
            }
        };
        
        return themes[theme] || themes.default;
    }

    // HEX转RGBA
    function hexToRgba(hex, alpha = 1) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }

    // 应用滚动条样式
    function applyScrollbarStyle() {
        const colors = getThemeColors(settings.theme);
        
        const scrollbarStyles = `
            /* 整体滚动条样式 */
            ::-webkit-scrollbar {
                width: ${settings.width}px;
                height: ${settings.width}px;
            }

            /* 滚动条轨道 */
            ::-webkit-scrollbar-track {
                background: ${colors.track};
                border-radius: ${settings.radius}px;
            }

            /* 滚动条滑块 */
            ::-webkit-scrollbar-thumb {
                background: ${colors.thumb};
                border-radius: ${settings.radius}px;
                border: 3px solid transparent;
                background-clip: content-box;
                transition: background 0.3s ease;
            }

            /* 滑块悬停效果 */
            ::-webkit-scrollbar-thumb:hover {
                background: ${colors.thumbHover};
                border: 3px solid transparent;
                background-clip: content-box;
            }

            /* 滚动条角落 */
            ::-webkit-scrollbar-corner {
                background: transparent;
            }

            /* Firefox 滚动条样式 */
            * {
                scrollbar-width: thin;
                scrollbar-color: ${colors.thumb} ${colors.track};
            }
        `;

        GM_addStyle(scrollbarStyles);
        console.log(`Beautiful Custom Scrollbar applied with '${settings.theme}' theme`);
    }

    // 注册菜单命令来切换主题
    function registerMenuCommands() {
        GM_registerMenuCommand('Default Theme', () => {
            settings.theme = 'default';
            GM_setValue('scrollbarSettings', settings);
            reloadPage();
        });
        
        GM_registerMenuCommand('Dark Theme', () => {
            settings.theme = 'dark';
            GM_setValue('scrollbarSettings', settings);
            reloadPage();
        });
        
        GM_registerMenuCommand('Blue Theme', () => {
            settings.theme = 'blue';
            GM_setValue('scrollbarSettings', settings);
            reloadPage();
        });
        
        GM_registerMenuCommand('Purple Theme', () => {
            settings.theme = 'purple';
            GM_setValue('scrollbarSettings', settings);
            reloadPage();
        });
        
        GM_registerMenuCommand('Custom Theme', () => {
            const color = prompt('输入自定义颜色 (HEX格式, 例如: #6e8efb):', settings.customColor);
            if (color && /#[0-9A-Fa-f]{6}/.test(color)) {
                settings.customColor = color;
                settings.theme = 'custom';
                GM_setValue('scrollbarSettings', settings);
                reloadPage();
            } else if (color !== null) {
                alert('无效的颜色格式! 请使用HEX格式 (例如: #6e8efb)');
            }
        });
        
        GM_registerMenuCommand('调整滚动条宽度', () => {
            const width = prompt('输入滚动条宽度 (像素):', settings.width);
            if (width && !isNaN(width) && width > 0) {
                settings.width = Number(width);
                GM_setValue('scrollbarSettings', settings);
                reloadPage();
            } else if (width !== null) {
                alert('请输入有效的宽度数值!');
            }
        });
        
        GM_registerMenuCommand('重置为默认设置', () => {
            if (confirm('确定要重置所有设置?')) {
                GM_setValue('scrollbarSettings', defaultSettings);
                reloadPage();
            }
        });
    }

    // 重载页面以应用新样式
    function reloadPage() {
        window.location.reload();
    }

    // 初始化
    applyScrollbarStyle();
    registerMenuCommands();
})(); 