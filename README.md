# Bloodbath
Humans don’t have hit points, they have blood pressure. Bloodbath is a fast-paced, 2-5 player card game where each player is a blood mage looking to be the last one left standing. More wounds means bigger spells, but it also means your pressure will drop faster while it’s your turn. Each player uses a companion website to track their health. Ending your turn starts the next player’s turn, and Unconscious players are cut out of the circle. Only one player will be left standing - if they can staunch their wounds in time.

## Website Features
Players will be able to log in, join games, and view their gameplay statistics.
There is an interactive hourglass with an adjustable wound count that affects the drain speed.
On player death, a random bible verse is displayed.
Gameplay statistics are tracked along with usage of the hourglass.

<!-- Once everyone has joined, each device will be given an identifying number 1-6, and players select their left and right neighbors to establish turn order. The creator of the lobby can start the game, and can pause the game while it's not their turn. Tapping or clicking on the left and right hand sides of the lower half of the screen increments and decrements wound count, tapping on the upper half ends the turn and passes to the next player, and swiping up or beginning a click low and ending it high ends the turn with regenerate until the start of that player's next turn. -->
I did my first playtests with WebGL Unity builds, but I think gameplay will flow better with a web app that starts turns automatically. The leading design principle for this game is ***fast***, with minimal confusion. However, websockets were never implemented during this semester. I will need to return to the website later to create these features.

![Screenshot 2025-02-04 192748](https://github.com/user-attachments/assets/585a58f4-94bb-4b35-92d7-047eeff5e09e)
![Screenshot 2025-02-04 192816](https://github.com/user-attachments/assets/aa6cdac8-17df-421e-bd58-7ea7b8c2a768)
![Screenshot 2025-02-04 192832](https://github.com/user-attachments/assets/da436938-d8c9-4651-9a93-85bd156d1952)

- HTML - Three HTML pages: Login, room select, gameplay.
- CSS - The application should look good, and look good on all shapes and sizes of devices.
- React - Provides login and gameplay functionality. Single page display with component views.
- Service -
  - Login, logout, and register user support
  - Join lobby
  - Start and stop turns
  - Track wound counts (maybe streamline some effects like Blood Drive with their own buttons, but that could create too much UI clutter)

- Third party API - Random bible verses on death
- Database - manage accounts, track lobbies and game state
- WebSocket - push game updates for devices, start turn when previous player ends theirs

![image](https://github.com/user-attachments/assets/2f29444e-0c59-416f-a663-da33f1fdacdc)
![image](https://github.com/user-attachments/assets/b5c8c19e-2606-4325-bbad-f883f691b85e)
![image](https://github.com/user-attachments/assets/5963ac66-fd27-4650-ba40-b62a7ed1ab66)

HTML Deliverable
This deliverable is built and structured using HTML.

HTML pages - 4 pages for login, lobbies, gameplay and viewing statistics.
Links - The header links between all of the pages. The footer contains links to the project's GitHub, and to my frog game.
Text - Textual description and context are provided for input and elements.
Images -  Images display background and Hourglass UI.
DB/Login - The user's gameplay statistics are saved to the database. Input fields and entry button for login.

CSS Deliverable
This deliverable is stylized using CSS and Bootstrap.

Header, footer, and main content body
Navigation elements - Navigation is simple and intuitive while being good looking. I animated the header to look like a bloodstream when the user mouses over it. There are little blood cells between each of the header links.
Responsive to window resizing - The application is highly dynamic and looks great on all window sizes.
Application elements - Uses of spacing to create an aesthetically pleasing and readable website, even though maybe it hurts your eyes a little bit because it's way too cool
Application text content - Alagard baby, let's give it up for Alagard! Text sizing contributes to page aesthetic as well. (Alagard is my favorite font, if you couldn't already tell)
Application images - Images are dynamically sized and properly aligned and stacked to create a cool animated hourglass effect.

React 1 Deliverable
This deliverable moved the project to React and Vite.
Single-Page application - The page now exists on a single page composed of stubbed React components that are exchanged by the browser router when links in the header nav are clicked.

React 2 Deliverable
This deliverable implemented JavaScript, the application works by storing in local storage. Placeholder for future technologies were also added.

Login - Sign up button stores login info and log in button gives feedback on the result of the login.
Database - Stores wounds and hourglass level and retrieves them on launch. Data is stored on local storage and will be replaced with the database which will also implement statistics storage.
Application logic - Hourglass drain animation speed changes with the amount of wounds the player has. Hourglass resets after running out when the page is reloaded.

Service Deliverable
This deliverable created the endpoints which will later be used by the Database, mocking out some of the functionality which will be available once Database is implemented. Implements create user, login, update stats, view stats, logout, and unauthorized endpoints.

DB/Login Deliverable
In this deliverable, users info are associated to their account and persistently stored on the Database.

MongoDB Atlas database created - Complete
Stores data in MongoDB - Complete
User registration - Creates a new account in the database.
Existing user - Stores and updates user info for each existing user.
Use MongoDB to store credentials - Passwords are hashed and stored securely on the database.
Restricts functionality - Users can only view the statistics page when logged in.
Statistics - Shared blood loss between all users can be seen, along with personal information on amount of blood lost, wounds taken, wounds staunched, and deaths, with more statistics which are not yet implemented being shown as preview elements on the page.
Final touches - Cleaned up many UI elements and improved user feedback on current state of the application and login.
