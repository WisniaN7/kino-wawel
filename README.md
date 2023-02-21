# Kino Wawel / Wawel Cinema
## About 
Final project for the course "*WWW Techniques*" and "*Graphical Interfaces*" at the FAIS faculty at Jagiellonian University. The project is a web application for a small **imaginary cinema network**.

## How to run
1. Download the project and install XAMPP (recommended) and Node.js (if you don't have the already).
2. Run XAMPP and start Apache and MySQL.
3. Open phpMyAdmin and create a new database called ``kino_wawel``.
4. Import the ``kino_wawel.sql`` file into the database.
5. Open the project in your favorite IDE and run ``npm start`` in the terminal.

* Once run the app should be available at [localhost:3000](http://localhsot:300).
* If you're having problems with database, check ``controllers/database.js`` file and try changing port, user or password values.
* For admin access to add and edit movies and screening in database via application, login as admin ``{ login: admin, password: admin }``.

## Disclaimer
All phone numbers and addresses are randomly selected (except address in Lubań, where there exists a cinema, which was inspiration for the project) and emails are fictional. Please do not call the numbers and do not harass the owners of the buildings at the given addresses. The images are taken from the Internet and are not owned by me. The project is for educational purposes only.
