const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let dinners = [];

// 从文件加载已有的晚餐数据
function loadDinnersFromFile() {
    try {
        const data = fs.readFileSync('dinners.json', 'utf8');
        dinners = JSON.parse(data);
    } catch (err) {
        dinners = []; // 初始化为空数组
    }
}

// 添加晚餐数据的函数
function addDinner(diningDate, location, orders) {
    dinners.push({ diningDate, location, orders });
}

// 保存晚餐资料到文件
function saveDinnersToFile() {
    fs.writeFile('dinners.json', JSON.stringify(dinners, null, 2), (err) => {
        if (err) {
            console.error('保存数据时出错:', err);
        } else {
            console.log('数据已成功保存到 dinners.json！');
        }
    });
}

// 计算总金额和各人应付金额
function calculateTotals(orders) {
    let totalAmount = 0;
    const individualTotals = {};
    let splitTotal = 0;
    let splitCount = 0;

    orders.forEach(order => {
        totalAmount += order.price;

        if (!individualTotals[order.name]) {
            individualTotals[order.name] = {
                total: 0,
                splitOrders: 0
            };
        }

        if (order.split) {
            splitTotal += order.price;
            individualTotals[order.name].splitOrders += 1;
        } else {
            individualTotals[order.name].total += order.price;
        }
    });

    splitCount = Object.keys(individualTotals).filter(name => individualTotals[name].splitOrders > 0).length;
    const splitAmount = splitCount > 0 ? splitTotal / splitCount : 0;

    for (const name in individualTotals) {
        if (individualTotals[name].splitOrders > 0) {
            individualTotals[name].total += splitAmount;
        }
    }

    return { totalAmount, individualTotals };
}

// 格式化输出
function formatOutput(diningDate, location, orders, totalAmount, individualTotals) {
    console.log(`用餐日期: ${diningDate}`);
    console.log(`用餐地点: ${location}\n`);

    console.log(`点餐清单:`);
    orders.forEach(order => {
        const splitText = order.split ? '(均分)' : '(自己付)';
        console.log(`${order.name} - ${order.dishName} - ${order.price} ${splitText}`);
    });

    console.log(`\n总金额: ${totalAmount}\n`);

    console.log(`分账结果:`);
    for (const name in individualTotals) {
        console.log(`${name} 应付金额: ${individualTotals[name].total}`);
    }
}

// 验证输入是否有效
function isValidInput(input) {
    return input.trim() !== '' && input.trim() !== '-';
}

// 输入晚餐资料
function inputDinner() {
    let diningDate, location;
    const orders = [];

    // 输入用餐日期
    const askDiningDate = () => {
        rl.question('请输入用餐日期（格式: YYYY/MM/DD），或输入 "back" 返回: ', (input) => {
            if (input.toLowerCase() === "back") {
                mainMenu(); // 返回主菜单
                return;
            }
            if (!isValidDate(input)) {
                console.log('日期格式不正确，请重新输入。');
                return askDiningDate(); // 重新输入
            }
            diningDate = input;
            askLocation(); // 继续输入餐厅名称
        });
    };

    // 输入餐厅名称
    const askLocation = () => {
        rl.question('请输入餐厅名称，或输入 "back" 返回: ', (input) => {
            if (input.toLowerCase() === "back") {
                askDiningDate(); // 返回上一步
                return;
            }
            if (!isValidInput(input)) {
                console.log('餐厅名称不能只由空白或负号组成，请重新输入。');
                return askLocation(); // 重新输入
            }
            location = input;
            inputOrders(orders, () => {
                // 如果没有有效订单，则不保存数据
                if (orders.length === 0) {
                    console.log('无有效的点餐数据，数据未保存。');
                } else {
                    addDinner(diningDate, location, orders);
                    const { totalAmount, individualTotals } = calculateTotals(orders);
                    formatOutput(diningDate, location, orders, totalAmount, individualTotals);
                    saveDinnersToFile();
                    console.log('晚餐资料已保存！');
                }
                mainMenu();
            });
        });
    };

    askDiningDate(); // 开始输入用餐日期
}

// 验证日期格式
function isValidDate(dateString) {
    // 正则表达式检查日期格式 YYYY/MM/DD
    const regex = /^\d{4}\/\d{1,2}\/\d{1,2}$/;
    return regex.test(dateString); // 返回是否匹配
}

// 输入点餐资料
function inputOrders(orders, callback) {
    function askForOrder() {
        // 输入人名
        rl.question('请输入人名（或输入 "done" 结束，或输入 "back" 返回）: ', (name) => {
            if (name.toLowerCase() === "back") {
                return callback(); // 返回上一步
            }
            if (name.toLowerCase() === "done") {
                // 如果没有输入任何有效的点餐数据，提示用户
                if (orders.length === 0) {
                    console.log('未输入任何点餐数据，数据未保存。');
                }
                callback();
                return;
            }

            if (!isValidInput(name)) {
                console.log('人名不能只由空白或负号组成，请重新输入。');
                return askForOrder(); // 重新输入
            }

            // 输入餐点名称
            rl.question('请输入餐点名称，或输入 "back" 返回: ', (dishName) => {
                if (dishName.toLowerCase() === "back") {
                    return askForOrder(); // 返回上一步
                }
                if (!isValidInput(dishName)) {
                    console.log('餐点名称不能只由空白或负号组成，请重新输入。');
                    return askForOrder(); // 重新输入
                }

                // 输入单价
                rl.question('请输入单价，或输入 "back" 返回: ', (price) => {
                    if (price.toLowerCase() === "back") {
                        return askForOrder(); // 返回上一步
                    }
                    const priceValue = parseFloat(price);
                    if (isNaN(priceValue) || priceValue <= 0) {
                        console.log('单价必须为正数，请重新输入。');
                        return askForOrder(); // 重新输入
                    }

                    // 输入是否均分
                    rl.question('是否均分？(y/n)，或输入 "back" 返回: ', (split) => {
                        if (split.toLowerCase() === "back") {
                            return askForOrder(); // 返回上一步
                        }
                        if (split.toLowerCase() !== 'y' && split.toLowerCase() !== 'n') {
                            console.log('请输入 y 或 n。');
                            return askForOrder(); // 重新输入
                        }

                        orders.push({
                            name: name,
                            dishName: dishName,
                            price: priceValue,
                            split: split.toLowerCase() === 'y'
                        });
                        askForOrder(); // 继续输入下一个订单
                    });
                });
            });
        });
    }

    askForOrder(); // 开始询问订单
}

// 搜索晚餐资料
function searchDinner() {
    rl.question('请输入要搜索的日期（格式: YYYY/MM/DD）: ', (searchDate) => {
        const foundDinners = dinners.filter(dinner => dinner.diningDate === searchDate);
        if (foundDinners.length > 0) {
            console.log(`找到 ${foundDinners.length} 条资料：`);
            foundDinners.forEach((dinner, index) => {
                console.log(`${index + 1}. 餐厅: ${dinner.location}`);
            });

            rl.question('请选择餐厅编号: ', (restaurantIndex) => {
                const index = parseInt(restaurantIndex) - 1;
                if (index >= 0 && index < foundDinners.length) {
                    const selectedDinner = foundDinners[index];
                    const { totalAmount, individualTotals } = calculateTotals(selectedDinner.orders);
                    formatOutput(selectedDinner.diningDate, selectedDinner.location, selectedDinner.orders, totalAmount, individualTotals);
                } else {
                    console.log('无效的编号，请重试。');
                }
                mainMenu();
            });
        } else {
            console.log('未找到相关的晚餐资料。');
            mainMenu();
        }
    });
}

// 主菜单
function mainMenu() {
    console.log('\n1. 输入晚餐资料');
    console.log('2. 搜索晚餐资料');
    console.log('3. 退出');

    rl.question('请选择操作: ', (option) => {
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
                console.log('无效的选择，请重新选择。');
                mainMenu();
        }
    });
}

// 启动程序，加载已有数据
loadDinnersFromFile();
mainMenu();