// ==UserScript==
// @name         V2EX base64 decode
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  base64自动解析
// @author       Hinnka
// @match        https://v2ex.com/*
// @match        https://*.v2ex.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    var reg = /[A-z0-9+/=]+/g
    var replaceFunc = function(str) {
        if (str.length % 4 !== 0 || str.length < 8) {
            return str;
        }
        try {
            var decode = atob(str).replace(/\r?\n?/g, '').trim();
            if (decode.replace(/[^\x20-\x7E]+/g, '') === decode) {
                return decode;
            }
            return str;
        } catch (error) {
            return str;
        }
    };

    var topicContent = document.getElementsByClassName("topic_content")[0];
    if (topicContent) {
        var original = topicContent.innerHTML;
        topicContent.onmouseover = function() {
            var decode = original.replace(reg, replaceFunc);
            if (topicContent.innerHTML != decode) {
                topicContent.innerHTML = decode;
            }
        }
        topicContent.onmouseout = function() {
            topicContent.innerHTML = original;
        }
    }
    var replyContent = document.getElementsByClassName("reply_content");
    var replyHtmls = [];
    if (replyContent) {
        for (var i = 0; i < replyContent.length; i++) {
            replyHtmls.push(replyContent[i].innerHTML);
            replyContent[i].onmouseover = (function(i){return function() {
                var decode = replyHtmls[i].replace(reg, replaceFunc);
                if (replyContent[i].innerHTML != decode) {
                    replyContent[i].innerHTML = decode;
                }
            }})(i);
            replyContent[i].onmouseout = (function(i){return function() {
                replyContent[i].innerHTML = replyHtmls[i];
            }})(i)
        }
    }
})();
