module.exports = {

  index: function(req, res){
    if(!req.session.authenticated) return res.view('login');
    return res.view('app');
  }

}
