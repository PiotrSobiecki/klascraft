import { Hono } from 'hono';
const app = new Hono();
app.get('/api/health', (c) => c.json({ status: 'ok', app: 'KlasCraft' }));
// Public, fictional demo data only. Real class data must require a verified session
// and server-side membership/role checks before D1 or R2 is connected.
app.get('/api/demo/announcements', (c) => c.json([
  { id: 1, category: 'WYCIECZKA', date: '8 września', title: 'Mała wyprawa, wielka przygoda!', text: '25 września ruszamy do Centrum Nauki Kopernik. Zbiórka o 8:15 przed szkołą. Pamiętajcie o wygodnych butach i drugim śniadaniu.', author: 'Anna Kowalska', role: 'Wychowawczyni', icon: 'trip' },
  { id: 2, category: 'WAŻNE', date: '7 września', title: 'Pierwsze zebranie w nowym roku', text: 'Spotykamy się 15 września o 17:00 w sali 24. Porozmawiamy o planach klasy na ten semestr. Do zobaczenia!', author: 'Anna Kowalska', role: 'Wychowawczyni', icon: 'meeting' }
]));
app.all('/api/*', (c) => c.json({ error: 'Nie znaleziono endpointu.' }, 404));
export default app;
