import Empirica from "meteor/empirica:core";

import "./callbacks.js";
import "./bots.js";
import { targetSets } from "./constants";
import _ from "lodash";


function addToRoles(roles, player, role, info) {
  // swap roles every repetition
  var otherRole = role == 'speaker' ? 'listener' : 'speaker';
  var roleBlock = _.times(info.numTrialsPerBlock, _.constant(role));
  var otherRoleBlock = _.times(info.numTrialsPerBlock, _.constant(otherRole))  ;
  var newValue1 = _.fromPairs([[
    player.toString(),
    roles[player].concat(..._.flatten(_.times(
      info.numRepsPerPartner/2,
      _.constant([roleBlock, otherRoleBlock])
    )))
  ]]);
  _.extend(roles, newValue1);
}

function createSchedule(players, info) {
  // Create a schedule for all players to play all others using 'circle' method
  // (en.wikipedia.org/wiki/Round-robin_tournament#Scheduling_algorithm)
  // requires an even umber of players
  const l = _.shuffle(players);
  const speaker = _.times(info.numTotalTrials, _.constant("speaker"))
  const listener = _.times(info.numTotalTrials, _.constant("listener"))
  console.log(speaker)
  const role_list= [speaker, listener, listener]; //just hard code for now
  const roles=_.zipObject(l,role_list);
  console.log(roles)
  return {roles};
}

// gameInit is where the structure of a game is defined.  Just before
// every game starts, once all the players needed are ready, this
// function is called with the treatment and the list of players.  You
// must then add rounds and stages to the game, depending on the
// treatment and the players. You can also get/set initial values on
// your game, players, rounds and stages (with get/set methods), that
// will be able to use later in the game.
Empirica.gameInit((game, treatment) => {
  console.log(
    "Game with a treatment: ",
    treatment,
    " will start, with workers",
    _.map(game.players, "id")
  );

  // Sample whether on the blue team or red team
  game.set("teamColor", treatment.teamColor);

  // Sample whether to use tangram set A or set B
  game.set("targetSet", treatment.targetSet); 
  game.set("team", game.players.length > 1);
  game.set('context', targetSets[treatment.targetSet]);
  const targets = game.get('context');
  const reps = treatment.repetitionsWithPartner;
  const numTargets = targets.length;
  const numPartners = game.players.length - 1;
  const info = {
    numTrialsPerBlock : numTargets,
    numBlocks : reps,
    numTotalTrials: reps * numTargets
  };
  
  // I use this to play the sound on the UI when the game starts
  game.set("justStarted", true);

  // Make partner schedule for the game
  const scheduleObj = createSchedule(_.map(game.players, '_id'), info);
  //const roomIds = _.map(scheduleObj.roomAssignments[0], (room, i) => 'room' + i);
  //game.set('rooms', scheduleObj.roomAssignments);
  game.set('roleList', scheduleObj.roles);


  // Loop through trials with partner
  _.times(numPartners, partnerNum => {

    // Loop through repetition blocks
    _.times(reps, repNum => {
      //const roomBlock = _.map(game.get('rooms'), room => _.shuffle(targets));

      // Loop through targets in block
      _.times(numTargets, targetNum => {      
        const round = game.addRound();
        //const roomTargets = _.map(roomBlock, room => room[targetNum]);
        //round.set('target', _.zipObject(roomIds, roomTargets));
        round.set('target', _.shuffle(targets));

        round.set('numTrials', reps * numTargets);
        round.set('trialNum', repNum * reps + targetNum);
        round.set('numPartners', numPartners);
        round.set('partnerNum', partnerNum);
        round.set('repNum', repNum);
        
        // add 'partner swap' slide as first trial w/ new partner
        
        round.addStage({
          name: "selection",
          displayName: "Selection",
          durationInSeconds: treatment.selectionDuration
        });
      });
    });
  });
});

