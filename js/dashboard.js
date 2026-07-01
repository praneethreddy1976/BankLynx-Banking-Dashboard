document.addEventListener("DOMContentLoaded", () => {
    
    checkAuth();
    
    
    setupLayout();
    
    
    const currentPath = window.location.pathname;
    
    if (currentPath.includes("dashboard.html")) {
        
        loadDashboardMetrics();
        loadRecentTransactions();
    } else if (currentPath.includes("profile.html")) {
        
        loadProfileDetails();
    }
});


function loadDashboardMetrics() {
    
    const customers = getCustomers();
    const totalCustomersCount = customers.length;
    
    let totalBalancesSum = 0;
    for (let i = 0; i < customers.length; i++) {
        totalBalancesSum += customers[i].balance;
    }
    
    
    const transactions = getTransactions();
    
    
    const todayStr = new Date().toISOString().split("T")[0]; 
    let todaysTransactionsCount = 0;
    
    
    let totalDepositsSum = 0;
    
    for (let j = 0; j < transactions.length; j++) {
        const txn = transactions[j];
        
        
        if (txn.date && txn.date.startsWith(todayStr)) {
            todaysTransactionsCount++;
        }
        
        
        if (txn.type === "Deposit" && txn.status === "Success") {
            totalDepositsSum += txn.amount;
        }
    }
    
    
    document.getElementById("total-customers").textContent = totalCustomersCount;
    document.getElementById("total-balance").textContent = formatCurrency(totalBalancesSum);
    document.getElementById("today-transactions").textContent = todaysTransactionsCount;
    document.getElementById("total-deposits").textContent = formatCurrency(totalDepositsSum);
}


function loadRecentTransactions() {
    const transactions = getTransactions();
    const tbody = document.getElementById("recent-transactions-tbody");
    
    if (!tbody) return;
    
    
    tbody.innerHTML = "";
    
    
    const sortedTxns = [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date));
    
    
    const recentTxns = sortedTxns.slice(0, 5);
    
    if (recentTxns.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align: center; color: var(--text-muted); padding: 30px;">
                    No transactions found in the system.
                </td>
            </tr>
        `;
        return;
    }
    
    
    for (let i = 0; i < recentTxns.length; i++) {
        const txn = recentTxns[i];
        
        
        let typeBadgeClass = "badge-info";
        if (txn.type === "Deposit") typeBadgeClass = "badge-success";
        if (txn.type === "Withdrawal") typeBadgeClass = "badge-danger";
        if (txn.type === "Transfer") typeBadgeClass = "badge-warning";
        
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${formatDate(txn.date)}</td>
            <td><strong>${txn.id}</strong></td>
            <td><span class="badge ${typeBadgeClass}">${txn.type}</span></td>
            <td>${txn.sender}</td>
            <td>${txn.receiver}</td>
            <td style="font-weight: 600;">${formatCurrency(txn.amount)}</td>
            <td><span class="badge badge-success">${txn.status}</span></td>
        `;
        tbody.appendChild(row);
    }
}


function loadProfileDetails() {
    const admin = getAdminDetails();
    
    const profileName = document.getElementById("profile-admin-name");
    const profileUsername = document.getElementById("profile-username");
    const profileRole = document.getElementById("profile-role");
    const profileLastLogin = document.getElementById("profile-last-login");
    const profileAvatar = document.getElementById("profile-avatar-char");
    
    
    if (profileAvatar && admin.name) {
        profileAvatar.textContent = admin.name.charAt(0).toUpperCase();
    }
    
    if (profileName) profileName.textContent = admin.name;
    if (profileUsername) profileUsername.textContent = admin.username;
    if (profileRole) profileRole.textContent = admin.role;
    if (profileLastLogin) {
        profileLastLogin.textContent = formatDate(admin.lastLogin);
    }
}
