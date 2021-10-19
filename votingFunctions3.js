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
let reVoteTurn = 0;

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
const votingSorterMSG = function () {
  if (currentStage === 'specialty') {
    if (players[randomOrder[playerTurn]].role === 'mafia') {
      if (selectedByMafia.length > 0 && selectedByMafiaLast.length === 0) {
        currentVoterMessage.textContent = `${
          players[randomOrder[playerTurn]].name
        }, you are a mafia. Other mafias selected ${selectedByMafia.join(
          ', '
        )}.`;
      } else if (
        selectedByMafia.length === 0 &&
        selectedByMafiaLast.length === 0
      ) {
        currentVoterMessage.textContent = `${
          players[randomOrder[playerTurn]].name
        }, you are a mafia. You are the first mafia to vote. Other mafias will be able to see your choice.`;
      }
      /// reVoteTurn > 0;
      else if (selectedByMafia.length > 0 && selectedByMafiaLast.length > 0) {
        currentVoterMessage.textContent = `${
          players[randomOrder[playerTurn]].name
        }, you are a mafia. Other mafias selected ${selectedByMafia.join(
          ', '
        )}. Last turn, others selected ${selectedByMafiaLast[reVoteTurn - 1]}.`;
      } else if (
        selectedByMafia.length === 0 &&
        selectedByMafiaLast.length > 0
      ) {
        currentVoterMessage.textContent = `${
          players[randomOrder[playerTurn]].name
        }, you are a mafia. You are the first mafia to vote. Other mafias will be able to see your choice. Last turn, others selected ${
          selectedByMafiaLast[reVoteTurn - 1]
        }.`;
      }
    } else if (players[randomOrder[playerTurn]].role === 'cop') {
      currentVoterMessage.textContent = `${
        players[randomOrder[playerTurn]].name
      }, you are a cop. You can select one to see whether the player is a mafia or not. You can only select once so do it wisely`;
    } else if (players[randomOrder[playerTurn]].role === 'doc') {
      currentVoterMessage.textContent = `${
        players[randomOrder[playerTurn]].name
      }, you are a doctor. You can select one to save the player from getting killed by the mafia tonight.`;
    } else if (players[randomOrder[playerTurn]].role === 'civilian') {
      currentVoterMessage.textContent = `${
        players[randomOrder[playerTurn]].name
      }, you are a civilian. At this moment, all you can do is to pray to God that mafias don't kill you. Select anyone below.`;
    }
  }
};
// Between
const betweenVote = function (type) {
  hideQ(secApp);
  hideQ(secBetween, false);
  // messages for each players
  if (type === 1) {
    betweenH2.textContent = `${
      players[randomOrder[playerTurn]].name
    }'s turn - LN44`;
    betweenP.textContent = `Give phone to ${
      players[randomOrder[playerTurn]].name
    } - LN44`;
    currentVoterMessage.textContent = `${
      players[randomOrder[playerTurn]].name
    }, vote the most suspicious player.`;
    votingSorterMSG();
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
        if (playerTurn < players.length - 1) {
          hideQ(confirmVotePage, false);
        }
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
          else if (players[randomOrder[playerTurn]].role === 'cop') {
            if (players[i].role === 'mafia') {
              specialtyMessage.textContent = `Player ${players[i].name} is a mafia`;
            } else {
              specialtyMessage.textContent = `Player ${players[i].name} is not a mafia`;
            }
          } else {
            specialtyMessage.textContent = `You did nothing - LN 216`;
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
    hideQ(voteNameContainer, false);
    hideQ(confirmVotePage, false);
    generateMessage(
      currentVoterMessage,
      `${players[randomOrder[playerTurn]].name}, confirm your vote. - LN188`
    );
    // currentVoterMessage.textContent = `CONFIRM`;
  } else if (playerTurn === players.length - 1) {
    hideQ(voteNameContainer, false);
    hideQ(confirmVotePage, false);
  } else if (playerTurn > players.length - 1) {
    //Move to result
    console.log('nah');
  }
  return votingProgress;
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
      selectedByMafia.push(
        `${players[selectedToBeKilled].name}(${players[playerTurn].name})`
      );

      votingProgress[selectedToBeKilled] += 1;
      console.log(players[selectedToBeKilled].name);
      // doctor hijacks mafia's votes
    } else if (players[randomOrder[playerTurn]].role === 'doc') {
      votingProgress[selectedByDoc] =
        Number(votingProgress[selectedByDoc]) * -1;
    } else {
      //
    }
  }
  // Decides wheather voting is ended
  if (playerTurn >= players.length - 1) {
    hideQ(btnReVote, false);
    hideQ(btnSubmitVote, false);
    currentVoterMessage.textContent = `Voting ended, click submit to confirm or revote. - LN270`;
    clickable = false;
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
  if (currentStage === 'specialty') {
    selectedByMafiaLast.push(selectedByMafia);
    console.log(selectedByMafiaLast);
  }
  // clean selected by mafia
  selectedByMafia = [];
  // increase vote turn #2
  reVoteTurn += 1;
  // remove added voters names
  const voter = document.querySelectorAll('.voter');
  if (voter !== null) {
    for (let i = 0; i < voter.length; i++) {
      voter[i].remove();
    }
  }
  hideQ(btnReVote);
  hideQ(btnSubmitVote);
  // cleans votingProgress
  votingProcess();
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
  // clenas out turns
  reVoteTurn = 0;
  playerTurn = 0;
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
  reVoteTurn = 0;
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
  let savedByDoc;
  // Check to see if there is same number of votes
  if (mostVoted > 0) {
    // this is set to 0 because doctor hijacks mafia vote by converting it into negative interger
    votedCount = votingProgress.filter(num => num === mostVoted);
    savedByDoc = votingProgress.filter(num => num < 0);
    votedPlayer = votingProgress.indexOf(mostVoted);
  } else {
    votedCount = 0;
    votedPlayer = null;
    savedByDoc = [];
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
  if (currentStage === 'voting' && votedCount.length >= 2) {
    errorMessage.textContent = `Can only vote for one - LN375`;
    revoteFn(), 5000;
  } else if (currentStage === 'specialty' && votedCount.length >= 2) {
    errorMessage.textContent = `Can only vote for one - LN375`;
    revoteFn(), 5000;
  } else if (savedByDoc.length !== 0) {
    errorMessage.textContent = `Mafias, make up your mind - LN377`;
    revoteFn(), 5000;
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
  displayStatistics();
  console.log(players);
});
