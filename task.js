// for(var i=0;i<4;i++) {
// 	setTimeout(function(){
// 		 console.log(i, '��ʱ��')
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
// �ο�����:https://blog.csdn.net/solocoder/article/details/106571783

	// add Ϊͬ������ ִ�� 1, sertimeout����Ϊtime1�������������У�setTimeout�������Ϊtimer2��new promiseΪͬ��ִ�У����4��setTimeout ����Ϊtimer3������ִ��ͬ���������8�� ͬ������û���ˣ���΢����һ��Ϊpromise.then������setTimeout�������Ϊtimer4�����7 �����ˣ�ͬ����΢����ִ����ϣ���ʼִ�к�����  timer1��timer2, timer3, timer4, �ȱȽ�һ��ʱ�� �ĳ���Ȼ��ִ�У�timer2��ִ�У����2��Ȼ��timer4�����6��Ȼ��timer3�����4�����timer1�����2  ���Ϊ1,4,8,7,3,6,5,2

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

// call ,apply ������ִ�У�����ֻ�����������ͬ����
// ��bind��᷵�غ����壬����Ҫ�Լ�ִ��

// getAge.call(getName, 'ppx')  My age is ppx
// getAge.apply(getName, ['ppx'])   My age is ppx
// getAge.bind(getName, 'ppx') () My age is ppx


// ����
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
