const readline = require('readline');

function checkPasswordStrength(password) {
    let strength = 0;

    // 检查长度
    if (password.length >= 8) {
        strength++;
    }
    // 检查大小写
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) {
        strength++;
    }
    // 检查数字
    if (/\d/.test(password)) {
        strength++;
    }
    // 检查特殊符号
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        strength++;
    }

    // 根据强度等级返回结果
    switch (strength) {
        case 0:
        case 1:
            return "非常弱";
        case 2:
            return "弱";
        case 3:
            return "中等";
        case 4:
            return "强";
        default:
            return "未知";
    }
}

function checkEmailValidity(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // 简单的邮箱正则表达式
    return regex.test(email) ? "有效的邮箱地址" : "无效的邮箱地址";
}

function countChineseAndEnglishCharacters(input) {
    const chineseRegex = /[\u4e00-\u9fa5]/g; // 匹配汉字
    const englishRegex = /[a-zA-Z]/g; // 匹配英文字母
    const wordRegex = /\b[a-zA-Z]+\b/g; // 匹配英文单词

    const chineseCount = (input.match(chineseRegex) || []).length;
    const englishCount = (input.match(englishRegex) || []).length;
    const wordCount = (input.match(wordRegex) || []).length;

    return { chineseCount, englishCount, wordCount };
}

// 创建 readline 接口
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// 显示主菜单
function mainMenu() {
    console.log("\n请选择功能:");
    console.log("1: 密码检测");
    console.log("2: 邮箱检测");
    console.log("3: 中英字符串统计");
    console.log("4: 退出程序");
    
    rl.question('请输入选项: ', (option) => {
        switch (option) {
            case '1':
                passwordMenu();
                break;
            case '2':
                emailMenu();
                break;
            case '3':
                stringMenu();
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

// 密码检测菜单
function passwordMenu() {
    rl.question('请输入密码以检查其强度（输入 "back" 返回主菜单）: ', (input) => {
        if (input === 'back') {
            mainMenu(); // 返回主菜单
        } else {
            const strength = checkPasswordStrength(input);
            console.log(`密码强度: ${strength}`);
            passwordMenu(); // 继续在密码菜单
        }
    });
}

// 邮箱检测菜单
function emailMenu() {
    rl.question('请输入您的邮箱（输入 "back" 返回主菜单）: ', (input) => {
        if (input === 'back') {
            mainMenu(); // 返回主菜单
        } else {
            const validity = checkEmailValidity(input);
            console.log(`邮箱检测结果: ${validity}`);
            emailMenu(); // 继续在邮箱菜单
        }
    });
}

// 中英字符串统计菜单
function stringMenu() {
    rl.question('请输入字符串进行统计（输入 "back" 返回主菜单）: ', (input) => {
        if (input === 'back') {
            mainMenu(); // 返回主菜单
        } else {
            const { chineseCount, englishCount, wordCount } = countChineseAndEnglishCharacters(input);
            console.log(`汉字数量: ${chineseCount}`);
            console.log(`英文字母数量: ${englishCount}`);
            console.log(`英文单词数量: ${wordCount}`);
            stringMenu(); // 继续在字符串统计菜单
        }
    });
}

// 启动程序，显示主菜单
mainMenu();