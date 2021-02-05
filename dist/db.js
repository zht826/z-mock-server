"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var node_json_db_1 = require("node-json-db");
var JsonDBConfig_1 = require("node-json-db/dist/lib/JsonDBConfig");
exports.default = (function (separator) { return new node_json_db_1.JsonDB(new JsonDBConfig_1.Config('./.db/myDataBase', true, false, separator || '/')); });
