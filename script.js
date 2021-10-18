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

const btnPlayers = document.querySelector('.submitPlayers_btn');
const btnGameStart = document.querySelector('.startGame_btn');
const btnSubmitNames = document.querySelector('.submitPlayersNames_btn');
const btnNext = document.querySelector('.next');
const btnReveal = document.querySelector('.reveal');
const btnHideResult = document.querySelector('.hideResult');
const btnToMorning = document.querySelector('.toMorning');

const gameStatusMessage = document.querySelector('.gameStatus');
const errorMessage = document.querySelector('.errorMessage');

// Functions
const styleDisplay = function (qes, status) {
  return (qes.style.display = status);
};
const hideQ = function (selector, status) {
  return status === false
    ? selector.classList.remove('hidden')
    : selector.classList.add('hidden');
};
// Announcement
const announceOnce = function () {
  if (!announced) announceRolls();
};
// Remove multiple HTML elements based on class
const multipleClassRemove = function (cn) {
  const arr = document.querySelectorAll(`.${cn}`);
  if (arr !== null) {
    for (let i = 0; i < arr.length; i++) {
      arr[i].remove();
    }
  }
};
const multipleClassList = function (type, cn, cn2) {
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
};

// Display mafia vs civ
const displayStatistics = function () {
  if (numberOfMafias >= players.length - numberOfMafias) {
    gameStatusMessage.textContent = `MAFIA WIIIIINNNN`;
    hideQ(secApp);
    hideQ(secBetween);
  } else if (numberOfMafias < 1) {
    gameStatusMessage.textContent = `CIV WIIIIINNNN`;
    hideQ(secApp);
    hideQ(secBetween);
  } else {
    gameStatusMessage.textContent = `Mafias: ${numberOfMafias} / Civilians: ${
      players.length - numberOfMafias
    }`;
  }
};
// Shuffle array
const shuffleArr = function (arr) {
  arr.sort(() => Math.random() - 0.5);
};
const shuffleArrR = function (arr) {
  return arr.sort(() => Math.random() - 0.5);
};

// Pre-conditioning
currentStage = 'init';
//////////// Restart ////////////
document.querySelector('.restart').addEventListener('click', function (e) {
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
  hideQ(btnPlayers, false);
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
  hideQ(formSettings);
  currentStage = 'init';
});

//////////// Choose number of players ////////////
btnPlayers.addEventListener('click', function (e) {
  e.preventDefault();
  numberOfPlayers = Number(inputOfPlayers.value);
  if (numberOfPlayers >= 5) {
    hideQ(btnPlayers);
    hideQ(formPlayerNames, false);
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

    // Generate button for player names confrimation
    formPlayerNames.insertAdjacentHTML(
      'beforeend',
      `<button class="submitPlayersNames_btn">Submit</button>`
    );

    // Create list of names into Players object for display
    const btnSubmitNames = document.querySelector('.submitPlayersNames_btn');

    //////////// Confrim names ////////////
    btnSubmitNames.addEventListener('click', function (e) {
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
      hideQ(btnSubmitNames);
      hideQ(document.querySelector('.playerNames'));

      // Reveals settings inputs
      hideQ(formSettings, false);
    });
  } else {
    inputOfPlayers.value = '';
    inputOfPlayers.placeholder = 'Minimum 5 players';
  }
});

//////////// Game Start ////////////
btnGameStart.addEventListener('click', function (e) {
  e.preventDefault();
  // Get number of each rolls from the input
  numberOfMafias = +inputOfMafias.value;
  numberOfCops = +inputOfCops.value;
  numberOfDocs = +inputOfDocs.value;

  // Error message
  const errorMessage = function (message) {
    inputOfMafias.value = '';
    inputOfMafias.placeholder = message;
    inputOfCops.value = '';
    inputOfCops.placeholder = message;
    inputOfDocs.value = '';
    inputOfDocs.placeholder = message;
  };
  // Check # of roles and assign roles
  if (
    numberOfMafias >= 1 &&
    numberOfMafias <= numberOfPlayers - 3 &&
    numberOfMafias < numberOfPlayers - numberOfMafias &&
    numberOfCops + numberOfDocs + numberOfMafias < numberOfPlayers &&
    numberOfCops <= numberOfMafias
  ) {
    // Shuffle players array to prepare for random role selection

    // Select roles based on the order of the shuffled array
    const roleSelector = function (arr) {
      shuffleArr(arr /*players*/);
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
    };

    roleSelector(players);
    console.log(players);

    // Move to next stage //
    hideQ(formInit);
    hideQ(secApp, false);
    currentStage = 'morning';
    announceOnce();
  } else if (numberOfCops + numberOfDocs + numberOfMafias > numberOfPlayers) {
    errorMessage('Too many roles!');
  } else if (numberOfMafias >= numberOfPlayers - numberOfMafias) {
    errorMessage('Too many mafias!');
  } else if (numberOfCops + numberOfDocs + numberOfMafias === numberOfPlayers) {
    errorMessage('There must be at least 1 civ!');
  } else if (numberOfCops > numberOfMafias) {
    errorMessage('Too many cops!');
  } else {
    console.log(`fucked up!`);
  }
  displayStatistics();
});

// Announce only once
let announced = false;
const announceRolls = function () {
  const nextfn = function () {
    currentPlayer = currentPlayer + 1;
    hideQ(btnHideResult, false);
    hideQ(btnReveal);
  };
  currentPlayer = 0;
  // Reveal button
  btnReveal.addEventListener('click', function (e) {
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
        nextfn();
      } else if (curPlayer.role === 'civilian') {
        document.querySelector(
          '.announcement p'
        ).textContent = `${curPlayer.name}, You are a civilian`;
        nextfn();
      } else if (curPlayer.role === 'cop') {
        document.querySelector(
          '.announcement p'
        ).textContent = `${curPlayer.name}, You are a cop`;
        nextfn();
      } else if (curPlayer.role === 'doc') {
        document.querySelector(
          '.announcement p'
        ).textContent = `${curPlayer.name}, You are a doc`;
        nextfn();
      } else {
        console.log(`error`);
      }
    }
  });
  hideQ(secAnnouncement, false);
  hideQ(secMorning);
  announced = true;
};
btnHideResult.addEventListener('click', function (e) {
  e.preventDefault();
  if (currentPlayer < players.length) {
    document.querySelector(
      '.announcement p'
    ).textContent = `Pass the phone to ${players[currentPlayer].name}.`;
    hideQ(btnReveal, false);
    hideQ(btnHideResult);
  } else if (currentPlayer === players.length) {
    document.querySelector('.announcement p').textContent = `FIN`;
    hideQ(btnReveal);
    hideQ(btnToMorning, false);
    hideQ(btnHideResult);
  }
});
btnToMorning.addEventListener('click', function (e) {
  e.preventDefault();
  hideQ(secAnnouncement);
  hideQ(secMorning, false);
});

// Dynamic next button
btnNext.addEventListener('click', function (e) {
  e.preventDefault();
  displayStatistics();
  if (currentStage === 'morning' && announced === false) {
    announceOnce();
    console.log(`announce rolls!`);
  } else if (currentStage === 'morning' && announced === true) {
    voting();
  } else {
    console.log(`error`);
  }
});
