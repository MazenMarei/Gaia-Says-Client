# Gaia Says - Space Memory Challenge 🚀

A space-themed Simon Says game built with Next.js, TypeScript, and Tailwind CSS. Test your memory by following sequences of planets in our solar system!

## 🌟 Features

- **Space Theme**: Beautiful solar system with 8 planets orbiting around a central star
- **Responsive Design**: Optimized for both desktop and mobile devices
- **OOP Architecture**: Built using Object-Oriented Programming and SOLID principles
- **Discord Authentication**: Login with Discord OAuth2 (when backend is set up)
- **Score Tracking**: Track current score, highest score, and game statistics
- **Smooth Animations**: CSS transitions and animations for engaging gameplay
- **Timer System**: Each level has a countdown timer that decreases as you progress
- **Progressive Difficulty**: More planets added to sequence each level

## 🎮 How to Play

1. Click "Start Game" to begin
2. Watch the sequence of planets light up
3. Click the planets in the same order they were shown
4. Complete the sequence to advance to the next level
5. Each level adds one more planet to the sequence
6. The timer gets shorter as levels increase
7. Game ends when you click wrong or time runs out

## 🏗️ Architecture

The game follows SOLID principles with a clean separation of concerns:

### Core Classes

- **GameEngine**: Main game logic coordinator
- **Planet**: Individual planet representation with animations
- **GameTimer**: Handles countdown timing
- **ScoreManager**: Manages scoring and persistence
- **GameSettings**: Configuration management

### Interfaces

- **IGameState**: Game state structure
- **IGameEngine**: Game engine contract
- **IPlanet**: Planet behavior interface
- **ITimer**: Timer functionality interface

## 📁 Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── api/               # API routes for backend
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Main page
├── components/            # React components
│   ├── Game.tsx          # Main game component
│   ├── GameUI.tsx        # Game interface
│   ├── Header.tsx        # Header with logo and auth
│   └── PlanetComponent.tsx # Planet rendering
├── game/                  # Game logic (OOP)
│   ├── interfaces.ts     # TypeScript interfaces
│   ├── GameEngine.ts     # Main game engine
│   ├── GameManagers.ts   # Score, timer managers
│   └── Planet.ts         # Planet class
├── lib/                   # Utilities
│   └── mongodb.ts        # Database connection
└── models/               # Database models
    └── Player.ts         # Player/GameSession models
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- MongoDB (for full backend functionality)

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd gaia-says-final
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Set up environment variables:
   Create a `.env.local` file:

```bash
# MongoDB (optional for development)
MONGODB_URI=mongodb://localhost:27017/gaia-says

# NextAuth.js (for Discord OAuth)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-super-secret-key-here

# Discord OAuth (optional)
DISCORD_CLIENT_ID=your-discord-client-id
DISCORD_CLIENT_SECRET=your-discord-client-secret
```

4. Run the development server:

```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🎨 Customization

### Adding More Planets

To add more planets, update the `GameSettings` class:

```typescript
export class GameSettings implements IGameSettings {
  public readonly planetCount = 10; // Increase from 8 to 10
  // ... other settings
}
```

Then add corresponding planet images to `public/assets/images/` named `image-9.webp`, `image-10.webp`, etc.

### Adjusting Difficulty

Modify the `GameSettings` class:

```typescript
export class GameSettings implements IGameSettings {
  public readonly baseTime = 45; // Starting time in seconds
  public readonly timeDecrement = 3; // Time reduced per level
  public readonly pointsPerLevel = 150; // Points awarded per level
  // ...
}
```

### Styling

The game uses Tailwind CSS. Main style files:

- `src/app/globals.css` - Global styles and animations
- Component-level styles in each `.tsx` file

## 🔧 Backend Setup (Optional)

### MongoDB Setup

1. Install MongoDB locally or use MongoDB Atlas
2. Update `MONGODB_URI` in `.env.local`
3. Install required packages:

```bash
npm install mongoose next-auth
```

### Discord OAuth Setup

1. Create a Discord application at [Discord Developer Portal](https://discord.com/developers/applications)
2. Add OAuth2 redirect URI: `http://localhost:3000/api/auth/callback/discord`
3. Copy Client ID and Client Secret to `.env.local`

## 📱 Mobile Optimization

The game is fully responsive and optimized for mobile:

- Touch-friendly planet sizes
- Responsive layout adjustments
- Mobile-specific animations
- Optimized asset loading

## 🧪 Testing

The game includes built-in development features:

- Console logging for debugging
- Mock authentication for development
- Placeholder images for immediate testing

## 🎯 Future Enhancements

- [ ] Add sound effects and background music
- [ ] Implement power-ups and special abilities
- [ ] Add multiplayer functionality
- [ ] Create achievement system
- [ ] Add different game modes (speed mode, endless mode)
- [ ] Implement global leaderboards
- [ ] Add planet information and educational content

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 🐛 Bug Reports

If you find a bug, please open an issue with:

- Description of the bug
- Steps to reproduce
- Expected behavior
- Screenshots (if applicable)

---

**Enjoy playing Gaia Says! 🌌✨**
