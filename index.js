// LIBRARY IMPORTS
// ------------------------------------------------------
const tmi = require('tmi.js');
var fs = require('fs');
const pipe = '\\\\.\\pipe\\TTF2SDK'; // Titanfall Pipe
const Login = JSON.parse(fs.readFileSync('twitch-login.json', 'utf8'));
// ------------------------------------------------------

//TWITCH CONFIG
// ------------------------------------------------------
//Login Info
const client = new tmi.Client({
	options: { debug: true },
	connection: {
		reconnect: true,
		secure: true
	},
	identity: {
		username: Login.username,
		password: Login.oauth
	},
	channels: [Login.channels]
});
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
  ["reload","reload"]
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
  ["down","ability 1"],
  ["stop", "-moveleft;-moveright;-left;-right;-back;-forward;-ability 3;-melee;-attack;-reload;-duck;-speed;-use;-scriptCommand1;-ability 1;-offhand1;-offhand0;-offhand2;-scriptcommand1;-ability 1"]
];

// ------------------------------------------------------

// FUNCTIONS
// ------------------------------------------------------
// Runs through the Commands object and picks 3 random ones

// Give the instructions on how to play
function sayCommands(channelName) {
  client.say(channelName, "Find the list of commands here - https://github.com/taskinoz/Twitch-Plays-Titanfall");
}

// Run a command in Titanfall
function generalCmd(a) {
  try {
    fs.writeFileSync(pipe, 'CGetLocalClientPlayer().ClientCommand("'+a+'")');
  } catch (error) {
    console.error(error);
  }
}

// The same as generalCmd but adds a + and a - to
// start and stop a movement command
function movementCmd(a) {
  try {
    fs.writeFileSync(pipe, 'CGetLocalClientPlayer().ClientCommand("+'+a+'")');
    setTimeout(function () {
      fs.writeFileSync(pipe, 'CGetLocalClientPlayer().ClientCommand("-'+a+'")');
    }, 1000);
  } catch (error) {
    console.error(error);
  }
}

function indexLookup(a,b) {
  for (var i = 0; i < a.length; i++) {
    try {
      let foo = (a[i]).indexOf(b);
      if (foo>=0) {
        return commands[i][1]
      }
    } catch (e) {
      // Do Nothing
    }
  }
}

function helpMessage(channelName) {
  setInterval(function () {
    sayCommands(channelName)
  },5*(60*1000));
}

// ------------------------------------------------------

client.connect(helpMessage(Login.channels)).catch(console.error);

client.on('message', (channel, tags, message, self) => {

  if ((message).includes("!help") && self==false) {
    sayCommands(channel);
  }
  // Hold a movement commands
  else if ((message).includes("!hold") && self==false) {
    let run = (indexLookup(commands,(message).split('!hold')[1]));
    if (run!=undefined) {
      generalCmd("+"+run);
      console.log(run);
    }
  }
  // Hold a movement commands
  else if ((message).includes("!") && self==false) {
    let run = (indexLookup(commands,(message).split('!')[1]));
    if (run!=undefined) {
      if ((message).includes("!changetitan")){
        generalCmd(run);
      }
      else {
        movementCmd(run);
        console.log(run);
      }
    }
    else {
      client.say(channel, "Command not found. Use !help to see the list of commands")
    }
  }
})
