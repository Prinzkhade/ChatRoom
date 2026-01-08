(function() {
    const app = document.querySelector('.app');
    const socket = io();
    let uname;

    app.querySelector('.join-screen #join-user').addEventListener('click', function() {
        let username = app.querySelector('.join-screen #username').value;
        if(username.length == 0) {
            return;
        }
        socket.emit('newusert', username);
        uname = username;
        app.querySelector('.join-screen').classList.remove('active');
        app.querySelector('.chat-screen').classList.add('active');
    });

    function sendMessage() {
        if(!uname) return;
        const input = app.querySelector('.chat-screen #message-input');
        let message = input.value.trim();
        if(message.length === 0) return;
        renderMessage("my", { username: uname, message: message });
        socket.emit("chat", { username: uname, message: message });
        input.value = "";
        input.focus();
    }

    app.querySelector('.chat-screen #send-message').addEventListener('click', sendMessage);
    app.querySelector('.chat-screen #message-input').addEventListener('keydown', function(e) {
        if(e.key === 'Enter') sendMessage();
    });
    function renderMessage(type, message) {
        let messageContainer = app.querySelector('.chat-screen .messages'); 
        if(type == "my") {
            let el = document.createElement('div');
            el.setAttribute('class', 'message my-message');
            el.innerHTML = `<div class="name">You</div><div class="text">${message.message}</div>`;
            messageContainer.appendChild(el);
        } else if(type == "other") {
            let el = document.createElement('div');
            el.setAttribute('class', 'message other-message');
            el.innerHTML = `<div class="name">${message.username}</div><div class="text">${message.message}</div>`;
            messageContainer.appendChild(el);
        } else if(type == "update") {
            let el = document.createElement('div');
            el.setAttribute('class', 'update');
            el.innerText = message;
            messageContainer.appendChild(el);
        }
        messageContainer.scrollTop = messageContainer.scrollHeight - messageContainer.clientHeight;
    }

    socket.on("ubdate", function(update){
        renderMessage("update", update);
    });

    socket.on("chat", function(data){
        renderMessage("other", data);
    });

    app.querySelector('.chat-screen #exit-chat').addEventListener('click', function() {
        socket.emit("exituser", uname);
        window.location.reload();
    });
})();