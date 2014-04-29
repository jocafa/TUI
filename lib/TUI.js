// Dependencies ---------------------------------------------------------------
var
  _ = require('lodash')._,
  keypress = require('keypress'),
  tty = require('tty'),
  events = require('events'),
  util = require('util');

// Local Dependencies ---------------------------------------------------------
var
  symbols = require('./symbols');

// Escape Codes ---------------------------------------------------------------
var
  CSI = '\x1b[', // Control Sequence Introducer
  OSC = '\x1b]', // Operating System Command
  DCS = '\x1bP'; // Device Control String

// TUI ========================================================================
function TUI() {
  var that = this;
  events.EventEmitter.call(this);
  _.bindAll(this, ['onResize', 'onKeyPress', 'onData']);

  if (TUI.isInteractive()) {
    process.stdin.setRawMode(true);
    process.stdin.resume();
    keypress(process.stdin);

    process.stdin.on('keypress', this.onKeyPress);
    process.stdin.on('data', this.onData);
    process.on('SIGWINCH', this.onResize);

    process.nextTick(function () {
      that.onResize();
      that.enableMouse();
    });

    this.isTerm = true;
  } else {
    this.isTerm = false;
  }
}

TUI.prototype = Object.create(events.EventEmitter.prototype);
TUI.prototype.constructor = TUI;

// Class ======================================================================
_.extend(TUI, {
  C: { k: 0, r: 1, g: 2, y: 3, b: 4, m: 5, c: 6, w: 7, x: 9 },
  S: { normal: 0, bold: 1, underline: 4, blink: 5, inverse: 8 },
  SYM: symbols,

  isInteractive: function () {
    return (tty.isatty(process.stdin) && tty.isatty(process.stdout));
  }
});

// Instance ===================================================================
_.extend(TUI.prototype, {
  // Main Output --------------------------------------------------------------
  out: function (buf) {
    if (this.isTerm) {
      process.stdout.write(buf);
    }
    return this;
  },

  // Cursor -------------------------------------------------------------------
  showCursor: function () {
    return this.out(CSI + '?25h');
  },

  hideCursor: function () {
    return this.out(CSI + '?25l');
  },

  // Mouse --------------------------------------------------------------------
  // TODO: use "all" motion tracking when focused, otherwise use "cell"
  enableMouse: function () {
    return this
      .out(CSI + '?1000h') // send mouse x/y on button press and release
      .out(CSI + '?1002h') // use cell motion mouse tracking
      .out(CSI + '?1003h') // use all motion mouse tracking
      .out(CSI + '?1004h') // send focusin/focusout events
      .out(CSI + '?1005h'); // enable utf8 mouse mode
  },

  disableMouse: function () {
    return this
      .out(CSI + '?1000l') // send mouse x/y on button press and release
      .out(CSI + '?1002l') // use cell motion mouse tracking
      .out(CSI + '?1003l') // use all motion mouse tracking
      .out(CSI + '?1004l') // send focusin/focusout events
      .out(CSI + '?1005l'); // enable utf8 mouse mode
  },

  // Position -----------------------------------------------------------------
  pos: function (x, y) {
    x = x < 0 ? this.width - x : x;
    y = y < 0 ? this.height - y : y;
    x = Math.max(Math.min(x, this.width), 1);
    y = Math.max(Math.min(y, this.height), 1);

    return this.out(CSI + y + ';' + x + 'H');
  },

  home: function () {
    return this.pos(1, 1);
  },

  end: function () {
    return this.pos(1, -1);
  },

  // Color State --------------------------------------------------------------
  fg: function (c) {
    return this.out(CSI + '3' + c + 'm');
  },

  bg: function (c) {
    return this.out(CSI + '4' + c + 'm');
  },

  hifg: function (c) {
    return this.out(CSI + '38;5;' + c + 'm');
  },

  hibg: function (c) {
    return this.out(CSI + '48;5;' + c + 'm');
  },

  rgbfg: function (r, g, b) {
    return this.out(CSI + '38;5;' + r + ';' + g + ';' + b + 'm');
  },

  rgbbg: function (r, g, b) {
    return this.out(CSI + '48;5;' + r + ';' + g + ';' + b + 'm');
  },

  resetColor: function () {
    return this.fg(TUI.C.x).bg(TUI.C.x);
  },

  // Drawing ------------------------------------------------------------------
  fillRect: function (c, t, l, b, r) {
    return this.out(CSI + c + ';' + t + ';' + l + ';' + b + ';' + r + '$x');
  },

  // Erasing ------------------------------------------------------------------
  eraseLine: function () {
    return this.out(CSI + '2K');
  },

  eraseRect: function (t, l, b, r) {
    return this.out(CSI + t + ';' + l + ';' + b + ';' + r + '$z');
  },

  clear: function () {
    return this.out(CSI + '2J').home();
  },

  // Data Processors for onData to use ----------------------------------------
  processMouseData: function (d) {
    var
      str = d.toString('utf8'),
      eventData = {
        raw: str,
        shift: (d[3] & 0x4) > 0,
        alt: (d[3] & 0x8) > 0, // maybe?
        ctrl: (d[3] & 0x10) > 0,
        x: str.charCodeAt(4) - 32,
        y: str.charCodeAt(5) - 32
      },
      buttons = [ 'left', 'middle', 'right' ];

    switch (d[3] & 0x60) {
      case 0x20: //button
        if ((d[3] & 0x3) < 0x3) {
          eventData.button = buttons[ d[3] & 0x3 ];
          this.mouseDownCoords = {x: eventData.x, y: eventData.y};
          this.emit('mousedown', eventData);
          this.emit('any', 'mousedown', eventData);
        } else {
          this.emit('mouseup', eventData);
          this.emit('any', 'mouseup', eventData);
          if (this.mouseDownCoords &&
              this.mouseDownCoords.x == eventData.x &&
              this.mouseDownCoords.y == eventData.y) {
            this.emit('click', eventData);
            this.emit('any', 'click', eventData);
          }
        }
        break;

      case 0x40: // movement
        if ((d[3] & 0x3) < 0x3) {
          eventData.button = buttons[ d[3] & 0x3 ];
          this.emit('mousemove', eventData);
          this.emit('any', 'mousemove', eventData);
          this.emit('drag', eventData);
          this.emit('any', 'drag', eventData);
        } else {
          this.emit('mousemove', eventData);
          this.emit('any', 'mousemove', eventData);
        }
        break;

      case 0x60: //scroll
        eventData.direction = (d[3] & 0x1) ? 'down' : 'up';
        this.emit('wheel', eventData);
        this.emit('any', 'wheel', eventData);
        break;
    }
  },

  // Event Handlers -----------------------------------------------------------
  onData: function (d) {
    var str = d.toString('utf8');
    if (str.indexOf(CSI + 'M') == 0) { // Mouse Event
      this.processMouseData(d);
    } else if (str.indexOf(CSI + 'I') == 0) { // Focus In
      this.emit('focus');
    } else if (str.indexOf(CSI + 'O') == 0) { // Focus Out
      this.emit('blur');
    }

    this.emit('data', d);
  },

  onKeyPress: function (c, key) {
    if (key && key.ctrl && key.name == 'c') {
      this.quit();
    } else {
      this.emit('keypress', c, key);
    }
  },

  onResize: function () {
    var winsize = process.stdout.getWindowSize();
    this.width = winsize[1];
    this.height = winsize[0];
    this.emit('resize', {w: this.width, h: this.height});
  },

  // End of lifecycle ---------------------------------------------------------
  quit: function () {
    this.resetColor().disableMouse().showCursor();
    process.stdin.setRawMode(false);
    process.exit(0);
  }
});

module.exports = TUI;
