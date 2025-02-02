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
// ==/UserScript==

(function() {
  'use strict';

  const scriptUrl = 'https://raw.githubusercontent.com/username/repository/branch/MapData%20to%20playerdata.js';
  const script = document.createElement('script');
  script.src = scriptUrl;
  script.onload = function() {
      console.log(`${GM_info.script.name} by ${GM_info.script.author} loaded successfully.`);
  };
  document.head.appendChild(script);
})();
