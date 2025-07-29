var _flutter = _flutter || {};
_flutter.loader = {
  loadEntrypoint: function() {
    var s = document.createElement('script');
    s.src = 'main.dart.js';
    document.body.appendChild(s);
  }
};
