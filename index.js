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
  ["turnleft","left"],
  ["turnright","right"],
  ["back","back"],
  ["forward","forward"],
  ["jump","ability 3"],
  ["melee","melee"],
  ["shoot","attack"],
  ["crouch","duck"],
  ["sprint","speed"],
  ["use","use"],
  ["pressx","scriptCommand1"],
  ["pressv","ability 1"],
  ["ability","offhand1"],
  ["throw","offhand0"],
  ["titanability","offhand2"],
  ["changetitan","titan_loadout_select"],
  ["up","scriptcommand1"],
  ["down","+ability 1"],
  ["stop", "-moveleft;-moveright;-left;-right;-back;-forward;-ability 3;-melee;-attack;-duck;-speed;-use;-scriptCommand1;-bility 1"]
];

// ------------------------------------------------------

// FUNCTIONS
// ------------------------------------------------------
// Runs through the Commands object and picks 3 random ones

// Give the instructions on how to play
function sayCommands() {
  Bot.say("Find the list of commands here - https://github.com/taskinoz/Twitch-Plays-Titanfall");
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
  sayCommands();
  setInterval(function () {
    sayCommands()
  },5*(60*1000));
  Bot.on('message', chatter => {

    if ((chatter.message).includes("!help")) {
      sayCommands();
    }
    // Hold a movement commands
    else if ((chatter.message).includes("!hold")) {
      let run = (indexLookup(commands,(chatter.message).split('!hold')[1]));
      if (run!=undefined) {
        generalCmd("+"+run);
        //console.log(run);
      }
    }
    // Hold a movement commands
    else if ((chatter.message).includes("!")) {
      let run = (indexLookup(commands,(chatter.message).split('!')[1]));
      if (run!=undefined) {
        if ((chatter.message).includes("!changetitan")){
          generalCmd(run);
        }
        else {
          movementCmd(run);
          //console.log(run);
        }
      }
    }
  })
})

Bot.on('error', err => {
  console.log(err)
})
