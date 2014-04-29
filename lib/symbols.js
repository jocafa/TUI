module.exports = {
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
  }
};
