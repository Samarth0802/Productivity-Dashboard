// Get all cards
const cards = document.querySelectorAll('.card');
const motivationCard = document.querySelector('.motivation')
const motivationQuote = document.querySelector('.forMotivation .main-moto .quote h1')
const motivationAuthor = document.querySelector('.forMotivation .main-moto .author')

// Theme functionality
const themeBtn = document.querySelector('.theme');
let currentThemeIndex = 0;

const themes = [
    {
        name: 'Default',
        mainBg: '#321A0D',
        headerBg: '#684728',
        selectBg: 'rgba(50, 26, 13, 0.98)',
        motoBg: 'radial-gradient(ellipse, rgb(167, 112, 20) 50%, rgb(56, 31, 14) 100%)',
        motoCard: '#FFB118',
        textColor: '#F8F1DC'
    },
    {
        name: 'Ocean Blue',
        mainBg: '#0D1B32',
        headerBg: '#1E3A5F',
        selectBg: 'rgba(13, 27, 50, 0.98)',
        motoBg: 'radial-gradient(ellipse, rgb(30, 58, 95) 50%, rgb(10, 20, 40) 100%)',
        motoCard: '#4A90E2',
        textColor: '#E8F4F8'
    },
    {
        name: 'Forest Green',
        mainBg: '#1A2E1A',
        headerBg: '#2D5016',
        selectBg: 'rgba(26, 46, 26, 0.98)',
        motoBg: 'radial-gradient(ellipse, rgb(45, 80, 22) 50%, rgb(20, 35, 15) 100%)',
        motoCard: '#7CB342',
        textColor: '#E8F5E9'
    },
    {
        name: 'Purple Night',
        mainBg: '#1A0D32',
        headerBg: '#3D2868',
        selectBg: 'rgba(26, 13, 50, 0.98)',
        motoBg: 'radial-gradient(ellipse, rgb(88, 44, 160) 50%, rgb(30, 15, 50) 100%)',
        motoCard: '#9C27B0',
        textColor: '#F3E5F5'
    }
];

// Load saved theme on page load
function loadTheme() {
    const savedTheme = localStorage.getItem('dashboardTheme');
    if (savedTheme !== null) {
        currentThemeIndex = parseInt(savedTheme);
        applyTheme(currentThemeIndex);
    }
}

// Apply theme
function applyTheme(index) {
    const theme = themes[index];
    
    document.querySelector('main').style.backgroundColor = theme.mainBg;
    document.querySelector('.heading-section').style.backgroundColor = theme.headerBg;
    
    document.querySelectorAll('.select').forEach(select => {
        select.style.backgroundColor = theme.selectBg;
        select.style.color = theme.textColor;
    });
    
    const forMotivation = document.querySelector('.forMotivation');
    forMotivation.style.background = theme.motoBg;
    
    const mainMoto = document.querySelector('.forMotivation .main-moto');
    if (mainMoto) {
        mainMoto.style.backgroundColor = theme.motoCard;
    }
    
    themeBtn.textContent = `Theme: ${theme.name}`;
}

// Change theme on button click
themeBtn.addEventListener('click', () => {
    currentThemeIndex = (currentThemeIndex + 1) % themes.length;
    applyTheme(currentThemeIndex);
    localStorage.setItem('dashboardTheme', currentThemeIndex);
});

loadTheme();

// Card click functionality
cards.forEach((card) => {
    card.addEventListener('click', (e) => {
        if(e.target.closest('.card-effects')) {
            return;
        }
        const targetClass = card.getAttribute('data-target');
        const selectSection = document.querySelector(`.${targetClass}`);
        
        if(selectSection){
            selectSection.classList.add('active');
        }
    });
});

// Close button functionality
const closeBtns = document.querySelectorAll('.close-btn');

closeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const selectSection = btn.closest('.select');
        if(selectSection){
            selectSection.classList.remove('active');
        }
    });
});

// Escape key to close
document.addEventListener('keydown', (e) => {
    if(e.key === 'Escape'){
        const activeSelect = document.querySelector('.select.active');
        if(activeSelect){
            activeSelect.classList.remove('active');
        }
    }
});

// Quote functionality
async function getQuote(){
    motivationQuote.innerHTML = "Loading quote...";
    motivationAuthor.innerHTML = "";
    
    let randomNumber = Math.floor(Math.random()*1454+1)
    const url = `https://dummyjson.com/quotes/${randomNumber}`
    
    try {
        let rawData = await fetch(url);
        if(!rawData.ok){
            throw new Error("Quote not found");
        }
        let data = await rawData.json();
        setQuoteAuthor(data);
    } catch (error) {
        motivationQuote.innerHTML = "Failed to load quote";
        motivationAuthor.innerHTML = "Please try again";
    }
}

motivationCard.addEventListener('click',function(){
    getQuote();
})

function setQuoteAuthor(data){
    motivationQuote.innerHTML = data.quote
    motivationAuthor.innerHTML = `- ${data.author}`
}

// TO-DO List
const inputTask = document.querySelector('#task');
const detailsTextArea = document.querySelector('#details')
const important = document.querySelector('#important')
const addTaskbtn = document.querySelector('.addTask')
const rightSide = document.querySelector('.rightSide')

let tasks = []

function loadTasks(){
    const savedTasks = localStorage.getItem('tasks')
    if(savedTasks){
        tasks = JSON.parse(savedTasks);
        renderTasks();
    }
}

function saveTasks(){
    localStorage.setItem('tasks',JSON.stringify(tasks));
}

addTaskbtn.addEventListener('click',function(){
    let textTask = inputTask.value.trim();
    let DetailedTask = detailsTextArea.value.trim();
    let isImportant =  important.checked;

    // ✅ FIXED: === instead of =
    if(textTask === ''){
        alert("Enter the task to add.")
        return
    }

    let task = {
        id:Date.now(),
        task:textTask,
        details:DetailedTask,
        important:isImportant,
        expanded:false
    }

    tasks.push(task)
    saveTasks();
    renderTasks();

    inputTask.value = '';
    detailsTextArea.value = '';
    important.checked =  false;
})

// ✅ FIXED: innerHTML clear ek baar loop ke bahar
function renderTasks(){
    rightSide.innerHTML = '';

    if(tasks.length === 0){
        rightSide.innerHTML = '<p style="text-align: center; padding: 20px; color: #F8F1DC;">Your Tasks will appear here...</p>';
        return;
    }

    tasks.forEach((task)=>{
        const todoWork = document.createElement('div');
        todoWork.className = 'todo-work'
        todoWork.dataset.id = task.id;

        todoWork.innerHTML = `<div class="todotask">
                    <div class="head">
                        <h1>${task.task}</h1>
                        <div class="imp" style="display: ${task.important ? 'flex' : 'none'}">Imp</div>
                    </div>
                    <div class="btns">
                        <button class="complete">Mark as Completed</button>
                        <button class="Expand">${task.expanded ? 'Collapse' : 'Expand'}</button>
                    </div>
                </div>
                <div class="desc" style="display: ${task.expanded ? 'block' : 'none'}; margin-top: 10px; padding-top: 10px; border-top: 1px solid #ccc;">
                    ${task.details || 'No details provided'}
                </div>`

        rightSide.appendChild(todoWork);
        
        const completeBtn = todoWork.querySelector('.complete');
        const expandBtn = todoWork.querySelector('.Expand');
        
        completeBtn.addEventListener('click', () => {
            removeTask(task.id);
        });
        
        expandBtn.addEventListener('click', () => {
            toggleExpand(task.id);
        });
    })
}

function removeTask(TaskId){
    tasks = tasks.filter((task)=> task.id !== TaskId)
    saveTasks();
    renderTasks();
}

function toggleExpand(TaskId){
    const task = tasks.find((t)=> t.id === TaskId)
    if(task){
        task.expanded = !task.expanded
        saveTasks();
        renderTasks();
    }
}

loadTasks()

// Daily Planner
function forDaily(){
    let DailyPlanner = document.querySelector('.dailyplanner')

    let dailyTasks = JSON.parse(localStorage.getItem('dailyTasks')) || {};
    console.log('Loaded tasks:', dailyTasks)

    let sum = '';
    for(let idx = 0; idx < 18; idx++){
        sum += `<div class="div-part">
            <div class="timing">${6+idx}:00 - ${7+idx}:00</div>
            <input type="text" placeholder="- - -" class="textPart" id="${idx+1}" autocomplete="off">
        </div>`
    }

    DailyPlanner.innerHTML = sum;

    function renderDailyTasks(){
        for (let id in dailyTasks){
            let input = document.getElementById(id);
            if(input && dailyTasks[id]){
                input.value = dailyTasks[id];
            }
        }
    }
    renderDailyTasks();

    DailyPlanner.addEventListener('input', function (e) {
        if (e.target.classList.contains('textPart')) {
            let index = e.target.id;
            let task = e.target.value;

            dailyTasks[index] = task;
            setTasks();
        }
    });

    function setTasks(){
        localStorage.setItem('dailyTasks', JSON.stringify(dailyTasks));
        localStorage.setItem('taskDate', new Date().toDateString());
        console.log('Tasks saved:', dailyTasks);
    }
}

function checkAndClearOldTasks(){
    let savedDate = localStorage.getItem('taskDate');
    let today = new Date().toDateString();
    
    if(savedDate && savedDate !== today){
        console.log("New day - Clearing old tasks");
        localStorage.removeItem('dailyTasks');
        localStorage.removeItem('taskDate');
    }
}

checkAndClearOldTasks();
forDaily();

// Pomodoro Timer
let startBtn = document.querySelector(".start-timer") 
let pauseBtn = document.querySelector(".pause-timer") 
let resetBtn = document.querySelector(".reset-timer") 
let timer = document.querySelector('.timer') 
 
let totalSeconds = 25*60 
let intervalId = null; 
let alreadyAsked = false;
 
function updateTimer(){ 
    let minutes = Math.floor(totalSeconds / 60); 
    let seconds = Math.floor(totalSeconds % 60); 
    timer.innerHTML = `${String(minutes).padStart(2,'0')}:${String(seconds).padStart(2,'0')}` 
} 
 
startBtn.addEventListener('click',function(){ 
    if(intervalId !== null){ 
        return 
    } 
 
    intervalId = setInterval(() => { 
        if(totalSeconds > 0){ 
            totalSeconds--; 
            updateTimer(); 
        } 
        else{ 
            clearInterval(intervalId) 
            intervalId = null;
            
            if(!alreadyAsked){
                alreadyAsked = true;
                showCustomPrompt();
            }
        } 
    }, 1000); // ✅ FIXED: 1000ms = 1 second
}) 

pauseBtn.addEventListener('click', function(){
    if(intervalId !== null){
        clearInterval(intervalId);
        intervalId = null;
    }
})

resetBtn.addEventListener('click', function(){
    clearInterval(intervalId);
    intervalId = null;
    totalSeconds = 25*60;
    alreadyAsked = false;
    updateTimer();
})

function showCustomPrompt(){
    let overlay = document.createElement('div');
    overlay.className = 'custom-prompt-overlay';
    
    overlay.innerHTML = `
        <div class="custom-prompt-box">
            <h2>🎉 Session Complete!</h2>
            <p>What would you like to do next?</p>
            <div class="prompt-buttons">
                <button class="prompt-btn" data-action="short">Short Break (5 min)</button>
                <button class="prompt-btn" data-action="long">Long Break (10 min)</button>
                <button class="prompt-btn lock-in" data-action="continue">Lock In (25 min) 🔥</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(overlay);
    
    document.querySelectorAll('.prompt-btn').forEach(btn => {
        btn.addEventListener('click', function(){
            let action = this.getAttribute('data-action');
            
            if(action === 'short'){
                totalSeconds = 5*60;
            } else if(action === 'long'){
                totalSeconds = 10*60;
            } else if(action === 'continue'){
                totalSeconds = 25*60;
            }
            
            updateTimer();
            alreadyAsked = false;
            document.body.removeChild(overlay);
        });
    });
}

let currentDate = document.querySelector('.date h2')
let dayTime = document.querySelector('.day-time h2')


setInterval(() => {
    const now = new Date();

    let currentDate = now.toDateString();      // Fri May 03 2025

    let time = now.toLocaleTimeString(); // 12:45:10 PM
    let hour = time.split(':')[0]
    
    let hours = String(hour).padStart(2,'0')
    time = `${hours}:${time.split(':')[1]}:${time.split(':')[2]}`
    currentDate.innerHTML = currentDate;
    dayTime.innerHTML = time
}, 1000); // ✅ every second



const apiKey = '53237438c16be0795730063ff89aabb5';

let cityName = getStoredCity() || prompt("Enter your city name:");
if(cityName){
    saveCity(cityName);
    loadWeather(cityName);
}

/************ WEATHER ************/
async function loadWeather(city){
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    try{
        const res = await fetch(url);
        const data = await res.json();

        if(data.cod === '404') return;

        document.querySelector('.city h2').innerText = `${data.name}, India`;
        document.querySelector('.temp').innerText = `${data.main.temp}° C`;
        document.querySelector('.weather').innerText = data.weather[0].main;
        document.querySelector('.humidity').innerText = `Humidity: ${data.main.humidity}%`;
        document.querySelector('.wind').innerText = `Wind: ${data.wind.speed} km/h`;

    }catch(err){
        console.log("Weather error", err);
    }
}

/************ LOCAL STORAGE ************/
function saveCity(city){
    localStorage.setItem('cityName', city);
    localStorage.setItem('cityTime', Date.now()); // ⏱ timestamp
}

function getStoredCity(){
    const savedCity = localStorage.getItem('cityName');
    const savedTime = localStorage.getItem('cityTime');

    if(!savedCity || !savedTime) return null;

    const hoursPassed = (Date.now() - savedTime) / (1000 * 60 * 60);

    if(hoursPassed >= 24){
        localStorage.removeItem('cityName');
        localStorage.removeItem('cityTime');
        return null;
    }

    return savedCity;
}

   