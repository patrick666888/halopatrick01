// 定義物件
const me = {
    name: 'patrick',
    age: 31
};

const teacher = {
    name: 'IT sir',
    age: 'young'
};

// 提取屬性
const { name: meName, age: meAge } = me;
const { name: teacherName, age: teacherAge } = teacher;

// 輸出結果
console.log(`Me's name: ${meName}`);
console.log(`Me's age: ${meAge}`);
console.log(`Teacher's name: ${teacherName}`);
console.log(`Teacher's age: ${teacherAge}`);

