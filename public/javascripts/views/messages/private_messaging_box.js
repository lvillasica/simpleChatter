Main.Views.PrivateMessagingBox = Backbone.View.extend({

	template: 'messages/private_messaging_box',
	className: 'chat-box',

	events: {
		'keypress .msg-input': 'triggerSend',
		'click .detach': 'detachChannel',
		'focus .msg-input': 'removeNotif'
	},

	initialize: function() {
		this.from = this.options.from;
		this.to = this.options.to;
		this.socket = this.options.socket;
	},

	render: function() {
		$(this.el).html(this.template());
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
				socket.emit('priv send', {
					from: this_.from.attributes,
					to: this_.to.attributes,
					msg: msg
				});
			}
			
			this_.appendMsg('You', this_.to.get('name'), msg);
		} else {
			console.log('Nothing happened.');
		}
	},

	appendMsg: function(from, to, msg) {
		var container = this.$('#' + to + 'Private');
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

	removeNotif: function() {
		var olPersonDom = $('#olPerson-' + this.to.get('sid'));
		olPersonDom.removeClass('has-pm');
	},

	detachChannel: function(evt) {
		evt.preventDefault();
		// this.socket.emit('detach priv', this.from);
		$(this.el).remove();
		this.remove();
	}

});