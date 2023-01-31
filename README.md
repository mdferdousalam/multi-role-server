# multi-role-server
This is a Node.js Express API that implements a multi-role user management system. It connects to a MongoDB database using the MongoDB driver and performs various database operations to manage users.

It implements the following endpoints:

/users: Returns an array of all users in the database.
/users/admin: Returns a JSON object indicating if the user with the specified email is an admin ({ isAdmin: true/false }).
/users/admins: Returns an array of all admin users in the database.
/users/consultant: Returns a JSON object indicating if the user with the specified email is a consultant ({ isConsultant: true/false }).
/users/consultants: Returns an array of all consultant users in the database.
/users/student: Returns a JSON object indicating if the user with the specified email is a student ({ isStudent: true/false }).
/users/students: Returns an array of all student users in the database.
/signup: Accepts a user's display name, email, password, and role and saves a new user to the database. The password is hashed before it is saved.
/login: Accepts a user's email and password and returns a JSON Web Token if the user exists and the password is correct.
