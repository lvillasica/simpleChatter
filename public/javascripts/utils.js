window.utils = {

  // Asynchronously load templates located in separate .html files
  loadTemplates: function(views, scope, callback) {

    var deferreds = [];

    $.each(views, function(index, view) {
      var view = scope[view];
      if (view) {
        var viewInst = new view();
        deferreds.push($.get('templates/' + viewInst.template + '.html', function(data) {
          view.prototype.template = _.template(data);
        }));
      } else {
        alert(view + " not found");
      }
    });

    $.when.apply(null, deferreds).done(callback);
  }

}