for (var i = 0; i < 256; i++) {
  process.stdout.write('\x1b[48;2;' + i + ';' + (255-i) + ';' + i + 'm ');
}

process.stdout.write('\x1b[49m \n');
