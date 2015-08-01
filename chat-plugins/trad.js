// !trad plugin 
// using http://www.pokemontrash.com/ API 

// répertoire des traductions persos
// format: 
// 'motcles': 'Réponse', 
var CUSTOM_TRANSLATIONS = {
    'panur'   : 'un BOGOSS',
    'panure'  : 'un BOGOSS',
    'rohff'   : 'le BOGOSS',
    'nmais'   : 'LE MAIS', 
    'zzerime' : 'Lol.',
    'claerina': 'la copine de Erza ^^',
    'yarti'   : 'chaud',
    'haunter' : 'permaban',
    'paul'    : 'le LUCARIO',
    'lucario' : 'Votre fondateur préféré',
    'erza'    : 'dieu le fils',
    'oiseau'  : 'pinson',
    'nesta'   : 'dieu le père',
    'jessicca': 'la beauté',
    'fautletelecharger': 'nan il ne faut pas',
    'rambol'  : 'ramdom',
    'wally'   : 'L admin le plus cool',
    'wallythebully' : 'Timmy l intimidateur',
    'skyrio'  : 'skyriolu',
    'robot'   : '﴾͡๏̯͡๏﴿ ',
    'lumasan' : 'loumassane :3',
    'wettin'  : 'erza',
    'bd'      : 'belly drum',
    'tonywyatt': 'Le catcheur',
    'situm'   : 'parle t es mort'
};

exports.commands = {
    trad: function(target, room, user) {
	 	if (!this.canBroadcast()) return; 
	 	
	 	var item = toId(target), // argument donné sous toId 
	 		lang = ['fr', 'en']; // les langages dispo
        if (!item) return false; // précaution anti crash 
        
        var self = this; 
        // les traductions persos
        if (item in CUSTOM_TRANSLATIONS) {
            self.sendReplyBox('Traduction: <b>'+ CUSTOM_TRANSLATIONS[item] +'</b>');
            return room.update();
        }
        
        // L'api pokémon trash
        var searchEN = {
            hostname : 'www.pokemontrash.com',
            method   : 'GET',
            path     : '/api/fr/to/en/' + item
        };
        
        var searchFR = {
            hostname : 'www.pokemontrash.com',
            method   : 'GET',
            path     : '/api/en/to/fr/' + item
        };
        

        var dataEN = '';
        var dataFR = '';
        var reqEN = require('http').request(searchEN, function(res) {
            
            res.on('data', function (chunk) {
                dataEN += chunk;
            });
            
            res.on('end', function(chunk) {
                var d = JSON.parse(dataEN);
                if (d.exists) {
                    self.add('|raw|[<font color="FF00FF">Serveur</font>] Traduction: <b>' + d.to + '</b>');         
                }
            });
        });
        reqEN.end();
        
        var reqFR = require('http').request(searchFR, function(res) {
            
            res.on('data', function (chunk) {
                dataFR += chunk;
            });
            
            res.on('end', function(chunk) {
                var d = JSON.parse(dataFR);
                if (d.exists  && toId(d.to) != item) {
                    self.add('|raw|[<font color="FF00FF">Serveur</font>] Traduction: <b>' + d.to + '</b>');
                }
            });
        });
        reqFR.end();
	}
};
