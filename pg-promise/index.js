const pg = require('pg-promise')

const db = pg()({ max: 4 })

module.exports = {
  queries: {
    select: () => db.query('select 1 as x'),
    select_arg: () => db.query('select $1 as x', [1]),
    select_args: () => db.query(`select
      $1::int as int,
      $2 as string,
      $3::timestamp with time zone as timestamp,
      $4 as null,
      $5::bool as boolean,
      $6::bytea as bytea,
      $7::jsonb as json
    `, [
      1337,
      'wat',
      new Date().toISOString(),
      null,
      false,
      Buffer.from('awesome'),
      JSON.stringify([{ some: 'json' }, { array: 'object' }])
    ]),
    select_where: () => db.query(`select * from pg_catalog.pg_type where typname = $1`, ['bool'])
  },
  end: () => db.$pool.end()
}
