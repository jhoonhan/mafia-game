// const array = [1, 1, 9, 0, 0, 0, 0];
// console.log(array.filter(num => num < 0).length);

let arrs = [];
let arr1 = [1, 2, 3];
const arr2 = [2, 3, 1];
const arr3 = [1, 2];

document.querySelector('.test').addEventListener('click', function (e) {
  e.preventDefault();

  arrs.push(arr1);
  console.log(arrs);
  console.log(arr1);
});
