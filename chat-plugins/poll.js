function splint(target) {
	var cmdArr = target.split(",");
	for (var i = 0; i < cmdArr.length; i++) cmdArr[i] = cmdArr[i].trim();
		return cmdArr;
}

// PLUGIN DE VOTES

exports.commands = {
	
	poll: function (target, room, user) {
		if (!this.can('lock')) return false; 
		if ((user.locked || user.mutedRooms[room.id]) && !user.can('bypassall')) return this.sendReply("Impossible en étant mute.");
		if (room.question) return this.sendReply('Déjà un vote en cours.');
		if (!target) return false;
		if (target.length > 500) return this.sendReply('Vote bien trop long.');
		var separacion = "&nbsp;&nbsp;";
		var answers = splint(target);
		if (answers.length < 3) return this.sendReply('Syntaxe incorrecte: Utilisez /poll question, option, option...');
		var question = answers[0];
		question = Tools.escapeHTML(question);
		answers.splice(0, 1);
		var answers = answers.join(',').toLowerCase().split(',');
		room.question = question;
		room.answerList = answers;
		room.usergroup = Config.groupsranking.indexOf(user.group);
		var output = '';
		for (var u in room.answerList) {
			if (!room.answerList[u] || room.answerList[u].length < 1) continue;
			output += '<button name="send" value="/vote ' + room.answerList[u] + '">' + Tools.escapeHTML(room.answerList[u]) + '</button>&nbsp;';
		}
		room.addRaw('<div class="infobox"><h2>' + Tools.escapeHTML(room.question) + separacion + '<font size=2 color = "#939393"><small>/vote OPTION<br /><i><font size=1>Poll créé par: ' + Tools.escapeHTML(user.name) + '</font size></i></small></font></h2><hr />' + separacion + separacion + output + '</div>');
	},

	pr: 'pollremind',
	remind: function (target, room, user) {
		var separacion = "&nbsp;&nbsp;";
		if (!room.question) return this.sendReply('Pas de vote en cours.');
		if ((user.locked || user.mutedRooms[room.id]) && !user.can('bypassall')) return this.sendReply("Impossible en étant mute.");
		if (!this.canBroadcast()) return;
		var output = '';
		for (var u in room.answerList) {
			if (!room.answerList[u] || room.answerList[u].length < 1) continue;
			output += '<button name="send" value="/vote '+room.answerList[u]+'">'+Tools.escapeHTML(room.answerList[u])+'</button>&nbsp;';
		}
		this.sendReply('|raw|<div class="infobox"><h2>' + Tools.escapeHTML(room.question) + separacion + '<font font size=1 color = "#939393"><small>/vote OPTION</small></font></h2><hr />' + separacion + separacion + output + '</div>');
	},

	ep: 'endpoll',
	endpoll: function (target, room, user) {
		if (!this.can('lock')) return false; 
		if ((user.locked || user.mutedRooms[room.id]) && !user.can('bypassall')) return this.sendReply("Impossible en étant mute.");
		if (!room.question) return this.sendReply('Il n\'y a pas de votes en cours.');
		if (!room.answers) room.answers = new Object();
		var votes = Object.keys(room.answers).length;
		if (votes == 0) {
			room.question = undefined;
			room.answerList = new Array();
			room.answers = new Object();
			return room.addRaw("<h3>VOTE TERMINÉ: Manque de votants.</h3>");
		}
		var options = new Object();
		var obj = Rooms.get(room);
		for (var i in obj.answerList) options[obj.answerList[i]] = 0;
		for (var i in obj.answers) options[obj.answers[i]]++;
		var sortable = new Array();
		for (var i in options) sortable.push([i, options[i]]);
		sortable.sort(function(a, b) {return a[1] - b[1]});
		var html = "";
		for (var i = sortable.length - 1; i > -1; i--) {
			var option = sortable[i][0];
			var value = sortable[i][1];
			if (value > 0) html += "&bull; " + Tools.escapeHTML(option) + " - " + Math.floor(value / votes * 100) + "% (" + value + ")<br />";
		}
		room.addRaw('<div class="infobox"><h2>Resultats de: "' + Tools.escapeHTML(obj.question) + '"<br /><i><font size=1 color = "#939393">Vote terminé par: ' + Tools.escapeHTML(user.name) + '</font></i></h2><hr />' + html + '</div>'); 
		room.question = undefined;
		room.answerList = new Array();
		room.answers = new Object();
	},

	votes: function (target, room, user) {
		if (!room.answers) room.answers = new Object();
		if (!room.question) return this.sendReply('Il n\'y a pas de vote.');
		if (!this.canBroadcast()) return;
		this.sendReply('Nombre de votes: ' + Object.keys(room.answers).length);
	},

	vote: function (target, room, user) {
		var ips = user; 
		//var ips = JSON.stringify(user.ips);
		console.log(ips);
		if (!room.question) return this.sendReply('Il n\'y a pas de vote.');
		if (!target) return this.parse('/help vote');
		if (room.answerList.indexOf(target.toLowerCase()) == -1) return this.sendReply('\'' + target + '\' n\'est pas une option valide.');
		if (!room.answers) room.answers = new Object();
		room.answers[ips] = target.toLowerCase();
		return this.sendReply('Vous votez pour: "' + target + '".');
	}
};
