const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const increaseBtn = document.getElementById("increase");
const decreaseBtn = document.getElementById("decrease");
const sizeEL = document.getElementById("size");
const colorEl = document.getElementById("color");
const clearEl = document.getElementById("clear");
const send = document.querySelector(".send-button");
const roomBtn = document.querySelector(".room-button");
const roomInput = document.getElementById("room-input");
const message = document.querySelector(".send");

function WindowResize() {
  // on mobile
  if (window.innerWidth < 786) {
    document.querySelector("canvas").style.display = "none";
    document.querySelector("div.cont").style.display = "none";
    document.querySelector(
      ".canvas-error"
    ).innerHTML = `<div style="color:white;text-align:center;">Canvas not Supported for Mobile version.<br/> Please Switch to Desktop Version.</div>`;
  }
  // on desktop
  else {
    document.querySelector("canvas").style.display = "flex";
    document.querySelector("div.cont").style.display = "flex";
    document.querySelector(".canvas-error").innerHTML = ``;
  }
}
WindowResize();
window.onresize = WindowResize;
let prev = "";
let x;
let y;
colorEl.value = "#000";
let color = colorEl.value;
let size = 5;
let isPressed = false;

let socket = io.connect();
let room = "";
// send a message to the server
// socket.emit("hello from client", 5, "6", { 7: Uint8Array.from([8]) });

// // // receive a message from the server
// // socket.on("hello from server", (...args) => {
// // ...

socket.on("connect", () => {
  displayMessage1(`you are connected with socketId= ${socket.id}`);
  canvas.addEventListener("mousedown", (e) => {
    isPressed = true;
    x = e.offsetX;
    y = e.offsetY;

    console.log(x, y);
  });
  canvas.addEventListener("mouseup", (e) => {
    isPressed = false;
    x = undefined;
    y = undefined;

    console.log(x, y);
  });

  canvas.addEventListener("mousemove", (e) => {
    if (isPressed) {
      const x2 = e.offsetX;
      const y2 = e.offsetY;

      DrawCircle(x2, y2);
      DrawLine(x, y, x2, y2);
      socket.emit("draw", x, y, x2, y2, room);
      x = e.offsetX;
      y = e.offsetY;
    }
  });

  socket.on("drawnow", (a, b, a2, b2) => {
    console.log("happy");

    DrawCircle(a2, b2);
    DrawLine(a, b, a2, b2);
    // x = e.offsetX;
    // y = e.offsetY;
  });

  function DrawCircle(x, y) {
    ctx.beginPath();
    ctx.arc(x, y, size, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
  }

  function DrawLine(x1, y1, x2, y2) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = color;
    ctx.lineWidth = size * 2;
    ctx.stroke();
  }

  function updateSizeOnScreen() {
    sizeEL.innerText = size;
  }

  increaseBtn.addEventListener("click", () => {
    size += 5;

    if (size > 50) {
      size = 50;
    }
    socket.emit("send-increase", size, room);
    updateSizeOnScreen();
  });
  socket.on("receive-increase", (sz) => {
    size = sz;
    updateSizeOnScreen();
  });

  decreaseBtn.addEventListener("click", () => {
    size -= 5;

    if (size < 5) {
      size = 5;
    }
    socket.emit("send-decrease", size, room);
    updateSizeOnScreen();
  });
  socket.on("receive-decrease", (sz) => {
    size = sz;
    updateSizeOnScreen();
  });
  colorEl.addEventListener("change", (e) => {
    color = e.target.value;
    socket.emit("send-color", color, room);
  });

  socket.on("receive-color", (cl) => {
    color = cl;
  });

  clearEl.addEventListener("click", () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    socket.emit("send-clear", room);
  });

  socket.on("receive-clear", () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  });

  function displayMessage1(message) {
    const div = document.createElement("div");
    const p = document.createElement("p");
    const chat = document.querySelector(".chatbox");
    div.append(p);
    div.classList.add("div1");
    p.classList.add("message1");
    p.textContent = message;
    prev = div;
    if (prev === "") {
      chat.append(div);
    } else {
      chat.append(div);
    }
    prev.scrollIntoView();
  }

  function displayMessage2(message) {
    const div = document.createElement("div");
    const p = document.createElement("p");
    const chat = document.querySelector(".chatbox");
    div.append(p);
    div.classList.add("div2");
    p.classList.add("message2");
    p.textContent = message;
    prev = div;
    if (prev === "") {
      chat.append(div);
    } else {
      chat.append(div);
    }
    prev.scrollIntoView();
  }

  socket.on("receive-message", (message) => {
    // if (join === 1) {
    //   socket.join(room);
    // }
    displayMessage2(message);
  });

  send.addEventListener("click", (e) => {
    const msgVlaue = message.value;
    if (msgVlaue === "") return;

    displayMessage1(msgVlaue);
    socket.emit("send-message", msgVlaue, room);
    message.value = "";
  });

  roomBtn.addEventListener("click", () => {
    room = roomInput.value;

    socket.emit("join-room", room, canvas, (cv) => {
      if (cv) canvas = cv;
    });
  });
});
