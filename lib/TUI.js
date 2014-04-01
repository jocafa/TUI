// Dependencies ---------------------------------------------------------------
var
  _ = require('lodash')._,
  keypress = require('keypress'),
  tty = require('tty'),
  events = require('events');

// Escape Codes ---------------------------------------------------------------
var
  CSI = '\x1b[', // Control Sequence Introducer
  OSC = '\x1b]', // Operating System Command
  DCS = '\x1bP'; // Device Control String

// Private Helpers ------------------------------------------------------------
function nxyz(n) {
  return (n/=255) <= 0.04045
    ? n/12.92
    : Math.pow((n+0.055)/1.055, 2.4);
}

function nxyzlab(n) {
  return n > 0.008856
    ? Math.pow(n, 1/3)
    : 7.787037 * n + 4/29;
}

function hexToLab(h) {
  var
    r = nxyz(h>>16),
    g = nxyz(h>>8&0xff),
    b = nxyz(h&0xff),
    x = nxyzlab((0.4124564 * r + 0.3575761 * g + 0.1804375 * b) / 0.950470),
    y = nxyzlab((0.2126729 * r + 0.7151522 * g + 0.0721750 * b) / 1),
    z = nxyzlab((0.0193339 * r + 0.1191920 * g + 0.9503041 * b) / 1.088830);

  return {
    L: 116*y - 16,
    a: 500*(x - y),
    b: 200*(y - z)
  }
}

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
  SYM: {
    star: '\u2605',
    openStar: '\u2606',

    check: '\u2714',
    x: '\u2718',

    // indicators
    ledOff: '\u25cb',
    ledOn: '\u25cf',

    watch: '\u231a\ufe0e',
    hourglass: '\u231b\ufe0e',

    triUp: '\u25b2',
    triDown: '\u25bc',
    triLeft: '\u25c0',
    triRight: '\u25b6',

    fn: '\u0192',
    lamda: '\u03bb',

    arrowUp: '\u2191',
    arrowRight: '\u2192',
    arrowDown: '\u2193',
    arrowLeft: '\u2190',

    block: '\u2588',

    hblock: [
      ' ',
      '\u2581',
      '\u2582',
      '\u2583',
      '\u2584',
      '\u2585',
      '\u2586',
      '\u2587',
      '\u2588'
    ],

    vblock: [
      ' ',
      '\u258f',
      '\u258e',
      '\u258d',
      '\u258c',
      '\u258b',
      '\u258a',
      '\u2589',
      '\u2588'
    ],

    quad: {
      tl: '\u2598',
      tr: '\u259d',
      br: '\u2597',
      bl: '\u2596',
      ntl: '\u259f',
      ntr: '\u2599',
      nbr: '\u259b',
      nbl: '\u259c',
      '/': '\u259e',
      '\\': '\u259a'
    },

    shade: {
      light: '\u2591',
      medium: '\u2592',
      dark: '\u2593'
    },

    triCorner: {
      tl: '\u25e4',
      tr: '\u25e5',
      br: '\u25e2',
      bl: '\u25e3'
    },

    arc: {
      tl: '\u25dc',
      tr: '\u25dd',
      tr: '\u25de',
      bl: '\u25df',
      top: '\u25e0',
      bottom: '\u25e1'
    },

    // Keys
    cmd: '\u2318',
    esc: '\u238b',
    opt: '\u2325',
    bsp: '\u232b',
    del: '\u2326',

    npa: { // symbols for non-printable ASCII
      nul: '\u2400',
      soh: '\u2401',
      stx: '\u2402',
      etx: '\u2403',
      eot: '\u2404',
      enq: '\u2405',
      ack: '\u2406',
      bel: '\u2407',
      bs:  '\u2408',
      ht:  '\u2409',
      lf:  '\u240a',
      vt:  '\u240b',
      ff:  '\u240c',
      cr:  '\u240d',
      so:  '\u240e',
      si:  '\u240f',

      dle: '\u2410',
      dc1: '\u2411',
      dc2: '\u2412',
      dc3: '\u2413',
      dc4: '\u2414',
      nak: '\u2415',
      syn: '\u2416',
      etb: '\u2417',
      can: '\u2418',
      em:  '\u2419',
      sub: '\u241a',
      esc: '\u241b',
      fs:  '\u241c',
      gs:  '\u241d',
      rs:  '\u241e',
      us:  '\u241f',

      sp:  '\u2420',
      del: '\u2421'
    },

    sup: { // superscript
      '0': '\u2070',
      '1': '\u00b9',
      '2': '\u00b3',
      '3': '\u00b3',
      '4': '\u2074',
      '5': '\u2075',
      '6': '\u2076',
      '7': '\u2077',
      '8': '\u2078',
      '9': '\u2079',
      'i': '\u2071',
      'n': '\u207f',
      '+': '\u207a',
      '=': '\u207c',
      '(': '\u207d',
      ')': '\u207e',
    },

    sub: { // subscript
      '0': '\u2080',
      '1': '\u2081',
      '2': '\u2082',
      '3': '\u2083',
      '4': '\u2084',
      '5': '\u2085',
      '6': '\u2086',
      '7': '\u2087',
      '8': '\u2088',
      '9': '\u2089',
      '+': '\u208a',
      '-': '\u208b',
      '=': '\u208c',
      '(': '\u208d',
      ')': '\u208e'
    }
  },

  isInteractive: function () {
    return (tty.isatty(process.stdin) && tty.isatty(process.stdout));
  }
});

// Instance ===================================================================
_.extend(TUI.prototype, {
  initialize: function () {
  },

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
  /* Color Notes:
     first 16 colors:
       regular:
         black: #000000
         red: #cd0000
         green: #00cd00
         yellow: #cdcd00
         blue: #0000ee
         magenta: #cd00cd
         cyan: #00cdcd
         white: #e5e5e5
       bright:
         black: #7f7f7f
         red: #ff0000
         green: #00ff00
         yellow: #ffff00
         blue: #5c5cff
         magenta: #ff00ff
         cyan: #00ffff
         white: #ffffff

     256-color mode:
       color cube:
         starts at 16
         is 6 wide
         steps are: 0x00, 0x5f, 0x87, 0xaf, 0xd7, 0xff
       grayscale:
         starts at 232
         has 24 entries
         ranges from #080808 to #eeeeee
         steps are: 0x08, 0x12, 0x1c, 0x26, 0x30, 0x3a, 0x44, 0x4e, 0x58, 0x62,
           0x6c, 0x76, 0x80, 0x84, 0x94, 0x9e, 0xa8, 0xb2, 0xbc, 0xc6, 0xd0,
           0xda, 0xe4, 0xee

     88-color mode:
       color cube:
         starts at 16
         is 4 wide
         steps are: 0x00, 0x8b, 0xcd, 0xff
       grayscale:
         starts at 80
         has 8 entries
         ranges from #0x2e2e2e to #e7e7e7
         steps are: 0x2e, 0x5c, 0x73, 0x8b, 0xa2, 0xb9, 0xd0, 0xe7
  */
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

  hexbg: function (c) {
  },

  hexfg: function (c) {
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

  quit: function () {
    this.resetColor().disableMouse().showCursor();
    process.stdin.setRawMode(false);
    process.exit(0);
  },

  // Queries ------------------------------------------------------------------
  query256ColorSupport: function () {
    return this.out(OSC + '4;255;?\e\\');
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
        /*
        x: d[4] - 32,
        y: d[5] - 32
        */
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
  }
});

module.exports = TUI;
