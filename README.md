# ToDo List

## Description

This is a task management application (ToDo) built using **Node.js, Express, and MongoDB**. It provides users with the ability to add, edit, and delete tasks, as well as manage their priorities. It includes user authentication and registration, as well as Google sign-in functionality.

## Key Features

- **User Authentication and Registration:** Users can register, log in, and log out.
- **Google Sign-In:** Supports authentication via Google for user convenience.
- **Task Management:** Allows adding new tasks, editing existing ones, deleting tasks, and changing their order. Tasks can be assigned priorities: High, Medium, and Low.
- **Data Storage:** Utilizes MongoDB to store user and task information.
- **Markdown Parsing:** Tasks can include descriptions in Markdown format, which is converted to HTML for better display.

## Preview 
## Home Page
<img src="https://cdn.glitch.global/4297ee09-1258-4bd4-a51a-260a1ee900ff/c904c019-54cf-4781-8b08-87268b34fdce.image.png?v=1723127196819" alt="Preview" />

## Login Page
<img src="https://cdn.glitch.global/0c34a768-d521-48ec-b253-732da4f90dab/0672c2a8-101b-44b7-968c-6d3cf7e65c34.image.png?v=1723215075025" alt="Preview" />

## Register Page
<img src="https://cdn.glitch.global/0c34a768-d521-48ec-b253-732da4f90dab/ba562d24-a836-40a9-b37c-a0fef0b13df1.image.png?v=1723215119898" alt="Preview" />

## Panel Page
<img src="https://cdn.glitch.global/4297ee09-1258-4bd4-a51a-260a1ee900ff/e069e34d-2de7-4e8a-8236-d9b204b06574.image.png?v=1723127277352" alt="Preview" />

## Preview Task
<img src="https://cdn.glitch.global/0c34a768-d521-48ec-b253-732da4f90dab/f17c5d4a-c1e2-4441-9823-fbde0aba4d43.image.png?v=1723215393190" alt="Preview" />

## Dropdown
<img src="https://cdn.glitch.global/0c34a768-d521-48ec-b253-732da4f90dab/4bce34df-1149-45ed-8454-f5913ff35286.image.png?v=1723215459636" alt="Preview" />

## Installation and Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/lordofsunshine/todo-list.git
   cd todo-list
   ```
   
2. Install dependencies:
 
```bash
npm install
```

3. Create a .env file:
```bash
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/<dbname>?retryWrites=true&w=majority
SESSION_SECRET=your_session_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback
PORT=3000 (optional)
```

4. Start the server:
```bash
npm start
```

5. Open the application in your browser:
Navigate to http://localhost:3000 in your web browser.

# Common Issues and Solutions
- **Missing .env file or incorrect environment variable values:** Ensure that all environment variables are defined in the `.env` file and contain correct values. Check that the MongoDB URI and Google API keys are accurate.
- **Database connection errors:** Verify that the MongoDB URI is correct and that your database is accessible. Check network settings and permissions.
- **Google Authentication errors:** Ensure that `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, and `GOOGLE_CALLBACK_URL` are correctly configured and match your project settings in the Google Cloud Console.
- **Server startup errors:** If the server fails to start, check that all dependencies are correctly installed and that you are using a supported version of Node.js.

## Project Development
This project will continue to evolve. New features, UI improvements, and security enhancements are planned. Contributions and suggestions are welcome!
## License
MIT License
