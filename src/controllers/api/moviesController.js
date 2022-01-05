const db = require('../../database/models')

const getUrl = (req) => {
    return `${req.protocol}://${req.get("host")}${req.originalUrl}`
}
module.exports = {
    create: (req, res) => {
        const { title,
            rating,
            awards,
            release_date,
            length,
            genre_id } = req.body
        db.Movie.create({
            title,
            rating,
            awards,
            release_date,
            length,
            genre_id
        })
            .then(movie => {
           
                return res.status(201).json({ // En el caso de que el recurso haya sido creado exitosamente
                    meta: {
                        endpoint: `${getUrl(req)}/${movie.id}`,
                        msg: "Pelicula agregada exitosamente"
                    },
                    data: movie
                })
            }).catch(error => {

                switch (error.name) {
                    case "SequelizeValidationError":
                        const errorsMsg = [];
                        const notNullErrors = [];
                        const validationErrors = [];

                        error.errors.forEach(error => {
                            errorsMsg.push(error.message)
                            if (error.type == "notNull Violation") {
                                notNullErrors.push(error.message)
                            }
                            if (error.type == "Validation error") {
                                validationErrors.push(error.message)
                            }
                        });
                        const response = {
                            status: 400,
                            message: "missing or wrong data",
                            errors: {
                                quantity: errorsMsg.length,
                                msg: errorsMsg,
                                notNull: notNullErrors,
                                validations: validationErrors
                            }
                        }
                        return res.status(400).json(response)

                    default:
                        return res.status(500).json({
                            error
                        }) //500 - error se servidor
                }
            })
    },
    getAll: (req, res) => {
        db.Movie.findAll({
            include: [{ association: "genre" }, { association: "actors" }]
        })
            .then(movies => {
                res.json({
                    meta: {
                        endpoint: getUrl(req),
                        status: 200,
                        total: movies.length,
                    },
                    data: movies
                })
            }).catch(err => console.log(err))
    },
    getOne: (req, res) => {
        if (req.params.id % 1 !== 0 || req.params.id < 0) {
            return res.status(404).json({
                meta: {
                    status: 404,
                    msg: "Wrong ID"
                }
            })
        } else {
            db.Movie.findByPk(req.params.id, {
                include: [{ association: "genre" }, { association: "actors" }]
            })
                .then(movie => {
                    if (movie) {
                        res.status(200).json({
                            meta: {
                                endpoint: getUrl(req),
                                status: 200
                            },
                            data: movie
                        })
                    } else {
                        return res.status(404).json({
                            meta: {
                                status: 404,
                                msg: "ID not found"
                            }
                        })
                    }
                }).catch(err => console.log(err))
        }
    },
    update: (req, res) => {
        const { title,
            rating,
            awards,
            release_date,
            length,
            genre_id } = req.body

        db.Movie.update({
            title,
            rating,
            awards,
            release_date,
            length,
            genre_id
        }, {
            where: {
                id: req.params.id
            }
        })
            .then(result => {
                if (result) {
                    return res.status(201).json({
                        msg: "Update successfully"
                    })
                } else {
                    return res.status(200).json({
                        msg: "No changes"
                    })
                }
            })
            .catch(err => console.log(err))
    },
    delete: (req, res) => {
        let actorUpdate = db.Actor.update({
            favorite_movie_id: null
        }, {
            where: {
                favorite_movie_id: req.params.id
            }
        })
        let actorMovieUpdate = db.actor_movie.destroy({
            where: {
                movie_id: req.params.id
            }
        })

        Promise.all([actorUpdate, actorMovieUpdate])
            .then(
                db.Movie.destroy({
                    where: {
                        id: req.params.id
                    }
                })
                )
                .then(result=>{
                    if (result) {
                        return res.status(200).json({
                            msg: "Movie deleted successfully"
                        })
                    } else {
                        return res.status(200).json({
                            msg: "No changes"
                        })
                    }
                })
    },

}