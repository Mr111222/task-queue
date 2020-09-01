// for(var i=0;i<4;i++) {
// 	setTimeout(function(){
// 		 console.log(i, '定时器')
// 	})
// }


// setTimeout(function(){
//     console.log(1)
// });
// new Promise(function(resolve){
//     console.log(2);
//     for(var i = 0; i < 10000; i++){
//         i == 9999 && resolve();
//     }
// }).then(function(){
//     console.log(3)
// });
// console.log(4);
// 参考链接:https://blog.csdn.net/solocoder/article/details/106571783

	// add 为同步任务 执行 1, sertimeout挂起为time1，继续向下自行，setTimeout任务挂起为timer2，new promise为同步执行，输出4，setTimeout 挂起为timer3，继续执行同步任务，输出8， 同步任务没有了，看微任务，一般为promise.then操作，setTimeout任务挂起为timer4，输出7 ，至此，同步和微任务执行完毕，开始执行宏任务  timer1，timer2, timer3, timer4, 先比较一下时间 的长短然后执行，timer2先执行，输出2，然后timer4，输出6，然后timer3，输出4，最后timer1，输出2  结果为1,4,8,7,3,6,5,2

function add(x, y) {   
  console.log(1)
  setTimeout(function() { // timer1
    console.log(2)
  }, 1000)
}
add();
																																	
setTimeout(function() { // timer2
  console.log(3)
})

new Promise(function(resolve) {
  console.log(4)
  setTimeout(function() { // timer3
    console.log(5)
  }, 100)
  for(var i = 0; i < 100; i++) {
    i == 99 && resolve()
  }
}).then(function() {
  setTimeout(function() { // timer4
    console.log(6) 
  }, 10)
  console.log(7)
})

console.log(8)



function getName (x) {
	console.log(`My name is ${x}`)
	return `My name is ${x}`
}

function getAge (x) {
	console.log(`My age is ${x}`)
}

// call ,apply 会立即执行，他们只是区别参数不同而已
// 而bind则会返回函数体，你需要自己执行

// getAge.call(getName, 'ppx')  My age is ppx
// getAge.apply(getName, ['ppx'])   My age is ppx
// getAge.bind(getName, 'ppx') () My age is ppx


// 防抖
function debounce (fn, wait) {
	let timer
	return function () {
		if(timer) clearTimeout(timer)
		timer = setTimeout(()=>{
				fn.applyly(this, arguments)
			}, wait)
		}
	}
}

function throttle (fn, wait) {
	let timer
	return function() {
		if(!timer) {
			timer = setTimeout(()=>{
				timer = null
				fn.apply(this, ...arg)
			}, wait)
		}
	}
	
}
