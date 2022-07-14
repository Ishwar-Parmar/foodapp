import pg from 'pg';
const {Pool} = pg;

const poolConfig = process.env.DATABASE_URL?{
    connectionString: process.env.DATABASE_URL,
    ssl:{
        rejectUnauthorized: false
    }
// }:{
//     user: 'postgres',
//     password: 'I@1234',
//     database: 'foodproduct',
//     host:'ec2-44-195-169-163.compute-1.amazonaws.com',
//     port: 5432, 
// };
}:{
    user: 'ipxxjnbsersypp',
    password: 'I@ec1e090b9789c37d652ba00518d9e26b04f310dfc057de67870cf788694f9be8',
    database: 'dfu67as0cohnsc',
    host:'ec2-44-195-169-163.compute-1.amazonaws.com',
    port: 5432, 
};
const pool = new Pool(poolConfig);
export default pool;