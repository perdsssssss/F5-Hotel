
        document.getElementById('registerForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Hide all error messages
            document.querySelectorAll('.error-message').forEach(function(msg) {
                msg.style.display = 'none';
            });
            
            let isValid = true;
            
            // Personal Information Validation
            const firstName = document.getElementById('firstName').value.trim();
            if (!firstName) {
                document.getElementById('firstNameError').style.display = 'block';
                isValid = false;
            }
            
            const lastName = document.getElementById('lastName').value.trim();
            if (!lastName) {
                document.getElementById('lastNameError').style.display = 'block';
                isValid = false;
            }
            
            const dateOfBirth = document.getElementById('dateOfBirth').value;
            if (!dateOfBirth) {
                document.getElementById('dateOfBirthError').style.display = 'block';
                isValid = false;
            }
            
            // Contact Information Validation
            const email = document.getElementById('email').value.trim();
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!email || !emailRegex.test(email)) {
                document.getElementById('emailError').style.display = 'block';
                isValid = false;
            }
            
            const contactNumber = document.getElementById('contactNumber').value.trim();
            if (!contactNumber || contactNumber.length < 10) {
                document.getElementById('contactNumberError').style.display = 'block';
                isValid = false;
            }
            
            // Account Information Validation
            const username = document.getElementById('username').value.trim();
            if (!username || username.length < 4) {
                document.getElementById('usernameError').style.display = 'block';
                isValid = false;
            }
            
            const password = document.getElementById('password').value;
            if (!password || password.length < 8) {
                document.getElementById('passwordError').style.display = 'block';
                isValid = false;
            }
            
            const confirmPassword = document.getElementById('confirmPassword').value;
            if (password !== confirmPassword) {
                document.getElementById('confirmPasswordError').style.display = 'block';
                isValid = false;
            }
            
            const termsCheckbox = document.getElementById('termsCheckbox').checked;
            if (!termsCheckbox) {
                document.getElementById('termsError').style.display = 'block';
                isValid = false;
            }
            
            // If validation passes
            if (isValid) {
                // Prepare user data for API
                const userData = {
                    firstName: firstName,
                    middleName: document.getElementById('middleName').value.trim(),
                    lastName: lastName,
                    dateOfBirth: dateOfBirth,
                    email: email,
                    contactNumber: contactNumber,
                    username: username,
                    password: password
                };
                
                // Send data to MongoDB via API (use relative path so port doesn't matter)
                fetch('/api/auth/signup', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(userData)
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        // Store token
                        localStorage.setItem('authToken', data.token);
                        localStorage.setItem('userData', JSON.stringify(data.user));
                        
                        // Show success message
                        document.getElementById('successMessage').style.display = 'block';
                        
                        // Redirect to login page after 2 seconds
                        setTimeout(function() {
                            window.location.href = 'login.html';
                        }, 2000);
                    } else {
                        alert('Registration failed: ' + data.message);
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('Server error. Please make sure the server is running on port 3000.');
                });
            } else {
                // Scroll to first error
                const firstError = document.querySelector('.error-message[style*="block"]');
                if (firstError) {
                    firstError.parentElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }
        });