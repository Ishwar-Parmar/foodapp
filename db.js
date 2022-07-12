import pg from 'pg';
const {Pool} = pg;

const poolConfig = process.env.DATABASE_URL?{
    connectionString: process.env.DATABASE_URL,
    ssl:{
        rejectUnauthorized: false
    }
}:{
    user: 'postgres',
    password: 'I@1234',
    database: 'foodproduct',
    host:'localhost',
    port: 5432, 
};
const pool = new Pool(poolConfig);
export default pool;