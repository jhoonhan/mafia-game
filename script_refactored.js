'use strict';

let players = [];
let names = [];
let civilians = [];
let mafias = [];
let mafiaNames = [];
let cops = [];
let docs = [];
let numberOfPlayers,
  numberOfMafias,
  numberOfCops,
  numberOfDocs,
  currentStage,
  currentPlayer;

let announced = false;

let votedPlayer, selected, clickable, playerTurn;
let selectedByMafia = [];
let selectedByMafiaLast = [];
let selectedByDoc;
let selectedPlayer, selectedToBeKilled;
let votingProgress = [];

let randomOrder = [];
let reVoteTurn = 0;

const nameOfRoles = ['mafia', 'cop', 'doc', 'civilian'];
const stages = ['init', 'morning', 'voting', 'between', 'announcement'];

// HTML selectors
// const header = document.header;
// const mainContainer = document.main;

const inputOfPlayers = document.querySelector('.initForm_numberOfPlayers');
const inputOfMafias = document.querySelector('.initForm_numberOfMafias');
const inputOfCops = document.querySelector('.initForm_numberOfCops');
const inputOfDocs = document.querySelector('.initForm_numberOfDocs');

//////////// Init page
const formInit = document.querySelector('.init');
const formWrapper = document.querySelector('.formWrapper');
const formPlayerNames = document.querySelector('.playerNames');
const formSettings = document.querySelector('.settings');

const secAnnouncement = document.querySelector('.announcement');
const secApp = document.querySelector('.app');
const secMorning = document.querySelector('.morning');
const secVote = document.querySelector('.vote');
const secBetween = document.querySelector('.between');
const secErrorPage = document.querySelector('.errorPage');

const btnPlayers = document.querySelector('.submitPlayers_btn');
const btnGameStart = document.querySelector('.startGame_btn');
const btnSubmitNames = document.querySelector('.submitPlayersNames_btn');
const btnNext = document.querySelector('.next');
const btnReveal = document.querySelector('.reveal');
const btnHideResult = document.querySelector('.hideResult');
const btnToMorning = document.querySelector('.toMorning');
const btnReVote = document.querySelector('.reVote');
const btnSubmitVote = document.querySelector('.submitVote');
const btnSpecialtyVote = document.querySelector('.specialtyVote');
const btnConfirmVote = document.querySelector('.confirmVote');
const btnBetween = document.querySelector('.nextBetween');
const btnClose = document.querySelector('.closeButton');

const gameStatusMessage = document.querySelector('.gameStatus');
const errorMessage = document.querySelector('.errorMessage');

const confirmVotePage = document.querySelector('.confirmVotePage');
const voteNameContainer = document.querySelector('.voteNameContainer');
const currentVoterMessage = document.querySelector('.voteText');
const specialtyMessage = document.querySelector('.specialtyMessage');
const betweenH2 = document.querySelector('.between h2');
const betweenP = document.querySelector('.between p');

const voteNames = document.querySelector('.voteNames');

class App {
  constructor() {
    // Pre-conditioning
    currentStage = 'init';
    // Announce only once
    document.querySelector('.restart').addEventListener('click', this.restart);

    btnPlayers.addEventListener('click', this.chooseNumberOfPlayers.bind(this));

    btnSubmitNames.addEventListener('click', this.submitNames.bind(this));

    btnGameStart.addEventListener('click', this.gameStart.bind(this));

    btnReveal.addEventListener('click', this.revealRolls.bind(this));

    btnHideResult.addEventListener('click', this.hideResult.bind(this));

    btnToMorning.addEventListener('click', this.toMorning.bind(this));

    btnNext.addEventListener('click', this.next.bind(this));

    btnBetween.addEventListener('click', this.btnBetweenFn.bind(this));

    btnConfirmVote.addEventListener('click', this.btnConfirmVoteFn.bind(this));

    btnReVote.addEventListener('click', this.btnReVoteFn.bind(this));

    btnSubmitVote.addEventListener('click', this.btnSubmitVoteFn.bind(this));

    btnSpecialtyVote.addEventListener(
      'click',
      this.btnSpecialtyVoteFn.bind(this)
    );
    btnClose.addEventListener('click', this.btnCloseFn.bind(this));
  }
  announceOnce() {
    if (!announced) this.announceRolls();
  }
  styleDisplay(qes, status) {
    return (qes.style.display = status);
  }
  hideQ(selector, status) {
    return status === false
      ? selector.classList.remove('hidden')
      : selector.classList.add('hidden');
  }
  multipleClassRemove(cn) {
    const arr = document.querySelectorAll(`.${cn}`);
    if (arr !== null) {
      for (let i = 0; i < arr.length; i++) {
        arr[i].remove();
      }
    }
  }
  multipleClassList(type, cn, cn2) {
    const arr = document.querySelectorAll(`.${cn}`);
    if (arr !== null && type === 'remove') {
      for (let i = 0; i < arr.length; i++) {
        arr[i].classList.remove(`${cn2}`);
      }
    } else if (arr !== null && type === 'add') {
      for (let i = 0; i < arr.length; i++) {
        arr[i].classList.add(`${cn2}`);
      }
    }
  }
  restart(e) {
    // e.preventDefault();
    // Clean out players
    players = [];
    names = [];
    civilians = [];
    mafias = [];
    cops = [];
    docs = [];
    currentPlayer;
    // Clean out inputs
    const initInputs = document.getElementsByTagName('input');
    for (let i = 0; i < initInputs.length; i++) {
      initInputs[i].value = '';
      initInputs[i].placeholder = '';
    }
    // Bring back btnPlayers button
    this.hideQ(btnPlayers, false);
    // Delete initForm_names & other buttons
    const initFormNames = document.querySelectorAll('.initForm_names');
    if (initFormNames !== null) {
      for (let i = 0; i < initFormNames.length; i++) {
        initFormNames[i].remove();
      }
    }
    if (document.querySelector('.nameStart') !== null) {
      document.querySelector('.nameStart').remove();
    }
    if (document.querySelector('.submitPlayersNames_btn') !== null) {
      document.querySelector('.submitPlayersNames_btn').remove();
    }
    if (document.querySelector('.displayInputPlayers') !== null) {
      document.querySelector('.displayInputPlayers').remove();
    }
    this.hideQ(formSettings);
    currentStage = 'init';
  }
  displayStatistics() {
    // Display mafia vs civ
    if (numberOfMafias >= players.length - numberOfMafias) {
      gameStatusMessage.textContent = `MAFIA WIIIIINNNN`;
      this.hideQ(secApp);
      this.hideQ(secBetween);
    } else if (numberOfMafias < 1) {
      gameStatusMessage.textContent = `CIV WIIIIINNNN`;
      this.hideQ(secApp);
      this.hideQ(secBetween);
    } else {
      gameStatusMessage.textContent = `Mafias: ${numberOfMafias} / Civilians: ${
        players.length - numberOfMafias
      }`;
    }
  }
  generateMessage(selector, message) {
    selector.textContent = message;
  }
  shuffleArr(arr) {
    // Shuffle array
    arr.sort(() => Math.random() - 0.5);
  }
  chooseNumberOfPlayers(e) {
    e.preventDefault();

    numberOfPlayers = Number(inputOfPlayers.value);
    if (numberOfPlayers >= 5) {
      this.hideQ(btnPlayers);
      this.hideQ(formPlayerNames, false);
      this.hideQ(btnSubmitNames, false);
      formPlayerNames.insertAdjacentHTML(
        'afterbegin',
        `<p class="nameStart">Name the players</p>`
      );

      // Generate inputs for x(numberOfPlayers) number of times
      for (let i = 0; i < numberOfPlayers; i++) {
        formPlayerNames.insertAdjacentHTML(
          'beforeend',
          `<input type="text" class="initForm_names player${i}Input" />`
        );
      }

      // Create list of names into Players object for display

      //////////// Confrim names ////////////
    } else {
      inputOfPlayers.value = '';
      inputOfPlayers.placeholder = 'Minimum 5 players';
    }
  }
  submitNames(e) {
    e.preventDefault();
    for (let i = 0; i < numberOfPlayers; i++) {
      players.push(i);
      names.push(document.querySelector(`.player${i}Input`).value);
    }
    formSettings.insertAdjacentHTML(
      'afterbegin',
      `<p class ="displayInputPlayers">${names.length} players: ${names.join(
        ', '
      )}</p>`
    );
    // Hides button & name inputs when submitted
    this.hideQ(btnSubmitNames);
    this.hideQ(document.querySelector('.playerNames'));

    // Reveals settings inputs
    this.hideQ(formSettings, false);
  }
  gameStart(e) {
    e.preventDefault();
    // Get number of each rolls from the input
    numberOfMafias = +inputOfMafias.value;
    numberOfCops = +inputOfCops.value;
    numberOfDocs = +inputOfDocs.value;
    // Check # of roles and assign roles
    if (
      numberOfMafias >= 1 &&
      numberOfMafias <= numberOfPlayers - 3 &&
      numberOfMafias < numberOfPlayers - numberOfMafias &&
      numberOfCops + numberOfDocs + numberOfMafias < numberOfPlayers &&
      numberOfCops <= numberOfMafias
    ) {
      this.roleSelector(players);
      console.log(players);

      // Move to next stage //
      this.hideQ(formInit);
      this.hideQ(secApp, false);
      currentStage = 'morning';
      this.announceOnce();
    } else if (numberOfCops + numberOfDocs + numberOfMafias > numberOfPlayers) {
      this.errorMessage('Too many roles!');
    } else if (numberOfMafias >= numberOfPlayers - numberOfMafias) {
      this.errorMessage('Too many mafias!');
    } else if (
      numberOfCops + numberOfDocs + numberOfMafias ===
      numberOfPlayers
    ) {
      this.errorMessage('There must be at least 1 civ!');
    } else if (numberOfCops > numberOfMafias) {
      this.errorMessage('Too many cops!');
    } else {
      console.log(`fucked up!`);
    }
    this.displayStatistics();
  }
  errorMessage(message) {
    inputOfMafias.value = '';
    inputOfMafias.placeholder = message;
    inputOfCops.value = '';
    inputOfCops.placeholder = message;
    inputOfDocs.value = '';
    inputOfDocs.placeholder = message;
  }
  roleSelector(arr) {
    // Shuffle players array to prepare for random role selection
    this.shuffleArr(arr /*players*/);
    // Select roles based on the order of the shuffled array
    mafias = arr.slice(0, numberOfMafias);
    cops = arr.slice(numberOfMafias, +numberOfMafias + +numberOfCops);
    docs = arr.slice(
      +numberOfMafias + +numberOfCops,
      +numberOfMafias + +numberOfCops + +numberOfDocs
    );
    civilians = arr.slice(
      -(arr.length - +numberOfMafias - +numberOfCops - +numberOfDocs)
    );

    // Assign input value name, role, and original input order to the object
    const roles = [mafias, cops, docs, civilians];
    const inputName = function (arr) {
      return document.querySelector(`.player${arr}Input`).value;
    };
    const assignObjectValues = function (assigned, playerIndex, i, arr) {
      players[playerIndex] = {
        name: inputName(playerIndex),
        role: assigned,
      };
    };
    roles.forEach(function (roleCur, roleIndex) {
      roleCur.forEach(function (playerIndex, i, arr) {
        const assginedRole = nameOfRoles[roleIndex];
        assignObjectValues(assginedRole, playerIndex, i, arr);
      });
    });
    // Get Mafia names
    mafias.forEach(function (_, mi, mArr) {
      mafiaNames.push(players[mArr[mi]].name);
    });
  }
  announceRolls() {
    currentPlayer = 0;
    // Reveal button

    this.hideQ(secAnnouncement, false);
    this.hideQ(secMorning);
    announced = true;
  }
  nextfn() {
    currentPlayer = currentPlayer + 1;
    this.hideQ(btnHideResult, false);
    this.hideQ(btnReveal);
  }
  revealRolls(e) {
    e.preventDefault();
    // Conditional message
    let curPlayer = players[currentPlayer];
    if (currentPlayer <= players.length) {
      if (curPlayer.role === 'mafia') {
        if (mafias.length === 1) {
          document.querySelector(
            '.announcement p'
          ).textContent = `${curPlayer.name}, you are a mafia. Kill all civilians.`;
        } else {
          document.querySelector('.announcement p').textContent = `${
            curPlayer.name
          }, you are a mafia. Mafias are ${mafiaNames.join(
            ', '
          )}. Team up with them to kill all civilians.`;
        }
        this.nextfn();
      } else if (curPlayer.role === 'civilian') {
        document.querySelector(
          '.announcement p'
        ).textContent = `${curPlayer.name}, You are a civilian`;
        this.nextfn();
      } else if (curPlayer.role === 'cop') {
        document.querySelector(
          '.announcement p'
        ).textContent = `${curPlayer.name}, You are a cop`;
        this.nextfn();
      } else if (curPlayer.role === 'doc') {
        document.querySelector(
          '.announcement p'
        ).textContent = `${curPlayer.name}, You are a doc`;
        this.nextfn();
      } else {
        console.log(`error`);
      }
    }
  }
  hideResult(e) {
    e.preventDefault();
    if (currentPlayer < players.length) {
      document.querySelector(
        '.announcement p'
      ).textContent = `Pass the phone to ${players[currentPlayer].name}.`;
      this.hideQ(btnReveal, false);
      this.hideQ(btnHideResult);
    } else if (currentPlayer === players.length) {
      document.querySelector('.announcement p').textContent = `FIN`;
      this.hideQ(btnReveal);
      this.hideQ(btnToMorning, false);
      this.hideQ(btnHideResult);
    }
  }
  toMorning(e) {
    e.preventDefault();
    this.hideQ(secAnnouncement);
    this.hideQ(secMorning, false);
  }
  next(e) {
    e.preventDefault();
    this.displayStatistics();
    if (currentStage === 'morning' && announced === false) {
      this.announceOnce();
      console.log(`announce rolls!`);
    } else if (currentStage === 'morning' && announced === true) {
      this.voting();
    } else {
      console.log(`error`);
    }
  }
  votingSorterMSG() {
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
          )}. Last turn, others selected ${
            selectedByMafiaLast[reVoteTurn - 1]
          }.`;
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
  }
  betweenVote(type) {
    this.hideQ(secApp);
    this.hideQ(secBetween, false);
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
      this.votingSorterMSG();
    } else if (type === 2) {
      betweenH2.textContent = `Voting has ended - LN44`;
      betweenP.textContent = `Let's see who got fucked - LN44`;
    }
  }
  btnCloseFn(e) {
    e.preventDefault();
    hideQ(secErrorPage);
    hideQ(secBetween, false);
  }
  btnBetweenFn(e) {
    e.preventDefault();
    this.hideQ(secApp, false);
    this.hideQ(secBetween);
  }
  btnConfirmVoteFn(e) {
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
      this.hideQ(btnReVote, false);
      this.hideQ(btnSubmitVote, false);
      currentVoterMessage.textContent = `Voting ended, click submit to confirm or revote. - LN270`;
      clickable = false;
    }

    // increase current player number
    playerTurn += 1;
    // Between screens for during vote and after vote is finished
    if (playerTurn < players.length) {
      this.betweenVote(1);
    } else {
      this.betweenVote(2);
    }
    this.hideQ(voteNameContainer, false);
    this.hideQ(confirmVotePage);
    // Change selected boolean
    selected = false;
    // cleans specialty residual text
    specialtyMessage.textContent = ``;
    // re-enables clickable voting
    clickable = true;
  }
  btnReVoteFn(e) {
    e.preventDefault();
    this.revoteFn();
  }
  btnSpecialtyVoteFn(e) {
    e.preventDefault();
    this.revoteFn();
    this.hideQ(btnReVote);
    this.hideQ(btnSubmitVote);
    this.hideQ(btnSpecialtyVote);
    if (currentStage === 'voting') {
      this.specialtyVoting();
    } else if (currentStage === 'specialty') {
      currentStage = 'morning';
      this.hideQ(secMorning, false);
      this.hideQ(secVote);
    } else {
      console.log(`ERROR6`);
    }
    this.displayStatistics();
    console.log(players);
  }
  btnSubmitVoteFn(e) {
    e.preventDefault();
    this.displayStatistics();
    if (currentStage === 'voting') {
      this.findMostVoted();
    } else if (currentStage === 'specialty') {
      this.findMostVoted();
    } else {
      console.log(`ERROR2`);
    }
  }
  votingProcess() {
    votingProgress = new Array(players.length).fill(0);
    playerTurn = 0;
    randomOrder = Array.from(Array(players.length).keys());
    this.shuffleArr(randomOrder);

    this.betweenVote(1);
  }
  votingStarts() {
    this.announceOnce();
    clickable = true;

    // Voting player starts & restarts

    const machine = function (player, i, arr) {
      voteNameContainer.insertAdjacentHTML(
        'afterbegin',
        `<span class="voteNames votePlayer${i}"><h2>${player.name}</h2></span>`
      );
      selected = false;

      const createClickableBox = function () {
        if (playerTurn < players.length - 1) {
          this.hideQ(confirmVotePage, false);
        }
        if (clickable === true) {
          this.votingFn(i);
        } else {
          console.log(`clickable False`);
        }
        clickable = false;
        // Insert names to selection section
        if (currentStage === 'voting' && playerTurn < players.length) {
          selectedPlayer = i;
          if (selected == false) {
            this.insertNameFn(i);
            selected = true;
          } //
          else if (selected == true) {
            document
              .querySelector(`.votedBy${randomOrder[playerTurn]}`)
              .remove();
            selected = false;
            this.insertNameFn(i);
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
      };
      document
        .querySelector(`.votePlayer${i}`)
        .addEventListener('click', createClickableBox.bind(this));
    };
    players.forEach(machine.bind(this));
  }
  insertNameFn(i) {
    document
      .querySelector(`.votePlayer${i}`)
      .insertAdjacentHTML(
        'beforeend',
        `<p class="voter votedBy${randomOrder[playerTurn]}">${
          players[randomOrder[playerTurn]].name
        }</p>`
      );
  }
  votingFn(i) {
    // Insert voters name next to voted
    if (playerTurn < players.length - 1) {
      this.hideQ(voteNameContainer, false);
      this.hideQ(confirmVotePage, false);
      this.generateMessage(
        currentVoterMessage,
        `${players[randomOrder[playerTurn]].name}, confirm your vote. - LN188`
      );
      // currentVoterMessage.textContent = `CONFIRM`;
    } else if (playerTurn === players.length - 1) {
      this.hideQ(voteNameContainer, false);
      this.hideQ(confirmVotePage, false);
    } else if (playerTurn > players.length - 1) {
      //Move to result
      console.log('nah');
    }
    return votingProgress;
  }
  revoteFn() {
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
    this.hideQ(btnReVote);
    this.hideQ(btnSubmitVote);
    // cleans votingProgress
    this.votingProcess();
  }
  voting() {
    // Changes current stage to voting
    currentStage = 'voting';
    // goes to voting
    this.hideQ(secMorning);
    this.multipleClassRemove('voteNames');
    this.hideQ(secVote, false);
    // clenas out turns
    reVoteTurn = 0;
    playerTurn = 0;
    // initialize voting
    this.votingProcess();
    // creates clickables & starts voting
    this.votingStarts();

    console.log(mafiaNames);
  }
  specialtyVoting() {
    // Changes current stage to voting
    currentStage = 'specialty';
    this.multipleClassRemove('voteNames');
    this.votingProcess();
    this.votingStarts();
    reVoteTurn = 0;
  }
  errorPromp() {
    this.hideQ(secErrorPage, false);
    this.hideQ(secBetween);

    document.querySelector(
      '.errorPage p'
    ).textContent = `Click the button to continue.`;
    if (type === 'onlyVoteOne') {
      document.querySelector(
        '.errorPage h2'
      ).textContent = `Can only vote for one.`;
    } else if (type === 'mOnlyVoteOne') {
      document.querySelector(
        '.errorPage h2'
      ).textContent = `Can only kill one.`;
    } else if (type === 'noOneDied') {
      document.querySelector('.errorPage h2').textContent = `No one died.`;
    }
  }
  findMostVoted() {
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
    // see if there is equal amount of votes
    if (currentStage === 'voting' && votedCount.length >= 2) {
      this.revoteFn();
      this.errorPromp('onlyVoteOne');
    } else if (currentStage === 'specialty' && votedCount.length >= 2) {
      this.hideQ(secErrorPage, false);
      this.revoteFn();
      this.errorPromp('onlyVoteOne');
    } else if (savedByDoc.length !== 0) {
      this.hideQ(secErrorPage, false);
      this.revoteFn();
      this.errorPromp('mOnlyVoteOne');
    } else if (votedPlayer === null) {
      this.hideQ(secErrorPage, false);
      console.log(players);
      this.finishedVoting(false);
      this.errorPromp('noOneDied');
    } else if (
      currentStage === 'voting' &&
      typeof votedPlayer === 'number' &&
      players[votedPlayer].role !== 'mafia'
    ) {
      currentVoterMessage.textContent = `${players[votedPlayer].name} was NOT a mafia - LN387`;
      // Remove most voted player out of the array on right condition
      players.splice(votedPlayer, 1);
      this.finishedVoting(false);
    } else if (
      currentStage === 'specialty' &&
      typeof votedPlayer === 'number' &&
      players[votedPlayer].role !== 'mafia'
    ) {
      currentVoterMessage.textContent = `${players[votedPlayer].name} was KILLED by a mafia - LN396`;
      this.finishedVoting(false);
      players.splice(votedPlayer, 1);
    } else if (
      typeof votedPlayer === 'number' &&
      players[votedPlayer].role === 'mafia'
    ) {
      currentVoterMessage.textContent = `GREAT! ${players[votedPlayer].name} was a mafia - LN404`;
      this.finishedVoting(false);
      players.splice(votedPlayer, 1);
      numberOfMafias = numberOfMafias - 1;
    } else {
      console.log('ERROR5');
    }
  }
  finishedVoting(remove) {
    this.hideQ(btnReVote);
    this.hideQ(btnSubmitVote);
    this.hideQ(btnSpecialtyVote, false);
    if (remove === true) {
      document.querySelector(`.votePlayer${votedPlayer}`).remove();
    }
  }
}

const app = new App();
