function getHash (str){
  var hash = 5381;
  str = str || '';

  for(var i=0, len=str.length; i<len; ++i){
      hash += (hash << 5) + str.charAt(i).charCodeAt();
  }

  return hash & 0x7fffffff;
}

console.log(getHash('281474999231181') % 10);