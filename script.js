document.addEventListener("DOMContentLoaded", () => {
    const expenseForm = document.getElementById("expense-form")
    const yearSelect = document.getElementById("year")
    const monthSelect = document.getElementById("month")
    const amountInput = document.getElementById("amount")
    const expenseChart = document.getElementById("expense-chart")

    let selectedMonth;
    let selectedYear;
    let myChart;
    //Generating Option Dynamically
    for (let year = 2020; year <= 2040; year++) {
        const option = document.createElement("option");
        option.val = year;
        option.textContent = year;
        yearSelect.appendChild(option);
    }

    //Initialize expense object with category
    const expenses = {
        January: { Housing: 0, Food: 0, Transportation: 0, Bills: 0, Miscellaneous: 0 },
        February: { Housing: 0, Food: 0, Transportation: 0, Bills: 0, Miscellaneous: 0 },
        March: { Housing: 0, Food: 0, Transportation: 0, Bills: 0, Miscellaneous: 0 },
        April: { Housing: 0, Food: 0, Transportation: 0, Bills: 0, Miscellaneous: 0 },
        May: { Housing: 0, Food: 0, Transportation: 0, Bills: 0, Miscellaneous: 0 },
        June: { Housing: 0, Food: 0, Transportation: 0, Bills: 0, Miscellaneous: 0 },
        July: { Housing: 0, Food: 0, Transportation: 0, Bills: 0, Miscellaneous: 0 },
        August: { Housing: 0, Food: 0, Transportation: 0, Bills: 0, Miscellaneous: 0 },
        September: { Housing: 0, Food: 0, Transportation: 0, Bills: 0, Miscellaneous: 0 },
        October: { Housing: 0, Food: 0, Transportation: 0, Bills: 0, Miscellaneous: 0 },
        November: { Housing: 0, Food: 0, Transportation: 0, Bills: 0, Miscellaneous: 0 },
        December: { Housing: 0, Food: 0, Transportation: 0, Bills: 0, Miscellaneous: 0 },
    }

    //Load expenses
    function getExpensesFromLocalStorage(month, year) {
        const key = `${month}-${year}`;
        return JSON.parse(localStorage.getItem(key)) || {};
    }
    //Save expenses
    function saveExpensesToLocalStorage(month, year) {
        const key = `${month}-${year}`;
        localStorage.setItem(key, JSON.stringify(expenses[month]));
    }

    //Get selected month & year
    function getSelectedMonthYear() {
        selectedMonth = monthSelect.value;
        selectedYear = yearSelect.value;

        if (!selectedMonth || !selectedYear) {
            alert("Month or Year not selected!");
            return;
        }

        if (!expenses[selectedMonth]) {
            expenses[selectedMonth] = { Housing: 0, Food: 0, Transportation: 0, Bills: 0, Miscellaneous: 0 };
        }
    }

    //UpdateChart 
    function updatChart() {
        getSelectedMonthYear();
        const expenseData = getExpensesFromLocalStorage(selectedMonth, selectedYear);
        Object.assign(expenses[selectedMonth], expenseData);

        const ctx = expenseChart.getContext("2d");
        if (myChart) {
            myChart.destroy();
        }
        myChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: Object.keys(expenses[selectedMonth]),
                datasets: [{
                    data: Object.values(expenses[selectedMonth]),
                    backgroundColor: [
                        "#ff6384", //Housing
                        "#4caf50", //Food
                        "#ffce56", //Transportation
                        "#36a2eb", //Bills
                        "#ff9f40", //Miscellaneous
                    ],
                }]
            },
            options: {
                 responsive: true,
                 plugins: {
                    legend: {
                        display: true,
                        positions: "top",
                    },
                    tooltip: {
                        callbacks: {
                            label: function(tooltipItems){
                                return `${tooltipItems.label}: $${tooltipItems.raw}`;
                            }
                        }
                    }
                 }
            }
        });
    }
    //Handle form submission
    function handleSubmit(event) {
        event.preventDefault();
        getSelectedMonthYear();

        const category = event.target.category.value;
        const amount = parseFloat(event.target.amount.value);

        const currentAmount = expenses[selectedMonth][category] || 0;
        if (amount > 0) {
            expenses[selectedMonth][category] = currentAmount + amount;
        } else if (amount < 0 && currentAmount >= Math.abs(amount)) {
            expenses[selectedMonth][category] = currentAmount + amount;
        } else {
            alert("Invalid amount : Can't reduce value below zero.");
        }
        console.log(expenses[selectedMonth]);
        saveExpensesToLocalStorage(selectedMonth, selectedYear);
        updatChart(); 
        amountInput.value = "";

    }
    expenseForm.addEventListener("submit", handleSubmit);
    monthSelect.addEventListener("change",updatChart);
    yearSelect.addEventListener("change",updatChart);

    //Setting Default month and year based on current month and year
    function setDefaultMonthYear() {
        const now = new Date();
        const initialMonth = now.toLocaleString("default", { month: "long" })
        const initialYear = now.getFullYear();
        monthSelect.value = initialMonth;
        yearSelect.value = initialYear;
    }
    setDefaultMonthYear();
    updatChart();
});