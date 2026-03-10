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
    { country: 'Sweden', artistName: 'Marcus & Martinus', songTitle: 'Unforgettable', countryCode: 'SE', semifinal: 1 },
    { country: 'Italy', artistName: 'Angelina Mango', songTitle: 'Due Vite', countryCode: 'IT', semifinal: 2 },
    { country: 'France', artistName: 'Slimane', songTitle: 'Évidemment', countryCode: 'FR', semifinal: null },
    { country: 'Germany', artistName: 'Lord of the Lost', songTitle: 'Blood & Gold', countryCode: 'DE', semifinal: null },
    { country: 'Spain', artistName: 'Nebulossa', songTitle: 'Zorra', countryCode: 'ES', semifinal: null },
    { country: 'Netherlands', artistName: 'Joost Klein', songTitle: 'Europapa', countryCode: 'NL', semifinal: 1 },
    { country: 'Ukraine', artistName: 'Jerry Heil', songTitle: 'Heart of Steel', countryCode: 'UA', semifinal: 1 },
    { country: 'Poland', artistName: 'Luna', songTitle: 'The Tower', countryCode: 'PL', semifinal: 2 },
    { country: 'Greece', artistName: 'Marina Satti', songTitle: 'Ela', countryCode: 'GR', semifinal: 2 },
    { country: 'Portugal', artistName: 'iolanda', songTitle: 'Ai Coração', countryCode: 'PT', semifinal: 1 },
    { country: 'Norway', artistName: 'Alessandra', songTitle: 'Queen of Kings', countryCode: 'NO', semifinal: 2 },
    { country: 'Switzerland', artistName: 'Remo Forrer', songTitle: 'Halo', countryCode: 'CH', semifinal: 1 },
  ];

  try {
    await Performer.bulkCreate(performers);
    console.log(`✅ Seeded ${performers.length} performers`);
  } catch (error) {
    console.error('❌ Error seeding performers:', error);
  }
};

module.exports = { initializeDatabase };
