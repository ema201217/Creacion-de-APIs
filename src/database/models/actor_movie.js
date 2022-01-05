module.exports = function(sequelize, dataTypes) {

    let alias = "actor_movie";

    let cols = {
        id: {
            type: dataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        actor_id: {
            type: dataTypes.INTEGER.UNSIGNED,
            allowNull : false
        },
        movie_id: {
            type: dataTypes.INTEGER.UNSIGNED,
            allowNull : false
        },
    }

    let config = {
        tableName: "actor_movie",
        timestamps: true,
        underscored: true
    }

    let actor_movie = sequelize.define(alias, cols, config)
    return actor_movie
}
