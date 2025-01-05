const diningDate = "2024/03/21";
const location = "某某餐廳";
const orders = [];

// 添加點餐資料的函數
function addOrder(name, dishName, price, split) {
    orders.push({
        name,
        dishName,
        price,
        split
    });
}

// 添加訂單示例
addOrder("小明", "主菜A", 200, true);
addOrder("小明", "飲料A", 50, false);
addOrder("小華", "主菜A", 200, true);
addOrder("小華", "飲料B", 60, false);
function calculateTotals(orders) {
    let totalAmount = 0;
    const individualTotals = {};

    orders.forEach(order => {
        totalAmount += order.price;

        // 均分的計算
        if (order.split) {
            if (!individualTotals[order.name]) {
                individualTotals[order.name] = 0;
            }
            individualTotals[order.name] += order.price;
        }
    });

    // 處理不均分的項目
    orders.forEach(order => {
        if (!order.split) {
            individualTotals[order.name] += order.price;
        }
    });

    return { totalAmount, individualTotals };
}

const { totalAmount, individualTotals } = calculateTotals(orders);
function formatOutput(diningDate, location, orders, totalAmount, individualTotals) {
    console.log(`用餐日期: ${diningDate}\n用餐地點: ${location}\n`);
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

// 輸出結果
formatOutput(diningDate, location, orders, totalAmount, individualTotals);
