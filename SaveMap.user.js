// ==UserScript==
// @name         Save Map Data Loader
// @namespace    https://www.bondageprojects.com
// @version      1.0
// @description  Save snd Load MapData to your player
// @author       Laele
// @match https://*.bondageprojects.elementfx.com/R*/*
// @match https://*.bondage-europe.com/R*/*
// @match https://*.bondageprojects.com/R*/*
// @match http://localhost:*/*
// @run-at       document-start
// ==/UserScript==

(function() {
  'use strict';
  console.log(`SaveMap Data Loader - loading...`);
  const scriptUrl = 'https://raw.githubusercontent.com/Kitty-Palace/SaveMapData/refs/heads/main/MapData%20to%20playerdata.js';
  const script = document.createElement('script');
  script.src = scriptUrl;
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
          src: event.target.src
      });
  };
  document.head.appendChild(script);
})();
