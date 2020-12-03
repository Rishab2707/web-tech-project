require('dotenv').config();
const mongoose = require('mongoose');

mongoose.set('debug', true);
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/mydb');

const db = require('./models');

const users = [
  { username: 'username', password: 'password' },
  { username: 'rishab', password: 'rishab' },
  { username: 'pranav', password: 'pranav' },
  { username: 'raghavendra', password: 'raghavendra' }
];

const polls = [
  { question: 'Better Movie', options: ['Avengers:Endgame', 'Titanic', 'Avatar']  },
  { question: 'Best Programming language', options: ['Python', 'Java','C++','JavaScript'] },
  { question: 'Who is the best Marvel Character', options: ['SpiderMan', 'Deadpool','IronMan'] },
  { question: 'Best IPL Team', options: ['RCB', 'CSK','MI','KXIP'] },
  { question: 'Will Modi win the next General Election ?', options: ['Yes', 'No'] },
];

const seed = async () => {
  try {
    await db.User.remove();
    console.log('DROP ALL USERS');

    await db.Poll.remove();
    console.log('DROP ALL POLLS');

    await Promise.all(
      users.map(async user => {
        const data = await db.User.create(user);
        await data.save();
      }),
    );
    console.log('CREATED USERS', JSON.stringify(users));

    await Promise.all(
      polls.map(async poll => {
        poll.options = poll.options.map(option => ({ option, votes: 0 }));
        const data = await db.Poll.create(poll);
        const user = await db.User.findOne({ username: 'username' });
        data.user = user;
        user.polls.push(data._id);
        await user.save();
        await data.save();
      }),
    );
    console.log('CREATED POLLS', JSON.stringify(polls));
  } catch (err) {
    console.error(err);
  }
};

seed();
