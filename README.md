# Kino Wawel / Wawel Cinema
## About 
The final project for the course "*WWW Techniques*" and "*Graphical Interfaces*" at the FAIS faculty at Jagiellonian University. The project is a web application for a small **imaginary cinema network**.

## How to run
1. Download the project and install XAMPP (recommended) and Node.js (if you don't have the already).
2. Run XAMPP and start Apache and MySQL.
3. Open phpMyAdmin and create a new database called ``kino_wawel``.
4. Import the ``kino_wawel.sql`` file into the database.
5. Run ``npm install`` command in the project directory.
6. Open the project in your favourite IDE and run ``npm start`` in the terminal.

* Once run the app should be available at [localhost:3000](http://localhost:3000).
* If you're having problems with the database, check ``controllers/database.js`` file and try changing the port, user or password values.
* For admin access to add and edit movies and screening in the database via application, login as admin ``{ login: admin, password: admin }``.

## Preview
You can also preview the application, by following this [url](https://kino-wawel.onrender.com/).

## Disclaimer
All phone numbers and addresses are randomly selected (except the address in Lubań, where there exists a cinema, which was the inspiration for the project) and emails are fictional. Please do not call the numbers and do not harass the owners of the buildings at the given addresses. The images are taken from the Internet and are not owned by me. The project is for educational purposes only.
