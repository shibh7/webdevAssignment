
let answers = 2;
let questionBank;
let editQID;
let xhttp = new XMLHttpRequest();


function getQuiz(){
    
    xhttp.open("GET", "http:kaushalanimesh.com/questions/", true);
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
        let divId = "Q" + questionBank[i].Question.questionID;
        newDiv.id = divId;
        newDiv.className = "question"
        let questionDiv = document.createElement("div");
        questionDiv.innerHTML = "<h4>Question " + (i+1) + ": " + questionBank[i].Question.questiondesc + "?</h4>";
        
        document.getElementById("quiz").appendChild(newDiv);
        document.getElementById(divId).appendChild(questionDiv);

        // let answersDiv = document.createElement("div");
        // answersDiv.id = questionBank[i].Answer.length;

        for(let j = 0; j < questionBank[i].Answer.length; j++){
            let ansDiv = document.createElement("div");
            ansDiv.innerHTML = "<p>" + (j+1) + " " + questionBank[i].Answer[j].answerdesc + ".</p>"
            document.getElementById(divId).appendChild(ansDiv);
        }
        let corransDiv = document.createElement("div");
        corransDiv.innerHTML = "<p> Correct Answer: " + questionBank[i].correctAns.correctAns + ".</p>"
        document.getElementById(divId).appendChild(corransDiv);
        let b = document.createElement("button");
        b.innerHTML = "EDIT"
        b.id = questionBank[i].Question.questionID;
        document.getElementById(divId).appendChild(b);
        b.onclick = function() {editQuestion(this.id)};
        
    }
}



getQuiz()

function addanswerfield(){
    document.getElementById("formdata").addEventListener("click", function(event){
        event.preventDefault()
      });
    
    if(answers == 4){
        return
    }
    let br = document.createElement("br");
    let d = document.getElementById("formdata")
    let e = document.getElementById("selectCorrAns")
    answers++;
    let label = document.createElement("label");
    label.id = "labeloption" + answers;
    label.for = "option" + answers;
    label.innerHTML = "Answer " +  answers + ": ";
    d.append(label)
   
    let inp = document.createElement("input");
    inp.type = "text";
    inp.id = "option" + answers;
    inp.name = "option" + answers;
    d.append(inp)
    d.append(br)

    e.innerHTML += '<option value="' + answers + '">' + answers + '</option>'
    if(answers == 4){
        document.getElementById("addoption").style.display = "none";
    }
}

function submitQuestion(){
    
    let question = [];
    let q = document.getElementById("createquestion").value;
    if(q == ""){
        alert("question field is empty");
        return
    }

    for(let i = 1; i <= answers; i++){
        let id = "option" + i;
        if(document.getElementById(id).value == ""){
            console.log(i)
            let a = "answer field " + i + " is empty"
            alert(a);
            return
        }
    }
    let questiondesc = {"question" : q};
    question.push(questiondesc);

    let a = [];
    for(let i = 1; i <= answers; i++){
        let id = "option" + i;
        let ans = document.getElementById(id).value;
        let obj = {"answerdesc": ans}
        a.push(obj)
    }
    let answer = {"answers": a}
    question.push(answer);

    let correctanswerindex = document.getElementById("selectCorrAns").value;
    let caId = "option" + correctanswerindex;

    let corranswer = document.getElementById(caId).value;

    let corrAns = {"correctAnswer": corranswer};
    question.push(corrAns);
    
    let questionstring = JSON.stringify(question);
    console.log(questionstring);

    
    xhttp.open("POST", "http:kaushalanimesh.com/questions/", true);
    xhttp.setRequestHeader("Content-type", "text/plain");
    xhttp.send(questionstring);
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          alert(this.responseText)
          location.reload();
        }
     };
    
    console.log("sent")
    canceladdition()
    
    
}

function canceladdition(){ 
    console.log(answers)
    document.getElementById("createquestion").value = "";
    document.getElementById("option1").value = "";
    document.getElementById("option2").value = "";
    if(answers == 4){
        let d4 = document.getElementById("option4");
        d4.remove();
        let d3 = document.getElementById("option3");
        d3.remove();
        let l4 = document.getElementById("labeloption4");
        l4.remove();
        let l3 = document.getElementById("labeloption3");
        l3.remove();
    }else if(answers == 3){
        let d3 = document.getElementById("option3");
        d3.remove();
        let l3 = document.getElementById("labeloption3");
        l3.remove();
    }
    answers = 2
    let addquestion = document.getElementById("addQuestion")
    addquestion.style.display = "none"; 
    document.getElementById("addoption").style.display = "block";
}


//Adds a new question to the storage
document.getElementById("add").onclick = function(){
    alert("Scroll to the bottom of th page to add a question");
    let addquestion = document.getElementById("addQuestion")
    addquestion.style.display = "block"; 
};


function editQuestion(clickedquestionID){

    alert("Scroll to the bottom of th page to edit this question");

    editQID = clickedquestionID;

    let addq = document.getElementById("add")
    addq.disabled = true;

    console.log(clickedquestionID)
    let editquestion = document.getElementById("editQuestion")
    editquestion.style.display = "block";
    let questionobj;
    for(let i = 0; i < questionBank.length; i++){
        if(questionBank[i].Question.questionID == clickedquestionID){
            questionobj = questionBank[i];
        }
    }
    console.log(questionobj);
    let question = document.getElementById("editexistingquestion");
    question.value = questionobj.Question.questiondesc;

    let totalans = questionobj.Answer.length;
    let ans1 = document.getElementById("editoption1");
    ans1.value = questionobj.Answer[0].answerdesc;
            
    let ans2 = document.getElementById("editoption2");
    ans2.value = questionobj.Answer[1].answerdesc;

    console.log("total ans ", totalans);

    if(totalans == 2){
        let d4 = document.getElementById("editoption4");
        d4.value = "";
        d4.style.display = "none";
        let d3 = document.getElementById("editoption3");
        d3.value = "";
        d3.style.display = "none";
        let l4 = document.getElementById("labeleditoption4");
        l4.style.display = "none";
        let l3 = document.getElementById("labeleditoption3");
        l3.style.display = "none";
        let e = document.getElementById("editselectCorrAns");
        e.innerHTML = '';
        e.innerHTML += '<option value="1">1</option>';
        e.innerHTML += '<option value="2">2</option>';
    }else if(totalans == 3){
        let d4 = document.getElementById("editoption4");
        d4.value = "";
        d4.style.display = "none";

        let l4 = document.getElementById("labeleditoption4");
        l4.style.display = "none";

        let ans3 = document.getElementById("editoption3");
        ans3.style.display = "inline";
        ans3.value = questionobj.Answer[2].answerdesc;

        let l3 = document.getElementById("labeleditoption3");
        l3.style.display = "inline";

        let e = document.getElementById("editselectCorrAns");
        e.innerHTML = '';
        e.innerHTML += '<option value="1">1</option>';
        e.innerHTML += '<option value="2">2</option>';
        e.innerHTML += '<option value="3">3</option>';

    }else if(totalans == 4){
        let ans3 = document.getElementById("editoption3");
        ans3.style.display = "inline";
        ans3.value = questionobj.Answer[2].answerdesc;

        let l3 = document.getElementById("labeleditoption3");
        l3.style.display = "inline";

        let ans4 = document.getElementById("editoption4");
        ans4.style.display = "inline";
        ans4.value = questionobj.Answer[3].answerdesc;

        let l4 = document.getElementById("labeleditoption4");
        l4.style.display = "inline";

        let e = document.getElementById("editselectCorrAns");
        e.innerHTML = '';
        e.innerHTML += '<option value="1">1</option>';
        e.innerHTML += '<option value="2">2</option>';
        e.innerHTML += '<option value="3">3</option>';
        e.innerHTML += '<option value="4">4</option>';

    }

}

function canceledition(){

        let question = document.getElementById("editexistingquestion");
        question.value = "";

        let d4 = document.getElementById("editoption4");
        d4.value = "";
        d4.style.display = "inline";
        let d3 = document.getElementById("editoption3");
        d3.value = "";
        d3.style.display = "inline";
        let l4 = document.getElementById("labeleditoption4");
        l4.style.display = "inline";
        let l3 = document.getElementById("labeleditoption3");
        l3.style.display = "inline";
        
        let d2 = document.getElementById("editoption2");
        d2.value = "";
        d2.style.display = "inline";
        let d1 = document.getElementById("editoption1");
        d1.value = "";
        d1.style.display = "inline";
        let l2 = document.getElementById("labeleditoption2");
        l2.style.display = "inline";
        let l1 = document.getElementById("labeleditoption1");
        l1.style.display = "inline";

        let d = document.getElementById("editQuestion");
        d.style.display = "none";

        let e = document.getElementById("editselectCorrAns");
        e.innerHTML = '';

        let addq = document.getElementById("add")
        addq.disabled = false;

        editQID = null;
        
}

function submiteditedQuestion(){

    console.log("editing question ID", editQID);

    let questionobj;
    for(let i = 0; i < questionBank.length; i++){
        if(questionBank[i].Question.questionID == editQID){
            questionobj = questionBank[i];
        }
    }
    console.log(questionobj)
    let question = [];
    let q = document.getElementById("editexistingquestion").value;
    if(q == ""){
        alert("question field is empty");
        return
    }

    let totalanswers = questionobj.Answer.length;

    for(let i = 1; i <= totalanswers; i++){
        let id = "editoption" + i;
        if(document.getElementById(id).value == ""){
            console.log(i)
            let a = "answer field " + i + " is empty"
            alert(a);
            return
        }
    }
    let qobj = {"questionID": editQID, "questiondesc": q};

    question.push(qobj);

    let a = [];
    for(let i = 1; i <= totalanswers; i++){
        let id = "editoption" + i;
        let ans = document.getElementById(id).value;
        let obj = {"answerId": questionobj.Answer[i-1].answerID, "answerdesc": ans}
        a.push(obj)
    }
    let answer = {"answers": a}
    question.push(answer);

    let correctanswerindex = document.getElementById("editselectCorrAns").value;
    let caId = "editoption" + correctanswerindex;

    let corranswer = document.getElementById(caId).value;

    let corrAns = {"correctAnswer": corranswer};
    question.push(corrAns);
    
    let questionstring = JSON.stringify(question);
    console.log(questionstring);

    
    xhttp.open("POST", "http:kaushalanimesh.com/questions/" + editQID, true);
    xhttp.setRequestHeader("Content-type", "text/plain");
    xhttp.send(questionstring);
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          console.log(this.responseText)
           location.reload();
        }
     };
    
    console.log("sent")
    canceledition()
    
}


