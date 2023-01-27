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



        // user creating API
        app.post('/users', async (req, res) => {
            const user = req.body
            console.log(user)
            const result = await userCollection.insertOne(user)
            res.send(result)

        })

        app.post('/signup', async (req, res) => {
            try {
                // Destructure the request body
                const { name, email, password, role } = req.body;
                console.log(req.body)
                // Check if the user already exists
                const user = await userCollection.findOne({ email });
                if (user) return res.status(400).json({ msg: 'User already exists' });

                // Create a new user
                const newUser = ({
                    name,
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

        app.get('/logout', (req, res) => {
            req.logout();
            res.redirect('/');
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



app.listen(port, () => {
    console.log(`surver running on port: ${port}`)
    client.connect(err => {
        if (err) {
            console.log(err)
        } else {
            console.log('Connected to mongoDb')
            client.close();
        }
    })
})