///////////// Voting page
let votedPlayer, selected;
let selectedByMafia = [];
let selectedByMafiaLast = [];
let selectedByDoc;
let selectedPlayer, selectedToBeKilled;
let votingOrder = [];
let clickable;
let votingProgress = [];
let shuffledOrder = [];

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

// Between
const betweenVote = function (type) {
  hideQ(secApp);
  hideQ(secBetween, false);
  // First step
  if (type === 1) {
    betweenH2.textContent = `${players[currentPlayer].name}'s turn'`;
    betweenP.textContent = `Get ready to vote`;
  } else if (type === 2) {
    betweenH2.textContent = `Voting has ended`;
    betweenP.textContent = `Let's see who got fucked`;
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
  currentPlayer = 0
  votingOrder = [0,1,2,3,4];
  shuffleArr(votingOrder);
};

const generateMessage = function (selector, message) {
  selector.textContent = message;
};

// Voting for the first start
const votingStarts = function () {
  announceOnce();
  betweenVote(1);
  clickable = true;

  const currentVoterMessageFn = function () {
    if (
      players[currentPlayer].role === 'mafia' &&
      currentStage === 'specialty'
    ) {
      currentVoterMessage.textContent = `${players[currentPlayer].name}, You mafia motherFUCKER!`;
    } else {
      currentVoterMessage.textContent = `Vote for the most suspicious player 2`;
    }
  };
  currentVoterMessageFn();

  const insertNameFn = function (i) {
    document
      .querySelector(`.votePlayer${i}`)
      .insertAdjacentHTML(
        'beforeend',
        `<p class="voter votedBy${currentPlayer}">${players[currentPlayer].name}</p>`
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
        errorMessage.textContent = ``;
        if (clickable === true) {
          votingFn(i);
        } else {
          console.log(`clickable False`);
        }
        clickable = false;
        // Insert names to selection section
        if (currentStage === 'voting' && currentPlayer < players.length) {
          selectedPlayer = i;
          if (selected == false) {
            insertNameFn(i);
            selected = true;
          } //
          else if (selected == true) {
            document.querySelector(`.votedBy${currentPlayer}`).remove();
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
        else if (
          currentStage === 'specialty' &&
          currentPlayer < players.length
        ) {
          if (players[currentPlayer].role === 'mafia') {
            selected = true;
            selectedToBeKilled = i;
            currentVoterMessage.textContent = `Other mafias voted for : ${selectedByMafia.join(
              ', '
            )}.`;
            return selectedToBeKilled;
          } //
          else if (players[currentPlayer].role === 'doc') {
            selected = true;
            selectedByDoc = i;
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
  if (currentPlayer < players.length - 1) {
    votingMachine(i);
    generateMessage(
      currentVoterMessage,
      `${players[currentPlayer].name}, conform your vote.`
    );
    // currentVoterMessage.textContent = `CONFIRM`;
  } else if (currentPlayer === players.length - 1) {
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

  // Sorts voting
  if (currentStage === 'specialty') {
    if (players[currentPlayer].role === 'mafia') {
      // Create array of selected names by mafia
      selectedByMafia.push(`${players[i].name}`);
      selectedByMafiaLast.push(`${players[i].name}`);
      specialtyMessage.textContent = `You voted ${players[i].name} to be killed`;
    } else if (players[currentPlayer].role === 'cop') {
      if (players[i].role === 'mafia') {
        specialtyMessage.textContent = `Player ${players[i].name} is a mafia`;
      } else {
        specialtyMessage.textContent = `Player ${players[i].name} is not a mafia`;
      }
    } else if (players[currentPlayer].role === 'doc') {
      specialtyMessage.textContent = `You saved ${players[i].name} from getting killed by the mafia/mafias`;
    } else {
      specialtyMessage.textContent = `You are a civilian`;
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
    if (players[currentPlayer].role === 'mafia') {
      votingProgress[selectedToBeKilled] =
        votingProgress[selectedToBeKilled] + 1;
      // doctor hijacks mafia's votes
    } else if (players[currentPlayer].role === 'doc') {
      votingProgress[selectedByDoc] =
        Number(votingProgress[selectedByDoc]) - Number(players.length + 1);
    } else {
      //
    }
  }

  // Decides next voter's message
  // NOTE: First voter's message is decided before with currentVoterMessageFn()
  if (currentStage === 'specialty' && currentPlayer < players.length - 1) {
    if (players[currentPlayer + 1].role === 'mafia') {
      currentVoterMessage.textContent = `Other mafias voted for : ${selectedByMafia.join(
        ', '
      )}.`;
      //
    } else if (players[currentPlayer + 1].role === 'doc') {
      currentVoterMessage.textContent = `You doc mothafacka`;
      //
    } else if (players[currentPlayer + 1].role === 'cop') {
      currentVoterMessage.textContent = `You cop mothafacka`;
      //
    } else if (players[currentPlayer + 1].role === 'civilian') {
      currentVoterMessage.textContent = `You civ mothafacka`;
      //
    } else {
      console.log(`error123`);
    }
  }
  // Decides wheather voting is ended
  if (currentPlayer >= players.length - 1) {
    hideQ(btnReVote, false);
    hideQ(btnSubmitVote, false);
    currentVoterMessage.textContent = `Voting ended, click submit to confirm or revote.`;
  }

  // increase current player number
  currentPlayer += 1;
  // Between screens for during vote and after vote is finished
  if (currentPlayer < players.length) {
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
    errorMessage.textContent = `Can only vote for one`;
    currentVoterMessage.textContent = `${players[0].name}, vote for the most suspicious player2.`;
    revoteFn();
  } else if (votedPlayer === null) {
    errorMessage.textContent = `No one died`;
    console.log(players);
    finishedVoting(false);
  } else if (
    currentStage === 'voting' &&
    typeof votedPlayer === 'number' &&
    players[votedPlayer].role !== 'mafia'
  ) {
    currentVoterMessage.textContent = `${players[votedPlayer].name} was NOT a mafia`;
    // Remove most voted player our of the array on right condition
    players.splice(votedPlayer, 1);
    finishedVoting(false);
  } else if (
    currentStage === 'specialty' &&
    typeof votedPlayer === 'number' &&
    players[votedPlayer].role !== 'mafia'
  ) {
    currentVoterMessage.textContent = `${players[votedPlayer].name} was KILLED by a mafia`;
    finishedVoting(false);
    players.splice(votedPlayer, 1);
  } else if (
    currentStage === 'voting' &&
    typeof votedPlayer === 'number' &&
    players[votedPlayer].role === 'mafia'
  ) {
    currentVoterMessage.textContent = `GREAT! ${players[votedPlayer].name} was a mafia`;
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
