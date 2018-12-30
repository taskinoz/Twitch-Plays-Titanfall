// LIBRARY IMPORTS
// ------------------------------------------------------
const TwitchBot = require('twitch-bot'); // https://github.com/kritzware/twitch-bot
var fs = require('fs');
const pipe = '\\\\.\\pipe\\TTF2SDK'; // Titanfall Pipe
const Login = JSON.parse(fs.readFileSync('twitch-login.json', 'utf8'));
// ------------------------------------------------------

//TWITCH CONFIG
// ------------------------------------------------------
//Login Info
const Bot = new TwitchBot({
  username: Login.username,
  oauth: Login.oauth,
  channels: [Login.channels]
})
// ------------------------------------------------------

// CHAT COMMANDS
const commands = [
  ["left","moveleft"],
  ["right","moveright"],
  ["back","back"],
  ["forward","forward"],
  ["jump","ability 3"],
  ["melee","melee"],
  ["shoot","attack"],
  ["crouch","duck"],
  ["sprint","speed"],
  ["use","use"]
];

// ------------------------------------------------------

// FUNCTIONS
// ------------------------------------------------------
// Runs through the Commands object and picks 3 random ones

// Give the instructions on how to play
function sayCommands() {
  Bot.say("Use ! to choose an Command");
}

// Run a command in Titanfall
function generalCmd(a) {
  fs.writeFileSync(pipe, 'CGetLocalClientPlayer().ClientCommand("'+a+'")');
}

// The same as generalCmd but adds a + and a - to
// start and stop a movement command
function movementCmd(a) {
  fs.writeFileSync(pipe, 'CGetLocalClientPlayer().ClientCommand("+'+a+'")');
  setTimeout(function () {
    fs.writeFileSync(pipe, 'CGetLocalClientPlayer().ClientCommand("-'+a+'")');
  }, 1000)
}

function indexLookup(a,b) {
  for (var i = 0; i < a.length; i++) {
    let foo = (a[i]).indexOf(b);
    if (foo>=0) {
      return commands[i][1]
    }
  }
}

// ------------------------------------------------------


Bot.on('join', () => {

  Bot.on('message', chatter => {

    // Hold a movement commands
    if ((chatter.message).includes("!hold")) {
      let run = (indexLookup(commands,(chatter.message).split('!hold')[1]));
      if (run!=undefined) {
        movementCmd(run);
        console.log(run);
      }
    }
    // Hold a movement commands
    else if ((chatter.message).includes("!")) {
      let run = (indexLookup(commands,(chatter.message).split('!')[1]));
      if (run!=undefined) {
        generalCmd(run);
        console.log(run);
      }
    }
  })
})

Bot.on('error', err => {
  console.log(err)
})
