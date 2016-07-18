var app = app || {};

$(function(){

  app.proxy = function(type, url, data, onSuccess, onError, that){
    if(!that) that = this;
    $.ajax({
      type: type,
      url : url,
      data: data,
      context: that
    }).done(function(res){
      onSuccess.call(that, res);
    }).error(function(err){
      onError.call(that, err);
    });
  };

});
