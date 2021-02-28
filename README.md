### knowledge_synonymns_task

Author: Vedant Gilhotra
Version: 1.0

Description: The project aims at providing a simpler way for a user to be able to update an sql database with the help of a csv file. 
Herein a user can change the file provided as sample-csv.csv under the cron directory to reflect the changes in the sqlite database as well.

### SETUP PROCESS:
To be able to setup the project dependencies in one go once after the repository has been cloned, a script by the name setup-projects.sh has been provided.
To execute installation of all required dependencies throughout the project, one may make use of the same:
To execute copy and paste the under mentioned command in a terminal aimed at the root directory of the project

## sh setup-projects.sh

# !important: The script excution process may prompt for password to be able to install pm2 dependecy globally. 
# Installation of this dependency makes the initialization of the project smoother and easier at the execution of one script.

### PROJECT INITIALIZATION
Once after the setup for the project via installation of dependencies has been done. One may execute the initialization script for the project.
To be able to do so, the user shall copy paste the under mentioned command in their terminal.
## sh start-project.sh 

# The logs for the execution of these processes can be found under their respective directories as api > app.log && cron > app.log
