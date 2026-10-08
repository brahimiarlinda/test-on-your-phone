# Test on your phone

A tiny sample project that shows how to open a site running on your laptop **on your real phone**, using nothing but your home Wi-Fi. No deploy, no test server, no extra tools.

It has zero dependencies. If you have Node.js, it runs.

## Why this exists

The "mobile view" in your browser's DevTools is only a simulation. A real phone shows you what it misses: how touch feels, what the keyboard covers, how iOS Safari actually behaves.

This project is a working example you can run in two minutes, then copy the idea into your own project.

## Quick start

You need [Node.js](https://nodejs.org) 18 or newer, a phone, and one Wi-Fi network that both devices are on.

```bash
git clone https://github.com/<your-username>/test-on-your-phone.git
cd test-on-your-phone
npm start
```

The terminal prints two addresses:

```
  Server is running.

  On this computer:  http://localhost:3000
  On your phone:     http://192.168.1.23:3000

  Phone and computer must be on the same Wi-Fi.
```

Type the **"On your phone"** address into your phone's browser. Your number will be different. Include `http://` and the `:3000` at the end.

On the page you will see:

1. **This device:** screen size, viewport, touch support. Proof the page runs on the phone.
2. **Talk to the laptop:** a button that calls a small API. The laptop's terminal logs each call, with the phone's address.
3. **Try the phone things:** inputs that open different keyboards, and a tiny vs. a properly sized tap target.

## How it works, in plain words

- Your **Wi-Fi router** gives every device on your network its own address, like `192.168.1.23`. That's the **IP address**.
- **`localhost`** means "this device itself". On the laptop it means the laptop. On the phone it means the phone. That's why `localhost` doesn't work on the phone.
- The number after the colon, like `:3000`, is the **port**. Think of it as a door number: it tells the laptop which program should answer.
- By default, many dev servers only listen to the laptop itself. This one listens to the whole network. That one line is the whole trick, in [`server.js`](server.js):

```js
const HOST = "0.0.0.0"; // accept visitors from any device on the network
server.listen(PORT, HOST);
```

Try changing it to `"127.0.0.1"` and restart. The laptop still works, the phone can't connect anymore.

## Do the same in your own project

| Tool | Command |
| --- | --- |
| Vite (React, Vue, Svelte) | `npm run dev -- --host` |
| Next.js | `npx next dev -H 0.0.0.0` |
| Angular | `ng serve --host 0.0.0.0` |
| Create React App | `npm start` (works by default) |
| Plain HTML files | `python3 -m http.server 8000` (works by default) |

Most of these print a **Network** address you can type straight into your phone.

### Don't hard-code `localhost` in your frontend

If your page calls an API at `http://localhost:3000/api`, it works on the laptop and breaks on the phone. Use a relative URL (`/api/hello`) like [`public/app.js`](public/app.js) does, or set the API address from an environment variable.

## Find your laptop's address yourself

If your tool doesn't print it:

- **Mac:** System Settings → Wi-Fi → Details → IP address, or run `ipconfig getifaddr en0`
- **Windows:** run `ipconfig` and look for **IPv4 Address** under "Wireless LAN adapter Wi-Fi"
- **Linux:** run `hostname -I` and take the first number

## If the phone can't connect

| Problem | Fix |
| --- | --- |
| Phone is on mobile data, guest Wi-Fi, or another network | Connect it to exactly the same Wi-Fi as the laptop. |
| You clicked "Deny" on the firewall prompt | Mac: System Settings → Network → Firewall. Windows: allow Node.js on **private** networks. |
| Windows marks your Wi-Fi as "Public" | Change the network profile to **Private**. |
| You typed `https://` or forgot the port | Use `http://` and the full `:3000`. |
| It worked yesterday, not today | The laptop's address can change. Restart `npm start` and use the new one. |
| A VPN is on | Turn it off while testing. |
| Office, hotel or café Wi-Fi | These often block devices from seeing each other. Use home Wi-Fi or a phone hotspot. |
| Port 3000 is busy | `PORT=3001 npm start` (Windows PowerShell: `$env:PORT=3001; npm start`) |

## Debug the phone's console

- **iPhone:** on the phone, Settings → Safari → Advanced → turn on Web Inspector. Connect it to a Mac by cable, then use Safari's **Develop** menu.
- **Android:** turn on USB debugging, connect by cable, and open `chrome://inspect` in desktop Chrome.

## Safety

While the server listens on `0.0.0.0`, anyone on the same Wi-Fi can open it. That's fine at home. Don't do it on public Wi-Fi, and stop the server (`Ctrl+C`) when you're done.

## Project structure

```
test-on-your-phone/
├── server.js          # zero-dependency Node server, listens on the network
├── package.json       # "npm start" runs server.js
└── public/
    ├── index.html     # the test page
    ├── app.js         # device info, API call, interaction checks
    └── style.css      # mobile-first styles, light and dark
```

## License

[MIT](LICENSE)
