
// reset sqlite database (only run this in development environment)

const prompt = require('promptly');
const openrecord = require('openrecord/store/sqlite3');

async function resetDatabase () {
  const answer = await prompt.confirm('This will DELETE ALL DATA from the animeshot database, only proceed if you are testing locally or have backed up the sqlite file, PROCEED? (y/n)');

  if (!answer) {
    console.log('database reset aborted');
    return;
  }

  const db = new openrecord({
    file: './database/animeshot.sqlite',
    autoLoad: true,
    migrations: [
      require('../migrations/database_reset')
    ]
  });
  
  await db.ready();

  // clean up reset filename cache too
  const migrationCache = db.Model('openrecord_migrations');
  await migrationCache.where({ name: 'database_reset' }).deleteAll();

  console.log('database reset done, to seed again - npm run db:seed');
  db.close();
}

resetDatabase().catch((err) => {
  console.log(err);
});
