import 'dotenv/config';
import Bot from './structures/bot';

const { token } = process.env;
const client = new Bot(token!);
