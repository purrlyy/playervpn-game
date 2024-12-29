async function register() {
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;

    // Check if the user already exists
    const existingUsers = JSON.parse(localStorage.getItem('users')) || [];

    if (existingUsers.find(user => user.email === email)) {
        alert('User already exists!');
        return;
    }

    // Generate a verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit code

    // Send email verification (using a backend API call)
    const response = await fetch('/send-verification', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ email, code: verificationCode })
    });

    if (response.ok) {
        // Save user in local storage temporarily until verified
        existingUsers.push({ email, password, verified: false, verificationCode });
        localStorage.setItem('users', JSON.stringify(existingUsers));
        alert('A verification code has been sent to your email. Please verify to log in.');
    } else {
        alert('Failed to send verification code. Please try again.');
    }
}

async function login() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const verificationCode = document.getElementById('verificationCode').value;

    const existingUsers = JSON.parse(localStorage.getItem('users')) || [];
    const user = existingUsers.find(user => user.email === email);

    // Check for user existence
    if (!user) {
        alert('Invalid email or password!');
        return;
    }

    // First-time login check
    if (!user.verified) {
        if (user.verificationCode === verificationCode) {
            // Mark user as verified
            user.verified = true;
            localStorage.setItem('users', JSON.stringify(existingUsers));
            alert('Verification successful! You can now log in.');
        } else {
            alert('Invalid verification code. Please check your email and try again.');
        }
        return;
    }

    // Password check for verified users
    if (user.password === password) {
        alert('Login successful!');
        // Proceed to the next part of your site
    } else {
        alert('Invalid password!');
    }
}
