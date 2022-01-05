module.exports = (sequelize, dataTypes) => {
    let alias = 'Movie'; // esto debería estar en singular
    let cols = {
        id: {
            type: dataTypes.BIGINT(10).UNSIGNED,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        // created_at: dataTypes.TIMESTAMP,
        // updated_at: dataTypes.TIMESTAMP,
        title: {
            type: dataTypes.STRING(500),
            allowNull: false,
            validate: {
                notNull: {
                    args:true,
                    msg:"Title can not be null"
                },
                notEmpty:{
                    args:true,
                    msg:"Write the movie title"
                }
            }
        },
        rating: {
            type: dataTypes.DECIMAL(3, 1).UNSIGNED,
            allowNull: false,
            validate: {
                notNull: {
                    args:true,
                    msg:"Rating can not be null"
                },
                notEmpty:{
                    args:true,
                    msg:"Write the rating of the movie"
                }
            }
        },
        awards: {
            type: dataTypes.BIGINT(10).UNSIGNED,
            allowNull: false,
            defaultValue:"0",
            
        },
        release_date: {
            type: dataTypes.DATEONLY,
            allowNull: false,
            validate: {
                notNull: {
                    args:true,
                    msg:"Field release date can not be null"
                },
                notEmpty:{
                    args:true,
                    msg:"Your have to indicate the release date of the movie"
                }
            }
        },
        length: dataTypes.BIGINT(10),
        genre_id: dataTypes.BIGINT(10)
    };
    let config = {
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: false
    }
    const Movie = sequelize.define(alias,cols,config);

    Movie.associate = function (models) {
        Movie.belongsTo(models.Genre, { // models.Genre -> Genres es el valor de alias en genres.js
            as: "genre",
            foreignKey: "genre_id"
        })

        Movie.belongsToMany(models.Actor, { // models.Actor -> Actors es el valor de alias en actor.js
            as: "actors",
            through: 'actor_movie',
            foreignKey: 'movie_id',
            otherKey: 'actor_id',
            timestamps: false
        })
    }

    return Movie
};