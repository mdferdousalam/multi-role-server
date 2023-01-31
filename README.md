# multi-role-server
# Node.js Express API - Multi-Role User Management System

## Connects to a MongoDB database using MongoDB driver

## Endpoints:
- /users: Returns array of all users
- /users/admin: Returns JSON object indicating if user with email is admin ({ isAdmin: true/false })
- /users/admins: Returns array of all admin users
- /users/consultant: Returns JSON object indicating if user with email is consultant ({ isConsultant: true/false })
- /users/consultants: Returns array of all consultant users
- /users/student: Returns JSON object indicating if user with email is student ({ isStudent: true/false })
- /users/students: Returns array of all student users
- /signup: Accepts user info (display name, email, password, role) and saves new user to database (password hashed)
- /login: Accepts email and password and returns JSON Web Token if user exists and password is correct
