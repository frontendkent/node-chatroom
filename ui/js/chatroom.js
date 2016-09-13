
var socket = io();
var chat = document.getElementById('id-chat');
var form = document.getElementById('id-chat__form');
var message = document.getElementById('id-chat__form-message')
var messages = [];


function render(msg, animate) {
	var li = document.createElement("li"); 
	li.className += " chat__post";
	if(msg.user == ip) li.className += " chat__post--me";
	if(animate) li.className += " chat__post--animate";
	li.innerHTML = "<span class='chat__datetime'>"+moment(msg.datetime).format('Do MMM h:mm A')+"</span><span class='chat__message'>" + msg.message + "</span>";
	chat.insertBefore(li, chat.childNodes[0]);
}

socket.on('connect', function(data) {
   socket.emit('join', 'Hello World from client');
});

socket.on('welcome', function(data) {
   console.log(data);
   for(m in data) render(data[m]);
});

form.onsubmit = function() {
	var value = message.value;
	message.value = "";
	var json =  {
		message:value,
		user:ip
	};
	socket.emit('chat message', json);
	return false;
}

socket.on('chat message', function(msg){
	render(msg, true);
});




