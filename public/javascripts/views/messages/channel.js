Main.Views.Channel = Backbone.View.extend({

	template: 'messages/channel',
	className: 'chat-box',

	events: {
		'keypress .msg-input': 'triggerSend',
		'click .detach': 'detachChannel'
	},

	initialize: function() {
		this.nickname = this.options.nickname;
		this.channel = this.options.channel;
		this.socket = this.options.socket;
	},

	render: function() {
		$(this.el).html(this.template({
			channel: this.channel
		}));
  	return this;
	},

	triggerSend: function(evt) {
		var msg = '';
		var this_ = this;
		var socket = this.socket;
		var target = this.$(evt.currentTarget);
		if(evt.keycode == 13 || evt.which == 13) {
			evt.preventDefault();
			evt.stopPropagation();
			msg = target.val();
			target.val('');
			if(socket) {
				socket.emit('send', {
					from: this_.nickname,
					channel: this_.channel,
					msg: msg
				});
			} else {
				this_.appendMsg(this_.nickname, msg);
			}
		} else {
			console.log('Nothing happened.');
		}
	},

	appendMsg: function(from, msg) {
		var container = this.$('#' + this.channel + 'Channel');
		if(container.length > 0) {
			var view = new Main.Views.ChatMessage({
				nickname: from,
				msg: msg
			});
			container.find('.nomsg').remove();
			container.append(view.render().el);
			container.scrollTop($(container)[0].scrollHeight);
		}
	},

	detachChannel: function(evt) {
		evt.preventDefault();
		this.socket.emit('detach channel', this.channel);
		$(this.el).remove();
		this.remove();
	}

});