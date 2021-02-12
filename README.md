# Postgres Library Benchmarks for Node.js

This is a set of benchmarks focusing on the performance of Postgres client libraries for Node.js. The benchmarks are primarily direct selects of values to measure the input-output performance and not the Performance of postgres data fetching.

> NB. In daily usage it is very likely that this difference doesn't matter as much since the time spent by the client library is negligable compared to the query time itself.

Currently benchmarked libraries are

- [Postgres.js](https://github.com/porsager/postgres)
- [pg-promise](https://github.com/vitaly-t/pg-promise)
- [pg](https://github.com/brianc/node-postgres)
- [pg-native](https://github.com/brianc/node-pg-native)
- [slonik](https://github.com/gajus/slonik)


## Results

These are the results from running the benchmarks on a Macbook Pro 2,9 GHz Quad-Core Intel Core i7 with a default Postgres 12.6 installation and Node 12.20.1.
The time is the average of 5 rounds, running the queries 10,000 times after some warmup rounds.

client     |         select |     select_arg |    select_args |   select_where
:--------- | -------------: | -------------: | -------------: | -------------:
[Postgres.js](https://github.com/porsager/postgres)   |  0.100s (4.8x) |  0.105s (7.4x) |  0.231s (4.3x) |  0.233s (5.1x)
[pg-promise](https://github.com/vitaly-t/pg-promise) |  0.360s (1.3x) |  0.427s (1.8x) |  0.662s (1.5x) |  0.801s (1.5x)
[pg-promise-native](https://github.com/vitaly-t/pg-promise) |  0.371s (1.3x) |  0.435s (1.8x) |  0.673s (1.5x) |  0.807s (1.5x)
[pg](https://github.com/brianc/node-postgres)         |  0.322s (1.5x) |  0.611s (1.3x) |  0.815s (1.2x) |  1.057s (1.1x)
[pg-native](https://github.com/brianc/node-pg-native)  |  0.479s (1.0x) |  0.551s (1.4x) |  0.885s (1.1x) |  1.183s (1.0x)
[slonik](https://github.com/gajus/slonik)     |  0.453s (1.1x) |  0.773s (1.0x) |  0.992s (1.0x) |  1.108s (1.1x)

![results chart](results.png)
> lower is better

## Query descriptions:

#### select

```sql
select 1 as x
```

#### select_arg

```sql
select $1 as x

-- $1 is just 1
```

#### select_args
```sql
select
  $1 as int,
  $2 as string,
  $3 as timestamp,
  $4 as null,
  $5 as boolean,
  $6 as bytea,
  $7 as json

--$1 = 1337
--$2 = 'wat'
--$3 = new Date()
--$4 = null
--$5 = false
--$6 = Buffer.from('awesome')
--$7 = "[{ "some": "json" }, { "array": "object" }]"
```

#### select_where

```sql
select * from pg_catalog.pg_type where typname = $1

--$1 = 'bool'
```


#### Running the benchmark

Ensure you have a PostgreSQL server running. You can add connection details using environment vars PGDATABASE, PGUSER etc.

```bash
npm install
npm start
```
