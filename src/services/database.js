import SQLite from 'react-native-sqlite-storage';

SQLite.enablePromise(true);

class DatabaseService {
  constructor() {
    this.database = null;
  }

  async initDB() {
    try {
      const db = await SQLite.openDatabase({
        name: 'ItemsDB.db',
        location: 'default',
      });
      this.database = db;
      await this.createTable();
    } catch (error) {
      console.error('Error initializing database:', error);
    }
  }

  async createTable() {
    if (!this.database) return;

    const query = `
      CREATE TABLE IF NOT EXISTS items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT
      )
    `;

    try {
      await this.database.executeSql(query);
    } catch (error) {
      console.error('Error creating table:', error);
    }
  }

  async getItems() {
    if (!this.database) return [];

    try {
      const [results] = await this.database.executeSql('SELECT * FROM items');
      return results.rows.raw();
    } catch (error) {
      console.error('Error getting items:', error);
      return [];
    }
  }

  async addItem(item) {
    if (!this.database) return -1;

    try {
      const [result] = await this.database.executeSql(
        'INSERT INTO items (name, description) VALUES (?, ?)',
        [item.name, item.description]
      );
      return result.insertId;
    } catch (error) {
      console.error('Error adding item:', error);
      return -1;
    }
  }

  async updateItem(item) {
    if (!this.database || !item.id) return false;

    try {
      await this.database.executeSql(
        'UPDATE items SET name = ?, description = ? WHERE id = ?',
        [item.name, item.description, item.id]
      );
      return true;
    } catch (error) {
      console.error('Error updating item:', error);
      return false;
    }
  }

  async deleteItem(id) {
    if (!this.database) return false;

    try {
      await this.database.executeSql('DELETE FROM items WHERE id = ?', [id]);
      return true;
    } catch (error) {
      console.error('Error deleting item:', error);
      return false;
    }
  }
}

export const databaseService = new DatabaseService(); 