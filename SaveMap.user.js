// ==UserScript==
// @name         Save Map Data Loader
// @namespace    https://www.bondageprojects.com
// @version      1.0
// @description  Save snd Load MapData to your player
// @author       Laele
// @downloadURL https://github.com/Kitty-Palace/SaveMapData/raw/refs/heads/main/SaveMap.user.js
// @updateURL   https://github.com/Kitty-Palace/SaveMapData/raw/refs/heads/main/SaveMap.user.js
// @match https://*.bondageprojects.elementfx.com/R*/*
// @match https://*.bondage-europe.com/R*/*
// @match https://*.bondageprojects.com/R*/*
// @match http://localhost:*/*
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';
    console.log(`SaveMap Data Loader - loading...`);
    function waitForGameLoad(callback) {
        console.log('Waiting for game to load...');
        if (typeof Player !== 'undefined' && Player.OnlineSettings) {
            console.log('Game loaded.');
            callback();
        } else {
            setTimeout(() => waitForGameLoad(callback), 100);
        }
    }

    waitForGameLoad(() => {
        const scriptUrl = 'https://raw.githubusercontent.com/Kitty-Palace/SaveMapData/refs/heads/main/MapDataToPlayerData.user.js';
        const script = document.createElement('script');
        script.src = scriptUrl;
        console.log(`Attempting to load script from ${scriptUrl}`);
        script.onload = function() {
            console.log(`SaveMap Data Loader - loaded successfully.`);
        };
        script.onerror = function(event) {
            console.error(`SaveMap Data Loader - failed to load. Reason: ${event.message || 'unknown error'}`);
            console.error(`Error details:`, {
                type: event.type,
                target: event.target,
                currentTarget: event.currentTarget,
                timeStamp: event.timeStamp,
                src: event.target.src,
                lineno: event.lineno,
                colno: event.colno,
                error: event.error
            });
        };
        script.addEventListener('error', function(event) {
            console.error(`SaveMap Data Loader - failed to load script from ${scriptUrl}`);
            console.error(`Error details:`, {
                type: event.type,
                target: event.target,
                currentTarget: event.currentTarget,
                timeStamp: event.timeStamp,
                src: event.target.src,
                lineno: event.lineno,
                colno: event.colno,
                error: event.error
            });
        });
        document.head.appendChild(script);
    });
})();
