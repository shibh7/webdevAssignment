//Hard Coded Strings
const break_p = "<br>";
const b_inpt_s = break_p + "<input id= 'quest";
const inpt_mid = "'type='radio' name='";
const quest_t = "<textarea disabled id='textquest";
const qu = "quest";
const tq = "textquest";
const end = "'>";
const text_a_end = "</textarea>";
const loStore = "storedVal";
const def1 = "Your Text Here";
const def2 = "Answer 1";
const def3 = "Answer 2";
const def4 = "Answer 3";
const def5 = "Answer 4";
const valat = "' value=";


let questionBank;
let xhttp = new XMLHttpRequest();

//User answers
let userAnswers = [];

//user score
let score = 0;


getQuiz();


//submitting the test answers
document.getElementById("submit").onclick = function(){
    for(let i = 0; i < questionBank.length; i++){
        for(let j = 1; j <= questionBank[i].Answer.length; j++){
            let id = questionBank[i].Question.questionID + "ans" + j;
            let option = document.getElementById(id);
            if(option.checked){
                userAnswers.push(option.value);
            }   
        }
        if(userAnswers.length != (i+1)){
            userAnswers.push(0);
        }
    }
    console.log(userAnswers)
    evaluateQuiz()
}

//evaluate test result
function evaluateQuiz(){
    for(let i = 0; i < questionBank.length; i++){
        if(questionBank[i].correctAns.correctAns == userAnswers[i]){
            score++;
        }
    }
    displayScore();
}

//Shows quiz result
function displayScore(){

    document.getElementById("submit").style.display = "none";

    
    let totalQuestions = questionBank.length;
    let userScore = document.createElement("p");
    userScore.innerHTML = "Your Score is " + score + "/" + totalQuestions;
    alert("Your Score is " + score + "/" + totalQuestions)
    document.getElementById("score").appendChild(userScore);
     
}

function getQuiz(){
    
    xhttp.open("GET", "https:kaushalanimesh.com/questions/", true);
    xhttp.send();
    xhttp.onreadystatechange = function () {
        if(this.readyState == 4 && this.status == 200){
            console.log(this.responseText)
            questionBank = JSON.parse(this.responseText)
            loadQuiz(questionBank)
        }else if(this.readyState == 0){
            console.log("this is", 0)
        }else if(this.readyState == 1){
            console.log("this is", 1)
        }else if(this.readyState == 2){
            console.log("this is", 2)
        }else if(this.readyState == 3){
            console.log("this is", 3)
        }
    }
}

function loadQuiz(questionBank){
    console.log(questionBank.length);
    for(let i =0; i < questionBank.length; i++){
        let newDiv = document.createElement("div");
        let divId = questionBank[i].Question.questionID;
        newDiv.id = divId;
        newDiv.className = "question"
        let questionDiv = document.createElement("p");
        questionDiv.innerHTML = "Question " + (i+1) + ": " + questionBank[i].Question.questiondesc + "?";
        
        document.getElementById("quiz").appendChild(newDiv);
        document.getElementById(divId).appendChild(questionDiv);

        // let answersDiv = document.createElement("div");
        // answersDiv.id = questionBank[i].Answer.length;

        for(let j = 0; j < questionBank[i].Answer.length; j++){
            let ansDiv = document.createElement("p");
            let br = document.createElement("br");
            ansDiv.style.display = "inline";
            let check = document.createElement("input");
            check.type = "radio";
            check.id = questionBank[i].Question.questionID + "ans" + (j+1);
            check.name = questionBank[i].Question.questionID;
            check.value = questionBank[i].Answer[j].answerdesc;
            ansDiv.innerHTML = ""  + " " + questionBank[i].Answer[j].answerdesc;
            document.getElementById(divId).appendChild(check);
            document.getElementById(divId).appendChild(ansDiv);
            document.getElementById(divId).appendChild(br);
        }
        
        
    }
}