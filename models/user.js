const pool = require("../db");

async function createUser(first, last, username, hashedPassword) {
    const result = await pool.query(
            `INSERT INTO users (first_name, last_name, username, password)
                     VALUES ($1, $2, $3, $4)
                              RETURNING *`,
                                       [first, last, username, hashedPassword]
                                           );
                                               return result.rows[0];
                                               }

                                               async function findUserByUsername(username) {
                                                   const result = await pool.query(
                                                           `SELECT * FROM users WHERE username=$1`,
                                                                   [username]
                                                                       );
                                                                           return result.rows[0];
                                                                           }

                                                                           async function updateMembership(userId) {
                                                                               await pool.query(
                                                                                       `UPDATE users SET is_member=true WHERE id=$1`,
                                                                                               [userId]
                                                                                                   );
                                                                                                   }

                                                                                                   async function updateAdmin(userId) {
                                                                                                       await pool.query(
                                                                                                               `UPDATE users SET is_admin=true WHERE id=$1`,
                                                                                                                       [userId]
                                                                                                                           );
                                                                                                                           }

                                                                                                                           module.exports = { createUser, findUserByUsername, updateMembership, updateAdmin };