document.addEventListener("DOMContentLoaded", () => {
    
    checkAlreadyLoggedIn();
    
    const loginForm = document.getElementById("login-form");
    if (loginForm) {
        loginForm.addEventListener("submit", handleLoginSubmit);
    }
});


function handleLoginSubmit(event) {
    event.preventDefault();
    
    const usernameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();
    
    
    if (username === "" || password === "") {
        alert("Please enter both username and password.");
        return;
    }
    
    
    const admin = getAdminDetails();
    if (username === admin.username && password === admin.password) {
        
        admin.lastLogin = new Date().toISOString();
        saveAdminDetails(admin);
        setLoginStatus(true);
        
        alert("Login successful!");
        window.location.href = "pages/dashboard.html";
    } else {
        
        alert("Invalid username or password.");
        passwordInput.value = "";
        passwordInput.focus();
    }
}
