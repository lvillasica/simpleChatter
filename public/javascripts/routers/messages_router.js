Main.Routers.Messages = Backbone.Router.extend({
	routes: {
		'': 'index',
		'chat_room/:nickname': 'enterChatRoom'
	},

	index: function () {
		if(!this.messagesIndex) {
			this.messagesIndex = new Main.Views.MessagesIndex();
		}
		$('#contentPane').html(this.messagesIndex.render().el);
	},

	enterChatRoom: function(nickname) {
		var this_ = this;
		var socket = io.connect(window.location.origin);
		console.log(socket);
		var msg = '';
		$.get('/chat', function(data) {
			if(data.nickname && data.nickname == nickname) {
				if(!this_.chatRoomView) {
					this_.chatRoomView = new Main.Views.ChatRoom({
						nickname: data.nickname,
						channel: 'public',
						socket: socket
					});
				}

				$('#mainContainer').html(this_.chatRoomView.render().el)
				$('#clientHeader').removeClass('hide');

				var onConnect = function (name, channel) {
			  	if (name == this_.chatRoomView.nickname) {
			  		msg = 'You have joined the chat.';
			  		$('#clientHeader .current-client').removeClass('offline')
				    .addClass('online')
				    .html(name);

				    $('#channelsContainer').css({width:'78%'});
				    $('#OLPeopleContainer').removeClass('hide');

				    $('#clientHeader .exitBtn').bind('click', function(evt) {
				    	evt.preventDefault();
				    	window.location.href = '/exit_room';
				    });
			  	} else {
			  		msg = name + ' has joined the chat.';
			  	}

			    this_.chatRoomView.appendMsg('', msg, channel);
			  	this_.fetchPeople(socket);
			  };

				var onDisconnect = function(name, channel) {
					if(name == this_.chatRoomView.nickname) {
						msg = 'You are disconnected.';
						if(!channel) {
							$('#clientHeader .current-client').removeClass('online')
				    	.addClass('offline');
						}
					} else {
						msg = name + ' has been disconnected.';
					}

					this_.chatRoomView.appendMsg('', msg, channel);
					this_.fetchPeople(socket);
				};

				socket.emit('set nickname', data.nickname);
				socket.on('ready', onConnect);
			  socket.on('msg', function(data) {
			  	var from = (data.from == this_.chatRoomView.nickname)? 'You' : data.from;
					this_.chatRoomView.appendMsg(from, data.msg, data.channel);
				});

				socket.on('priv msg', function(data) {
					var from = new Main.Models.Person(data.from);
					var to = new Main.Models.Person(data.to);
					var olPersonDom = $('#olPerson-' + from.get('sid'));
					this_.chatRoomView.appendPrivateMsg(from, to, data.msg, socket);
					if(!olPersonDom.hasClass('has-pm')) olPersonDom.addClass('has-pm');
				});

				socket.on('ended', onDisconnect);
				socket.on('disconnect', function() {
					onDisconnect(this_.chatRoomView.nickname, null);
				});

				socket.on('reconnect', function() {
					window.location.reload();
				});

			} else {
				window.location.href = '/exit_room';
			}
			
		});
	},

	fetchPeople: function(socket) {
		var collection = new Main.Collections.People();
		collection.fetch({
			success: function(col, res) {
				var view = new Main.Views.PeopleIndex({
					collection: col,
					socket: socket
				});
				$('#OLPeopleContainer .list').html(view.render().el);
				$('#OLPeopleContainer .ol-person').addClass('online');
				$(window).resize(function() {
		    	$('#olPeople').css({height: ($(this).height() - 44) + 'px'});
		    });
		    $('#olPeople').css({height: ($(window).height() - 44) + 'px'});
			},
			error: function(col, res) {
				$('#OLPeopleContainer .ol-person')
				.removeClass('online')
				.removeClass('has-pm');
			}
		});
	}
});