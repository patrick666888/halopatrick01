const fs = require('fs');
const readline = require('readline');

// 创建 readline 接口
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// 文件路径
const chatFilePath = 'chatMessages.txt';
const gradesFilePath = 'studentGrades.txt';
const shoppingFilePath = 'shoppingList.txt';

// 主菜单
function mainMenu() {
    console.log("\n请选择功能:");
    console.log("1: 聊天室訊息操作 | 2: 學生成績登記 | 3: 購物清單 | 4: 退出程序");
    
    rl.question('请输入选项: ', (option) => {
        switch (option) {
            case '1':
                chatRoom();
                break;
            case '2':
                studentGrades();
                break;
            case '3':
                shoppingList();
                break;
            case '4':
                console.log('程序已退出。');
                rl.close(); // 关闭 readline 接口
                break;
            default:
                console.log('无效的选择，请重新输入。');
                mainMenu();
        }
    });
}

// 聊天室訊息操作
function chatRoom() {
    const messages = loadChatMessages(); // 从文件加载消息

    function chatMenu() {
        console.log("\n聊天室訊息操作:");
        console.log("1: 傳送新訊息 | 2: 收回最後一則訊息 | 3: 檢查訊息數量 | 4: 返回主菜單");

        rl.question('请输入选项: ', (option) => {
            switch (option) {
                case '1':
                    rl.question('请输入新的訊息: ', (message) => {
                        messages.push(message); // 使用 push 傳送新訊息
                        console.log(`訊息已傳送: "${message}"`);
                        saveChatMessages(messages); // 保存消息到文件
                        console.log(`目前已傳送的訊息數量: ${messages.length}`); // 使用 length 檢查訊息數量
                        chatMenu(); // 返回聊天菜单
                    });
                    break;
                case '2':
                    const removedMessage = messages.pop(); // 使用 pop 收回最後一則訊息
                    saveChatMessages(messages); // 更新文件
                    console.log(removedMessage ? `已收回訊息: "${removedMessage}"` : "沒有訊息可收回。");
                    console.log(`目前已傳送的訊息數量: ${messages.length}`); // 使用 length 檢查訊息數量
                    chatMenu(); // 返回聊天菜单
                    break;
                case '3':
                    console.log(`已傳送的訊息數量: ${messages.length}`); // 直接使用 length
                    chatMenu(); // 返回聊天菜单
                    break;
                case '4':
                    mainMenu(); // 返回主菜单
                    break;
                default:
                    console.log('无效的选择，请重新输入。');
                    chatMenu();
            }
        });
    }

    chatMenu(); // 启动聊天菜单
}

// 加载聊天消息
function loadChatMessages() {
    if (fs.existsSync(chatFilePath)) {
        return fs.readFileSync(chatFilePath, 'utf-8').split('\n').filter(Boolean);
    }
    return [];
}

// 保存聊天消息
function saveChatMessages(messages) {
    fs.writeFileSync(chatFilePath, messages.join('\n'));
}

// 學生成績登記
function studentGrades() {
    const { students, grades } = loadStudentGrades(); // 从文件加载学生成绩

    function gradesMenu() {
        console.log("\n學生成績登記:");
        console.log("1: 登記學生成績 | 2: 檢查學生成績 | 3: 查詢學生索引位置 | 4: 產生學生成績報表 | 5: 返回主菜單");

        rl.question('请输入选项: ', (option) => {
            switch (option) {
                case '1':
                    rl.question('请输入学生姓名: ', (name) => {
                        rl.question('请输入学生成績: ', (grade) => {
                            students.push(name);
                            grades.push(grade);
                            console.log(`已登記: ${name} - ${grade} 分`);
                            saveStudentGrades(students, grades); // 保存成绩到文件
                            gradesMenu(); // 返回成绩菜单
                        });
                    });
                    break;
                case '2':
                    rl.question('请输入要查詢的學生姓名: ', (name) => {
                        if (students.includes(name)) {
                            const index = students.indexOf(name);
                            console.log(`${name} 的成績是: ${grades[index]} 分`);
                        } else {
                            console.log("學生未登記成績。");
                        }
                        gradesMenu(); // 返回成绩菜单
                    });
                    break;
                case '3':
                    rl.question('请输入要查詢的學生姓名: ', (name) => {
                        const index = students.indexOf(name);
                        console.log(index !== -1 ? `${name} 的索引位置是: ${index + 1}` : "學生未登記。"); // 索引加1
                        gradesMenu(); // 返回成绩菜单
                    });
                    break;
                case '4':
                    const report = students.map((student, index) => `${student}: ${grades[index]} 分`).join('，');
                    console.log(`學生成績報表: ${report}`);
                    gradesMenu(); // 返回成绩菜单
                    break;
                case '5':
                    mainMenu(); // 返回主菜单
                    break;
                default:
                    console.log('无效的选择，请重新输入。');
                    gradesMenu();
            }
        });
    }

    gradesMenu();
}

// 加载学生成绩
function loadStudentGrades() {
    const students = [];
    const grades = [];
    if (fs.existsSync(gradesFilePath)) {
        const data = fs.readFileSync(gradesFilePath, 'utf-8').trim().split('\n');
        data.forEach(line => {
            const [name, grade] = line.split(' - ');
            students.push(name);
            grades.push(grade);
        });
    }
    return { students, grades };
}

// 保存学生成绩
function saveStudentGrades(students, grades) {
    const data = students.map((student, index) => `${student} - ${grades[index]}`).join('\n');
    fs.writeFileSync(gradesFilePath, data);
}

// 購物清單
function shoppingList() {
    const items = loadShoppingList(); // 从文件加载购物清单

    function listMenu() {
        console.log("\n購物清單:");
        console.log("1: 新增物品 | 2: 刪除物品 | 3: 查看清單 | 4: 返回主菜單");

        rl.question('请输入选项: ', (option) => {
            switch (option) {
                case '1':
                    rl.question('请输入要新增的物品: ', (item) => {
                        const id = items.length + 1; // 物品代号从1开始
                        items.push({ id, name: item });
                        console.log(`新增物品: ${id} - ${item}`);
                        saveShoppingList(items); // 保存清单到文件
                        listMenu(); // 返回清单菜单
                    });
                    break;
                case '2':
                    rl.question('请输入要刪除的物品代号: ', (id) => {
                        if (parseInt(id) <= 0) {
                            console.log("代号必須大於 0，請重新輸入。");
                            listMenu();
                            return;
                        }
                        const index = items.findIndex(item => item.id === parseInt(id));
                        if (index !== -1) {
                            const removedItem = items.splice(index, 1)[0];
                            console.log(`刪除物品: ${removedItem.id} - ${removedItem.name}`);
                            saveShoppingList(items); // 更新文件
                        } else {
                            console.log("無效的物品代号。");
                        }
                        listMenu(); // 返回清单菜单
                    });
                    break;
                case '3':
                    if (items.length === 0) {
                        console.log("購物清單是空的。");
                    } else {
                        console.log("購物清單:");
                        items.forEach(item => console.log(`${item.id}: ${item.name}`));
                    }
                    listMenu(); // 返回清单菜单
                    break;
                case '4':
                    mainMenu(); // 返回主菜单
                    break;
                default:
                    console.log('无效的选择，请重新输入。');
                    listMenu();
            }
        });
    }

    listMenu();
}

// 加载购物清单
function loadShoppingList() {
    const items = [];
    if (fs.existsSync(shoppingFilePath)) {
        const data = fs.readFileSync(shoppingFilePath, 'utf-8').trim().split('\n');
        data.forEach(line => {
            const [id, name] = line.split(' - ');
            items.push({ id: parseInt(id), name });
        });
    }
    return items;
}

// 保存购物清单
function saveShoppingList(items) {
    const data = items.map(item => `${item.id} - ${item.name}`).join('\n');
    fs.writeFileSync(shoppingFilePath, data);
}

// 启动程序，显示主菜单
mainMenu();