const readline = require('readline');

class Meal {
    constructor(date, location) {
        this.date = date;
        this.location = location;
        this.orders = [];
    }

    addOrder(person, itemName, price, splitEqually) {
        this.orders.push({ person, itemName, price, splitEqually });
    }

    calculate() {
        const total = this.orders.reduce((acc, order) => acc + order.price, 0);
        const equalSplitOrders = this.orders.filter(order => order.splitEqually);
        const individualTotals = {};

        equalSplitOrders.forEach(order => {
            const share = total / equalSplitOrders.length;
            individualTotals[order.person] = (individualTotals[order.person] || 0) + share;
        });

        this.orders.forEach(order => {
            if (!order.splitEqually) {
                individualTotals[order.person] = (individualTotals[order.person] || 0) + order.price;
            }
        });

        return { total, individualTotals };
    }

    formatDate(date) {
        const d = new Date(date);
        return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}`;
    }

    printSummary() {
        const { total, individualTotals } = this.calculate();
        console.log(`用餐日期: ${this.formatDate(this.date)}`);
        console.log(`用餐地點: ${this.location}`);
        console.log(`總金額: ${total.toFixed(2)} 元`);
        console.log(`分帳結果:`);

        for (const [person, amount] of Object.entries(individualTotals)) {
            console.log(`${person}: ${amount.toFixed(2)} 元`);
        }
    }
}

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const meal = new Meal('2024-03-21', '某餐廳');

function askForOrder() {
    rl.question('請輸入人名（或輸入"結束"來完成）: ', (person) => {
        if (person === '結束') {
            meal.printSummary();
            rl.close();
            return;
        }

        rl.question('請輸入餐點名稱: ', (itemName) => {
            rl.question('請輸入單價: ', (price) => {
                rl.question('是否均分？(是/否): ', (splitResponse) => {
                    const splitEqually = splitResponse === '是';
                    meal.addOrder(person, itemName, parseFloat(price), splitEqually);
                    askForOrder();
                });
            });
        });
    });
}

askForOrder();
