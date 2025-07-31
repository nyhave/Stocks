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
  dismissBtn.textContent = 'Dismiss';
  Object.assign(dismissBtn.style, {
    float: 'right',
    background: '#444',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
    marginLeft: '0.5em'
  });

  const copyBtn = document.createElement('button');
  copyBtn.textContent = 'Copy';
  Object.assign(copyBtn.style, {
    float: 'right',
    background: '#444',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
    marginLeft: '0.5em'
  });

  copyBtn.onclick = function() {
    const text = Array.from(list.children)
      .map(n => n.textContent)
      .join('\n');
    navigator.clipboard.writeText(text);
  };

  dismissBtn.onclick = function() {
    overlay.style.display = 'none';
  };

  const list = document.createElement('div');
  overlay.appendChild(copyBtn);
  overlay.appendChild(dismissBtn);
  overlay.appendChild(list);
  document.body.appendChild(overlay);

  function showOverlay() {
    overlay.style.display = 'block';
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

  window.addEventListener('unhandledrejection', function(e) {
    let msg = '';
    if (e.reason && e.reason.message) {
      msg = e.reason.message;
    } else if (typeof e.reason === 'string') {
      msg = e.reason;
    } else {
      try {
        msg = JSON.stringify(e.reason);
      } catch {
        msg = String(e.reason);
      }
    }
    addMessage('error', ['Unhandled rejection: ' + msg]);
  });
})();
