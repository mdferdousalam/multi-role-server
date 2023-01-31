const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const bcrypt = require("bcryptjs")

const app = express();
const port = process.env.PORT || 5000;

app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.kykmokn.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });



async function run() {
    try {
        const userCollection = client.db('multiroleapp').collection('users');


        // users finding api
        app.get('/users', async (req, res) => {
            const query = {}
            const cursor = userCollection.find(query)
            const users = await cursor.toArray()
            res.send(users)
        })



        // admin users 
        app.get('/users/admin', async (req, res) => {
            const email = req.query.email;
            const query = { email }
            const user = await userCollection.findOne(query);
            console.log(user);
            res.send({ isAdmin: user?.role === "admin" });
        })

        //All admins 
        app.get('/users/admins', async (req, res) => {
            const role = 'admin'
            const query = { role: role }
            const cursor = userCollection.find(query);
            const result = await cursor.toArray()
            res.send(result);
        })

        // consultant
        app.get('/users/consultant', async (req, res) => {
            const email = req.query.email;
            const query = { email }
            const user = await userCollection.findOne(query);
            res.send({ isConsultant: user?.role === 'consultant' });
        })
        //All consultants 
        app.get('/users/consultants', async (req, res) => {
            const role = 'consultant'
            const query = { role: role }
            const cursor = userCollection.find(query);
            const result = await cursor.toArray()

            res.send(result);
        })

        // All Students
        app.get('/users/students', async (req, res) => {
            const role = 'student';
            const query = { role: role }
            const cursor = userCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        })
        // Student 
        app.get('/users/student', async (req, res) => {
            const email = req.query.email;
            const query = { email }
            const user = await userCollection.findOne(query);
            res.send({ isStudent: user?.role === 'student' });
        })

        app.post('/signup', async (req, res) => {
            try {
                // Destructure the request body
                const { DisplayName, email, password, role } = req.body;
                console.log(req.body)
                // Check if the user already exists
                const user = await userCollection.findOne({ email });
                if (user) return res.status(400).json({ msg: 'User already exists' });

                // Create a new user
                const newUser = ({
                    DisplayName,
                    email,
                    password,
                    role
                });
                console.log(newUser)
                // Hash the password
                const salt = await bcrypt.genSalt(10);
                newUser.password = await bcrypt.hash(password, salt);

                // Save the user to the database
                await userCollection.insertOne(newUser)

                // Create and assign a token
                const token = jwt.sign({ id: newUser._id }, process.env.TOKEN_SECRET);
                res.status(201).json({ token });
            } catch (err) {
                console.error(err.message);
                res.status(500).send(message = 'Server Error');
            }
        });




        app.post('/login', async (req, res) => {
            const { email, password } = req.body;

            // Find the user by email
            const user = await userCollection.findOne({ email });
            if (!user) return res.status(400).send('Invalid email or password');

            // Compare the passwords
            const validPassword = await bcrypt.compare(password, user.password);
            if (!validPassword) return res.status(400).send('Invalid email or password');

            // Create and assign a token
            const token = jwt.sign({ _id: user._id, role: user.role }, process.env.TOKEN_SECRET);
            res.status(201).json({ token });
            // res.header('auth-token', token).send(token);
        });







    } catch (error) {

    }
    finally {

    }
}

run().catch(err => console.error(err));



app.get('/', (req, res) => {
    res.send('multi role server is running')
})

app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500).send(err.stack);
});

app.listen(port, () => {
    console.log(`surver running on port: ${port}`)

})