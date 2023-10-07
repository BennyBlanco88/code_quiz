const start_btn = document.querySelector(".start_btn button");
const info_box = document.querySelector(".info_box");
const exit_btn = info_box.querySelector(".buttons .quit");
const continue_btn = info_box.querySelector(".buttons .restart");
const quiz_box = document.querySelector(".quiz_box");
const timeCount = quiz_box.querySelector(".timer .timer_sec");

const option_list = document.querySelector(".option_list");

//if start Quiz Button Clicked
start_btn.onclick = ()=>{
    info_box.classList.add("activeInfo"); //show th info box
}

//if Exit Button Clicked
exit_btn.onclick = ()=>{
    info_box.classList.remove("activeInfo");//hide info box
}

//if Cpntinue Button Clicked
continue_btn.onclick = ()=>{
    info_box.classList.remove("activeInfo");//hide info box
    quiz_box.classList.add("activeQuiz");//Show the quiz box
    showQuestions(0);
    queCounter(1);
    StartTimer();
    next_btn.style.display = "none";
}

let que_count = 0;
let que_numb = 1;
let counter;
let timeValue = 15;
let userScore = 0;
let time = 120;

let records = JSON.parse(localStorage.getItem("records"))

const next_btn = quiz_box.querySelector(".next_btn");
const result_box = document.querySelector(".result_box");
// const restart_quiz = result_box.querySelector(".buttons .restart");
const save_quiz = result_box.querySelector(".buttons .save");
const quit_quiz = result_box.querySelector(".buttons .quit")

const initials_input = result_box.querySelector("#initials")


// // restart_quiz.onclick = ()=>{
//     let que_count = 0;
//     let que_numb = 1;
//     let timeValue = 15;
//     let userScore = 0;
// }

save_quiz.onclick = () => {
    var score = userScore;
    var initials = initials_input.value;

    console.log(score, initials)

    var data = {
        score,
        initials
    }

    records.push(data)

    localStorage.setItem("records", JSON.stringify(records));

    const scoreText = result_box.querySelector(".score_text");
    scoreText.innerHTML = "";

    // <ul>
    //     <li>AC - 2</li>
    //     <li>AC - 5</li>
    //     <li>AC - 4</li>
    //  </ul>
    const newUl = document.createElement("ul");

    for (let i = 0; i < records.length; i++) {
        const newLi = document.createElement("li");
        newLi.textContent = records[i].initials + " - " + records[i].score;
        newUl.append(newLi)
    }

    scoreText.append(newUl)

    save_quiz.style.display = "none";
    
}

quit_quiz.onclick = ()=>{
    window.location.reload();
}

//If Next Button Clicked
next_btn.onclick = ()=>{
    if(que_count < questions.length - 1){
        que_count++;
        que_numb++;
        showQuestions(que_count);
        queCounter(que_numb);
    }else{
        console.log("Questions completed");
        showResultBox();
    }
    
}

//getting questions and options from array
function showQuestions(index){
    const que_text = document.querySelector(".que_text");
    let que_tag = '<span>'+ questions[index].numb + ". "+ questions[index].question +'</span>'
    let option_tag = '<div class="option">' + questions[index].options[0] +'<span></span></div>'
                    + '<div class="option">'+ questions[index].options[1] +'<span></span></div>'
                    + '<div class="option">'+ questions[index].options[2] +'<span></span></div>'
                    + '<div class="option">'+ questions[index].options[3] +'<span></span></div>';
    que_text.innerHTML = que_tag;
    option_list.innerHTML = option_tag;
    const option = option_list.querySelectorAll(".option");
    for (let i = 0; i < option.length; i++) {
        option[i].setAttribute("onclick", "optionSelected(this)");
    }
}

let tickIcon = '<div class="icon tick"><i class="fas fa-check"></i></div>';
let crossIcon = '<div class="icon cross"><i class="fas fa-times"></i></div>';

function optionSelected(answer){
    let userAns = answer.textContent;
    let correctAns = questions[que_count].answer;
    let allOptions = option_list.children.length;
    if(userAns == correctAns){
        userScore += 1;
        console.log(userScore)
        answer.classList.add("correct");
        console.log("Answer is Correct");
        answer.insertAdjacentHTML("beforeend", tickIcon)
    }else{
        answer.classList.add("incorrect");
        console.log("Answer is Wrong");
        answer.insertAdjacentHTML("beforeend", crossIcon)

        //if answer is incorrect then automatically select correct answer
        for (let i = 0; i < allOptions; i++) {
            if(option_list.children[i].textContent == correctAns){
                option_list.children[i].setAttribute("class", "option correct");
                option_list.children[i].insertAdjacentHTML("beforeend", tickIcon)
            }
        }

        time = time - 5;
    }

    //once user selected disabled all options
    for (let i = 0; i < allOptions; i++) {
        option_list.children[i].classList.add("disabled");
        
    }
    next_btn.style.display = "block";
}

function showResultBox(){
    info_box.classList.remove("activeInfo");//hide info box
    quiz_box.classList.remove("activeQuiz");//hide the quiz box
    result_box.classList.add("activeResult");//Show the result box
    const scoreText = result_box.querySelector(".score_text");
    if(userScore > 3){
        let scoreTag = '<span>and congrats!, You got <p>'+ userScore + '</p> out of <p>' + questions.length +'</p></span>';
        scoreText.innerHTML = scoreTag;
    }
    else if(userScore > 1){
        let scoreTag = '<span>and nice, You got <p>'+ userScore + '</p> out of <p>' + questions.length +'</p></span>';
        scoreText.innerHTML = scoreTag;
    }
    else{
        let scoreTag = '<span>and sorry, You got only <p>'+ userScore + '</p> out of <p>' + questions.length +'</p></span>';
        scoreText.innerHTML = scoreTag;
    }
}

function StartTimer(){
    counter = setInterval(timer, 1000)
    function timer(){
        timeCount.textContent = time;
        time--;
        if(time < 0){
            clearInterval(counter);
            timeCount.textContent = "00"
        }
    }
}

function queCounter(index){
    const bottom_ques_counter = quiz_box.querySelector(".total_que")
    let totalQuesCountTag = '<span><p>'+ index + '</p><p>Of</p><p>'+ questions.length +'</p><p>Questions</p></span>';
    bottom_ques_counter.innerHTML = totalQuesCountTag;
}