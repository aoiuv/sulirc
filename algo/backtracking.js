const str1 = '-+++++--';
const str2 = '-++-++-';
const str3 = '-+++-';
const str4 = '-++--++++-+++-+++++-';
const str5 = '+++++++++++++++';

// 每次执行破坏性操作
// 次数为奇数时，即为必赢
function checkIfCanWin(src) {
  const arr = src.split(/-/g).filter(Boolean);
  let step = 0;

  for(let i = 0; i < arr.length; i++) {
    const str = arr[i];
    if(str.length < 2) {
      continue;
    }
    if(str.length < 5) {
      step++;
      continue;
    }
  }
  // console.log(arr);
}

[str1, str2, str3, str4, str5].forEach(v => checkIfCanWin(v));