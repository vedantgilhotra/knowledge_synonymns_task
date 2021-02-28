const Sequelize = require("sequelize");
const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: "./src/databases/database.sqlite"
});

const userData = sequelize.define('userData', {
    external_code: {
        type: Sequelize.STRING,
        allowNull: false
    },
    name:{
        type: Sequelize.STRING,
        allowNull:false,
    },
    address:{
        type:Sequelize.STRING,
        allowNull:true,
    },
    country_code:{
        type:Sequelize.STRING,
        allowNull:true,
    },
});

sequelize.sync().then(() => {
    console.log("The table userData has been created if it didn't exist already");
}).catch( (error) => {
    console.log("The table userData could not be created due to an error: ",error);
});

module.exports = {
   UserData:userData,
};