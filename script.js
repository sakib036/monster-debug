const display = document.getElementById("display");
const question = document.getElementById("question");
const startBtn = document.getElementById("starts");
const countdownOverlay = document.getElementById("countdown");
const resultModal = document.getElementById("result");
const modalBackground = document.getElementById("modal-background");

// variables
let userText = "";
// let errorCount = 0;
let startTime;
let questionText = "";
//error Counter

let counter=document.getElementById('counter');
// console.log(errorCount);
let number = 0;
function increment() {
    number++;
    console.log(number);
    counter.innerHTML = number;
}
function reset() {
  number = 0;
 counter.innerHTML = number;
}

// Load and display question
const loadJson=()=>{
  fetch("./texts.json")
  .then((res) => res.json())
  .then((data) => {
    questionText = data[Math.floor(Math.random() * data.length)];
    question.innerHTML = questionText;
  });
}


// checks the user typed character and displays accordingly
const typeController = (e) => {
  const newLetter = e.key;
  

  // Handle backspace press
  if (newLetter == "Backspace") {
    userText = userText.slice(0, userText.length - 1);
    return display.removeChild(display.lastChild);
  }

  // these are the valid character we are allowing to type
  const validLetters =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ 1234567890!@#$%^&*()_+-={}[]'\".,?";

  // if it is not a valid character like Control/Alt then skip displaying anything
  if (!validLetters.includes(newLetter)) {
    return;
  }

  userText += newLetter;

  const newLetterCorrect = validate(newLetter);

  if (newLetterCorrect) {
    display.innerHTML += `<span class="green">${newLetter === " " ? "▪" : newLetter}</span>`;
  } else {
    display.innerHTML += `<span class="red">${newLetter === " " ? "▪" : newLetter}</span>`;
    increment();
  }

  // check if given question text is equal to user typed text
  if (questionText === userText) {
    gameOver();
  }
};

const validate = (key) => {
  if (key === questionText[userText.length - 1]) {
    return true;
  }
  return false;
};

// FINISHED TYPING
const gameOver = () => {
  let errorCount=counter.innerHTML? counter.innerHTML:0;
  document.removeEventListener("keydown", typeController);
  // the current time is the finish time
  // so total time taken is current time - start time
  const finishTime = new Date().getTime();
  const timeTaken = Math.round((finishTime - startTime) / 1000);

  // show result modal
  resultModal.innerHTML = "";
  resultModal.classList.toggle("hidden");
  modalBackground.classList.toggle("hidden");
  // clear user text
  display.innerHTML = "";
  // make it inactive
  display.classList.add("inactive");
  // show result
  resultModal.innerHTML += `
    <h1>Finished!</h1>
    <p>You took: <span class="bold">${timeTaken}</span> seconds</p>
    <p>You made <span class="bold red">${errorCount}</span> mistakes</p>
    <button onclick="closeModal()">Close</button>
  `;

  addHistory(questionText, timeTaken, errorCount);

  // restart everything
  startTime = null;
  // errorCount = 0;
  userText = "";
  display.classList.add("inactive");
  
};

const closeModal = () => {
  modalBackground.classList.toggle("hidden");
  resultModal.classList.toggle("hidden");
  loadJson();
  reset();
};

const start = () => {
  // If already started, do not start again
  if (startTime) return;
  countdownOverlay.innerHTML ="";

  let count = 3;
  countdownOverlay.style.display = "flex";

  const startCountdown = setInterval(() => {
    countdownOverlay.innerHTML = `<h1>${count}</h1>`;

    // finished timer
    if (count == 0) {
     
      clearInterval(startCountdown);
     

      // -------------- START TYPING -----------------
      document.addEventListener("keydown", typeController);
      display.classList.remove("inactive");
      countdownOverlay.style.display = "none";
      

     
      startTime = new Date().getTime();
    }
    count--;
  }, 1000);
};

// START Countdown
startBtn.addEventListener("click", start);

// If history exists, show it
displayHistory();

// Show typing time spent
setInterval(() => {
  const currentTime = new Date().getTime();
  const timeSpent = Math.round((currentTime - startTime) / 1000);


  document.getElementById("show-time").innerHTML = `${startTime ? timeSpent : 0} seconds`;
}, 1000);
loadJson();