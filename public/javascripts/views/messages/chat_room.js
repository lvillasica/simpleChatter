Main.Views.ChatRoom = Backbone.View.extend({

	template: 'messages/chat_room',

	events: {
		'click .add-chat-box': 'triggerAddChannel'
	},

	initialize: function() {
		this.nickname = this.options.nickname;
		this.channel = this.options.channel;
		this.socket = this.options.socket;
	},

	render: function() {
		$(this.el).html(this.template());
		this.addChannel(this.channel, this.socket);
  	return this;
	},

	triggerAddChannel: function(evt) {
		evt.preventDefault();
		evt.stopPropagation();
		var channel=prompt("Please Enter a Channel Name",null);
		var ch = $('#' + channel + 'Channel');
		if(ch.length != 0) {
			alert('You are already connected to ' + channel);
		} else if(channel!=null && channel != '') {
		  this.addChannel(channel, this.socket);
			this.socket.emit('join channel', this.nickname, channel);
		}
	},

	addChannel: function(channel, socket) {
		view = new Main.Views.Channel({
			nickname: this.nickname,
			channel: channel,
			socket: socket
		});
		$(view.render().el).insertBefore(this.$('.add-chat-box'));
	},

	// TODO: REFACTOR ALL APPEND MESSAGE FUNCTIONS
	appendPrivateMsg: function(from, to, msg, socket) {
		var sender = from.get('name');
		var msgCont = $('#' + sender + 'Private');
		if(msgCont.length < 1) {
			var view = new Main.Views.PrivateMessagingBox({
				from: to,
				to: from,
				socket: socket
			});
			$(view.render().el).insertBefore($('.add-chat-box'));
			view.appendMsg(sender, sender, msg);
		} else {
			var view = new Main.Views.ChatMessage({
				nickname: sender,
				msg: msg
			});
			msgCont.find('.nomsg').remove();
			msgCont.append(view.render().el);
			msgCont.scrollTop($(msgCont)[0].scrollHeight);
		}
	},

	appendMsg: function(from, msg, channel) {
		var container = (channel)? this.$('#' + channel + 'Channel') : this.$('.chats');
		if(container.length > 0) {
			var view = new Main.Views.ChatMessage({
				nickname: from,
				msg: msg
			});
			container.find('.nomsg').remove();
			container.append(view.render().el);
			container.scrollTop($(container)[0].scrollHeight);
		}
	}

});