const DEFAULT_ADMIN = {
  username: "admin",
  password: "1234",
  name: "System Administrator",
  role: "Super Admin",
  lastLogin: "",
};

const DEFAULT_CUSTOMERS = [
  {
    id: "CUST-1001",
    name: "Geetha Reddy",
    age: 32,
    phone: "9876543210",
    email: "john@example.com",
    accountNumber: "1001001001",
    accountType: "Savings",
    balance: 5000.0,
  },
  {
    id: "CUST-1002",
    name: "Samanvi",
    age: 28,
    phone: "9876543211",
    email: "jane@example.com",
    accountNumber: "1001001002",
    accountType: "Current",
    balance: 12500.0,
  },
  {
    id: "CUST-1003",
    name: "Parikshit",
    age: 45,
    phone: "9876543212",
    email: "robert@example.com",
    accountNumber: "1001001003",
    accountType: "Savings",
    balance: 2750.0,
  },
];

const DEFAULT_TRANSACTIONS = [
  {
    id: "TXN-10001",
    date: new Date(Date.now() - 24 * 60 * 60 * 1000 * 2).toISOString(),
    type: "Deposit",
    sender: "N/A",
    receiver: "1001001001 (Geetha Reddy)",
    amount: 1000.0,
    status: "Success",
  },
  {
    id: "TXN-10002",
    date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    type: "Withdrawal",
    sender: "1001001002 (Samanvi)",
    receiver: "N/A",
    amount: 500.0,
    status: "Success",
  },
  {
    id: "TXN-10003",
    date: new Date().toISOString(),
    type: "Transfer",
    sender: "1001001002 (Samanvi)",
    receiver: "1001001003 (Parikshit)",
    amount: 1500.0,
    status: "Success",
  },
];

function initializeStorage() {
  if (!localStorage.getItem("admin")) {
    localStorage.setItem("admin", JSON.stringify(DEFAULT_ADMIN));
  }

  if (!localStorage.getItem("customers")) {
    localStorage.setItem("customers", JSON.stringify(DEFAULT_CUSTOMERS));
  }

  if (!localStorage.getItem("transactions")) {
    localStorage.setItem("transactions", JSON.stringify(DEFAULT_TRANSACTIONS));
  }

  if (localStorage.getItem("loginStatus") === null) {
    localStorage.setItem("loginStatus", "false");
  }
}

function getCustomers() {
  const data = localStorage.getItem("customers");
  return data ? JSON.parse(data) : [];
}

function saveCustomers(customersArray) {
  localStorage.setItem("customers", JSON.stringify(customersArray));
}

function getTransactions() {
  const data = localStorage.getItem("transactions");
  return data ? JSON.parse(data) : [];
}

function saveTransactions(transactionsArray) {
  localStorage.setItem("transactions", JSON.stringify(transactionsArray));
}

function getLoginStatus() {
  return localStorage.getItem("loginStatus") === "true";
}

function setLoginStatus(status) {
  localStorage.setItem("loginStatus", status ? "true" : "false");
}

function getAdminDetails() {
  const data = localStorage.getItem("admin");
  return data ? JSON.parse(data) : DEFAULT_ADMIN;
}

function saveAdminDetails(adminObject) {
  localStorage.setItem("admin", JSON.stringify(adminObject));
}

function logoutUser() {
  setLoginStatus(false);
}

initializeStorage();