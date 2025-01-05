const readline = require('readline');

function checkPasswordStrength(password) {
    let strength = 0;

    // 檢查長度
    if (password.length >= 8) {
        strength++;
    }
    // 檢查大小寫
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) {
        strength++;
    }
    // 檢查數字
    if (/\d/.test(password)) {
        strength++;
    }
    // 檢查特殊符號
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        strength++;
    }

    // 根據強度等級回傳結果
    switch (strength) {
        case 0:
        case 1:
            return "非常弱";
        case 2:
            return "弱";
        case 3:
            return "中等";
        case 4:
            return "強";
        default:
            return "未知";
    }
}

// 創建 readline 接口
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// 請求用戶輸入密碼
rl.question('請輸入密碼以檢查其強度: ', (password) => {
    // 檢查是否為空或僅包含空白，及是否包含空白字符
    if (!password || password.trim() === '' || password.includes(' ')) {
        console.log('錯誤: 密碼不能為空、僅包含空白或包含空白字符。請輸入有效的密碼。');
    } else {
        const strength = checkPasswordStrength(password);
        console.log(`密碼強度: ${strength}`);
    }
    rl.close();
});