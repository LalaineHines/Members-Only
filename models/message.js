const pool = require("../db");

async function createMessage(title, text, author_Id) {
    const result = await pool.query(
            `INSERT INTO messages (title, text, author_Id)
                     VALUES ($1, $2, $3)
                              RETURNING *`,
                                       [title, text, author_Id]
                                           );
                                               return result.rows[0];
                                               }

                                               async function getAllMessages() {
                                                   const result = await pool.query(
                                                           `SELECT m.*, u.first_name, u.last_name, u.is_member
                                                                    FROM messages m
                                                                             JOIN users u ON m.author_id = u.id
                                                                                      ORDER BY m.timestamp DESC`
                                                                                          );
                                                                                              return result.rows;
                                                                                              }

                                                                                              async function deleteMessage(messageId) {
                                                                                                  await pool.query(`DELETE FROM messages WHERE id=$1`, [messageId]);
                                                                                                  }

                                                                                                  module.exports = { createMessage, getAllMessages, deleteMessage };