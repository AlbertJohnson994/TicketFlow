import { sequelize } from '../src/config/database.js';
import { Event } from '../src/models/Event.js';
import { Sale } from '../src/models/Sale.js';

async function seed() {
  await sequelize.sync({ force: true });
  const ev = await Event.create({
    description: 'Show de Teste',
    type: 1,
    date: new Date(Date.now() + 1000*60*60*24*7),
    startSales: new Date(),
    endSales: new Date(Date.now() + 1000*60*60*24*6),
    price: 120.5
  });
  await Sale.create({
    user_id: '00000000-0000-0000-0000-000000000001',
    event_id: ev.id,
    saleStatus: 1
  });
  console.log('Seed complete');
  process.exit(0);
}

seed().catch(e => { console.error(e); process.exit(1); });
