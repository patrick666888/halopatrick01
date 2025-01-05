let person = {}

person.name = Peter 
person.age = 23

person.sayHallo = function (){
    console.log('Hello,', this.name)
}

person.sayHello()

let toy = {}
toy.name = 'fighter 101'
toy.sayHello = person.sayHello

toy.sayHello() 
person.sayHello{}

let { name, sayHello } = toy

console.log('The name is:', name)

sayHello()

