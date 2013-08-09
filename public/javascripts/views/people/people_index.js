Main.Views.PeopleIndex = Backbone.View.extend({

	template: 'people/index',
	id: 'olPeople',

	initialize: function() {
		this.socket = this.options.socket;
	},

	render: function() {
		var this_ = this;
		var socket = this.socket;
		$(this.el).html(this.template());
		var container = $(this.el);
		this.collection.each(function(person) {
			if(socket.socket.sessionid != person.get('sid')) {
				this_.appendPersonTo(person, container, socket);
			}
		});
  	return this;
	},

	appendPersonTo: function(person, container, socket) {
		var view = new Main.Views.OnlinePerson({
			model: person,
			socket: socket
		});
		$(container).append(view.render().el);
	}

});