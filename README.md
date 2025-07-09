# Leaderboard App

A full-stack leaderboard application built with React, Express, and Node.js.

## Features

- View all scores in descending order
- Submit new scores
- Real-time updates

## Local Development

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   cd client && npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. The app will be available at `http://localhost:3000`

## Testing

Run tests with:
```bash
npm test
```

## Deployment

This app is configured for deployment to Netlify. To deploy:

1. Push your code to a GitHub repository
2. Connect the repository to Netlify
3. Set the following build settings in Netlify:
   - Build command: `npm run build`
   - Publish directory: `client/dist`
4. Deploy!

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
NODE_ENV=development
PORT=3000
```

## License

ISC
