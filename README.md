![GitHub last commit](https://img.shields.io/github/last-commit/4refr0nt/svelte-mqtt-monitor)
# Svelte MQTT Monitor

![Svelte MQTT Monitor](https://raw.githubusercontent.com/4refr0nt/svelte-mqtt-monitor/master/image.png)

## Demos

[https://svelte-mqtt-monitor.vercel.app](https://svelte-mqtt-monitor.vercel.app/)

## Get started

### Requiring

- [Node.JS](https://nodejs.org/) installed (not required for docker install)
- MQTT broker with [enabled  MQTT over WebSockets or MQTT over WebSockets Secure](https://www.google.com/webhp?newwindow=1&q=mqtt+over+websockets) (ws or wss)

### Development

```bash
git clone https://github.com/4refr0nt/svelte-mqtt-monitor.git
cd svelte-mqtt-monitor
npm i
cp .env.sample .env
```
…then edit .env - broker settigs

```bash
nano .env
```
and run app

```bash
npm run dev
```

...then open browser link [http://localhost:5000](http://localhost:5000)

### docker install

```bash
git clone https://github.com/4refr0nt/svelte-mqtt-monitor.git
cd svelte-mqtt-monitor
npm i
cp .env.sample .env
```
…then edit .env - broker connection settings

```bash
nano .env
```
then run

```bash
npm run build
docker-compose up -d
```
configure `nginx` or `traefik` as reverse-proxy to `5000` port 
(see example part of config `nginx-include.conf`) or
open browser `http://address:5000`

Enjoy!

