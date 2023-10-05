document.addEventListener("DOMContentLoaded", function () {
    const taskInput = document.getElementById("task");
    const addBtn = document.getElementById("add");
    const taskList = document.getElementById("task-list");
    const analogClock = document.getElementById("analog-clock");
    const digitalClock = document.getElementById("digital-clock");
    const context = analogClock.getContext("2d");
    const clockRadius = analogClock.width / 2;

    // Display current time (digital clock)
    function updateDigitalClock() {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, "0");
        const minutes = now.getMinutes().toString().padStart(2, "0");
        const seconds = now.getSeconds().toString().padStart(2, "0");
        digitalClock.textContent = `${hours}:${minutes}:${seconds}`;
    }

    setInterval(updateDigitalClock, 1000);
    updateDigitalClock();

    // Draw analog clock
    function drawAnalogClock() {
        context.clearRect(0, 0, analogClock.width, analogClock.height);

        const now = new Date();
        const hours = now.getHours() % 12;
        const minutes = now.getMinutes();
        const seconds = now.getSeconds();

        // Draw clock face
        context.beginPath();
        context.arc(clockRadius, clockRadius, clockRadius - 10, 0, 2 * Math.PI);
        context.lineWidth = 5;
        context.strokeStyle = "white";
        context.stroke();
        context.closePath();

        // Draw hour hand
        const hourAngle = (hours * 30 + minutes / 2) * (Math.PI / 180);
        const hourHandLength = clockRadius * 0.5;
        const hourX = clockRadius + hourHandLength * Math.cos(hourAngle - Math.PI / 2);
        const hourY = clockRadius + hourHandLength * Math.sin(hourAngle - Math.PI / 2);
        context.beginPath();
        context.moveTo(clockRadius, clockRadius);
        context.lineTo(hourX, hourY);
        context.lineWidth = 8;
        context.strokeStyle = "white";
        context.stroke();
        context.closePath();

        // Draw minute hand
        const minuteAngle = (minutes * 6 + seconds / 10) * (Math.PI / 180);
        const minuteHandLength = clockRadius * 0.7;
        const minuteX = clockRadius + minuteHandLength * Math.cos(minuteAngle - Math.PI / 2);
        const minuteY = clockRadius + minuteHandLength * Math.sin(minuteAngle - Math.PI / 2);
        context.beginPath();
        context.moveTo(clockRadius, clockRadius);
        context.lineTo(minuteX, minuteY);
        context.lineWidth = 5;
        context.strokeStyle = "white";
        context.stroke();
        context.closePath();

        // Draw second hand
        const secondAngle = (seconds * 6) * (Math.PI / 180);
        const secondHandLength = clockRadius * 0.7;
        const secondX = clockRadius + secondHandLength * Math.cos(secondAngle - Math.PI / 2);
        const secondY = clockRadius + secondHandLength * Math.sin(secondAngle - Math.PI / 2);
        context.beginPath();
        context.moveTo(clockRadius, clockRadius);
        context.lineTo(secondX, secondY);
        context.lineWidth = 2;
        context.strokeStyle = "red";
        context.stroke();
        context.closePath();
    }

    setInterval(drawAnalogClock, 1000);
    drawAnalogClock();

    // Load tasks from local storage
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    function loadTasks() {
        taskList.innerHTML = "";
        tasks.forEach(function (taskData, index) {
            const li = document.createElement("li");
            const taskTime = new Date(taskData.timestamp);
            li.innerHTML = `
                ${taskData.text} (Added at ${taskTime.toLocaleString()})
                <button class="delete" data-index="${index}">Delete</button>
            `;
            taskList.appendChild(li);
        });
    }

    loadTasks();

    // Add a new task
    addBtn.addEventListener("click", function () {
        const taskText = taskInput.value.trim();
        if (taskText !== "") {
            const taskData = {
                text: taskText,
                timestamp: new Date().toISOString(),
            };
            tasks.push(taskData);
            localStorage.setItem("tasks", JSON.stringify(tasks));
            taskInput.value = "";
            loadTasks();
        }
    });

    // Delete task
    taskList.addEventListener("click", function (event) {
        if (event.target.classList.contains("delete")) {
            const index = event.target.getAttribute("data-index");
            tasks.splice(index, 1);
            localStorage.setItem("tasks", JSON.stringify(tasks));
            loadTasks();
        }
    });

    // Handle enter key press
    taskInput.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            addBtn.click();
        }
    });
});
// ... (Previous JavaScript code)

function loadTasks() {
    taskList.innerHTML = "";
    tasks.forEach(function (taskData, index) {
        const li = document.createElement("li");
        const taskTime = new Date(taskData.timestamp);
        li.classList.add("task-box"); // Add the task-box class
        li.innerHTML = `
            <span class="task-text ${taskData.completed ? 'completed' : ''}">${taskData.text}</span>
            <div class="task-actions">
                <button class="delete" data-index="${index}">Delete</button>
                <button class="edit" data-index="${index}">Edit</button>
                <button class="complete" data-index="${index}">${taskData.completed ? 'Undo' : 'Complete'}</button>
            </div>
        `;
        taskList.appendChild(li);

        // Add event listeners for task actions
        const completeBtn = li.querySelector(".complete");
        const editBtn = li.querySelector(".edit");
        const taskText = li.querySelector(".task-text");

        completeBtn.addEventListener("click", function () {
            taskData.completed = !taskData.completed;
            localStorage.setItem("tasks", JSON.stringify(tasks));
            loadTasks();
        });

        editBtn.addEventListener("click", function () {
            const newText = prompt("Edit task:", taskData.text);
            if (newText !== null) {
                taskData.text = newText;
                localStorage.setItem("tasks", JSON.stringify(tasks));
                loadTasks();
            }
        });

        taskText.addEventListener("click", function () {
            taskText.classList.toggle("completed");
        });
    });
}
