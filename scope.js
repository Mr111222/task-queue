// let a = 10
// function getA () {
// 	console.log(a)
// }
// getA()

// function aaa(){
// 	var a=10;  // 布局变量 
// };
// aaa();
// console.log(a); // 此处无法访问



// 实现fizzBuzz函数，参数num与返回值的关系如下：

// 1.如果num能同时被3和5整除，返回字符串fizzbuzz

// 2.如果num能被3整除，返回字符串fizz

// 3.如果num能被5整除，返回字符串buzz

// 4,如果参数为空或者不是Number类型，返回false

// 5.其余情况，返回参数num




function getNum (arg) {
	if(!arg && typeof arg !== Number) return false
	if(arg % 3 === 0 && arg % 5 === 0) {
		return 'fizzbuzz'
	}else if (arg % 3 === 0){
		return 'fizz'
	}else if (arg % 5 === 0) {
		return 'buzz'
	}else{
		return arg
	}
}
console.log(getNum(123), '~~~~~~')


function func2 () {
  console.log( num );
  var num = 456;
  console.log( num );
}
var num = 123;
func2( num );
