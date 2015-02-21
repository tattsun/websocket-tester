var getNow = function() {
    return new Date(Date.now());
};

var main = new Vue({
    el: '#main',
    data: {
        url: 'ws://127.0.0.1',
        sendmsg: '',
        messages: [],
        ws: null,
        isopen: false
    },
    methods: {
        connect: function() {
            var self = this;
            self.ws = new WebSocket(self.url);
            self.ws.onopen = function() {
                self.isopen = true;
                self.messages.unshift({
                    type: 'system',
                    message: 'Connected ' + self.url,
                    timestamp: getNow()
                });
            };
            self.ws.onmessage = function(e) {
                self.messages.unshift({
                    type: 'server',
                    message: e.data,
                    timestamp: getNow()
                });
            };
            self.ws.onerror = function() {
                self.messages.unshift({
                    type: 'system',
                    message: 'an error occured',
                    timestamp: getNow()
                });
            };
            self.ws.onclose = function() {
                self.isopen = false;
                self.messages.unshift({
                    type: 'system',
                    message: 'Closed',
                    timestamp: getNow()
                });
            };
        },
        send: function() {
            var self = this;
            self.messages.unshift({
                type: 'client',
                message: self.sendmsg,
                timestamp: getNow()
            });
            self.ws.send(self.sendmsg);
        }
    }
});
