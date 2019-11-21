// Update with your config settings.

import { DB_NAME, DB_USER, DB_PASS } from "serverSettings"

const dbConfig = {
    client: "mysql",
    connection: {
        database: DB_NAME,
        user: DB_USER,
        password: DB_PASS
    },
    pool: {
        min: 2,
        max: 10
    },
    migrations: {
        tableName: "knex_migrations"
    }
}

export = {
    development: dbConfig,
    staging: dbConfig,
    production: dbConfig
}
