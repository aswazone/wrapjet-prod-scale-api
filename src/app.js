import express from 'express';
import 'dotenv/config';

const app = express();

app.get('/', (req, res) => {
  console.log(process.env.DATABASE_URL,'DATABASE_URL');
  res.status(200).send('Hello from WrapJet-Prod-Scale-API ✨');
});

export default app;
