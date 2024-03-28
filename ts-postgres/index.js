const { connect } = require('ts-postgres')
const { createPool } = require('generic-pool');

const pool = createPool(
    {
      create: connect,
      destroy: client => client.end()
    },
    { max: 4 },
);

const query = (text, values) => pool.use(async client => client.query(text, values))

module.exports = {
  queries: {
    select: () => query('select 1 as x'),
    select_arg: () => query('select $1 as x', [1]),
    select_args: () => query(`select
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
      [{ some: 'json' }, { array: 'object' }]
    ]),
    select_where: () => query('select * from pg_catalog.pg_type where typname = $1', ['bool'])
  },
  end: () => Promise.all([pool.drain(), pool.clear()])
}
