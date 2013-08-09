Main.Views.ChatMessage = Backbone.View.extend({

	template: 'messages/chat_message',

	initialize: function() {
		var time = new Date();
		var toTwoDigits = function(num) {
			num = parseInt(num);
			return (num < 10)? '0' + num : num;
		};
		var hh = toTwoDigits(time.getHours()),
		    mm = toTwoDigits(time.getMinutes()),
		    ss = toTwoDigits(time.getSeconds());

		this.nickname = this.options.nickname
		this.msg = this.options.msg
		this.timeReceived = hh + ':' + mm + ':' + ss;
	},

	render: function() {
		$(this.el).html(this.template({
			nickname: this.nickname,
			msg: this.msg,
			timeReceived: this.timeReceived
		}));
  	return this;
	}

});