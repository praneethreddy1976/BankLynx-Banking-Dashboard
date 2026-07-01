let activeCustomer = null;

document.addEventListener("DOMContentLoaded", () => {
    
    checkAuth();
    setupLayout();
    
    const path = window.location.pathname;
    
    if (path.includes("deposit.html")) {
        initDepositPage();
    } else if (path.includes("withdraw.html")) {
        initWithdrawPage();
    } else if (path.includes("transfer.html")) {
        initTransferPage();
    } else if (path.includes("transactions.html")) {
        initTransactionsPage();
    }
});

function initDepositPage() {
    
    const form = document.getElementById("deposit-form");
    if (form) form.addEventListener("submit", (e) => e.preventDefault());
    
    document.getElementById("btn-search-account").addEventListener("click", searchAccount);
    document.getElementById("btn-execute-deposit").addEventListener("click", executeDeposit);
    document.getElementById("btn-cancel").addEventListener("click", resetTransactionPanel);
}

function executeDeposit() {
    if (!activeCustomer) return;
    
    const amountInput = document.getElementById("deposit-amount");
    const amount = parseFloat(amountInput.value);
    
    if (isNaN(amount) || amount <= 0) {
        alert("Please enter a valid deposit amount.");
        return;
    }
    
    const customers = getCustomers();
    const index = customers.findIndex(c => c.id === activeCustomer.id);
    
    if (index !== -1) {
        
        customers[index].balance += amount;
        saveCustomers(customers);
        
        
        const target = `${activeCustomer.accountNumber} (${activeCustomer.name})`;
        logTransaction("Deposit", "N/A", target, amount);
        
        
        activeCustomer = customers[index];
        document.getElementById("display-balance").textContent = formatCurrency(activeCustomer.balance);
        amountInput.value = "";
        
        alert(`Successfully deposited ${formatCurrency(amount)}.`);
    }
}





function initWithdrawPage() {
    const form = document.getElementById("withdraw-form");
    if (form) form.addEventListener("submit", (e) => e.preventDefault());
    
    document.getElementById("btn-search-account").addEventListener("click", searchAccount);
    document.getElementById("btn-execute-withdraw").addEventListener("click", executeWithdrawal);
    document.getElementById("btn-cancel").addEventListener("click", resetTransactionPanel);
}

function executeWithdrawal() {
    if (!activeCustomer) return;
    
    const amountInput = document.getElementById("withdraw-amount");
    const amount = parseFloat(amountInput.value);
    
    if (isNaN(amount) || amount <= 0) {
        alert("Please enter a valid withdrawal amount.");
        return;
    }
    
    if (amount > activeCustomer.balance) {
        alert("Insufficient balance! Withdrawal request denied.");
        return;
    }
    
    const customers = getCustomers();
    const index = customers.findIndex(c => c.id === activeCustomer.id);
    
    if (index !== -1) {
        
        customers[index].balance -= amount;
        saveCustomers(customers);
        
        
        const target = `${activeCustomer.accountNumber} (${activeCustomer.name})`;
        logTransaction("Withdrawal", target, "N/A", amount);
        
        
        activeCustomer = customers[index];
        document.getElementById("display-balance").textContent = formatCurrency(activeCustomer.balance);
        amountInput.value = "";
        
        alert(`Successfully withdrew ${formatCurrency(amount)}.`);
    }
}


function searchAccount() {
    const query = document.getElementById("search-account").value.trim();
    if (!query) {
        alert("Please enter an Account Number or Customer ID.");
        return;
    }
    
    const customers = getCustomers();
    const customer = customers.find(c => c.id.toLowerCase() === query.toLowerCase() || c.accountNumber === query);
    
    const actionCard = document.getElementById("transaction-action-card");
    
    if (customer) {
        activeCustomer = customer;
        document.getElementById("display-name").textContent = customer.name;
        document.getElementById("display-acc-no").textContent = customer.accountNumber;
        document.getElementById("display-acc-type").textContent = customer.accountType;
        document.getElementById("display-balance").textContent = formatCurrency(customer.balance);
        
        actionCard.style.display = "block";
    } else {
        activeCustomer = null;
        actionCard.style.display = "none";
        alert("Account details not found in database.");
    }
}

function resetTransactionPanel() {
    activeCustomer = null;
    document.getElementById("search-account").value = "";
    document.getElementById("transaction-action-card").style.display = "none";
    
    const depForm = document.getElementById("deposit-form");
    if (depForm) depForm.reset();
    
    const wdrForm = document.getElementById("withdraw-form");
    if (wdrForm) wdrForm.reset();
}





function initTransferPage() {
    const form = document.getElementById("transfer-form");
    if (form) form.addEventListener("submit", (e) => e.preventDefault());
    
    document.getElementById("btn-execute-transfer").addEventListener("click", executeTransfer);
    
    
    document.getElementById("sender-account").addEventListener("input", (e) => {
        verifyTransferInput(e.target.value, "sender-verify-badge");
    });
    
    document.getElementById("receiver-account").addEventListener("input", (e) => {
        verifyTransferInput(e.target.value, "receiver-verify-badge");
    });
}

function verifyTransferInput(accVal, badgeId) {
    const query = accVal.trim();
    const badge = document.getElementById(badgeId);
    if (!badge) return;
    
    if (!query) {
        badge.className = "account-verification-badge";
        badge.innerHTML = `<i class="fas fa-info-circle"></i> <span>Enter account number to verify.</span>`;
        return;
    }
    
    const customers = getCustomers();
    const customer = customers.find(c => c.id.toLowerCase() === query.toLowerCase() || c.accountNumber === query);
    
    if (customer) {
        badge.className = "account-verification-badge valid";
        badge.innerHTML = `<i class="fas fa-check-circle"></i> <span>Verified: ${customer.name}</span>`;
    } else {
        badge.className = "account-verification-badge invalid";
        badge.innerHTML = `<i class="fas fa-times-circle"></i> <span>Account details not found.</span>`;
    }
}

function executeTransfer() {
    const senderAcc = document.getElementById("sender-account").value.trim();
    const receiverAcc = document.getElementById("receiver-account").value.trim();
    const amountVal = document.getElementById("transfer-amount").value;
    const amount = parseFloat(amountVal);
    
    if (!senderAcc || !receiverAcc || isNaN(amount) || amount <= 0) {
        alert("Please enter valid accounts and transfer amount.");
        return;
    }
    
    const customers = getCustomers();
    const sender = customers.find(c => c.id.toLowerCase() === senderAcc.toLowerCase() || c.accountNumber === senderAcc);
    const receiver = customers.find(c => c.id.toLowerCase() === receiverAcc.toLowerCase() || c.accountNumber === receiverAcc);
    
    if (!sender) {
        alert("Sender account is invalid.");
        return;
    }
    if (!receiver) {
        alert("Receiver account is invalid.");
        return;
    }
    if (sender.id === receiver.id) {
        alert("Sender and receiver accounts must be different.");
        return;
    }
    if (amount > sender.balance) {
        alert(`Insufficient balance. Sender has only ${formatCurrency(sender.balance)}.`);
        return;
    }
    
    const senderIndex = customers.findIndex(c => c.id === sender.id);
    const receiverIndex = customers.findIndex(c => c.id === receiver.id);
    
    
    customers[senderIndex].balance -= amount;
    customers[receiverIndex].balance += amount;
    saveCustomers(customers);
    
    
    const senderLog = `${sender.accountNumber} (${sender.name})`;
    const receiverLog = `${receiver.accountNumber} (${receiver.name})`;
    logTransaction("Transfer", senderLog, receiverLog, amount);
    
    
    document.getElementById("transfer-form").reset();
    verifyTransferInput("", "sender-verify-badge");
    verifyTransferInput("", "receiver-verify-badge");
    
    alert(`Successfully transferred ${formatCurrency(amount)}.`);
}





function initTransactionsPage() {
    loadTransactionsLedger();
    
    document.getElementById("search-transactions").addEventListener("input", searchLedgerLogs);
    document.getElementById("btn-clear-history").addEventListener("click", clearLedgerHistory);
}

function loadTransactionsLedger(customList = null) {
    const tbody = document.getElementById("transactions-tbody");
    if (!tbody) return;
    
    tbody.innerHTML = "";
    const list = customList ? customList : getTransactions();
    
    if (list.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--text-muted); padding: 20px;">No transactions recorded.</td></tr>`;
        return;
    }
    
    
    const sorted = [...list].sort((a, b) => new Date(b.date) - new Date(a.date));
    
    sorted.forEach(txn => {
        let typeBadge = "badge-info";
        if (txn.type === "Deposit") typeBadge = "badge-success";
        if (txn.type === "Withdrawal") typeBadge = "badge-danger";
        if (txn.type === "Transfer") typeBadge = "badge-warning";
        
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${formatDate(txn.date)}</td>
            <td><strong>${txn.id}</strong></td>
            <td><span class="badge ${typeBadge}">${txn.type}</span></td>
            <td>${txn.sender}</td>
            <td>${txn.receiver}</td>
            <td style="font-weight: 600;">${formatCurrency(txn.amount)}</td>
            <td><span class="badge badge-success">${txn.status}</span></td>
        `;
        tbody.appendChild(row);
    });
}

function searchLedgerLogs(event) {
    const query = event.target.value.toLowerCase().trim();
    const transactions = getTransactions();
    
    const filtered = transactions.filter(t => 
        t.id.toLowerCase().includes(query) || 
        t.type.toLowerCase().includes(query) || 
        t.sender.toLowerCase().includes(query) || 
        t.receiver.toLowerCase().includes(query)
    );
    
    loadTransactionsLedger(filtered);
}

function clearLedgerHistory() {
    if (confirm("Are you sure you want to clear the entire transaction log?")) {
        saveTransactions([]);
        loadTransactionsLedger();
        alert("Transaction history cleared.");
    }
}


function logTransaction(type, sender, receiver, amount) {
    const transactions = getTransactions();
    const txnId = "TXN-" + (transactions.length + 10004);
    
    const newTxn = {
        id: txnId,
        date: new Date().toISOString(),
        type: type,
        sender: sender,
        receiver: receiver,
        amount: amount,
        status: "Success"
    };
    
    transactions.push(newTxn);
    saveTransactions(transactions);
}
