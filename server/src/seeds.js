const { sequelize, User, Performer, Score } = require('./models');

const initializeDatabase = async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log('✅ Database schema synced');
    
    const performerCount = await Performer.count();
    if (performerCount === 0) {
      await seedPerformers();
    }
  } catch (error) {
    console.error('❌ Error initializing database:', error);
  }
};

const seedPerformers = async () => {
  const performers = [
    { country: 'Albania', artistName: 'Alis', songTitle: 'Nân', countryCode: 'AL', semifinal: 2 },
    { country: 'Armenia', artistName: 'Simon', songTitle: 'TBA', countryCode: 'AM', semifinal: 2 },
    { country: 'Australia', artistName: 'Delta Goodrem', songTitle: 'Eclipse', countryCode: 'AU', semifinal: 2 },
    { country: 'Austria', artistName: 'Cosmó', songTitle: 'Tanzschein', countryCode: 'AT', semifinal: null },
    { country: 'Azerbaijan', artistName: 'JIVA', songTitle: 'Just Go', countryCode: 'AZ', semifinal: 2 },
    { country: 'Belgium', artistName: 'ESSYLA', songTitle: 'Dancing on the Ice', countryCode: 'BE', semifinal: 1 },
    { country: 'Bulgaria', artistName: 'DARA', songTitle: 'Bangaranga', countryCode: 'BG', semifinal: 2 },
    { country: 'Croatia', artistName: 'LELEK', songTitle: 'Andromeda', countryCode: 'HR', semifinal: 1 },
    { country: 'Cyprus', artistName: 'Antigoni', songTitle: 'JALLA', countryCode: 'CY', semifinal: 2 },
    { country: 'Czechia', artistName: 'Daniel Zizka', songTitle: 'CROSSROADS', countryCode: 'CZ', semifinal: 2 },
    { country: 'Denmark', artistName: 'Søren Torpegaard Lund', songTitle: 'Før Vi Går Hjem', countryCode: 'DK', semifinal: 2 },
    { country: 'Estonia', artistName: 'Vanilla Ninja', songTitle: 'Too Epic To Be True', countryCode: 'EE', semifinal: 1 },
    { country: 'Finland', artistName: 'Linda Lampenius x Pete Parkkonen', songTitle: 'Liekinheitin', countryCode: 'FI', semifinal: 1 },
    { country: 'France', artistName: 'Monroe', songTitle: 'Regarde !', countryCode: 'FR', semifinal: null },
    { country: 'Georgia', artistName: 'Bzikebi', songTitle: 'On Replay', countryCode: 'GE', semifinal: 1 },
    { country: 'Germany', artistName: 'Sarah Engels', songTitle: 'Fire', countryCode: 'DE', semifinal: null },
    { country: 'Greece', artistName: 'Akylas', songTitle: 'Ferto', countryCode: 'GR', semifinal: 1 },
    { country: 'Israel', artistName: 'Noam Bettan', songTitle: 'Michelle', countryCode: 'IL', semifinal: 1 },
    { country: 'Italy', artistName: 'Sal Da Vinci', songTitle: 'Per Sempre Sì', countryCode: 'IT', semifinal: null },
    { country: 'Latvia', artistName: 'Atvara', songTitle: 'Ēnā', countryCode: 'LV', semifinal: 2 },
    { country: 'Lithuania', artistName: 'Lion Ceccah', songTitle: 'Sólo Quiero Más', countryCode: 'LT', semifinal: 1 },
    { country: 'Luxembourg', artistName: 'Eva Marija', songTitle: 'Mother Nature', countryCode: 'LU', semifinal: 2 },
    { country: 'Malta', artistName: 'AIDAN', songTitle: 'Bella', countryCode: 'MT', semifinal: 2 },
    { country: 'Moldova', artistName: 'Satoshi', songTitle: 'Viva, Moldova!', countryCode: 'MD', semifinal: 1 },
    { country: 'Montenegro', artistName: 'Tamara Živković', songTitle: 'Nova Zora', countryCode: 'ME', semifinal: 1 },
    { country: 'Norway', artistName: 'JONAS LOVV', songTitle: 'YA YA YA', countryCode: 'NO', semifinal: 2 },
    { country: 'Poland', artistName: 'Alicja', songTitle: 'Pray', countryCode: 'PL', semifinal: 1 },
    { country: 'Portugal', artistName: 'Bandidos do Cante', songTitle: 'Rosa', countryCode: 'PT', semifinal: 1 },
    { country: 'Romania', artistName: 'Alexandra Căpitănescu', songTitle: 'Choke Me', countryCode: 'RO', semifinal: 2 },
    { country: 'San Marino', artistName: 'Senhit', songTitle: 'Superstar', countryCode: 'SM', semifinal: 1 },
    { country: 'Serbia', artistName: 'Lavina', songTitle: 'Kraj Mene', countryCode: 'RS', semifinal: 1 },
    { country: 'Sweden', artistName: 'Felicia', songTitle: 'My System', countryCode: 'SE', semifinal: 1 },
    { country: 'Switzerland', artistName: 'Veronica Fusaro', songTitle: 'Alice', countryCode: 'CH', semifinal: 2 },
    { country: 'Ukraine', artistName: 'Leléka', songTitle: 'Ridnym', countryCode: 'UA', semifinal: 2 },
    { country: 'United Kingdom', artistName: 'LOOK MUM NO COMPUTER', songTitle: 'Eins, Zwei, Drei', countryCode: 'GB', semifinal: null },
  ];

  try {
    await Performer.bulkCreate(performers);
    console.log(`✅ Seeded ${performers.length} performers`);
  } catch (error) {
    console.error('❌ Error seeding performers:', error);
  }
};

module.exports = { initializeDatabase };
