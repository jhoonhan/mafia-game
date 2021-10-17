///////////// Voting page
let votedPlayer, selected;
let selectedByMafia = [];
let selectedByMafiaLast = [];
let selectedByDoc;
let selectedPlayer, selectedToBeKilled;
let clickable;
let votingProgress = [];

let randomOrder = [];
let playerTurn;

const secApp = document.querySelector('.app');
const secMorning = document.querySelector('.morning');
const secVote = document.querySelector('.vote');
const secBetween = document.querySelector('.between');

const confirmVotePage = document.querySelector('.confirmVotePage');
const voteNameContainer = document.querySelector('.voteNameContainer');
const currentVoterMessage = document.querySelector('.voteText');
const specialtyMessage = document.querySelector('.specialtyMessage');
const betweenH2 = document.querySelector('.between h2');
const betweenP = document.querySelector('.between p');

const voteNames = document.querySelector('.voteNames');

const btnReVote = document.querySelector('.reVote');
const btnSubmitVote = document.querySelector('.submitVote');
const btnSpecialtyVote = document.querySelector('.specialtyVote');
const btnConfirmVote = document.querySelector('.confirmVote');
const btnBetween = document.querySelector('.nextBetween');

// Player order
// Between
const betweenVote = function (type) {
  hideQ(secApp);
  hideQ(secBetween, false);
  // For the playerTurn 0. First player.
  if (type === 1) {
    betweenH2.textContent = `${
      players[randomOrder[playerTurn]].name
    }'s turn - LN44`;
    betweenP.textContent = `Get ready to vote - LN44`;
    currentVoterMessage.textContent = `${
      players[randomOrder[playerTurn]].name
    } vote! - LN44`;
  } else if (type === 2) {
    betweenH2.textContent = `Voting has ended - LN44`;
    betweenP.textContent = `Let's see who got fucked - LN44`;
  }
};

btnBetween.addEventListener('click', function (e) {
  e.preventDefault();
  hideQ(secApp, false);
  hideQ(secBetween);
});
// Generate initiator
const votingProcess = function () {
  votingProgress = new Array(players.length).fill(0);
  playerTurn = 0;
  randomOrder = Array.from(Array(players.length).keys());
  shuffleArr(randomOrder);

  betweenVote(1);
};
const generateMessage = function (selector, message) {
  selector.textContent = message;
};

// Voting for the first start
const votingStarts = function () {
  announceOnce();
  clickable = true;

  // only used for first time
  // const currentVoterMessageFn = function () {
  //   if (
  //     players[randomOrder[playerTurn]].role === 'mafia' &&
  //     currentStage === 'specialty'
  //   ) {
  //     currentVoterMessage.textContent = `${
  //       players[randomOrder[playerTurn]].name
  //     }, You mafia motherFUCKER!`;
  //   } else {
  //     currentVoterMessage.textContent = `${
  //       players[randomOrder[playerTurn]].name
  //     }, vote!`;
  //   }
  //   errorMessage.textContent = ``;
  // };
  // currentVoterMessageFn();

  const insertNameFn = function (i) {
    document
      .querySelector(`.votePlayer${i}`)
      .insertAdjacentHTML(
        'beforeend',
        `<p class="voter votedBy${randomOrder[playerTurn]}">${
          players[randomOrder[playerTurn]].name
        }</p>`
      );
  };
  ////////////////////////////////////////////////////////////
  // Voting player starts & restarts
  players.forEach(function (
    player,
    i /* i represents clicked player index */,
    arr
  ) {
    voteNameContainer.insertAdjacentHTML(
      'afterbegin',
      `<span class="voteNames votePlayer${i}"><h2>${player.name}</h2></span>`
    );
    selected = false;

    //////////////////////
    // AEL = clickable player boxes
    document
      .querySelector(`.votePlayer${i}`)
      .addEventListener('click', function (e) {
        e.preventDefault();
        if (clickable === true) {
          votingFn(i);
        } else {
          console.log(`clickable False`);
        }
        clickable = false;
        // Insert names to selection section
        if (currentStage === 'voting' && playerTurn < players.length) {
          selectedPlayer = i;
          if (selected == false) {
            insertNameFn(i);
            selected = true;
          } //
          else if (selected == true) {
            document
              .querySelector(`.votedBy${randomOrder[playerTurn]}`)
              .remove();
            selected = false;
            insertNameFn(i);
            selected = true;
          } //
          else {
            console.log(`error 12333`);
          }
          return selectedPlayer;
        } //
        // specialty
        else if (currentStage === 'specialty' && playerTurn < players.length) {
          if (players[randomOrder[playerTurn]].role === 'mafia') {
            selected = true;
            selectedToBeKilled = i;
            if (selectedByMafia.length > 0) {
              currentVoterMessage.textContent = `Other mafias voted for : ${selectedByMafia.join(
                ', '
              )}. - LN 157`;
            } else {
              currentVoterMessage.textContent = `You are the first mafia. Other mafias will be able to see your choice. - LN 159`;
            }

            specialtyMessage.textContent = `You voted ${players[i].name} to be killed - LN 162`;
            return selectedToBeKilled;
          } //
          else if (players[randomOrder[playerTurn]].role === 'doc') {
            selected = true;
            selectedByDoc = i;
            specialtyMessage.textContent = `You selected ${players[i].name} to be saved - LN 168`;
            return selectedToBeKilled;
            return selectedByDoc;
          } //
          else {
            selected = true;
            return null;
          }
        }
      });
  });
};

// Voting functions
const votingFn = function (i) {
  // Insert voters name next to voted
  if (playerTurn < players.length - 1) {
    votingMachine(i);
    generateMessage(
      currentVoterMessage,
      `${players[randomOrder[playerTurn]].name}, conform your vote. - LN188`
    );
    // currentVoterMessage.textContent = `CONFIRM`;
  } else if (playerTurn === players.length - 1) {
    votingMachine(i);
  } else {
    //Move to result
    console.log('nah');
  }

  return votingProgress;
};

const votingMachine = function (i) {
  // Voting Machine
  hideQ(voteNameContainer, false);
  hideQ(confirmVotePage, false);

  // Cop finding when clicked CLB voting
  if (currentStage === 'specialty') {
    if (players[randomOrder[playerTurn]].role === 'mafia') {
    } else if (players[randomOrder[playerTurn]].role === 'cop') {
      if (players[i].role === 'mafia') {
        specialtyMessage.textContent = `Player ${players[i].name} is a mafia`;
      } else {
        specialtyMessage.textContent = `Player ${players[i].name} is not a mafia`;
      }
    } else {
      specialtyMessage.textContent = `You did nothing - LN 216`;
    }
  }
};

btnConfirmVote.addEventListener('click', function (e) {
  e.preventDefault();
  // increase voting progress
  if (currentStage === 'voting') {
    votingProgress[selectedPlayer] = votingProgress[selectedPlayer] + 1;
  } //
  else if (currentStage === 'specialty') {
    // Mafia kill
    if (players[randomOrder[playerTurn]].role === 'mafia') {
      // Create array of selected names by mafia
      selectedByMafia.push(`${players[selectedToBeKilled].name}`);
      selectedByMafiaLast.push(`${players[selectedToBeKilled].name}`);
      votingProgress[selectedToBeKilled] =
        votingProgress[selectedToBeKilled] + 1;
      console.log(players[selectedToBeKilled].name);
      // doctor hijacks mafia's votes
    } else if (players[randomOrder[playerTurn]].role === 'doc') {
      votingProgress[selectedByDoc] =
        Number(votingProgress[selectedByDoc]) - Number(players.length + 1);
    } else {
      //
    }
  }

  // Decides next voter's message
  // NOTE: First voter's message is decided before with currentVoterMessageFn()
  if (currentStage === 'specialty' && playerTurn < players.length - 1) {
    if (players[randomOrder[playerTurn + 1]].role === 'mafia') {
      currentVoterMessage.textContent = `Other mafias voted for : ${selectedByMafia.join(
        ', '
      )}. - LN251`;
      //
    } else if (players[randomOrder[playerTurn + 1]].role === 'doc') {
      currentVoterMessage.textContent = `You doc mothafacak - LN254`;
      //
    } else if (players[randomOrder[playerTurn + 1]].role === 'cop') {
      currentVoterMessage.textContent = `You cop mothafacka - LN257`;
      //
    } else if (players[randomOrder[playerTurn + 1]].role === 'civilian') {
      currentVoterMessage.textContent = `You civ mothafacka - LN260`;
      //
    } else {
      console.log(`error123`);
    }
  }
  // Decides wheather voting is ended
  if (playerTurn >= players.length - 1) {
    hideQ(btnReVote, false);
    hideQ(btnSubmitVote, false);
    currentVoterMessage.textContent = `Voting ended, click submit to confirm or revote. - LN270`;
  }

  // increase current player number
  playerTurn += 1;
  // Between screens for during vote and after vote is finished
  if (playerTurn < players.length) {
    betweenVote(1);
  } else {
    betweenVote(2);
  }
  hideQ(voteNameContainer, false);
  hideQ(confirmVotePage);
  // Change selected boolean
  selected = false;
  // cleans specialty residual text
  specialtyMessage.textContent = ``;
  // re-enables clickable voting
  clickable = true;
});

// Revoting function
btnReVote.addEventListener('click', function (e) {
  e.preventDefault();
  revoteFn();
});
const revoteFn = function () {
  // cleans votingProgress
  votingProcess();
  // removed voted
  selectedByMafia = [];
  // remove added voters names
  const voter = document.querySelectorAll('.voter');
  if (voter !== null) {
    for (let i = 0; i < voter.length; i++) {
      voter[i].remove();
    }
  }
  hideQ(btnReVote);
  hideQ(btnSubmitVote);
};
//
//
/////////////////////////////////////////////
// Order of entire voting mechanism
const voting = function () {
  // Changes current stage to voting
  currentStage = 'voting';
  // goes to voting
  hideQ(secMorning);
  multipleClassRemove('voteNames');
  hideQ(secVote, false);
  // initialize voting
  votingProcess();
  // creates clickables & starts voting
  votingStarts();

  console.log(mafiaNames);
};

const specialtyVoting = function () {
  // Changes current stage to voting
  currentStage = 'specialty';
  multipleClassRemove('voteNames');
  votingProcess();
  votingStarts();
};

// Submit result
btnSubmitVote.addEventListener('click', function (e) {
  e.preventDefault();
  displayStatistics();
  if (currentStage === 'voting') {
    findMostVoted();
  } else if (currentStage === 'specialty') {
    findMostVoted();
  } else {
    console.log(`ERROR2`);
  }
});

// Find the most voted
const findMostVoted = function () {
  const mostVoted = Math.max(...votingProgress);
  let votedCount;
  // Check to see if there is same number of votes
  if (mostVoted > 0) {
    // this is set to 0 because doctor hijacks mafia vote by converting it into negative interger
    votedCount = votingProgress.filter(num => num === mostVoted);
    votedPlayer = votingProgress.indexOf(mostVoted);
  } else {
    votedCount = 0;
    votedPlayer = null;
  }
  //
  const finishedVoting = function (remove) {
    hideQ(btnReVote);
    hideQ(btnSubmitVote);
    hideQ(btnSpecialtyVote, false);
    if (remove === true) {
      document.querySelector(`.votePlayer${votedPlayer}`).remove();
    }
  };
  // see if there is equal amount of votes
  if (votedCount.length >= 2) {
    errorMessage.textContent = `Can only vote for one - LN375`;
    console.log(`wtf`);
    setTimeout(revoteFn(), 5000);
  } else if (votedPlayer === null) {
    errorMessage.textContent = `No one died - LN379`;
    console.log(players);
    finishedVoting(false);
  } else if (
    currentStage === 'voting' &&
    typeof votedPlayer === 'number' &&
    players[votedPlayer].role !== 'mafia'
  ) {
    currentVoterMessage.textContent = `${players[votedPlayer].name} was NOT a mafia - LN387`;
    // Remove most voted player our of the array on right condition
    players.splice(votedPlayer, 1);
    finishedVoting(false);
  } else if (
    currentStage === 'specialty' &&
    typeof votedPlayer === 'number' &&
    players[votedPlayer].role !== 'mafia'
  ) {
    currentVoterMessage.textContent = `${players[votedPlayer].name} was KILLED by a mafia - LN396`;
    finishedVoting(false);
    players.splice(votedPlayer, 1);
  } else if (
    currentStage === 'voting' &&
    typeof votedPlayer === 'number' &&
    players[votedPlayer].role === 'mafia'
  ) {
    currentVoterMessage.textContent = `GREAT! ${players[votedPlayer].name} was a mafia - LN404`;
    finishedVoting(false);
    players.splice(votedPlayer, 1);
    numberOfMafias = numberOfMafias - 1;
  } else {
    console.log('ERROR5');
  }
};

// Specialty Vote
btnSpecialtyVote.addEventListener('click', function (e) {
  e.preventDefault();
  displayStatistics();
  revoteFn();
  hideQ(btnReVote);
  hideQ(btnSubmitVote);
  hideQ(btnSpecialtyVote);
  if (currentStage === 'voting') {
    specialtyVoting();
  } else if (currentStage === 'specialty') {
    currentStage = 'morning';
    hideQ(secMorning, false);
    hideQ(secVote);
  } else {
    console.log(`ERROR6`);
  }
  console.log(players);
});
