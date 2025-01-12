const readline = require('readline');
const moment = require('moment');
const fs = require('fs');
const path = require('path');

// 创建输入接口
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// 定义文件路径
const dataFilePath = path.join(__dirname, 'appointments.json');

// 行事历功能
let appointments = [];

// 加载预约数据
function loadAppointments() {
    if (fs.existsSync(dataFilePath)) {
        const data = fs.readFileSync(dataFilePath);
        appointments = JSON.parse(data);
    }
}

// 保存预约数据
function saveAppointments() {
    fs.writeFileSync(dataFilePath, JSON.stringify(appointments, null, 2));
}

// 活动倒数计时器
function countdownTimer() {
    rl.question('请输入活动日期 (格式: YYYY-MM-DD HH:mm): ', (inputDate) => {
        const eventDate = moment(inputDate);

        if (!eventDate.isValid()) {
            console.log('无效日期格式，请重新输入。');
            return countdownTimer();
        }

        const interval = setInterval(() => {
            const now = moment();
            const duration = moment.duration(eventDate.diff(now));

            console.clear(); // 清屏
            if (duration.asMilliseconds() < 0) {
                console.log('活动时间已过。');
                clearInterval(interval);
            } else {
                // 显示倒计时
                console.log(`距离活动还有 ${duration.days()} 天 ${duration.hours()} 小时 ${duration.minutes()} 分钟 ${duration.seconds()} 秒`);
                console.log('当前预约:');
                showAppointments(false); // 不返回主菜单
            }
        }, 1000); // 每秒更新

        // 结束倒计时功能
        rl.question('按 ENTER 结束倒计时...', () => {
            clearInterval(interval);
            mainMenu();
        });
    });
}

// 主菜单
function mainMenu() {
    console.log('\n请选择功能:');
    console.log('1. 活动倒数计时器');
    console.log('2. 新增预约');
    console.log('3. 查看所有预约');
    console.log('4. 查看特定日期的预约');
    console.log('5. 删除预约');
    console.log('6. 年龄计算器');
    console.log('7. 退出');

    rl.question('请输入选项: ', (option) => {
        switch (option) {
            case '1':
                countdownTimer();
                break;
            case '2':
                addAppointment();
                break;
            case '3':
                showAppointments(true);
                break;
            case '4':
                showAppointmentsByDate();
                break;
            case '5':
                deleteAppointment();
                break;
            case '6':
                calculateAge();
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

function addAppointment() {
    rl.question('请输入预约日期 (格式: YYYY-MM-DD): ', (date) => {
        if (!moment(date).isValid()) {
            console.log('无效日期格式，请重新输入。');
            return addAppointment();
        }

        rl.question('请输入预约内容: ', (content) => {
            if (checkConflict(date)) {
                console.log('该日期已有预约，请选择其他日期。');
            } else {
                appointments.push({ date, content });
                console.log(`预约已添加: ${content} 在 ${date}`);
                saveAppointments(); // 保存数据
            }
            mainMenu();
        });
    });
}

function checkConflict(date) {
    return appointments.some(appointment => appointment.date === date);
}

function showAppointments(returnToMenu) {
    if (appointments.length === 0) {
        console.log('没有预约。');
    } else {
        appointments.sort((a, b) => moment(a.date).diff(moment(b.date))); // 按日期排序
        console.log('当前预约:');
        const now = moment();
        appointments.forEach(appointment => {
            const appointmentDate = moment(appointment.date);
            const duration = moment.duration(appointmentDate.diff(now));
            const timeLeft = duration.asMilliseconds() > 0
                ? `${duration.days()} 天 ${duration.hours()} 小时 ${duration.minutes()} 分钟 ${duration.seconds()} 秒`
                : '已过期';

            console.log(`- ${appointment.content} 在 ${appointment.date} (${timeLeft} 剩余)`);
        });
    }

    // 提供返回选项
    if (returnToMenu) {
        rl.question('\n按 ENTER 返回主菜单...', () => {
            mainMenu();
        });
    }
}

function showAppointmentsByDate() {
    rl.question('请输入要查看的日期 (格式: YYYY-MM-DD): ', (date) => {
        if (!moment(date).isValid()) {
            console.log('无效日期格式，请重新输入。');
            return showAppointmentsByDate();
        }

        const filteredAppointments = appointments.filter(appointment => appointment.date === date);
        if (filteredAppointments.length === 0) {
            console.log(`在 ${date} 没有预约。`);
        } else {
            console.log(`在 ${date} 的预约:`);
            const now = moment();
            filteredAppointments.forEach(appointment => {
                const appointmentDate = moment(appointment.date);
                const duration = moment.duration(appointmentDate.diff(now));
                const timeLeft = duration.asMilliseconds() > 0
                    ? `${duration.days()} 天 ${duration.hours()} 小时 ${duration.minutes()} 分钟 ${duration.seconds()} 秒`
                    : '已过期';

                console.log(`- ${appointment.content} (${timeLeft} 剩余)`);
            });
        }

        // 提供返回选项
        rl.question('\n按 ENTER 返回主菜单...', () => {
            mainMenu();
        });
    });
}

function deleteAppointment() {
    rl.question('请输入要删除的预约日期 (格式: YYYY-MM-DD): ', (date) => {
        if (!moment(date).isValid()) {
            console.log('无效日期格式，请重新输入。');
            return deleteAppointment();
        }

        const index = appointments.findIndex(appointment => appointment.date === date);
        if (index !== -1) {
            appointments.splice(index, 1);
            console.log(`在 ${date} 的预约已删除。`);
            saveAppointments(); // 保存数据
        } else {
            console.log(`在 ${date} 没有找到预约。`);
        }
        mainMenu();
    });
}

// 年龄计算器
function calculateAge() {
    rl.question('请输入出生日期 (格式: YYYY-MM-DD): ', (birthDate) => {
        const birth = moment(birthDate);
        if (!birth.isValid()) {
            console.log('无效日期格式，请重新输入。');
            return calculateAge();
        }

        const age = moment().diff(birth, 'years');
        console.log(`您的年龄是: ${age} 岁`);
        mainMenu();
    });
}

// 启动程序
loadAppointments(); // 加载预约数据
mainMenu();