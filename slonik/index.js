const slonik = require('slonik')

const pool = slonik.createPool('postgres://', {
  captureStackTrace: false,
  maximumPoolSize: 4,
  connectionTimeout: 30 * 1000,
  preferNativeBindings: false
})

const query = sql => pool.then(p => p.query(sql))

module.exports = {
  queries: {
    select: () => query(slonik.sql.unsafe`select 1  as x`),
    select_arg: () => query(slonik.sql.unsafe`select ${ 1 } as x`),
    select_args: () => query(slonik.sql.unsafe`select
      ${ 1337 } as int,
      ${ 'wat' } as string,
      ${ new Date().toISOString() }::timestamp with time zone as timestamp,
      ${ null } as null,
      ${ false }::bool as boolean,
      ${ Buffer.from('awesome').toString() }::bytea as bytea,
      ${ JSON.stringify([{ some: 'json' }, { array: 'object' }]) }::jsonb as json
    `),
    select_where: () => query(slonik.sql.unsafe`select * from pg_catalog.pg_type where typname = ${ 'bool' }`)
  },
  end: () => pool.then(p => p.end())
}
