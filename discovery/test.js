var TUI = require('lib/TUI');
var t = new TUI();
t.on('focus', function () {
  t
    .pos(1,1)
    .eraseLine()
    .fg(TUI.C.g)
    .out('focus');
});

t.on('blur', function () {
  t
    .pos(1,1)
    .eraseLine()
    .fg(TUI.C.r)
    .out('blur');
});

t.on('data', function (d) {
  var str = d.toString().replace('\x1b', 'ESC');
  t.pos(1,2).eraseLine().fg(TUI.C.g).out('Data: ').fg(TUI.C.c).out(str);
});

t.on('resize', function (evt) {
  t.clear();
  t.pos(1,3).eraseLine().fg(TUI.C.g).out('Size: ').fg(TUI.C.c).out(evt.w + ', ' + evt.h);
});

t.on('mousedown', function (evt) {
  t
    .pos(1,4)
    .eraseLine()
    .fg(TUI.C.g)
    .out('Mousedown: ')
    .fg(TUI.C.c)
    .out('(' + evt.x + ',' + evt.y + ')');
});

t.on('mouseup', function (evt) {
  t
    .pos(1,4)
    .eraseLine()
    .fg(TUI.C.g)
    .out('Mouseup: ')
    .fg(TUI.C.c)
    .out('(' + evt.x + ',' + evt.y + ')');
});

t.on('click', function (evt) {
  t
    .pos(1,4)
    .eraseLine()
    .fg(TUI.C.g)
    .out('Click: ')
    .fg(TUI.C.c)
    .out('(' + evt.x + ',' + evt.y + ')');
});

t.on('mousemove', function (evt) {
  t
    .pos(1,4)
    .eraseLine()
    .fg(TUI.C.g)
    .out('Mousemove: ')
    .fg(TUI.C.c)
    .out('(' + evt.x + ',' + evt.y + ')');
});

t.on('drag', function (evt) {
  t
    .pos(1,4)
    .eraseLine()
    .fg(TUI.C.g)
    .out('Drag: ')
    .fg(TUI.C.c)
    .out('(' + evt.x + ',' + evt.y + ')');
});

t.on('keypress', function (c, key) {
  t
    .pos(1,5)
    .eraseLine()
    .fg(TUI.C.g)
    .out('Keypress: ')
    .fg(TUI.C.c)
    .out(c + ' ' + (key ? JSON.stringify(key) : ''));
});

t.on('any', function (type, evt) {
  t
    .pos(1,6)
    .eraseLine()
    .fg(TUI.C.g)
    .out(type + ' (any): ')
    .fg(TUI.C.c)
    .out('(' + evt.x + ',' + evt.y + ') ' + (evt.alt?'alt ':'') + (evt.ctrl?'ctrl ':'') + (evt.shift?'shift':''));
});
