const readline = require('readline');

// 定義物件
const me = {
    name: 'patrick',
    age: 31
};

const teacher = {
    name: 'IT sir',
    age: 'young'
};

// 創建 readline 介面
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// 提問用戶
rl.question('請輸入 "ME" 或 "TEACHER": ', (answer) => {
    // 根據用戶輸入顯示相應的資訊
    if (answer.toUpperCase() === 'ME') {
        console.log(`Me's name: ${me.name}`);
        console.log(`Me's age: ${me.age}`);
    } else if (answer.toUpperCase() === 'TEACHER') {
        console.log(`Teacher's name: ${teacher.name}`);
        console.log(`Teacher's age: ${teacher.age}`);
    } else {
        console.log('無效的輸入，請輸入 "ME" 或 "TEACHER"。');
    }

    // 關閉 readline 介面
    rl.close();
});