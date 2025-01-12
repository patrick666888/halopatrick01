const fs = require('fs');
const readline = require('readline');

// 创建输入接口
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// 手机对象
class Phone {
    constructor(brand, model, color, capacity, usedSpace) {
        this.brand = brand;
        this.model = model;
        this.color = color;
        this.capacity = capacity; // 总容量
        this.usedSpace = usedSpace; // 已用空间
    }

    displayInfo() {
        return `手机信息: ${this.brand} ${this.model}, 颜色: ${this.color}, 容量: ${this.capacity}GB, 已用空间: ${this.usedSpace}GB`;
    }
}

// 书本对象
class Book {
    constructor(title, author, publicationYear, totalPages, currentPage) {
        this.title = title;
        this.author = author;
        this.publicationYear = publicationYear;
        this.totalPages = totalPages;
        this.currentPage = currentPage; // 当前阅读页数
    }

    displayInfo() {
        return `书本信息: ${this.title}, 作者: ${this.author}, 出版年份: ${this.publicationYear}, 总页数: ${this.totalPages}, 当前页数: ${this.currentPage}`;
    }
}

// 点餐对象
class Order {
    constructor(dishName, price, quantity, note) {
        this.dishName = dishName;
        this.price = price; // 单价
        this.quantity = quantity; // 数量
        this.note = note; // 备注
    }

    displayInfo() {
        return `点餐信息: ${this.dishName}, 单价: $${this.price}, 数量: ${this.quantity}, 备注: ${this.note}`;
    }
}

// 保存数据到文件
function saveDataToFile(data, type) {
    const filename = type + '.txt';
    fs.appendFile(filename, data + '\n', (err) => {
        if (err) throw err;
        console.log(`数据已保存到 ${filename} 文件中。`);
        mainMenu(); // 返回主菜单
    });
}

// 查看文件内容
function viewData(type) {
    const filename = type + '.txt';
    fs.readFile(filename, 'utf8', (err, data) => {
        if (err) {
            console.log(`无法读取 ${filename} 文件。`);
        } else {
            console.log(`${type.charAt(0).toUpperCase() + type.slice(1)} 信息:`);
            console.log(data || '没有保存任何信息。');
        }
        mainMenu(); // 返回主菜单
    });
}

// 验证输入
function validateInput(input) {
    return input.trim() !== '' && input !== 'BACK';
}

// 输入手机信息
function inputPhone() {
    let phoneData = {};

    function askBrand() {
        rl.question('请输入手机品牌 (或输入 BACK 返回): ', (brand) => {
            if (brand.toUpperCase() === 'BACK') return mainMenu();
            if (!validateInput(brand)) {
                console.log('无效输入，请重新输入。');
                return askBrand(); // 重新输入品牌
            }
            phoneData.brand = brand;
            askModel();
        });
    }

    function askModel() {
        rl.question('请输入手机型号 (或输入 BACK 返回): ', (model) => {
            if (model.toUpperCase() === 'BACK') return mainMenu();
            if (!validateInput(model)) {
                console.log('无效输入，请重新输入。');
                return askModel(); // 重新输入型号
            }
            phoneData.model = model;
            askColor();
        });
    }

    function askColor() {
        rl.question('请输入手机颜色 (或输入 BACK 返回): ', (color) => {
            if (color.toUpperCase() === 'BACK') return mainMenu();
            if (!validateInput(color)) {
                console.log('无效输入，请重新输入。');
                return askColor(); // 重新输入颜色
            }
            phoneData.color = color;
            askCapacity();
        });
    }

    function askCapacity() {
        rl.question('请输入手机容量 (GB) (或输入 BACK 返回): ', (capacity) => {
            if (capacity.toUpperCase() === 'BACK') return mainMenu();
            if (!validateInput(capacity)) {
                console.log('无效输入，请重新输入。');
                return askCapacity(); // 重新输入容量
            }
            phoneData.capacity = capacity;
            askUsedSpace();
        });
    }

    function askUsedSpace() {
        rl.question('请输入已用空间 (GB) (或输入 BACK 返回): ', (usedSpace) => {
            if (usedSpace.toUpperCase() === 'BACK') return mainMenu();
            if (!validateInput(usedSpace)) {
                console.log('无效输入，请重新输入。');
                return askUsedSpace(); // 重新输入已用空间
            }
            phoneData.usedSpace = usedSpace;
            const myPhone = new Phone(phoneData.brand, phoneData.model, phoneData.color, phoneData.capacity, phoneData.usedSpace);
            console.log(myPhone.displayInfo());
            saveDataToFile(myPhone.displayInfo(), 'phone');
        });
    }

    askBrand(); // 开始询问品牌
}

// 输入书本信息
function inputBook() {
    rl.question('请输入书名 (或输入 BACK 返回): ', (title) => {
        if (title.toUpperCase() === 'BACK') return mainMenu();
        if (!validateInput(title)) {
            console.log('无效输入，请重新输入。');
            return inputBook(); // 重新输入
        }
        rl.question('请输入作者 (或输入 BACK 返回): ', (author) => {
            if (author.toUpperCase() === 'BACK') return mainMenu();
            if (!validateInput(author)) {
                console.log('无效输入，请重新输入。');
                return inputBook(); // 重新输入
            }
            rl.question('请输入出版年份 (或输入 BACK 返回): ', (publicationYear) => {
                if (publicationYear.toUpperCase() === 'BACK') return mainMenu();
                if (!validateInput(publicationYear)) {
                    console.log('无效输入，请重新输入。');
                    return inputBook(); // 重新输入
                }
                rl.question('请输入总页数 (或输入 BACK 返回): ', (totalPages) => {
                    if (totalPages.toUpperCase() === 'BACK') return mainMenu();
                    if (!validateInput(totalPages)) {
                        console.log('无效输入，请重新输入。');
                        return inputBook(); // 重新输入
                    }
                    rl.question('请输入当前阅读页数 (或输入 BACK 返回): ', (currentPage) => {
                        if (currentPage.toUpperCase() === 'BACK') return mainMenu();
                        if (!validateInput(currentPage)) {
                            console.log('无效输入，请重新输入。');
                            return inputBook(); // 重新输入
                        }
                        const myBook = new Book(title, author, publicationYear, totalPages, currentPage);
                        console.log(myBook.displayInfo());
                        saveDataToFile(myBook.displayInfo(), 'book');
                    });
                });
            });
        });
    });
}

// 输入点餐信息
function inputOrder() {
    rl.question('请输入餐点名称 (或输入 BACK 返回): ', (dishName) => {
        if (dishName.toUpperCase() === 'BACK') return mainMenu();
        if (!validateInput(dishName)) {
            console.log('无效输入，请重新输入。');
            return inputOrder(); // 重新输入
        }
        rl.question('请输入单价 (或输入 BACK 返回): ', (price) => {
            if (price.toUpperCase() === 'BACK') return mainMenu();
            if (!validateInput(price)) {
                console.log('无效输入，请重新输入。');
                return inputOrder(); // 重新输入
            }
            rl.question('请输入数量 (或输入 BACK 返回): ', (quantity) => {
                if (quantity.toUpperCase() === 'BACK') return mainMenu();
                if (!validateInput(quantity)) {
                    console.log('无效输入，请重新输入。');
                    return inputOrder(); // 重新输入
                }
                rl.question('请输入备注 (或输入 BACK 返回): ', (note) => {
                    if (note.toUpperCase() === 'BACK') return mainMenu();
                    if (!validateInput(note)) {
                        console.log('无效输入，请重新输入。');
                        return inputOrder(); // 重新输入
                    }
                    const myOrder = new Order(dishName, price, quantity, note);
                    console.log(myOrder.displayInfo());
                    saveDataToFile(myOrder.displayInfo(), 'order');
                });
            });
        });
    });
}

// 主菜单
function mainMenu() {
    console.log('\n请选择输入项:');
    console.log('1. 输入手机信息');
    console.log('2. 输入书本信息');
    console.log('3. 输入点餐信息');
    console.log('4. 查看手机信息');
    console.log('5. 查看书本信息');
    console.log('6. 查看点餐信息');
    console.log('7. 退出');

    rl.question('请输入选项: ', (option) => {
        switch (option) {
            case '1':
                inputPhone();
                break;
            case '2':
                inputBook();
                break;
            case '3':
                inputOrder();
                break;
            case '4':
                viewData('phone');
                break;
            case '5':
                viewData('book');
                break;
            case '6':
                viewData('order');
                break;
            case '7':
                rl.close();
                console.log('程序已退出。');
                break;
            default:
                console.log('无效选项，请重新输入。');
                mainMenu();
                break;
        }
    });
}

// 启动程序
mainMenu();