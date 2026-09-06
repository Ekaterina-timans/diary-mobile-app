import * as SQLite from 'expo-sqlite'

let databasePromise: Promise<SQLite.SQLiteDatabase> | null = null
// Открывает локальную базу дневника один раз и возвращает общее подключение к ней.
export function getDatabase() {
  if (!databasePromise) {
    databasePromise = SQLite.openDatabaseAsync('diary.db').then(async (database) => {
      await database.execAsync('PRAGMA journal_mode = WAL')
      return database
    })
  }
  return databasePromise
}