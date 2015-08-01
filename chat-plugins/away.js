

var parseStatus = function parseStatus(text, encoding) {
    var bubbleLetterMap = new Map([['a', 'ⓐ'], ['b', 'ⓑ'], ['c', 'ⓒ'], ['d', 'ⓓ'], ['e', 'ⓔ'], ['f', 'ⓕ'], ['g', 'ⓖ'], ['h', 'ⓗ'], ['i', 'ⓘ'], ['j', 'ⓙ'], ['k', 'ⓚ'], ['l', 'ⓛ'], ['m', 'ⓜ'], ['n', 'ⓝ'], ['o', 'ⓞ'], ['p', 'ⓟ'], ['q', 'ⓠ'], ['r', 'ⓡ'], ['s', 'ⓢ'], ['t', 'ⓣ'], ['u', 'ⓤ'], ['v', 'ⓥ'], ['w', 'ⓦ'], ['x', 'ⓧ'], ['y', 'ⓨ'], ['z', 'ⓩ'], ['A', 'Ⓐ'], ['B', 'Ⓑ'], ['C', 'Ⓒ'], ['D', 'Ⓓ'], ['E', 'Ⓔ'], ['F', 'Ⓕ'], ['G', 'Ⓖ'], ['H', 'Ⓗ'], ['I', 'Ⓘ'], ['J', 'Ⓙ'], ['K', 'Ⓚ'], ['L', 'Ⓛ'], ['M', 'Ⓜ'], ['N', 'Ⓝ'], ['O', 'Ⓞ'], ['P', 'Ⓟ'], ['Q', 'Ⓠ'], ['R', 'Ⓡ'], ['S', 'Ⓢ'], ['T', 'Ⓣ'], ['U', 'Ⓤ'], ['V', 'Ⓥ'], ['W', 'Ⓦ'], ['X', 'Ⓧ'], ['Y', 'Ⓨ'], ['Z', 'Ⓩ'], ['1', '①'], ['2', '②'], ['3', '③'], ['4', '④'], ['5', '⑤'], ['6', '⑥'], ['7', '⑦'], ['8', '⑧'], ['9', '⑨'], ['0', '⓪']]);
    var asciiMap = new Map([['ⓐ', 'a'], ['ⓑ', 'b'], ['ⓒ', 'c'], ['ⓓ', 'd'], ['ⓔ', 'e'], ['ⓕ', 'f'], ['ⓖ', 'g'], ['ⓗ', 'h'], ['ⓘ', 'i'], ['ⓙ', 'j'], ['ⓚ', 'k'], ['ⓛ', 'l'], ['ⓜ', 'm'], ['ⓝ', 'n'], ['ⓞ', 'o'], ['ⓟ', 'p'], ['ⓠ', 'q'], ['ⓡ', 'r'], ['ⓢ', 's'], ['ⓣ', 't'], ['ⓤ', 'u'], ['ⓥ', 'v'], ['ⓦ', 'w'], ['ⓧ', 'x'], ['ⓨ', 'y'], ['ⓩ', 'z'], ['Ⓐ', 'A'], ['Ⓑ', 'B'], ['Ⓒ', 'C'], ['Ⓓ', 'D'], ['Ⓔ', 'E'], ['Ⓕ', 'F'], ['Ⓖ', 'G'], ['Ⓗ', 'H'], ['Ⓘ', 'I'], ['Ⓙ', 'J'], ['Ⓚ', 'K'], ['Ⓛ', 'L'], ['Ⓜ', 'M'], ['Ⓝ', 'N'], ['Ⓞ', 'O'], ['Ⓟ', 'P'], ['Ⓠ', 'Q'], ['Ⓡ', 'R'], ['Ⓢ', 'S'], ['Ⓣ', 'T'], ['Ⓤ', 'U'], ['Ⓥ', 'V'], ['Ⓦ', 'W'], ['Ⓧ', 'X'], ['Ⓨ', 'Y'], ['Ⓩ', 'Z'], ['①', '1'], ['②', '2'], ['③', '3'], ['④', '4'], ['⑤', '5'], ['⑥', '6'], ['⑦', '7'], ['⑧', '8'], ['⑨', '9'], ['⓪', '0']]);

    if (encoding) {
      text = text.split('').map(function (char) {
        return bubbleLetterMap.get(char);
      }).join('');
    } else {
      text = text.split('').map(function (char) {
        return asciiMap.get(char);
      }).join('');
    }
    return text;
};

exports.commands = {
    afk: function (target, room, user) {
      console.log('[AFK] '+ user +': '+ target); // AFFICHE DANS LA CONSOLE LES UTILISATEURS UTILISANT LA COMMANDE
      target = target ? target.replace(/[^a-zA-Z0-9]/g, '') : 'AFK';
      var newName = user.name;
      var status = parseStatus(target, true);
      var statusLen = status.length;
      if (statusLen > 14) {
        return this.sendReply('Statut trop long.');
      }

      if (user.isAway) {
        var statusIdx = newName.search(/\s\-\s[\u24B6-\u24E9\u2460-\u2468\u24EA]+$/);
        if (statusIdx > -1) newName = newName.substr(0, statusIdx);
        if (user.name.substr(-statusLen) === status) {
          return this.sendReply('Votre statut est déjà "' + target + '".');
        }
      }

      newName += ' - ' + status;
      var targetUser = Users.getExact(user.userid + target);
      if (targetUser && targetUser !== user && targetUser.name === user.name + ' - ' + target) {
        targetUser.resetName();
        targetUser.send('|nametaken|Votre pseudo rentre en conflit avec ' + user.name + (user.name.substr(-1) === 's' ? '\'' : '\'s') + ' votre nouveau statut.');
      }

      if (user.can('lock', null, room)) this.add('|raw|► <b>' + Tools.escapeHTML(user.name) + '</b> est maintenant "' + target.toLowerCase() + '".');
      user.forceRename(newName, user.registered);
      user.updateIdentity();
      user.isAway = true;
    },
    re: 'back',
    back: function (target, room, user) {
      if (!user.isAway) {
        return this.sendReply('Vous n\'avez pas de statut.');
      }
      user.isAway = false;

      var newName = user.name;
      var statusIdx = newName.search(/\s\-\s[\u24B6-\u24E9\u2460-\u2468\u24EA]+$/);
      if (statusIdx < 0) {
        user.isAway = false;
        if (user.can('lock', null, room)) this.add('|raw|► <b>' + Tools.escapeHTML(user.name) + '</b> n\'est plus AFK.');
        return false;
      }

      var status = parseStatus(newName.substr(statusIdx + 3), false);
      newName = newName.substr(0, statusIdx);
      user.forceRename(newName, user.registered);
      user.updateIdentity();
      user.isAway = false;
      if (user.can('lock', null, room)) this.add('|raw|► <b>' + Tools.escapeHTML(user.name) + '</b> n\'est plus "' + status.toLowerCase() + '".');
    }
};
