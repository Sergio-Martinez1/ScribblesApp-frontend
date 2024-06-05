# Scribbles FrontEnd
Scribbles FrontEnd is the user interface of the Scribbles App, this frontend was delevoped with Svelte and SvelteKit.

This project is a social-network like app, you can:
- Create an user.
- Add a profile photo, cover photo and personal information.
- Publish and delete posts with images and tags.
- Add reactions to other's posts.
- Comment on other's posts.
- Block posts that you dont like. 

## Before you getting started
You'll need to configure the "Scribbles Api" to see the full functionality of the application.
- Go to the api repository https://github.com/Sergio-Martinez1/ScribblesApp-Api
- Following the instructions in there you'll create this folder skeleton:
```
scribblesapp
|-- ScribblesApp-api
|-- db
```
When already configure your db and api, continue with the frontend configuration.
## Getting started
Go to the scribblesapp folder
```
cd scribblesapp
```
Clone the repository and go inside the folder:
```
git clone https://github.com/Sergio-Martinez1/ScribblesApp-frontend.git && cd ScribblesApp-frontend
```
Install all the dependencies
```
npm install
```
Create a .env file and open it with the code editor:
```
touch .env && nano .env
```
Copy and paste this enviromental variables in the .env file and save it with Ctrl-x:
```
API_URL=http://127.0.0.1:8080
PUBLIC_SERVER_API_URL=http://localhost:5173
```
*Note: The api url depends of the type of intallation you choose for the api, the api url may vary between: http://127.0.0.1:8000 and http://127.0.0.1:8080

*Note: The public_server_api_url is the url of the frontend, usually svelte uses the port 5173, but you can change it if is already in use.

Run the app:
```
npm run dev
```
Visit the app in its default url:
```
http://localhost:5173
```
