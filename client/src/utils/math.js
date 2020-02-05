export const min = nums => (nums.length ? Math.min(...nums) : undefined)
export const max = nums => (nums.length ? Math.max(...nums) : undefined)
export const minBy = (arr, iteratee) => {
  const func = typeof iteratee === 'function' ? iteratee : item => item[iteratee]
  const min = Math.min(...arr.map(func))
  return arr.find(item => func(item) === min)
}
export const sum = arr =>
  arr.reduce((acc, num) => {
    acc += num
    return acc
  }, 0)

export const eachSlice = (arr, size, callback) => {
  for (var i = 0, l = arr.length; i < l; i += size){
    callback.call(arr.slice(i, i + size));
  }
}
