function checkAuth() {
    const isLoggedIn = getLoginStatus();
    const currentPath = window.location.pathname;
    const isInPagesFolder = currentPath.includes("/pages/");
    
    if (!isLoggedIn) {
        window.location.href = isInPagesFolder ? "../index.html" : "index.html";
    }
}


function checkAlreadyLoggedIn() {
    const isLoggedIn = getLoginStatus();
    const currentPath = window.location.pathname;
    const isInPagesFolder = currentPath.includes("/pages/");
    
    if (isLoggedIn) {
        window.location.href = isInPagesFolder ? "dashboard.html" : "pages/dashboard.html";
    }
}


function formatCurrency(amount) {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD"
    }).format(amount);
}


function formatDate(isoString) {
    if (!isoString) return "N/A";
    const date = new Date(isoString);
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    const hh = String(date.getHours()).padStart(2, "0");
    const min = String(date.getMinutes()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd} ${hh}:${min}`;
}


function setupLayout() {
    
    const menuBtn = document.getElementById("sidebar-toggle");
    const sidebar = document.getElementById("sidebar");
    if (menuBtn && sidebar) {
        menuBtn.addEventListener("click", () => {
            sidebar.classList.toggle("collapsed");
        });
    }

    
    const admin = getAdminDetails();
    const loggedUserEl = document.getElementById("logged-user-name");
    const sidebarUserEl = document.getElementById("sidebar-user-name");
    
    if (loggedUserEl) loggedUserEl.textContent = admin.name;
    if (sidebarUserEl) sidebarUserEl.textContent = admin.name;

    
    const currentPath = window.location.pathname;
    const pageName = currentPath.substring(currentPath.lastIndexOf("/") + 1);
    const sidebarLinks = document.querySelectorAll(".sidebar-menu a");
    
    sidebarLinks.forEach(link => {
        const href = link.getAttribute("href");
        if (href && (href === pageName || (pageName === "" && href === "dashboard.html"))) {
            link.classList.add("active");
        } else {
            link.classList.remove("active");
        }
    });

    
    const logoutBtn = document.getElementById("logout-btn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", (e) => {
            e.preventDefault();
            
            if (confirm("Are you sure you want to logout?")) {
                logoutUser();
                const isInPagesFolder = currentPath.includes("/pages/");
                window.location.href = isInPagesFolder ? "../index.html" : "index.html";
            }
        });
    }
}
