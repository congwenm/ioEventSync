var connection = {};
var socket = io.connect(location.href);

var output = document.getElementById('output')

socket.on('connect', function() {
  connection.sessionId = socket.io.engine.id;
  console.log("IO connected", connection.sessionId)
})

socket.on('command-click', function(clickEvent) {
  console.debug('api asking to click element', clickEvent)
  if(clickEvent.sessionId !== connection.sessionId) {
    console.debug("sessionId are not equal: ", clickEvent.sessionId, connection.sessionId);
    var evt = new Event('click')
    evt.fromApi = true;
    document.querySelector(`[io-click="${clickEvent.selector}"]`).dispatchEvent(evt)
  }
})

document.querySelector('#log-in').addEventListener('click', function onLogin(e) {
  if (e.fromApi){
    return output.innerHTML = `successfully synchronized: <p>username: ${document.querySelector('#login').value}</p> <p>password: ${document.querySelector('#pass').value}</p>`
  }
  output.textContent = 'you have been synchronized' 
})

document.querySelector('#register').addEventListener('click', (e) => {
  if (e.fromApi){
    return output.textContent = "User attempted to register"
  }
  output.innerHTML = "Registration is not avaible, please enter a username and password"
})

socket.on('command-change', function(changeEvent) {
  console.debug('api asking to change element', changeEvent);
  if (changeEvent.sessionId !== connection.sessionId) {
    console.debug('sessionId are not equal')
    var elemToChange = document.querySelector(`[io-change="${changeEvent.selector}"]`)

    var evt = new Event('change')
    evt.fromApi = true;
    elemToChange.value = changeEvent.value
    elemToChange.dispatchEvent(evt)
  }
})

socket.on("error", function (reason) {
        console.error("Unable to connect to server", reason);
      });


document.querySelectorAll('[io-click]').forEach((elem) => {
  var selector = elem.getAttribute('io-click')
  elem.addEventListener("click", function(e){
    var fromApi = e.fromApi
    console.debug('emitting clickevent', e, fromApi)
    if (fromApi) return;
    socket.emit('click', { selector, sessionId: connection.sessionId })
  })
})

document.querySelectorAll('[io-change]').forEach((elem) => {
  var selector = elem.getAttribute('io-change')
  elem.addEventListener("change", function(e){
    var fromApi = e.fromApi
    console.debug('emitting clickevent', e, fromApi)
    if (fromApi) return;
    socket.emit('change', { 
      selector, 
      sessionId: connection.sessionId,
      value: elem.value
    })
  })
})