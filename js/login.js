document.getElementById('loginForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const email = document.getElementById('email').value.trim();
            const username = document.getElementById('username').value.trim();
            const password = document.getElementById('password').value.trim();
            
            // Hide all error messages
            document.querySelectorAll('.error-message').forEach(function(msg) {
                msg.style.display = 'none';
            });
            
            // Basic validation
            let isValid = true;
            
            if (!email || !email.includes('@')) {
                document.getElementById('emailError').style.display = 'block';
                isValid = false;
            }
            
            if (!username) {
                document.getElementById('usernameError').style.display = 'block';
                isValid = false;
            }
            
            if (!password) {
                document.getElementById('passwordError').style.display = 'block';
                isValid = false;
            }
            
            // If validation passes, authenticate with API
            if (isValid) {
                // Send login request to MongoDB via API (use relative path so port doesn't matter)
                fetch('/api/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        email: email,
                        username: username,
                        password: password
                    })
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        // Store authentication token and user data
                        localStorage.setItem('authToken', data.token);
                        localStorage.setItem('userData', JSON.stringify(data.user));
                        sessionStorage.setItem('userLoggedIn', 'true');
                        sessionStorage.setItem('username', data.user.username);
                        
                        // Redirect to main page
                        window.location.href = 'home.html';
                    } else {
                        alert('Login failed: ' + data.message);
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('Server error. Please make sure the server is running on port 3000.');
                });
            }
            
        });