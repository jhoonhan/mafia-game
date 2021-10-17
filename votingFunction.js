///////////// Voting page
let votedPlayer;

const secApp = document.querySelector('.app');
const secMorning = document.querySelector('.morning');
const secVote = document.querySelector('.vote');
const secAnnouncement = document.querySelector('.announcement');
const secBetween = document.querySelector('.between');

const voteNameContainer = document.querySelector('.voteNameContainer');

const btnReVote = document.querySelector('.reVote');
const btnSubmitVote = document.querySelector('.submitVote');
const btnSpecialtyVote = document.querySelector('.specialtyVote');

// Voting function
const revoteFn = function () {
  votingProcess();
  //remove added voters names
  const voter = document.querySelectorAll('.voter');
  if (voter !== null) {
    for (let i = 0; i < voter.length; i++) {
      voter[i].remove();
    }
  }
  hideQ(btnReVote);
  hideQ(btnSubmitVote);
};

// Generate voting block
const votingProcess = function () {
  votingProgress = new Array(players.length).fill(0);
  currentPlayer = 0;
};

const voting = function () {
  // Changes current stage to voting
  currentStage = 'voting';
  // goes to voting
  hideQ(secMorning);
  hideQ(secVote, false);

  votingProcess();

  players.forEach(function (player, i, arr) {
    voteNameContainer.insertAdjacentHTML(
      'afterbegin',
      `<span class="voteNames votePlayer${i}"><h2>${arr[i].name}</h2></span>`
    );

    // Voting function
    const votingFn = function () {
      // Insert name function
      const insertNames = function () {
        document
          .querySelector(`.votePlayer${i}`)
          .insertAdjacentHTML(
            'afterend',
            `<p class="voter">${arr[currentPlayer].name}</p>`
          );
        // Generate voting result
        votingProgress[i] = votingProgress[i] + 1;
        currentPlayer = currentPlayer + 1;
      };
      // Insert voters name next to voted
      if (currentPlayer < Number(players.length) - 1) {
        insertNames();
      } else if (currentPlayer === Number(players.length) - 1) {
        insertNames();
        // Unhide revote and submit
        hideQ(btnReVote, false);
        hideQ(btnSubmitVote, false);
        // Revote

        btnReVote.addEventListener('click', function (e) {
          e.preventDefault();
          revoteFn();
        });
      } else {
        //Move to result
        console.log('nah');
      }
      return votingProgress;
    };
    // Voting starts
    document
      .querySelector(`.votePlayer${i}`)
      .addEventListener('click', function (e) {
        e.preventDefault();
        votingFn();
      });
  });
};
// Submit result
btnSubmitVote.addEventListener('click', function (e) {
  e.preventDefault();
  const mostVoted = Math.max(...votingProgress);
  const votedCount = votingProgress.filter(num => num === mostVoted);
  votedPlayer = votingProgress.indexOf(mostVoted);
  if (votedCount.length >= 2) {
    console.log(`we have a problem`);
    revoteFn();
  } else {
    console.log(`${players[votedPlayer].name} is about to die`);
    players.splice(votedPlayer, 1);
    console.log(players);
    hideQ(btnReVote);
    hideQ(btnSubmitVote);
    hideQ(btnSpecialtyVote, false);
  }
});

// Specialty Vote

btnSpecialtyVote.addEventListener('click', function (e) {
  e.preventDefault();
  console.log('clicked');
  revoteFn();
  hideQ(btnReVote, false);
  hideQ(btnSubmitVote, false);
  hideQ(btnSpecialtyVote);
  document.querySelector(`.votePlayer${votedPlayer}`).remove();
});
