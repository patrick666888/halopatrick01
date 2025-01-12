const fs = require('fs');
const readline = require('readline');

let votes = {};
let options = []; // 存儲投票選項
let question = ''; // 存儲投票題目
const dataFile = 'votes.json'; // 數據文件
let votingSessions = []; // 存儲投票題目和選項

// 加載現有投票數據
function loadVotes() {
    if (fs.existsSync(dataFile)) {
        const data = fs.readFileSync(dataFile);
        votes = JSON.parse(data);
    }
}

// 保存投票數據
function saveVotes() {
    fs.writeFileSync(dataFile, JSON.stringify(votes, null, 2));
}

// 創建 readline 接口
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// 顯示主菜單
function showMenu() {
    console.log('1: 查看投票題目並投票');
    console.log('2: 開始新投票');
    console.log('3: 查看最新投票結果');

    rl.question('輸入選項 (或輸入 BACK 返回上級菜單): ', (option) => {
        handleMenuOption(option);
    });
}

// 處理菜單選項
function handleMenuOption(option) {
    switch (option) {
        case '1':
            chooseVote();
            break;
        case '2':
            startNewVote();
            break;
        case '3':
            displayResultsMenu();
            break;
        default:
            console.log('無效選項，請重新選擇，或輸入 BACK 返回上級菜單。');
            rl.question('請輸入任意鍵返回上級菜單: ', () => {
                showMenu(); // 返回主菜單
            });
    }
}

// 開始新投票
function startNewVote() {
    options = []; // 清空舊選項

    rl.question('請輸入投票題目: ', (title) => {
        if (title.toUpperCase() === 'BACK') {
            showMenu(); // 返回上級菜單
            return;
        }

        question = title;
        console.log(`投票題目已設置為: ${question}`);
        console.log('請輸入投票選項，輸入 DONE 結束。');

        function inputOptions() {
            rl.question('輸入選項: ', (option) => {
                if (option.toUpperCase() === 'BACK') {
                    showMenu(); // 返回上級菜單
                    return;
                }
                if (option.toUpperCase() === 'DONE') {
                    if (options.length === 0) {
                        console.log('請至少輸入一個選項。');
                        inputOptions(); // 繼續詢問
                    } else {
                        votingSessions.push({ question, options });
                        console.log('投票選項已設置：', options);
                        showMenu(); // 返回主菜單
                    }
                } else {
                    options.push(option);
                    inputOptions(); // 繼續輸入選項
                }
            });
        }

        inputOptions();
    });
}

// 選擇投票題目
function chooseVote() {
    if (votingSessions.length === 0) {
        console.log('沒有可用的投票題目。請先創建投票。');
        rl.question('請輸入任意鍵返回上級菜單: ', () => {
            showMenu(); // 返回主菜單
        });
        return;
    }

    console.log('可用投票題目:');
    votingSessions.forEach((session, index) => {
        console.log(`${index + 1}: ${session.question}`);
    });

    rl.question('請選擇投票題目 (輸入編號，或輸入 BACK 返回上級菜單): ', (choice) => {
        if (choice.toUpperCase() === 'BACK') {
            showMenu(); // 返回上級菜單
            return;
        }

        const choiceIndex = parseInt(choice) - 1;
        if (choiceIndex >= 0 && choiceIndex < votingSessions.length) {
            const selectedSession = votingSessions[choiceIndex];
            castVote(selectedSession);
        } else {
            console.log('無效選擇，請輸入有效的選項編號，或輸入 BACK 返回上級菜單。');
            chooseVote(); // 重新詢問
        }
    });
}

// 投票選擇
function castVote(selectedSession) {
    const { question, options } = selectedSession;
    console.log(`投票題目: ${question}`);
    console.log('投票選項:');
    options.forEach((opt, index) => {
        console.log(`${index + 1}: ${opt}`);
    });

    rl.question('請輸入您的投票人 ID: ', (voterId) => {
        if (voterId.toUpperCase() === 'BACK') {
            showMenu(); // 返回上級菜單
            return;
        }

        rl.question('請輸入您的選擇 (選項編號，或輸入 BACK 返回上級菜單): ', (choice) => {
            if (choice.toUpperCase() === 'BACK') {
                showMenu(); // 返回上級菜單
                return;
            }

            const choiceIndex = parseInt(choice) - 1;
            if (choiceIndex >= 0 && choiceIndex < options.length) {
                vote(voterId, options[choiceIndex]);
            } else {
                console.log('無效選擇，請輸入有效的選項編號，或輸入 BACK 返回上級菜單。');
                castVote(selectedSession); // 重新詢問
            }
        });
    });
}

// 投票函數
function vote(voterId, choice) {
    if (votes[voterId]) {
        console.log('您已經投過票，不能再次投票。');
        rl.question('按任意鍵返回主菜單...', () => {
            showMenu(); // 返回主菜單
        });
        return;
    }

    votes[voterId] = choice;
    console.log(`感謝您的投票！您的選擇: ${choice}`);
    saveVotes(); // 保存投票數據

    rl.question('您想查看結果嗎？輸入 Y 查看結果，或輸入任意鍵返回主菜單: ', (response) => {
        if (response.toUpperCase() === 'Y') {
            displayResults(selectedSession); // 顯示結果
        } else {
            showMenu(); // 返回主菜單
        }
    });
}

// 顯示投票結果菜單
function displayResultsMenu() {
    if (votingSessions.length === 0) {
        console.log('沒有可用的投票題目。請先創建投票。');
        rl.question('請輸入任意鍵返回上級菜單: ', () => {
            showMenu(); // 返回主菜單
        });
        return;
    }

    console.log('可用投票題目:');
    votingSessions.forEach((session, index) => {
        console.log(`${index + 1}: ${session.question}`);
    });

    rl.question('請選擇查看結果的投票題目 (輸入編號，或輸入 BACK 返回上級菜單): ', (choice) => {
        if (choice.toUpperCase() === 'BACK') {
            showMenu(); // 返回上級菜單
            return;
        }

        const choiceIndex = parseInt(choice) - 1;
        if (choiceIndex >= 0 && choiceIndex < votingSessions.length) {
            const selectedSession = votingSessions[choiceIndex];
            displayResults(selectedSession); // 顯示選定題目的結果
        } else {
            console.log('無效選擇，請輸入有效的選項編號，或輸入 BACK 返回上級菜單。');
            displayResultsMenu(); // 重新詢問
        }
    });
}

// 顯示特定投票結果
function displayResults(selectedSession) {
    const results = {};
    const { options } = selectedSession;

    for (const choice of Object.values(votes)) {
        results[choice] = (results[choice] || 0) + 1;
    }

    console.log(`當前投票結果: ${selectedSession.question}`);
    options.forEach(opt => {
        console.log(`${opt}: ${results[opt] || 0} 票`);
    });

    rl.question('輸入任意鍵返回主菜單: ', () => {
        showMenu(); // 返回主菜單
    });
}

// 啟動程序
loadVotes(); // 加載投票數據
showMenu();