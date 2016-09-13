

function chatroom(data) {
	var chat = document.getElementById('id-chat');
	var form = document.getElementById('id-chat__form');
	var message = document.getElementById('id-chat__form-message')
	var sendingMessage = false;

		function RenderMessages(n) {
			var renderAll = false;
			if(n === undefined) {
				n = data.messages.length;
				renderAll = true;
				chat.innerHTML = "";
			}
			console.log('Rendering ', n);
			if(!n) return;
			var html = "";
			var li;
			for(i=0; i<n; i++) {
				li = document.createElement("li"); 
				li.className += "chat__post";
				if(data.me == data.messages[i].user) li.className += " chat__post--me";
				li.innerHTML = "<span class='chat__datetime'>"+moment(data.messages[i].datetime).format('Do MMM h:mm A')+"</span><span class='chat__user'>" + data.messages[i].user + "</span><span class='chat__message'>" + data.messages[i].message + "</span>";
				if(renderAll) {
					chat.appendChild(li);
				} else {
					li.className += " chat__post--animate";
					chat.insertBefore(li, chat.childNodes[0]);
				}
			}
		}
		RenderMessages();

		form.onsubmit = function() {
			var value = message.value;
			if(value) {
				var xhttp = new XMLHttpRequest();
				xhttp.open("POST", "/api/messages", true);
				xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
				xhttp.onreadystatechange = function() {
				  if (xhttp.readyState == 4 && xhttp.status == 200) {
				  	var newData = JSON.parse(xhttp.responseText);
				  	console.log(newData);
				  	var number = newData.length - data.messages.length;
				  	data.messages = newData;
				  	RenderMessages(number);
				  }
				  sendingMessage = false;
				};
				sendingMessage = true;
				xhttp.send("ajax=true&message=" + value);
				message.value = "";
			}
			return false;
		}

		setInterval(function() {
			if(sendingMessage) return;

			var xhttp = new XMLHttpRequest();
			xhttp.open("GET", "/api/messages", true);
			xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
			xhttp.onreadystatechange = function() {
			  if (xhttp.readyState == 4 && xhttp.status == 200) {
			  	var newData = JSON.parse(xhttp.responseText);
			  	var number = newData.length - data.messages.length;
			  	data.messages = newData;
			  	RenderMessages(number);
			  }
			};
			xhttp.send();

		}, 1000);
}

if( typeof module !== 'undefined' && module.exports ) {
	module.exports = function() {
    	console.log('hello world');
    }
}



