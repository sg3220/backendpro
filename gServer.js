import mongooseModule from 'mongoose';
import dotenvModule from 'dotenv';
import { gApp } from './gApp.js';

gApp.get('/', (gReq, gRes) => {
  gRes.send('<h1>Hello</h1>');
});
gApp.route('/Users').get((gReq, gRes, gNext) => {
  gRes.status(200).json({
    users: [],
    success: false,
  });
});

dotenvModule.config({ path: './Data/Configuration.env' });

const databaseLink = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);

mongooseModule
  .connect(databaseLink, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('cL: gServer.js, 🎆: Database Connection Successfull!!!');
  });

process.on('uncaughtException', error => {
  console.log('eL: gServer.js, 💥: Uncaught-Exception, Shutting-Down!!!');
  console.log(error.name, error.message);
  process.exit(1);
});

process.on('unhandledRejection', error => {
  console.log('eL: gServer.js, 💥: Uncaught-Rejection, Shutting-Down!!!');
  console.log(error.name, error.message);
  gServer.close(() => {
    process.exit(1);
  });
  process.exit(1);
});

const portNumber = process.env.PORT || 3000;

const gServer = gApp.listen(portNumber, () => {
  console.log(`cL: gServer.js, 🎆: App Running On Port ${portNumber}...`);
});
