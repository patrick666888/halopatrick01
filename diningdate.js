const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const dinners = [];

// 添加點餐資料的函數
function addDinner(diningDate, location, orders) {
    dinners.push({ diningDate, location, orders });
}

// 計算總金額和各人應付金額
function calculateTotals(orders) {
    let totalAmount = 0;
    const individualTotals = {};

    orders.forEach(order => {
        totalAmount += order.price;

        if (order.split) {
            if (!individualTotals[order.name]) {
                individualTotals[order.name] = 0;
            }
            individualTotals[order.name] += order.price;
        }
    });

    orders.forEach(order => {
        if (!order.split) {
            individualTotals[order.name] += order.price;
        }
    });

    return { totalAmount, individualTotals };
}

// 格式化輸出
function formatOutput(diningDate, location, orders, totalAmount, individualTotals) {
    console.log(`\n用餐日期: ${diningDate}\n用餐地點: ${location}\n`);
    console.log("點餐清單:");
    orders.forEach(order => {
        console.log(`${order.name} - ${order.dishName} - ${order.price} ${order.split ? '(均分)' : '(自己付)'}`);
    });

    console.log(`\n總金額: ${totalAmount}\n`);
    console.log("分帳結果:");
    for (const [name, amount] of Object.entries(individualTotals)) {
        console.log(`${name} 應付金額: ${amount}`);
    }
}

// 輸入晚餐資料
function inputDinner() {
    rl.question('請輸入用餐日期（格式: YYYY/MM/DD）: ', (diningDate) => {
        rl.question('請輸入用餐地點: ', (location) => {
            const orders = [];
            inputOrders(orders, () => {
                addDinner(diningDate, location, orders);
                console.log('晚餐資料已儲存！');
                mainMenu();
            });
        });
    });
}

// 輸入點餐資料
function inputOrders(orders, callback) {
    rl.question('請輸入人名（或輸入 "完成" 結束）: ', (name) => {
        if (name.toLowerCase() === '完成') {
            callback();
            return;
        }
        rl.question('請輸入餐點名稱: ', (dishName) => {
            rl.question('請輸入單價: ', (price) => {
                rl.question('是否均分？(是/否): ', (split) => {
                    orders.push({
                        name,
                        dishName,
                        price: parseFloat(price),
                        split: split.toLowerCase() === '是'
                    });
                    inputOrders(orders, callback);
                });
            });
        });
    });
}

// 搜尋晚餐資料
function searchDinner() {
    rl.question('請輸入要搜尋的日期（格式: YYYY/MM/DD）: ', (searchDate) => {
        const foundDinners = dinners.filter(dinner => dinner.diningDate === searchDate);
        if (foundDinners.length > 0) {
            foundDinners.forEach(dinner => {
                const { totalAmount, individualTotals } = calculateTotals(dinner.orders);
                formatOutput(dinner.diningDate, dinner.location, dinner.orders, totalAmount, individualTotals);
            });
        } else {
            console.log('未找到相關的晚餐資料。');
        }
        mainMenu();
    });
}

// 主選單
function mainMenu() {
    console.log('\n1. 輸入晚餐資料');
    console.log('2. 搜尋晚餐資料');
    console.log('3. 退出');

    rl.question('請選擇操作: ', (option) => {
        switch (option) {
            case '1':
                inputDinner();
                break;
            case '2':
                searchDinner();
                break;
            case '3':
                rl.close();
                break;
            default:
                console.log('無效的選擇，請重新選擇。');
                mainMenu();
        }
    });
}

// 啟動主選單
mainMenu();