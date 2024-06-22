//game name
const gameName = "Guess The Word";
//title of page contain name of game
document.title = gameName;

//put name of game in header and footer
document.querySelector("h2").innerHTML = gameName ;
document.querySelector("footer").innerHTML = " "+gameName+" <span> GAME</span>";

//manage words to guess
let guessWord = "";
const words = ["school" , "office" , "bakery" , "jungle" , "forest" , "market"];
guessWord = words[Math.floor(Math.random() * words.length)];
//catch message div that shows in won or lose
const message = document.querySelector(".message");

//function that control all the game
function generateInputs() {

    let numberOfTries = 6;
    let numberOfLetters = 6;
    let currentTry = 1;
    let numberOfHints = 2;

    //catch the empty div to handle the game area
    let inputsContainer = document.querySelector(".inputs");

    for (let i = 1; i <= numberOfTries; i++) {
        //make div to put try and inputs inside it
        let tryDiv = document.createElement("div");
        //number of tries in classlist of div and inside span in this div
        tryDiv.classList.add("try"+i+"");
        tryDiv.innerHTML = "<span>Try  "+i+"</span>" ;

        inputsContainer.appendChild(tryDiv);

        for(let j = 1 ; j <= numberOfLetters ; j++){
            //create inputs that contain letters
            let emptyInput = document.createElement("input");
            emptyInput.type ="text";
            emptyInput.id = "try-"+i+"-input"+j+"";
            emptyInput.setAttribute("maxlength" , 1);
            
            tryDiv.appendChild(emptyInput);
        }
        if (`${i}` != 1 ) {
            //disabled all inputs except the first div contain try1 span
            tryDiv.classList.add("disabled");
        }
        //focus on first input on enabled div 
        inputsContainer.children[0].children[1].focus();
    }

    //disabled all input inside disabled divs
    const disabledInputs = document.querySelectorAll(".disabled input");
    disabledInputs.forEach(input => {input.disabled = true});

    //Loop on all inputs
    const AllInput = document.querySelectorAll("input");
    AllInput.forEach((input , index) => {
        input.addEventListener("input" , function () {
            input.value = input.value.toUpperCase();
            const nextIndex = index + 1 
            //focus on next input automatic
            if(nextIndex) AllInput[nextIndex].focus();
        })

        //handle press on three key 
        input.addEventListener("keydown" , function (event) {
            if (event.key === "ArrowRight") {
              const nextIndex = index + 1
              if (nextIndex < AllInput.length) AllInput[nextIndex].focus()
            }
            if (event.key === "ArrowLeft") {
              const prevIndex = index - 1
              if (prevIndex >= 0) AllInput[prevIndex].focus()
            }
            if (event.key === "Backspace") {
                AllInput[index].value = ""
                if (AllInput[index - 1]) {
                    AllInput[index - 1].value =""
                    AllInput[index - 1].focus()
                }

              }
        })
    })

    //hint button
    const hintButton = document.querySelector(".hint");
    let spanInHint = document.querySelector(".hint span");
    spanInHint.innerHTML = numberOfHints
    hintButton.addEventListener("click" , getHint)


    //check button
    const checkButton = document.querySelector(".check");
    checkButton.addEventListener("click" , handleWords);

    function handleWords() {
        let successStatue = true ;
        for (let i = 1 ; i <= numberOfLetters ; i++){
            //catch every input in try 1 
            let inputField = document.querySelector("#try-"+currentTry+"-input"+i+"");
            let inputFieldValue = inputField.value.toLowerCase();
            let actualLetter = guessWord[i - 1];
            //check inputs field
            if (inputFieldValue === actualLetter) {
                inputField.classList.add("in-place");
            }else if (guessWord.includes(inputFieldValue) && inputFieldValue !== ""){
                inputField.classList.add("not-in-place");
                successStatue = false;
            }else {
                inputField.classList.add("no");
                successStatue = false;
            }
        }

        const AllDivs = document.querySelectorAll(".game-area .inputs > div");

        if (successStatue) {
            message.innerHTML = `Yo Win The Word is <span>${guessWord}</span>`;
            message.style.display = "block";

            AllDivs.forEach((div) => div.classList.add("disabled"))

            checkButton.disabled = true;
            checkButton.classList.add("disabled");
            hintButton.disabled = true;
            hintButton.classList.add("disabled");
        }else{
            //when fail in first try
            const TryCurrent = document.querySelector(`.inputs .try${currentTry}`);
            TryCurrent.classList.add("disabled");
            //disable input in first try
            let inputsTryCurrent = document.querySelectorAll(`.inputs .try${currentTry} input`)
            inputsTryCurrent.forEach((input) => input.disabled = true)

            //moves to next try
            currentTry++

            const nextTry = document.querySelector(`.inputs .try${currentTry}`);
            if (nextTry) {
                nextTry.classList.remove("disabled");
                let inputsTryNext = document.querySelectorAll(`.inputs .try${currentTry} input`)
                inputsTryNext.forEach((input) => input.disabled = false)
                //choose children[1] because children[0] is span
                nextTry.children[1].focus()
            }else{
                checkButton.disabled = true;
                checkButton.classList.add("disabled");
                hintButton.disabled = true;
                hintButton.classList.add("disabled");
                message.innerHTML = `Yo Lose The Word is <span>${guessWord}</span>`;
                message.style.display = "block";
            }
        }
    }

    function getHint() {
        if (numberOfHints > 0) {
            numberOfHints--;
            spanInHint.innerHTML = numberOfHints;
        }         
        if (numberOfHints == 0) {
            hintButton.disabled = true;
            hintButton.classList.add("disabled");
        }
        //catch all enabled inputs
        const emptyField = document.querySelectorAll("input:not([disabled])");
        //filter enabled inputs to inputs that didn't contain letter 
        const fieldToFill =  Array.from(emptyField).filter((field) => field.value == "")

        //if there is empty field in try
        if (fieldToFill.length > 0 ) {
            const randomIndex = Math.floor(Math.random() * fieldToFill.length);
            const arrayFromEmptyField = Array.from(emptyField);
            // fieldToFill[randomIndex] => the answer is random input
            // arrayFromEmptyField.indexOf(fieldToFill[randomIndex]) => index number of random input 
            const IndexOfFieldWantToFill = arrayFromEmptyField.indexOf(fieldToFill[randomIndex]);
            arrayFromEmptyField[IndexOfFieldWantToFill].value = guessWord[IndexOfFieldWantToFill].toUpperCase();
        }
    }
}

window.onload = function () {
    generateInputs()
}
