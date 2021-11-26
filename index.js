/*-----readline module, promises API, interface for input/output ---------------*/
const readline = require("readline");
const readlineInterface = readline.createInterface(
  process.stdin,
  process.stdout
);

function ask(questionText) {
  return new Promise((resolve, reject) => {
    readlineInterface.question(questionText, resolve);
  });
}
/*---------------------------------------*/

//creating rooms and room kay-property pairs
//lockstate 0 = locked, 1 = unlocked
let entrance = {
    name: "entrance",
    description: "welcome to the entrance, there is a sign on the door",
    sign:"go to the starting room on the third floor",
    allowedPlaces:['starting room'],
    lockState:1,
    code: '123',
    inventory: ['ball'],
    fixedItems: ['sign']
    }
let startingRoom = {
    name: "starting room",
    description: "you are in the starting room. the foyer is ahead of you",
    allowedPlaces:['foyer'],
    lockState:1,
    code: '123',
    inventory:[],
    fixedItems: []
    }
let foyer = {
    name: "foyer",
    description: "You enter the foyer, there's a magazine on the table. The dining room is to the right, the living room is to the left",
    allowedPlaces:['dining room','living room'],
    lockState:1,
    code: '123',
    inventory:['magazine'],
    fixedItems: []  
  }
let diningRoom = {
    name: "dining room",
    description: "You enter the dining room,Renoir's BAL DU MOULIN DE LA GALETTE is hanging on the wall. The kitchen is ahead of you",
    allowedPlaces:['foyer','kitchen'],
    lockState:1,
    code: '123',
    inventory:['hope diamond'],
    fixedItems: ['painting']  
  }
let kitchen = {
    name: "kitchen",
    description: "You're now in the kitchen, there's a noise coming from the living room",
    allowedPlaces:['dining room', 'living room'],
    lockState:1,
    code: '123',
    inventory:['raw oysters'],
    fixedItems: ['oven', 'fridge','sink']  
  }
let livingRoom = {
    name: "living room",
    description: "you enter the living room, the butler is dead on the floor with a knife in his back!",
    allowedPlaces:['foyer', 'kitchen'],
    lockState:1,
    code: '123',
    inventory:['knife'],
    fixedItems: ['couch'],
    note: "the maid did it!"  
  }
//defining room array to provde a link between a string value entered in an await and the room objects
let rooms = [entrance, startingRoom, foyer, diningRoom, kitchen, livingRoom];
//initializing an empty player array you can add to with a take command
let playerInventory = [];

//functions
//changeTo function moves rooms and accepts a room name (place)
//the for loop is to use the string-room name entered by user to compare to the value of the name key
//of each object.
//first if statement -- finding the right room object
//second and third if statements - checking if place is in allowed places and if door is unlocked

    function changeTo(place){
      for (let i = 0; i < rooms.length; i++) { 
        if (place === rooms[i].name){
          if (currentLocal.allowedPlaces.includes(rooms[i].name) && rooms[i].lockState === 1) {
            currentLocal = rooms[i];
            describe();
          } else if (currentLocal.allowedPlaces.includes(rooms[i].name) && rooms[i].lockState === 0){
            console.log ("the door to the "+rooms[i].name+" is locked")
          } else {
            console.log("you can't get to the " + rooms[i].name + " from " + currentLocal.name);
          }
      }}}
    //function that tells you the current room and provides a description
    function describe() {
        console.log(currentLocal.name + ' - ' + currentLocal.description);
          }
    //function for printing the property of the specified keyname of the currentLocal (the current room)
    //this takes a keyname, loops through the keynames of the object for a match and then prints the 
    //the property of the matching keyname
    function read(item) {
        for (let keyName in currentLocal){
           if (keyName === item){
              console.log(currentLocal[keyName])
          }}}

  //function for taking an item from the room
  //the first if checks if the specified item is in the room inventory
  //if yes, it takes that item out of the inventory array, adds it to the player inventory
  //the second if checks if the specified item is a fixed item and if yes says you can't take it
  //else the item you want isn't in this room
    function take(item) {
        if (currentLocal.inventory.includes(item)){
          currentLocal.inventory.splice(currentLocal.inventory.indexOf(item),1);
          playerInventory.push(item);
          console.log("the " + currentLocal.name + "inventory now includes " + currentLocal.inventory)
          console.log("your inventory now includes: " + playerInventory)
      } else if (currentLocal.fixedItems.includes(item)){
        console.log("you aren't allowed to take the " + item + " from the " + currentLocal.name)
    } else console.log("there isn't a " + item + " in " + currentLocal.name)
  }
  
  //functions for checking the room and player inventories 
    function checkInventory() {
      console.log(currentLocal.name + "inventory: " + currentLocal.inventory)
    }
    function checkPlayerInventory() {
      console.log("player inventory: " + playerInventory)
    }

  //function to unlock the door to a particular room. you specify the room name and the code
  //for loop iterates through the room array
  //first if: if the string name for the desired room matches the property of the keyname name
  //for the object (i.e., you have found the object you are looking for), the second if checks if 
  //the specified code matches the room code.  If yes, the value for the lockstate for that room is
  //changed to 1 (unlocked), else, that's not the right code
    function unlock(room,code) {
      for (let i = 0; i < rooms.length; i++) { 
        if (room === rooms[i].name){
            if (rooms[i].code === code) {
                rooms[i].lockState = 1;
                console.log("congrats! that's the right code. " + rooms[i].name + " door is unlocked");
            } else console.log ("that is not the correct code")
      }}}

//starting the game at the entrance "room"
let currentLocal = entrance

//starting the asyc await
start();
async function start() {

console.log(currentLocal.description)

//make a series of if statements for different functions
//if enter read sign, go to the read portion, perform read(sign)

let ans = null;

//entire game happens in this while loop and keeps running until you enter bye
while (ans != 'bye'){
  ans = await ask(">_")

//the playner needs to enter a verb and then a noun.  each verb corresponds to a function. the options for verbs are read, enter, input, and check
//all initial entires are split up into the verb and the noun by converting to an array, defining the verb
//as the first item in the array and the remainder of the array as the noun 
ansArray = ans.split(" ")
let verb = ans.split(' ').slice(0,1).join()
let noun = ans.split(' ').slice(1).join(' ')

//if the first word is 'read', the if statement checks if the current room has a keyname
//that matches the specified noun.  if yes, call the read function to print the property of the
//specified keyname.  else: if the current room doesn't have a keyname that matches the noun
  if (verb === 'read'){
    if (Object.keys(currentLocal).includes(noun)){  
      read(noun)
    }else {
      console.log("the "+currentLocal.name+" does not include a "+noun)
  }
}
//if the first word is 'enter' call the changeto function and pass the noun as the room
//the player would like to enter
  else if (verb === 'enter'){
      changeTo(noun)
  }
//if the first word is input and the noun is code, ask the player to specify the room
//and then enter the code.  I split it up like this so I could keep it simple and keep the
//initial uer entry as verb-noun
//after recieving the specified room and code, call unlock and pass those strings to it
  else if (verb === 'input' && noun === 'code'){
    room = await ask("for which room? ")
    code = await ask("enter code: ")
    unlock(room,code)
}
//this calls the take function to take an item from the room and add it to the player inventory
//when the first word the user enters is take and passes the noun as the item to take
  else if (verb === 'take'){
  take(noun)
}
//this checks the room or player inventory.  As with the code entry, kept it
//simple by asking for the inventory of interest in a second await ask
//calls the check inventory function if enter 'room' and call player inventor if
//enter 'player'
else if (verb === 'check' && noun === 'inventory'){
    roomPlayer = await ask("room or player? ")
  if(roomPlayer === "room"){
    checkInventory()
  }else if (roomPlayer === 'player'){
    checkPlayerInventory()
  }
}
//a catch all when the user enters a first word (verb) that doesn't match 
    else console.log("I don't know how to "+verb+" "+noun)
}
  process.exit();
}