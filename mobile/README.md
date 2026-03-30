# Tour Guide Mobile

React Native project (Expo + TypeScript) to support guides during live tour operations.

## Features in the starter app

- Live tour status card (route, bus, traveler count)
- Operation timeline with event status (done, live, upcoming)
- Quick action panel for coordination tasks
- Traveler watchlist with check-in visibility

## Run locally

```bash
npm install
npm run start
```

Then open with Expo Go on mobile, or run:

```bash
npm run android
npm run ios
npm run web
```

## Suggested next steps

1. Add React Navigation and split each section into dedicated screens.
2. Connect to backend APIs for real-time tour data.
3. Add role-based auth for lead guide and assistant guide.
4. Add offline mode for unstable network areas.
