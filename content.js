let request = new XMLHttpRequest();
request.withCredentials = true;
request.open("GET", "https://vk.com/dev/messages.getById", true);
request.send();
request.onload = start;

function start() {
	if (request.status != 200) {
	    alert(`Ошибка ${request.status}: ${request.statusText}`);
		return;
	}
    let dom = new DOMParser();
    let el = dom.parseFromString(request.response, "text/xml");
    let startIndex = request.response.indexOf("Dev.methodRun('") + 15;
    let devHash = request.response.substring(startIndex, startIndex+29);
    document.addEventListener(
		"mouseover",
		function(arg){
			if(arg.toElement.className == "im-mess--fav _im_mess_fav") {
				let data = new FormData();
				data.append("act", "a_run_method");
				data.append("al",1);
				data.append("hash",devHash);
				data.append("method","messages.getById");
				data.append("param_extended",0);
				data.append("param_message_ids",arg.toElement.offsetParent.dataset.msgid);
				data.append("param_preview_length",0);
				data.append("param_v","5.120");
				request.open("POST", "https://vk.com/dev/messages.getById");
				request.send(data);
				request.onload = function() {
					let resp = JSON.parse(JSON.parse(request.response.substring(4)).payload[1]);
					if (resp.response.items[0].attachments.length > 0) {
						if (resp.response.items[0].attachments[0].type == "audio_message") {
							if (resp.response.items[0].attachments[0].audio_message.transcript_state == "done") {
								let transcript = resp.response.items[0].attachments[0].audio_message.transcript;
								alert(transcript);
							}
						}
					}
				};
			} 
		}
	);
}