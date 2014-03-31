for (var i = 0; i < 256; i++) {
  process.stdout.write('\x1b[38;5;' + i + 'mX');
  if (!((i+1)%16)) {
    process.stdout.write('\n');
  }
}

process.stdout.write('\x1b[39m \n\n');
