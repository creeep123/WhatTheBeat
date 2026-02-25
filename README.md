# WhatTheBeat - Hip-Hop Style Analyzer

A modern web application for analyzing Hip-Hop beats, built with Next.js 14, TypeScript, and Tailwind CSS.

## Features

- 🎵 Beat upload and analysis
- 🎚️ BPM detection
- 🎤 Style classification
- 📊 Pattern analysis
- 🎨 Modern, responsive UI with Hip-Hop aesthetic

## Tech Stack

- **Framework:** Next.js 14 with App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **React:** 18+

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/whatthebeat.git
cd whatthebeat
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
WhatTheBeat/
├── app/                # App router pages and layouts
│   ├── layout.tsx     # Root layout
│   ├── page.tsx       # Home page
│   └── globals.css    # Global styles
├── components/        # React components
│   └── BeatUploader.tsx
├── public/           # Static assets
├── tailwind.config.ts # Tailwind configuration
├── tsconfig.json     # TypeScript configuration
└── package.json      # Project dependencies
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Future Enhancements

- [ ] Audio waveform visualization
- [ ] Real-time BPM detection
- [ ] Machine learning-based style classification
- [ ] Beat pattern breakdown
- [ ] Sample library integration
- [ ] Export analyzed data

## License

MIT

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.
