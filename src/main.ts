import { config } from 'dotenv';

config();

/* eslint-disable import/first */

import KatarinaClient from './bot/client/KatarinaClient';
import * as _config from './util/config';

const client: KatarinaClient = new KatarinaClient(_config);
client._init();
