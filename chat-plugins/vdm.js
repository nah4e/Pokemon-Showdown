//  by keb

exports.commands = {
    vdm: function(target, room, user) {
        if (!this.canBroadcast()) return; 
        
        var self = this;
        var reqOpts = {
            hostname: "api.fmylife.com",
            method: "GET",
            path: '/view/random/sexe?language=fr&key=5395d4752b0a9'
        };
        var data = '';
        var req = require('http').request(reqOpts, function(res) {
            res.on('data', function(chunk) {
                data += chunk;
            });
            res.on('end', function(chunk) {
                parseString(data, function(err, result) {
                    if (err) throw err;
                    self.sendReplyBox('<b>Vie De Merde</b> - '+ result.root.items[0].item[0].text);
                    return room.update();
                });
            });
        });
        req.end();
    }
};
