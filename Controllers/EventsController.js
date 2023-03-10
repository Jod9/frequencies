const pool = require("../database")

class EventsController {
    constructor(client) {
      this.client = client
    }

    async getEvents() {
        try {
            const result = await this.client.query('SELECT * FROM events');
            return result.rows;
        } catch (err) {
        
        }
    }

    async getEventById(id) {
      try {
        const query = 'SELECT * FROM events WHERE id = $1';
        const values = [id];
        const result = await this.client.query(query, values);
        return result.rows[0];
      } catch (err) {
        console.error(err);
      }
    }

    async createEvent(event) {
        try {
          const query = `INSERT INTO events ("name", "location", "genre", "artist_list", "attendees", "promoter_id", "price", "date") VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`;
          const values = [
            event.name,
            event.location,
            event.genre,
            JSON.stringify(event.artist_list),
            JSON.stringify(event.attendees),
            event.promoter_id,
            event.price,
            event.date
          ];
          await this.client.query(query, values);
        } catch (err) {
          console.error(err);
        }
    }

    async deleteEvent(id) {
      try {
        const client = await pool.connect();
        const query = `DELETE FROM events WHERE id = $1`;
        const values = [id];
        await client.query(query, values);
        client.end();
      } catch (err) {
        console.error(err);
      }
    }
    
    async fetchEventsByPromoter(id) {
      try {
        const query = 'SELECT * FROM events WHERE promoter_id = $1'
        const values = [id];
        const result = await this.client.query(query, values);
        return result.rows;
      } catch (err) {
        console.error(err);
      }
    }
    
    async updateEvent(event_id, updatedEvent) {
      try {
        const query = `
          UPDATE events SET
            name = $1,
            location = $2,
            genre = $3,
            artist_list = $4::jsonb,
            attendees = $5::jsonb,
            promoter_id = $6,
            price = $7,
            date = $8
          WHERE id = $9
        `;
        const values = [
          updatedEvent.name,
          updatedEvent.location,
          updatedEvent.genre,
          JSON.stringify(updatedEvent.artist_list),
          JSON.stringify(updatedEvent.attendees),
          updatedEvent.promoter_id,
          updatedEvent.price,
          updatedEvent.date,
          event_id
        ];

        const result = await this.client.query(query, values);
        return result.rowCount;
      } catch (err) {
        console.error(err);
      }
    }

    async update_picture(picture, id) {
      try {
          await this.client.query('UPDATE events SET picture = $1 WHERE id = $2', [picture, id])  
      }
      catch(err){
          console.log(err)
      }
  }

  async addAttendee(listenerID, eventId){
    try {
      const query = `UPDATE events SET attendees = attendees || '[{"listener_id" : "${listenerID}"}]' WHERE id = $1;`
      const values = [eventId];
      await this.client.query(query, values);
    } catch (err) {
      console.error(err);
    }
  }

  async removeAttendee(position, id) {
      try {
          await this.client.query(`UPDATE events SET attendees = attendees - ${position} WHERE id = $1;`, [id])
      } catch (err) {
        console.error(err);
      }
    }

  async findAllAttendeeEvents(AttendeeId) {
    try {
      const result = await this.client.query(`SELECT * FROM events WHERE attendees @> '[{"listener_id": "${AttendeeId}"}]';`)
      return result
    } catch (err) {
      console.error(err);
    }
  }
    
};
  
    
module.exports = EventsController;