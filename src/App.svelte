<script>
  import IoIosArrowDown from 'svelte-icons/io/IoIosArrowDown.svelte';
  import IoIosTrash from 'svelte-icons/io/IoIosTrash.svelte';
  import IoIosSettings from 'svelte-icons/io/IoIosSettings.svelte';
  import {
    Container,
    Button,
    Col,
    Row,
    ListGroup,
    ListGroupItem,
    Badge,
    Alert,
    Collapse,
    UncontrolledCollapse,
    Card,
    Table,
  } from 'sveltestrap';
  import { createEventDispatcher, onMount } from 'svelte';
  import moment from 'moment';
  moment.locale();
  export let name;
  export let messages = [];
  let msg;
  let isSettingsOpen = true;
  let clientId = 'monitor_';
  if (DEVICE_ID) {
    clientId += DEVICE_ID;
  }
  clientId += '_' + Math.floor(Math.random() * 10000);
  let connected = false;
  const dispatch = createEventDispatcher();
  const date_format = DATE_FORMAT;
  const mqtt_options = {
    clientId: clientId,
    servers: [
      {
        host: MQTT_HOST,
        port: Number(MQTT_PORT),
        protocol: MQTT_PROTOCOL,
      },
    ],
    path: '/' + MQTT_PATH,
    protocolId: 'MQTT',
    protocolVersion: 4,
    clean: true,
    reconnectPeriod: 1000,
    connectTimeout: 30 * 1000,
    rejectUnauthorized: false,
  };
  if (MQTT_USERNAME) {
    mqtt_options.username = MQTT_USERNAME;
    mqtt_options.password = MQTT_PASSWORD;
  }
  const url = `${mqtt_options.servers[0].protocol}://${mqtt_options.servers[0].host}:${mqtt_options.servers[0].port}${mqtt_options.path}`;
  const onConnect = () => {
    console.log(`MQTT connected ${url}`);
    connected = client.connected;
    const topic = MQTT_SUBSCRIBE_TOPIC;
    client.subscribe(topic, function (err) {
      if (err) {
        console.error(err);
        // client.publish('presence', 'Hello mqtt')
      } else {
        console.log(`MQTT subscribed on topic '${topic}'`);
      }
    });
  };

  const addMessage = (topic, msg, time) => {
    if (messages.length > Number(MQTT_MAX_MESSAGES)) {
      messages = messages.slice(0);
    }
    messages = [
      ...messages,
      { topic, msg, time, colored: syntaxHighlight(msg), closed: true },
    ];
    messages.sort(function (a, b) {
      a.closed = true;
      if (a.time > b.time) {
        return -1;
      }
      if (a.time < b.time) {
        return 1;
      }
      return 0;
    });
  };

  const onMessage = (topic, message) => {
    const msg = message.toString();
    const time = new Date().getTime();
    addMessage(topic, msg, time);
    // client.end();
  };

  export const client = mqtt.connect(mqtt_options);
  client.on('connect', onConnect);
  client.on('message', onMessage);
  client.on('error', (err) => {
    console.log('MQTT', err);
    client.end();
    connected = client.connected;
  });
  client.on('close', () => {
    console.log('MQTT ' + clientId + ' disconnected');
    connected = client.connected;
  });

  // https://stackoverflow.com/questions/4810841/pretty-print-json-using-javascript
  const syntaxHighlight = (json) => {
    try {
      json = JSON.stringify(JSON.parse(json), null, 4);
    } catch (e) {
      return json;
    }
    json = json
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    json = json.replace(
      /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
      function (match) {
        var cls = 'number';
        if (/^"/.test(match)) {
          if (/:$/.test(match)) {
            cls = 'key';
          } else {
            cls = 'string';
          }
        } else if (/true|false/.test(match)) {
          cls = 'boolean';
        } else if (/null/.test(match)) {
          cls = 'null';
        }
        return '<span class="' + cls + '">' + match + '</span>';
      }
    );
    return json;
  };
  const toggle = (i) => {
    messages[i].closed = !messages[i].closed;
    messages = messages;
  };
  const trash = () => {
    console.log('MQTT messages list cleared.');
    messages = [];
  };
  const settings = () => {
    isSettingsOpen = !isSettingsOpen;
  };
</script>

<style>
  .navbar-brand {
    text-transform: uppercase;
    font-weight: 100;
  }

  .logo {
    height: 4vh;
    width: 4vh;
  }
  .clear-fix {
    clear: both;
  }
  h3 {
    font-size: 2rem;
  }
  .small {
    font-size: 60%;
    padding-left: 0;
  }
  .topic {
    word-wrap: break-word;
  }
  .item {
    padding-top: 0.5rem;
  }
  .start,
  .end {
    width: 20%;
  }
  .url {
    width: 60%;
  }
  .end {
    flex-direction: row-reverse;
  }
  .icon {
    width: 2.5rem;
    display: inline-flex;
  }
  @media screen and (max-width: 480px) {
    h4,
    .navbar-brand {
      font-size: 1rem;
    }
    .url {
      font-size: 80%;
    }
  }

  .table thead th {
    font-size: 110%;
  }
  pre {
    margin-top: 0;
    margin-bottom: 0;
  }
  .card-body {
    padding: 1rem;
  }
</style>

<nav class="navbar navbar-light bg-light">
  <span class="navbar-brand">
    <img
      class="logo d-inline-block align-top"
      src="images/logo.svg"
      alt="Svelte" />
    Svelte
  </span>
  <h4 class="text-center pt-1 text-dark">{name}</h4>
  <div class="form-inline">
    <Badge color={connected ? 'success' : 'danger'}>
      MQTT {connected ? 'connected' : 'disconnected'}
    </Badge>
  </div>
</nav>

<Container class="text-center">
  <div class="nav">
    <div class="start pt-2 pb-2 justify-content-start text-left">
      <div class="icon">
        <Button
          class="icon"
          clear
          color="info"
          size="sm"
          id="settings"
          on:click={() => settings()}>
          <IoIosSettings />
        </Button>
      </div>
    </div>
    <div class="url pt-2 text-center text-muted">{url}</div>
    <div class="end pt-2 pb-2 justify-content-end text-right">
      <div class="icon">
        <Button
          class="icon"
          clear
          disabled={messages.length === 0}
          color="info"
          size="sm"
          id="trash"
          on:click={() => trash()}>
          <IoIosTrash />
        </Button>
      </div>
    </div>
  </div>
  <UncontrolledCollapse toggler="#settings">
    <Card body class="mt-2 mb-2">
      <Table hover>
        <thead>
          <tr>
            <th class="text-info">Enviroment variable</th>
            <th class="text-info">Value</th>
          </tr>
        </thead>
        <tbody class="text-left">
          <tr>
            <td>DEVICE ID</td>
            <td>{DEVICE_ID}</td>
          </tr>
          <tr>
            <td>MQTT PROTOCOL</td>
            <td>{MQTT_PROTOCOL}</td>
          </tr>
          <tr>
            <td>MQTT HOST</td>
            <td>{MQTT_HOST}</td>
          </tr>
          <tr>
            <td>MQTT PORT</td>
            <td>{MQTT_PORT}</td>
          </tr>
          <tr>
            <td>MQTT USERNAME</td>
            <td>{MQTT_USERNAME}</td>
          </tr>
          <tr>
            <td>MQTT PASSWORD</td>
            <td>******</td>
          </tr>
          <tr>
            <td>MQTT PATH</td>
            <td>{MQTT_PATH}</td>
          </tr>
          <tr>
            <td>MQTT SUBSCRIBE TOPIC</td>
            <td>{MQTT_SUBSCRIBE_TOPIC}</td>
          </tr>
          <tr>
            <td>MQTT MAX MESSAGES</td>
            <td>{MQTT_MAX_MESSAGES}</td>
          </tr>
          <tr>
            <td>DATE FORMAT</td>
            <td>{date_format}</td>
          </tr>
        </tbody>
      </Table>
    </Card>
  </UncontrolledCollapse>
  {#if messages.length === 0 && connected}
    <ListGroupItem>Waiting for messages...</ListGroupItem>
  {/if}
  {#if !connected}
    <Alert color="danger">
      Client disconnected, messages will not be received.
    </Alert>
  {/if}
  {#each messages as message, i}
    <Row class="mt-2">
      <Col xs="2" sm="1" class="text-left">
        <div class="icon">
          <Button
            outline
            color="info"
            size="sm"
            id="toggler{i}"
            on:click={() => toggle(i)}>
            <IoIosArrowDown />
          </Button>
        </div>
      </Col>
      <Col xs="5" sm="2" class="small text-muted">
        {moment(message.time).format(date_format)}
      </Col>
      <Col xs="5" sm="3" class="small text-muted">
        {moment(message.time).fromNow()}
      </Col>
      <Col xs="auto" class="topic text-info">{message.topic}</Col>
    </Row>
    <UncontrolledCollapse toggler="#toggler{i}">
      <Row class="mt-2 mb-2">
        <Col>
          <Card body class="text-left">
            <pre>
              {@html message.colored}
            </pre>
          </Card>
        </Col>
      </Row>
    </UncontrolledCollapse>
  {/each}
</Container>
