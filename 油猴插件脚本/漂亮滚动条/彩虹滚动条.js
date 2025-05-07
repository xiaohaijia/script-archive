// ==UserScript==
// @name         滚动条美化
// @namespace    npm/vite-plugin-monkey
// @version      1.3.2
// @author       Feny
// @description  移植于Scroll Style插件，且使用🌈彩虹滚动条🌈脚本的CSS样式
// @license      MIT
// @homepage     https://github.com/xFeny/UserScript/tree/main/monkey-scrollbar
// @match        *://*/*
// @grant        GM_addStyle
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/518997/%E6%BB%9A%E5%8A%A8%E6%9D%A1%E7%BE%8E%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/518997/%E6%BB%9A%E5%8A%A8%E6%9D%A1%E7%BE%8E%E5%8C%96.meta.js
// ==/UserScript==

(t=>{if(typeof GM_addStyle=="function"){GM_addStyle(t);return}const e=document.createElement("style");e.textContent=t,document.head.append(e)})(' @charset "UTF-8";:root{scrollbar-width:none!important}body::-webkit-scrollbar,::-webkit-scrollbar-track,::-webkit-scrollbar-corner,::-webkit-scrollbar-button,::-webkit-scrollbar-track-piece,::-webkit-scrollbar-track:horizontal{display:none!important}::-webkit-scrollbar{width:7px;height:7px;display:static!important}::-webkit-scrollbar-thumb{background:linear-gradient(to bottom,#ff567f,#fbeb91,#2ec2ff,#8375ff)!important;border-radius:5px!important;box-shadow:inset 0 0 10px #fff!important}::-webkit-scrollbar-thumb:horizontal{background:linear-gradient(to right,#ff567f,#fbeb91,#2ec2ff,#8375ff)!important;border-radius:5px!important;box-shadow:inset 0 0 10px #fff!important}.wsx_scroll{margin:0;padding:0;-webkit-user-select:none;user-select:none;pointer-events:none;display:none;position:fixed;z-index:999999999;transition:opacity .2s linear}.wsx_scroll_bar{margin:0;padding:0;-webkit-user-select:none;user-select:none;pointer-events:none;position:relative}.wsx_fade{margin:0;padding:0;-webkit-user-select:none;user-select:none;pointer-events:none;display:block;position:fixed;z-index:9999999999}.wsx_vertical_scroll{top:0;right:0;width:30px}.wsx_vertical_scroll_bar{left:19px;opacity:.6;height:100%;width:7px;border-radius:5px!important;background:linear-gradient(to bottom,#ff567f,#fbeb91,#2ec2ff,#8375ff)!important}.wsx_vertical_fade{top:0;right:0;width:30px;height:100%}.wsx_horizontal_scroll{left:0;bottom:0;height:30px}.wsx_horizontal_scroll_bar{top:20px;width:100%;opacity:.6;height:7px;border-radius:5px!important;background:linear-gradient(to right,#ff567f,#fbeb91,#2ec2ff,#8375ff)!important}.wsx_horizontal_fade{left:0;bottom:0;width:100%;height:30px} ');

(function () {
  'use strict';

  document.addEventListener("DOMContentLoaded", function() {
    const timeoutSec = 500;
    function createAndAppendElement(tag, className, parent) {
      const el = document.createElement(tag);
      el.className = className;
      parent.appendChild(el);
      return el;
    }
    const verticalFade = createAndAppendElement("div", "wsx_fade wsx_vertical_fade", document.body);
    const verticalScroll = createAndAppendElement(
      "div",
      "wsx_scroll wsx_vertical_scroll",
      document.body
    );
    createAndAppendElement("div", "wsx_scroll_bar wsx_vertical_scroll_bar", verticalScroll);
    const horizontalFade = createAndAppendElement(
      "div",
      "wsx_fade wsx_horizontal_fade",
      document.body
    );
    const horizontalScroll = createAndAppendElement(
      "div",
      "wsx_scroll wsx_horizontal_scroll",
      document.body
    );
    createAndAppendElement("div", "wsx_scroll_bar wsx_horizontal_scroll_bar", horizontalScroll);
    let content = document.documentElement || document.body;
    let changeY = window.innerHeight;
    let scrollShowY = false;
    let wsxVerticalTimeout;
    let changeX = window.innerWidth;
    let scrollShowX = false;
    let wsxHorizontalTimeout;
    function upScrollHeight() {
      const fullWin = Array.from(document.querySelectorAll("*")).some((el) => {
        const cs = getComputedStyle(el);
        return (cs.position === "fixed" || cs.position === "static") && el.type === "application/x-shockwave-flash" && cs.height === window.innerHeight + "px" && parseInt(cs.width, 10) >= window.innerWidth;
      });
      clearTimeout(wsxVerticalTimeout);
      clearTimeout(wsxHorizontalTimeout);
      const wHeight = document.documentElement.clientHeight;
      const wWidth = document.documentElement.clientWidth;
      const dHeight = document.documentElement.scrollHeight;
      const dWidth = document.documentElement.scrollWidth;
      if (dHeight <= wHeight || fullWin) {
        if (scrollShowY) {
          verticalScroll.style.display = "none";
        }
        scrollShowY = false;
      } else {
        verticalScroll.style.display = "block";
        verticalScroll.style.opacity = "1";
        verticalScroll.style.pointerEvents = "none";
        scrollShowY = true;
      }
      if (dWidth <= wWidth || fullWin) {
        if (scrollShowX) {
          horizontalScroll.style.display = "none";
        }
        scrollShowX = false;
      } else {
        horizontalScroll.style.display = "block";
        horizontalScroll.style.opacity = "1";
        horizontalScroll.style.pointerEvents = "none";
        scrollShowX = true;
      }
      const scrollHeight = Math.max(wHeight / dHeight * wHeight, 30);
      const scrollWidth = Math.max(wWidth / dWidth * wWidth, 30);
      const top = (document.documentElement.scrollTop || document.body.scrollTop) / (dHeight - wHeight) * (wHeight - scrollHeight);
      verticalScroll.style.top = `${top}px`;
      verticalScroll.style.height = `${scrollHeight}px`;
      const left = (document.documentElement.scrollLeft || document.body.scrollLeft) / (dWidth - wWidth) * (wWidth - scrollWidth);
      horizontalScroll.style.left = `${left}px`;
      horizontalScroll.style.width = `${scrollWidth}px`;
      wsxVerticalTimeout = setTimeout(() => {
        verticalScroll.style.opacity = "0";
        verticalScroll.style.pointerEvents = "none";
        scrollShowY = false;
      }, timeoutSec);
      wsxHorizontalTimeout = setTimeout(() => {
        horizontalScroll.style.opacity = "0";
        horizontalScroll.style.pointerEvents = "none";
        scrollShowX = false;
      }, timeoutSec);
    }
    const initInterval = 200;
    setInterval(() => {
      if (changeY !== content.scrollHeight || changeX !== content.scrollWidth) {
        changeY = content.scrollHeight;
        changeX = content.scrollWidth;
        upScrollHeight();
      }
    }, initInterval);
    window.addEventListener("scroll", upScrollHeight);
    window.addEventListener("resize", upScrollHeight);
    let alwaysY;
    let alwaysX;
    let mousedownY = false;
    let mousedownX = false;
    let startY;
    let Y;
    let startX;
    let X;
    window.addEventListener("mousemove", (event) => {
      if (event.clientX >= 0 && event.clientY >= 0) {
        if (content.clientWidth - event.clientX < 40) {
          if (!scrollShowY) {
            upScrollHeight();
          }
          clearTimeout(wsxVerticalTimeout);
          alwaysY = true;
        } else if (alwaysY) {
          alwaysY = false;
          wsxVerticalTimeout = setTimeout(() => {
            verticalScroll.style.opacity = "0";
            verticalScroll.style.pointerEvents = "none";
            scrollShowY = false;
          }, timeoutSec);
        }
        if (content.clientHeight - event.clientY < 40) {
          if (!scrollShowX) {
            upScrollHeight();
          }
          clearTimeout(wsxHorizontalTimeout);
          alwaysX = true;
        } else if (alwaysX) {
          alwaysX = false;
          wsxHorizontalTimeout = setTimeout(() => {
            horizontalScroll.style.opacity = "0";
            horizontalScroll.style.pointerEvents = "none";
            scrollShowX = false;
          }, timeoutSec);
        }
        if (mousedownY) {
          verticalFade.style.pointerEvents = "auto";
          const endY = event.clientY;
          let top = endY - startY + Y;
          top = Math.max(0, top);
          const maxHeight = window.innerHeight - verticalScroll.offsetHeight;
          top = Math.min(maxHeight, top);
          const scrollTop = top / (window.innerHeight - verticalScroll.offsetHeight) * (document.documentElement.scrollHeight - window.innerHeight);
          document.documentElement.scrollTop = document.body.scrollTop = scrollTop;
        }
        if (mousedownX) {
          horizontalFade.style.pointerEvents = "auto";
          const endX = event.clientX;
          let left = endX - startX + X;
          left = Math.max(0, left);
          const maxWidth = window.innerWidth - horizontalScroll.offsetWidth;
          left = Math.min(maxWidth, left);
          const scrollLeft = left / (window.innerWidth - horizontalScroll.offsetWidth) * (document.documentElement.scrollWidth - window.innerWidth);
          document.documentElement.scrollLeft = document.body.scrollLeft = scrollLeft;
        }
      }
    });
    window.addEventListener("mousedown", (event) => {
      startY = event.clientY;
      startX = event.clientX;
      Y = (document.documentElement.scrollTop || document.body.scrollTop) / (document.documentElement.scrollHeight - window.innerHeight) * (window.innerHeight - verticalScroll.offsetHeight);
      X = (document.documentElement.scrollLeft || document.body.scrollLeft) / (document.documentElement.scrollWidth - window.innerWidth) * (window.innerWidth - horizontalScroll.offsetWidth);
      if (content.clientWidth - event.clientX < 40 && content.clientWidth - event.clientX >= 0) {
        mousedownY = true;
        document.onselectstart = () => false;
      }
      if (content.clientHeight - event.clientY < 40 && content.clientHeight - event.clientY >= 0) {
        mousedownX = true;
        document.onselectstart = () => false;
      }
    });
    window.addEventListener("mouseup", () => {
      document.onselectstart = null;
      mousedownY = false;
      mousedownX = false;
      verticalFade.style.pointerEvents = "none";
      horizontalFade.style.pointerEvents = "none";
    });
  });

})();