const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('./User');

const Post = sequelize.define('Post', {
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    body: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    createdBy: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    },
    active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    },
    geoLocation: {
        type: DataTypes.JSON,
        allowNull: false,
        get() {
            const value = this.getDataValue('geoLocation');
            return value ? JSON.parse(value) : null;
        },
        set(value) {
            if (value) {
                this.setDataValue('geoLocation', JSON.stringify(value));
            }
        }
    }
}, {
    timestamps: true
});

User.hasMany(Post, { foreignKey: 'createdBy' });
Post.belongsTo(User, { foreignKey: 'createdBy' });

module.exports = Post;
