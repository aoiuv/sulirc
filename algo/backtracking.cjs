function checkIfCanWin(src) {
  // const result = [];
  // function game(src) {
  //   let symbols = src.split('');
  //   let step = 0;
  //   let p = 0;
  //   while (p < symbols.length) {
  //     if (symbols[p] === '+' && symbols[p + 1] === '+') {
  //       step++;
  //       symbols[p] = '-';
  //       symbols[p + 1] = '-';
  //       p = p + 2;
  //     } else {
  //       p++;
  //     }
  //   }
  //   return step;
  // }
  const symbols = src.split('');

  if (symbols.length <= 1) {
    return false;
  }
  if (symbols.length <= 4) {
    return true;
  }

}

[
  '+', '++', '+++', '++++', '+++++',
  '++++++', '+++++++', '++++++++'
].forEach(v => checkIfCanWin(v));
