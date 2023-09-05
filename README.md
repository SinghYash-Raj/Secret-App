# Secrets-Sharing-App

A web application that allows users to post and view secrets anonymously. Users can register using their email and password or directly through their Google account. 
The project is built using Express.js, EJS for templating, REST API, Passport for password hashing and salting, and MongoDB to store user credentials.

Table of Contents
1.Features
2.Installation
3.Usage
4.API Endpoints
5.Technologies Used
6.Contributing

1.Features
User Registration: Users can register using their email and password.

Login: Registered users can log in using their credentials.

Google Authentication: Users can also register directly using their Google account through Google Authentication.

Posting Secrets: Logged-in users can post their secrets anonymously.

Viewing Secrets: Users can view secrets posted by others without knowing the identity of the secret's author.

2.Installation
To run this project locally, follow these steps:

Clone the repository:
git clone https://github.com/your-username/secret-sharing-app.git

Navigate to the project directory:
cd secret-sharing-app

Install the dependencies:
npm install

Create a .env file and add the required environment variables:
PORT=3000
MONGODB_URI=mongodb://localhost/secret-sharing-db
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
SESSION_SECRET=your-session-secret

Start the server:
npm start

Open your web browser and access the application at http://localhost:3000.


3.Usage
1.Register a new user account using your email and password, or use Google Authentication to register directly through your Google account.

2.Log in with your credentials.

3.Once logged in, you can post your secrets, which will be displayed anonymously to other users.

4.You can also view secrets posted by other users without knowing their identity.

5.Enjoy sharing and discovering secrets while maintaining anonymity!


4.API Endpoints
The following API endpoints are available:

POST /api/register: Register a new user.
POST /api/login: Log in a user.
POST /api/logout: Log out a user.
GET /api/secrets: Retrieve a list of secrets.
POST /api/secrets: Post a new secret.

5.Technologies Used
Express.js: A web application framework for Node.js.
EJS: A templating engine for rendering dynamic content.
MongoDB: A NoSQL database to store user credentials and secrets.
Passport.js: Used for user authentication and password hashing.
Google Authentication: For allowing users to register with their Google accounts.
REST API: Used for handling HTTP requests and responses.
HTML, CSS, and JavaScript: For building the frontend of the application.

6.Contributing
Contributions are welcome! If you'd like to contribute to this project, please follow these guidelines:

Fork the repository.
Create a new branch for your feature or bug fix.
Make your changes and commit them with descriptive messages.
Push your changes to your fork.
Submit a pull request to the original repository.
