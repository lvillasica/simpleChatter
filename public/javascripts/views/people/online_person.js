Main.Views.OnlinePerson = Backbone.View.extend({

	template: 'people/online_person',
	className: 'ol-person',

	events: {
		'click': 'addPrivateMsgBox'
	},

	initialize: function() {
		this.socket = this.options.socket;
	},

	render: function() {
		$(this.el).html(this.template({
			model: this.model
		}));
		$(this.el).attr('id', 'olPerson-' + this.model.get('sid'));
  	return this;
	},

	addPrivateMsgBox: function(evt) {
		evt.preventDefault();
		evt.stopPropagation();
		var sessionid = this.socket.socket.sessionid,
		    from = this.model.collection.where({sid: sessionid})[0],
				to = this.model;
				pmBox = $('#' + to.get('name') + 'Private');
		if(pmBox.length < 1) {
			var view = new Main.Views.PrivateMessagingBox({
				from: this.model.collection.where({sid: sessionid})[0],
				to: this.model,
				socket: this.socket
			});
			var el = view.render().el;
			$(el).insertBefore($('.add-chat-box'));
			$(document).scrollTop($(el).offset().top);
		} else {
			$(document).scrollTop($(pmBox).closest('.chat-box').offset().top);
			$(this.el).removeClass('has-pm');
		}
	}

});