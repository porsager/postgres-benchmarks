const slonik = require('slonik')

const pool = slonik.createPool('postgres://', { maximumPoolSize: 4, connectionTimeout: 30 * 1000, preferNativeBindings: false })

module.exports = {
  queries: {
    select: () => pool.query(slonik.sql`select 1  as x`),
    select_arg: () => pool.query(slonik.sql`select ${ 1 } as x`),
    select_args: () => pool.query(slonik.sql`select
      ${ 1337 } as int,
      ${ 'wat' } as string,
      ${ new Date().toISOString() }::timestamp with time zone as timestamp,
      ${ null } as null,
      ${ false }::bool as boolean,
      ${ Buffer.from('awesome').toString() }::bytea as bytea,
      ${ JSON.stringify([{ some: 'json' }, { array: 'object' }]) }::jsonb as json
    `),
    select_where: () => pool.query(slonik.sql`select * from pg_catalog.pg_type where typname = ${ 'bool' }`)
  },
  end: () => pool.end()
}
