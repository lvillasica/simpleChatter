Main.Views.MessagesIndex = Backbone.View.extend({

	template: 'messages/index',

	events: {
		'submit #nicknameForm': 'submitNickname'
	},

	render: function() {
		$(this.el).html(this.template());
  	return this;
	},

	submitNickname: function(evt) {
		evt.preventDefault();
		params = {nickname: $('#nickname').val()};
		$.post('/', params, function(data) {
			if(data && data.nickname) {
				Backbone.history.navigate('chat_room/' + data.nickname, {trigger: true});
			}
		});
	}

});