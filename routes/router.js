/*
 * GET home page.
 */
exports.index = function(req, res) {
  res.render('index', {
    title: 'Chat2x din pag may time...',
    menu: 'chat'
  });
};

exports.setNickname = function(req, res) {
  var nickname = req.body.nickname;
  res.cookie('nickname', nickname);
  res.send({nickname: nickname});
};

exports.chat = function(req, res) {
  var nickname = req.cookies.nickname;
  res.send({nickname: nickname});
};

exports.exitRoom = function(req, res) {
  res.clearCookie('nickname');
  res.redirect('/');
}

exports.people = function(req, res) {
  // var nickname = req.cookies.nickname;
  // var olPips = [];
  // for(var i = 0; i < people.length; i++) {
  //   if(people[i].name != nickname) olPips.push(people[i]);
  // }
  // res.send(olPips);
  res.send(people);
}
