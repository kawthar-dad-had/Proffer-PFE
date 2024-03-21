const { DataTypes } = require("sequelize");

const sequelize = require('../db/db_connection')
 
const User = sequelize.define("users", {
    first_name: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    last_name: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    phone_number: {
      type: DataTypes.STRING(16),
      allowNull: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        args: true,
        msg: 'Email address is already in use',
        // Add a custom validation function for checking uniqueness
        validate: async function (value, options) {
          if (!this.deleted) {
            const foundUser = await User.findOne({
              where: {
                email: value,
                deleted: false,
                id: {
                  [Op.ne]: this.id
                }
              }
            });
            if (foundUser) {
              throw new Error('Email address is already in use by another active user');
            }
          }
        }
      }    
  },
    password: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
            len: [7, Infinity] // Minimum length of 7 characters
        }
    },
    address: {
        type: DataTypes.STRING(200),
        allowNull: true
    },
    role: {
      type: DataTypes.ENUM('admin', 'evaluateur', 'contractant', 'soumissionnaire', 'ministere', 'etablissement'),
      allowNull: false
    },
    active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    },
    deleted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }

});

User.belongsTo(User, {
  as: 'contractant',
  foreignKey: {
    name: 'contractantId',
    allowNull: true
  }
})

module.exports = User