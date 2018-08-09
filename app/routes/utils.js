const handleFailure = (msg, type, req, res) => {
  const prefix = req.params[0] + '/';
  const service = (type === 'bsp' ? 'bsp' : 'fep');
  req.session.data[service + 'Failure'] = msg;
  res.app.locals[service + 'Complete'] = true;
  res.redirect(prefix + 'error');
}

module.exports = {
  handleFailure
}