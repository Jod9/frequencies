const pool = require("../database")

class EventsController {
    constructor() {

    }

    async getEvents() {
        try {
            const client = await pool.connect();
            const result = await client.query('SELECT * FROM events');
            client.end();
            return result.rows;
        } catch (err) {
        
        }
    }

    async createEvent(event) {
        try {
          const client = await pool.connect();
          const query = `INSERT INTO events (name, location, genre, artist_list, attendees, promoter_id, price) VALUES ($1, $2, $3, $4, $5, $6, $7)`;
          const values = [
            event.name,
            event.location,
            event.genre,
            JSON.stringify(event.artist_list),
            JSON.stringify(event.attendees),
            event.promoter_id,
            event.price
          ];
          await client.query(query, values);
          client.end();
        } catch (err) {
          console.error(err);
        }
    }

};


module.exports = EventsController;