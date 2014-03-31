var TUI = require('../lib/TUI');

var t = new TUI;

t.on('data', function (d) {
  t.pos(2,2).fg(TUI.C.y).out(d.toString('utf8', 1));
});

t.out('\x1b[0c');
