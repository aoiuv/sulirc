import { pathToRegexp } from 'path-to-regexp';

const debug = require('debug')('web');

const keys = [];
const regex = pathToRegexp('/prefix/:foo/:bar/:id', keys);

debug(keys);
debug(regex.exec('/prefix/test/route/123'));