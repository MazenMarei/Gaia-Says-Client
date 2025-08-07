# Gaia Says - Dependencies Installation Guide

## Required Dependencies

To fully set up the Gaia Says game with all features, you'll need to install the following packages:

### Core Dependencies

```bash
npm install mongoose next-auth framer-motion
```

### Individual Package Installation

1. **MongoDB Integration:**

```bash
npm install mongoose
npm install @types/mongoose
```

2. **Authentication (NextAuth.js):**

```bash
npm install next-auth
npm install @next-auth/prisma-adapter  # Optional, for Prisma
```

3. **Animations (Framer Motion):**

```bash
npm install framer-motion
```

4. **Discord OAuth Provider:**

```bash
npm install next-auth
# Discord provider is included with next-auth
```

### Development Dependencies

```bash
npm install --save-dev @types/node
```

## Environment Variables Setup

Create a `.env.local` file in the root directory:

```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/gaia-says

# NextAuth.js
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-super-secret-key-here

# Discord OAuth
DISCORD_CLIENT_ID=your-discord-client-id
DISCORD_CLIENT_SECRET=your-discord-client-secret
```

## Complete Installation Command

For a fresh installation with all dependencies:

```bash
npm install mongoose next-auth framer-motion @types/mongoose
```

## Notes

- The current version uses placeholder mock functions for development
- MongoDB and Discord OAuth are optional for basic gameplay
- Framer Motion enhances animations but CSS fallbacks are provided
- All core game functionality works without external dependencies

## Troubleshooting

If you encounter issues:

1. **TypeScript Errors:** Make sure all type definitions are installed
2. **MongoDB Connection:** Verify MongoDB is running and connection string is correct
3. **Discord OAuth:** Check Discord app settings and redirect URIs
4. **Build Issues:** Try deleting `node_modules` and running `npm install` again

## Alternative Setup (Minimal)

For a minimal setup without external dependencies, the game will run with:

- Basic CSS animations instead of Framer Motion
- Mock authentication instead of Discord OAuth
- Local storage instead of MongoDB

The core game functionality remains fully operational in this minimal setup.
