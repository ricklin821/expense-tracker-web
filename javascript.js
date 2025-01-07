// 在文件開頭添加這個函數
function setDefaultDateTime() {
    const now = new Date();
    
    // 設置日期
    const dateInput = document.getElementById('date');
    dateInput.valueAsDate = now;
    
    // 設置時間
    const timeInput = document.getElementById('time');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    timeInput.value = `${hours}:${minutes}`;
}

// 初始化支出數據數組
let expenses = JSON.parse(localStorage.getItem('expenses')) || [];

// DOM 元素
const expenseForm = document.getElementById('expense-form');
const expensesTable = document.getElementById('expenses-table').getElementsByTagName('tbody')[0];
const filterButton = document.getElementById('filter-button');
const filterDate = document.getElementById('filter-date');
const filterCurrency = document.getElementById('filter-currency');

// 更新統計數據
function updateSummary() {
    const summaries = {
        TWD: 0,
        JPY: 0,
        USD: 0,
        EUR: 0,
        KRW: 0
    };

    expenses.forEach(expense => {
        summaries[expense.currency] += parseFloat(expense.amount);
    });

    // 更新每個幣別的總計
    Object.keys(summaries).forEach(currency => {
        const summaryElement = document.getElementById(`${currency}-summary`).getElementsByTagName('span')[0];
        summaryElement.textContent = summaries[currency].toFixed(2);
    });
}

// 顯示支出列表
function displayExpenses(expensesToShow = expenses) {
    expensesTable.innerHTML = '';
    expensesToShow.forEach((expense, index) => {
        const row = expensesTable.insertRow();
        row.innerHTML = `
            <td>${expense.date}</td>
            <td>${expense.time}</td>
            <td>${expense.currency}</td>
            <td>${parseFloat(expense.amount).toFixed(2)}</td>
            <td>${expense.category}</td>
            <td>${expense.item}</td>
            <td>${expense.description}</td>
            <td>
                <button onclick="editExpense(${index})">編輯</button>
                <button onclick="deleteExpense(${index})">刪除</button>
            </td>
        `;
    });
    updateSummary();
}

// 添加新支出
expenseForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const expense = {
        date: document.getElementById('date').value,
        time: document.getElementById('time').value,
        currency: document.getElementById('currency').value,
        amount: document.getElementById('amount').value,
        category: document.getElementById('category').value,
        item: document.getElementById('item').value,
        description: document.getElementById('description').value
    };

    expenses.push(expense);
    localStorage.setItem('expenses', JSON.stringify(expenses));
    displayExpenses();
    expenseForm.reset();
});

// 刪除支出
function deleteExpense(index) {
    if (confirm('確定要刪除這筆支出嗎？')) {
        expenses.splice(index, 1);
        localStorage.setItem('expenses', JSON.stringify(expenses));
        displayExpenses();
    }
}

// 編輯支出
function editExpense(index) {
    const expense = expenses[index];
    document.getElementById('date').value = expense.date;
    document.getElementById('time').value = expense.time;
    document.getElementById('currency').value = expense.currency;
    document.getElementById('amount').value = expense.amount;
    document.getElementById('category').value = expense.category;
    document.getElementById('item').value = expense.item;
    document.getElementById('description').value = expense.description;

    // 刪除原有的支出
    expenses.splice(index, 1);
    localStorage.setItem('expenses', JSON.stringify(expenses));
    displayExpenses();
}

// 篩選支出
filterButton.addEventListener('click', function() {
    let filteredExpenses = [...expenses];

    // 依據日期篩選
    if (filterDate.value) {
        filteredExpenses = filteredExpenses.filter(expense => 
            expense.date === filterDate.value
        );
    }

    // 依據幣別篩選
    if (filterCurrency.value) {
        filteredExpenses = filteredExpenses.filter(expense => 
            expense.currency === filterCurrency.value
        );
    }

    displayExpenses(filteredExpenses);
});

// 初始顯示支出列表
displayExpenses();

// 在文件中找一個合適的位置（例如在 DOMContentLoaded 事件監聽器中）調用這個函數
document.addEventListener('DOMContentLoaded', function() {
    setDefaultDateTime();
    
    // 其他現有的初始化代碼...
});

// 如果您之前沒有 DOMContentLoaded 事件監聽器，可以直接在文件末尾添加：
// setDefaultDateTime();
