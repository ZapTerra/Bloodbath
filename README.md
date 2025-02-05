# Bloodbath
Humans don’t have hit points, they have blood pressure. Bloodbath is a fast-paced, 2-5 player card game where each player is a blood mage looking to be the last one left standing. More wounds means bigger spells, but it also means your pressure will drop faster while it’s your turn. Each player uses a companion website to track their health. Ending your turn starts the next player’s turn, and Unconscious players are cut out of the circle. Only one player will be left standing - if they can staunch their wounds in time.

## Website Features
Players will be able to log in, join games, and view their gameplay statistics.
Once everyone has joined, each device will be given an identifying number 1-6, and players select their left and right neighbors to establish turn order. The creator of the lobby can start the game, and can pause the game while it's not their turn. Tapping or clicking on the left and right hand sides of the lower half of the screen increments and decrements wound count, tapping on the upper half ends the turn and passes to the next player, and swiping up or beginning a click low and ending it high ends the turn with regenerate until the start of that player's next turn.
I did my first playtests with WebGL Unity builds, but I think gameplay will flow better with a web app that starts turns automatically. The leading design principle for this game is ***fast*** with minimal confusion.
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
