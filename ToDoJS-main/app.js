//Selectors
const todoInput = document.querySelector('.todo-input');
const todoButton = document.querySelector('.todo-button');
const todoList = document.querySelector('.todo-list');
const filterOption = document.querySelector('.filter-todo');

//Event Listeners
document.addEventListener("DOMContentLoaded", getTodos)
todoButton.addEventListener('click', addTodo);
todoList.addEventListener('click', deleteCheck);
filterOption.addEventListener('click', filterTodo);


//Functions
function addTodo(event){
    event.preventDefault();

    const todoDiv = document.createElement('div');
    todoDiv.classList.add('todo');

    //Create li
    const newtoDo = document.createElement('li');
    newtoDo.innerText = todoInput.value;
    
    newtoDo.classList.add('todo-item');
    todoDiv.appendChild(newtoDo);

    //Add todo to localStorage
    saveLocalTodos(todoInput.value);

    //Checked button
    const completedButton = document.createElement('button');
    completedButton.innerHTML = '<i class="fas fa-check"></i>';
    completedButton.classList.add("complete-btn");
    todoDiv.appendChild(completedButton);

    //Trash button
    const trashButton = document.createElement('button');
    trashButton.innerHTML = '<i class="fas fa-trash"></i>';
    trashButton.classList.add("trash-btn");
    todoDiv.appendChild(trashButton);

    //Append to list
    todoList.appendChild(todoDiv);

    //Clear input text
    todoInput.value = "";
    
    if(todoInput.value === ""){
        todoButton.disabled = true;
    }
}

function success() {
    if(todoInput.value==="") { 
        todoButton.disabled = true; 
       } else { 
        todoButton.disabled = false;
       }
   }


function deleteCheck(e){
    // console.log(e.target)
    const item = e.target;
    //Delete todo
    if (item.classList == "trash-btn"){
        const todo = item.parentElement;
        //Fade animation
        todo.classList.add("fade");
        removeLocalTodos(todo);
        todo.addEventListener('transitionend', () => {
            todo.remove();
        })
    }
    //Check todo
    if (item.classList == "complete-btn"){
        const todo = item.parentElement;
        todo.classList.toggle("completed");
    }
}

function filterTodo(e) {
    const todos = todoList.childNodes;
    todos.forEach(function (todo) { 
        const mStyle = todo.style;  
        if(mStyle != undefined && mStyle != null){
            switch (e.target.value) {
                case "all":
                    mStyle.display = "flex";
                    break;
                case "completed":
                    if (todo.classList.contains('completed')) {
                        mStyle.display = 'flex';
                    } else {
                        mStyle.display = "none";
                    }
                    break;
                case "uncompleted":
                    if (todo.classList.contains('completed')){
                        mStyle.display = 'none';
                    }
                    else{
                        mStyle.display = "flex";
                    }
                    break;
            }
        }
    })
}


function saveLocalTodos(todo){
    let todos;
    if(localStorage.getItem('todos')===null){
        todos = [];
    }else{
        todos = JSON.parse(localStorage.getItem('todos'));
    }
    todos.push(todo);
    localStorage.setItem("todos", JSON.stringify(todos));
}

function getTodos(){
    let todos;
    if(localStorage.getItem('todos')===null){
        todos = [];
    }else{
        todos = JSON.parse(localStorage.getItem('todos'));
    }
    todos.forEach(function(todo){

        const todoDiv = document.createElement('div');
    todoDiv.classList.add('todo');

    //Create li
    const newtoDo = document.createElement('li');
    newtoDo.innerText = todo;
    
    newtoDo.classList.add('todo-item');
    todoDiv.appendChild(newtoDo);

    //Checked button
    const completedButton = document.createElement('button');
    completedButton.innerHTML = '<i class="fas fa-check"></i>';
    completedButton.classList.add("complete-btn");
    todoDiv.appendChild(completedButton);

    //Trash button
    const trashButton = document.createElement('button');
    trashButton.innerHTML = '<i class="fas fa-trash"></i>';
    trashButton.classList.add("trash-btn");
    todoDiv.appendChild(trashButton);

    //Append to list
    todoList.appendChild(todoDiv);

    })
}

function removeLocalTodos(todo){
    let todos;
    if(localStorage.getItem('todos')===null){
        todos = [];
    }else{
        todos = JSON.parse(localStorage.getItem('todos'));
    }
    const todoIndex = todo.children[0].innerText;
    todos.splice(todos.indexOf(todoIndex), 1);
    localStorage.setItem("todos", JSON.stringify(todos));
}
// localStorage.clear()

//Pomodoro Timer
let workTime = 25; // in minutes
let breakTime = 5; // in minutes

let timerElement = document.getElementById('timer');
let statusElement = document.getElementById('status');
let chimeAudio = new Audio('chime-sound-7143.mp3');

let isWorkTime = true;
let timeLeft = workTime * 60; // converting to seconds
let timerInterval = null;

document.getElementById('pause-button').addEventListener('click', toggleTimer);

function toggleTimer() {
    let pauseButton = document.getElementById('pause-button');
    
    if (timerInterval === null) {
        // If the timer isn't running, then start it.
        startTimer();
        pauseButton.textContent = '| |';  // change to "pause" symbol
        pauseButton.setAttribute('data-state', 'running');
    } else {
        // If the timer is running, then pause it.
        pauseTimer();
        pauseButton.textContent = '▶';  // change to "play" symbol
        pauseButton.setAttribute('data-state', 'paused');
    }
}
function updateTimerDisplay() {
    let minutes = Math.floor(timeLeft / 60);
    let seconds = timeLeft % 60;

    timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function updateStatusDisplay() {
    if (timerInterval !== null) {
        statusElement.textContent = isWorkTime ? 'Working' : 'Having a break';
    } else {
        statusElement.textContent = '';
    }
}

function showNotification(message) {
    if (!("Notification" in window)) {
        console.log("This browser does not support desktop notification");
    } else if (Notification.permission === "granted") {
        new Notification(message);
    } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then(permission => {
            if (permission === "granted") {
                new Notification(message);
            }
        });
    }
}

function switchTimer() {
    isWorkTime = !isWorkTime;
    timeLeft = (isWorkTime ? workTime : breakTime) * 60;
    updateStatusDisplay();

    if (isWorkTime) {
        showNotification('Work time started!');
    } else {
        showNotification('Break time started!');
    }

    chimeAudio.play();
}

function timerTick() {
    if (timeLeft > 0) {
        timeLeft--;
        updateTimerDisplay();
    } else {
        switchTimer();
    }
}

function startTimer() {
    if (timerInterval === null) {
        timerInterval = setInterval(timerTick, 1000);
        document.getElementById('pause-button').style.display = 'inline-block'; // display the pause button
    }
    updateStatusDisplay();
}

function resetTimer() {
    if (timerInterval !== null) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
    isWorkTime = true;
    timeLeft = workTime * 60;
    updateTimerDisplay();
    updateStatusDisplay();
    document.getElementById('pause-button').style.display = 'none'; // hide the pause button
}

function pauseTimer() {
    if (timerInterval !== null) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

updateStatusDisplay();


var players = {
    "player1": { 
        "elementId": "playBtn1", 
        "player": null, 
        "isPlaying": false,
        "videoId": 'MDJC16ShEDM' // Replace with your first video ID
    },
    "player2": { 
        "elementId": "playBtn2", 
        "player": null, 
        "isPlaying": false,
        "videoId": 'Q6MemVxEquE' // Replace with your second video ID
    }
};

function onYouTubeIframeAPIReady() {
    for(var key in players) {
        players[key].player = new YT.Player(key, {
            height: '0',
            width: '0',
            videoId: players[key].videoId,
            playerVars: {
                autoplay: 0,
                controls: 0,
                showinfo: 0,
                rel: 0,
                loop: 1,
                playlist: players[key].videoId
            },
            events: {
                onReady: onPlayerReady
            }
        });
    }
}

function onPlayerReady(event) {
    var playerId = event.target.getIframe().id;
    var playerObj = players[playerId];
    var playBtn = document.getElementById(playerObj.elementId);
    
    playBtn.addEventListener('click', function() {
        if (!playerObj.isPlaying) {
            playerObj.player.playVideo();
            playBtn.style.backgroundColor = '#9b59b6'; // change the color when playing
            playerObj.isPlaying = true;
        } else {
            playerObj.player.pauseVideo();
            playBtn.style.backgroundColor = '#A7233A'; // revert to original color when paused
            playerObj.isPlaying = false;
        }
    });
}

// Date and Time
window.onload = function() {
    var vol = document.getElementById('vol');
    vol.addEventListener('input', function() {
        for(var key in players) {
            if (players[key].player) {
                players[key].player.setVolume(this.value);
            }
        }
    });
    (function() {
      function checkTime(i) {
        return (i < 10) ? "0" + i : i;
      }
  
      function startTime() {
        var today = new Date(),
            h = checkTime(today.getHours()),
            m = checkTime(today.getMinutes());
        document.getElementById('time').innerHTML = h + ":" + m;
        document.getElementById('date').innerHTML = today.toDateString();
        t = setTimeout(function() {
          startTime()
        }, 500);
      }
      startTime();
    })();
  }