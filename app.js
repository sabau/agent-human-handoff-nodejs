// Copyright 2017, Google, Inc.
// Licensed under the Apache License, Version 2.0 (the 'License');
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an 'AS IS' BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

// Load third party dependencies
const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

// Load our custom classes
const CustomerStore = require('./customerStore.js');
const MessageRouter = require('./messageRouter.js');

process.env.APIAI_ACCESS_TOKEN = process.env.APIAI_ACCESS_TOKEN || '90367979439c4d6288c2ecc38284e77f';
// Load and instantiate the API.AI client library
const ApiAi = require('apiai');
const apiAiApp = ApiAi(process.env.APIAI_ACCESS_TOKEN);

// Instantiate our app
const customerStore = new CustomerStore();
const messageRouter = new MessageRouter(customerStore, apiAiApp, io.of('/customer'), io.of('/operator'));

// Serve static html files for the customer and operator clients
app.get('/customer', (req, res) => {
  res.sendFile(`${__dirname}/static/customer.html`);
});

app.get('/operator', (req, res) => {
  res.sendFile(`${__dirname}/static/operator.html`);
});

// Begin responding to websocket and http requests
messageRouter.handleConnections();
http.listen(3003, () => {
  console.log('Listening on *:3003');
});
