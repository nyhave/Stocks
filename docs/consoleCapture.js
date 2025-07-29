(function() {
  const overlay = document.createElement('div');
  overlay.id = 'console-overlay';
  Object.assign(overlay.style, {
    position: 'fixed',
    bottom: '0',
    left: '0',
    right: '0',
    maxHeight: '40vh',
    overflowY: 'auto',
    background: 'rgba(0,0,0,0.8)',
    color: 'white',
    fontFamily: 'monospace',
    fontSize: '12px',
    zIndex: '10000',
    padding: '0.5em',
    display: 'none'
  });

  const dismissBtn = document.createElement('button');
  dismissBtn.textContent = 'Dismiss / Luk';
  Object.assign(dismissBtn.style, {
    float: 'right',
    background: '#444',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
    marginLeft: '0.5em'
  });

  let dismissed = false;
  dismissBtn.onclick = function() {
    dismissed = true;
    overlay.style.display = 'none';
  };

  const list = document.createElement('div');
  overlay.appendChild(dismissBtn);
  overlay.appendChild(list);
  document.addEventListener('DOMContentLoaded', function() {
    document.body.appendChild(overlay);
  });

  function showOverlay() {
    if (!dismissed) overlay.style.display = 'block';
  }

  function addMessage(type, args) {
    const div = document.createElement('div');
    div.textContent = '[' + type + '] ' + Array.from(args).join(' ');
    list.appendChild(div);
    showOverlay();
  }

  const origLog = console.log;
  const origError = console.error;

  console.log = function() {
    addMessage('log', arguments);
    origLog.apply(console, arguments);
  };

  console.error = function() {
    addMessage('error', arguments);
    origError.apply(console, arguments);
  };

  window.addEventListener('error', function(e) {
    addMessage('error', [e.message + ' (' + e.filename + ':' + e.lineno + ')']);
  });
})();
