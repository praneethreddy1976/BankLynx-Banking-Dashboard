let selectedCustomerId = null;
document.addEventListener("DOMContentLoaded", () => {
    
    checkAuth();
    setupLayout();
    
    
    loadCustomerList();
    
    
    document.getElementById("search-customer").addEventListener("input", searchCustomers);
    document.getElementById("customer-form").addEventListener("submit", saveCustomer);
    document.getElementById("btn-update").addEventListener("click", updateCustomer);
    document.getElementById("btn-clear").addEventListener("click", clearCustomerForm);
});

function loadCustomerList(customList = null) {
    const tbody = document.getElementById("customer-tbody");
    if (!tbody) return;
    
    tbody.innerHTML = "";
    
    
    const list = customList ? customList : getCustomers();
    
    if (list.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--text-muted); padding: 20px;">No customers found.</td></tr>`;
        return;
    }
    
    
    list.forEach(cust => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td><strong>${cust.id}</strong></td>
            <td>${cust.name}</td>
            <td>${cust.accountNumber}</td>
            <td><span class="badge ${cust.accountType === 'Savings' ? 'badge-info' : 'badge-warning'}">${cust.accountType}</span></td>
            <td>${cust.phone}</td>
            <td style="font-weight: 600;">${formatCurrency(cust.balance)}</td>
            <td>
                <div class="table-actions">
                    <button class="btn-icon btn-icon-edit" title="Edit"><i class="fas fa-edit"></i></button>
                    <button class="btn-icon btn-icon-delete" title="Delete"><i class="fas fa-trash-alt"></i></button>
                </div>
            </td>
        `;
        
        
        row.querySelector(".btn-icon-edit").addEventListener("click", () => startEditCustomer(cust.id));
        row.querySelector(".btn-icon-delete").addEventListener("click", () => deleteCustomer(cust.id));
        
        tbody.appendChild(row);
    });
}


function searchCustomers(event) {
    const query = event.target.value.toLowerCase().trim();
    const customers = getCustomers();
    
    const filtered = customers.filter(c => 
        c.name.toLowerCase().includes(query) || 
        c.id.toLowerCase().includes(query) || 
        c.accountNumber.includes(query)
    );
    
    loadCustomerList(filtered);
}


function saveCustomer(event) {
    event.preventDefault();
    
    const name = document.getElementById("cust-name").value.trim();
    const age = parseInt(document.getElementById("cust-age").value);
    const phone = document.getElementById("cust-phone").value.trim();
    const email = document.getElementById("cust-email").value.trim();
    const accountType = document.getElementById("cust-account-type").value;
    const balance = parseFloat(document.getElementById("cust-balance").value);
    
    
    if (!name || isNaN(age) || !phone || !email || isNaN(balance)) {
        alert("Please fill in all fields.");
        return;
    }
    if (age < 18) {
        alert("Customer must be 18 years or older.");
        return;
    }
    if (phone.length !== 10 || isNaN(phone)) {
        alert("Please enter a valid 10-digit mobile number.");
        return;
    }
    if (balance < 100) {
        alert("Opening balance must be at least $100.");
        return;
    }
    
    const customers = getCustomers();
    
    
    const newId = "CUST-" + (customers.length + 1004);
    const newAcc = "100100100" + (customers.length + 4);
    
    const newCustomer = {
        id: newId,
        name: name,
        age: age,
        phone: phone,
        email: email,
        accountNumber: newAcc,
        accountType: accountType,
        balance: balance
    };
    
    customers.push(newCustomer);
    saveCustomers(customers);
    
    
    logSystemTransaction("Deposit", "N/A", `${newAcc} (${name})`, balance);
    
    loadCustomerList();
    clearCustomerForm();
    alert(`Customer registered successfully! Account: ${newAcc}`);
}


function startEditCustomer(id) {
    const customers = getCustomers();
    const customer = customers.find(c => c.id === id);
    if (!customer) return;
    
    selectedCustomerId = id;
    
    document.getElementById("cust-id").value = customer.id;
    document.getElementById("cust-account-no").value = customer.accountNumber;
    document.getElementById("cust-name").value = customer.name;
    document.getElementById("cust-age").value = customer.age;
    document.getElementById("cust-phone").value = customer.phone;
    document.getElementById("cust-email").value = customer.email;
    document.getElementById("cust-account-type").value = customer.accountType;
    
    
    document.getElementById("balance-form-group").style.display = "none";
    
    
    document.getElementById("btn-save").style.display = "none";
    document.getElementById("btn-update").style.display = "block";
    document.getElementById("form-action-title").textContent = "Edit Customer Profile";
}


function updateCustomer() {
    if (!selectedCustomerId) return;
    
    const name = document.getElementById("cust-name").value.trim();
    const age = parseInt(document.getElementById("cust-age").value);
    const phone = document.getElementById("cust-phone").value.trim();
    const email = document.getElementById("cust-email").value.trim();
    const accountType = document.getElementById("cust-account-type").value;
    
    if (!name || isNaN(age) || !phone || !email) {
        alert("Please fill in all fields.");
        return;
    }
    if (age < 18) {
        alert("Customer must be 18 years or older.");
        return;
    }
    if (phone.length !== 10 || isNaN(phone)) {
        alert("Please enter a valid 10-digit mobile number.");
        return;
    }
    
    const customers = getCustomers();
    const index = customers.findIndex(c => c.id === selectedCustomerId);
    
    if (index !== -1) {
        customers[index].name = name;
        customers[index].age = age;
        customers[index].phone = phone;
        customers[index].email = email;
        customers[index].accountType = accountType;
        
        saveCustomers(customers);
        loadCustomerList();
        clearCustomerForm();
        alert("Customer profile updated successfully!");
    }
}


function deleteCustomer(id) {
    
    if (confirm("Are you sure you want to delete this customer account?")) {
        const customers = getCustomers();
        const filtered = customers.filter(c => c.id !== id);
        saveCustomers(filtered);
        
        if (selectedCustomerId === id) {
            clearCustomerForm();
        }
        
        loadCustomerList();
        alert("Customer account deleted successfully.");
    }
}


function clearCustomerForm() {
    selectedCustomerId = null;
    document.getElementById("customer-form").reset();
    document.getElementById("cust-id").value = "";
    document.getElementById("cust-account-no").value = "";
    
    
    document.getElementById("balance-form-group").style.display = "block";
    document.getElementById("btn-save").style.display = "block";
    document.getElementById("btn-update").style.display = "none";
    document.getElementById("form-action-title").textContent = "Register Customer";
}


function logSystemTransaction(type, sender, receiver, amount) {
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
