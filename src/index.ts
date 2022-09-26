import { Bot } from '#structures/bot';
import 'dotenv/config';

const { token } = process.env

new Bot(token!);
