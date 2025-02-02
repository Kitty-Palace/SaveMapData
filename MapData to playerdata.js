"use strict";

// Ensure HitchFunction is available
if (typeof HitchFunction === 'undefined') {
    function HitchFunction(functionName, HitchFunction) {
        const originalFunction = window[functionName];
        if (typeof originalFunction === 'function') {
            window[functionName] = function(...args) {
                return HitchFunction.apply(this, [originalFunction, ...args]);
            };
            console.log(`${functionName} Hitched successfully`);
        } else {
            console.error(`${functionName} is not a function`);
        }
    }
    window.HitchFunction = HitchFunction;
}

let mapCache = Player.OnlineSettings.SavedMaps ?? {};

// Save the current chatroom map to the cache
function saveMap(name) {
    if (mapCache[name]) {
        console.error("This name has been taken, use !MapOverride `name` to replace the current saved map.");
        ChatRoomSendLocal("This name has been taken, use !MapOverride `name` to replace the current saved map.", 5000);
        return;
    }
    if (!ChatRoomData || !ChatRoomData.MapData) {
        console.error("No map data available to save.");
        ChatRoomSendLocal("No map data available to save.", 5000);
        return;
    }
    mapCache[name] = {
        type: 'map',
        tiles: ChatRoomData.MapData.Tiles,
        objects: ChatRoomData.MapData.Objects
    };
    saveMapCache();
    console.log(`Map saved as ${name}`);
    console.log('Tiles:', ChatRoomData.MapData.Tiles);
    console.log('Objects:', ChatRoomData.MapData.Objects);
    ChatRoomSendLocal(`Map saved as ${name}`, 5000);
}

// Override the current chatroom map in the cache
function overrideMap(name) {
    if (!mapCache[name]) {
        console.error(`No map found with the name ${name} to override.`);
        ChatRoomSendLocal(`No map found with the name ${name} to override.`, 5000);
        return;
    }
    if (!ChatRoomData || !ChatRoomData.MapData) {
        console.error("No map data available to save.");
        ChatRoomSendLocal("No map data available to save.", 5000);
        return;
    }
    mapCache[name] = {
        type: 'map',
        tiles: ChatRoomData.MapData.Tiles,
        objects: ChatRoomData.MapData.Objects
    };
    saveMapCache();
    console.log(`Map overridden as ${name}`);
    console.log('Tiles:', ChatRoomData.MapData.Tiles);
    console.log('Objects:', ChatRoomData.MapData.Objects);
    ChatRoomSendLocal(`Map overridden as ${name}`, 5000);
}

// Load a map from the cache and apply it to the current room
function loadMap(name) {
    if (!mapCache[name] || mapCache[name].type !== 'map') {
        console.error(`No map found with the name ${name}`);
        ChatRoomSendLocal(`No map found with the name ${name}`, 5000);
        return;
    }
    ChatRoomData.MapData.Tiles = mapCache[name].tiles;
    ChatRoomData.MapData.Objects = mapCache[name].objects;
    console.log(`Map ${name} loaded`);
    console.log('Tiles:', mapCache[name].tiles);
    console.log('Objects:', mapCache[name].objects);
    ChatRoomSendLocal(`Map ${name} loaded`, 5000);
    ChatRoomMapViewUpdateRoomSync();
    // Apply the map data to the current room (this may require additional steps depending on the game implementation)
}

// List all saved maps
function listMaps() {
    const maps = Object.keys(mapCache).filter(key => mapCache[key].type === 'map');
    console.log("Saved maps:", maps);
    ChatRoomSendLocal(`Saved maps: ${maps.join(", ")}`, 5000);
}

// Remove a map from the cache
function removeMap(name) {
    if (!mapCache[name] || mapCache[name].type !== 'map') {
        console.error(`No map found with the name ${name}`);
        ChatRoomSendLocal(`No map found with the name ${name}`, 5000);
        return;
    }
    delete mapCache[name];
    saveMapCache();
    console.log(`Map ${name} removed`);
    ChatRoomSendLocal(`Map ${name} removed`, 5000);
}

// Show all available map commands
function showMapCommands() {
    const commands = [
        "!MapSave <name> - Save the current map",
        "!MapOverride <name> - Override the current map",
        "!MapLoad <name> - Load a saved map",
        "!MapList - List all saved maps",
        "!MapRemove <name> - Remove a saved map"
    ];
    console.log("Available map commands:", commands);
    ChatRoomSendLocal(`Available map commands: ${commands.join(", ")}`, 5000);
}

// Command handler
function handleCommand(command) {
    const [cmd, ...args] = command.split(" ");
    switch (cmd.toLowerCase()) {
        case "!mapsave":
            if (args.length < 1) {
                console.error("Usage: !MapSave <name>");
                ChatRoomSendLocal("Usage: !MapSave <name>", 5000);
                return;
            }
            saveMap(args[0]);
            break;
        case "!mapoverride":
            if (args.length < 1) {
                console.error("Usage: !MapOverride <name>");
                ChatRoomSendLocal("Usage: !MapOverride <name>", 5000);
                return;
            }
            overrideMap(args[0]);
            break;
        case "!mapload":
            if (args.length < 1) {
                console.error("Usage: !MapLoad <name>");
                ChatRoomSendLocal("Usage: !MapLoad <name>", 5000);
                return;
            }
            loadMap(args[0]);
            break;
        case "!maplist":
            listMaps();
            break;
        case "!mapremove":
            if (args.length < 1) {
                console.error("Usage: !MapRemove <name>");
                ChatRoomSendLocal("Usage: !MapRemove <name>", 5000);
                return;
            }
            removeMap(args[0]);
            break;
        case "!map":
            showMapCommands();
            break;
        default:
            console.error(`Unknown command: ${cmd}`);
            ChatRoomSendLocal(`Unknown command: ${cmd}`, 5000);
    }
}

// Hook into the chat message handler to intercept commands
function interceptChatMessage(originalFunction, ...args) {
    const message = args[0];
    if (message.startsWith("!")) {
        handleCommand(message);
        // Make the message hidden instead of stopping the actual sending
        args[0] = "";
        args[1] = "Hidden";
    }
    return originalFunction.apply(this, args);
}

// Hook the ChatRoomSendChatMessage function
HitchFunction('ChatRoomSendChatMessage', interceptChatMessage);

function saveMapCache() {
    Player.OnlineSettings.SavedMaps = mapCache;
    ServerAccountUpdate.QueueData({ OnlineSettings: Player.OnlineSettings }, true);
}

function loadMapCache() {
    return Player.OnlineSettings.SavedMaps;
}