# JSON Ordering Tool

A web application for reordering JSON object keys and restructuring JSON hierarchies with an intuitive drag-and-drop interface.

## Features

- 📁 **JSON Import**: Upload files or paste JSON directly
- 🌳 **Tree Visualization**: Expandable/collapsible JSON tree structure
- 🔄 **Drag & Drop**: Reorder keys and move them between parent/child relationships
- 📤 **Export**: Download modified JSON files
- ✅ **Validation**: Real-time JSON syntax checking
- 🔍 **Search**: Find specific keys in large JSON structures
- 📱 **Responsive**: Works on desktop and mobile devices

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/edmondmiu/json-ordering-tool.git
cd json-ordering-tool

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/
│   ├── globals.css          # Global styles
│   ├── layout.tsx           # Root layout
│   └── page.tsx            # Main application page
├── components/
│   ├── ui/                 # Reusable UI components
│   ├── JsonEditor/         # Main JSON editing interface
│   ├── JsonTree/           # Tree visualization components
│   ├── FileUpload/         # File handling components
│   └── Export/             # Export functionality
├── hooks/                  # Custom React hooks
├── lib/                    # Utility functions
├── types/                  # TypeScript type definitions
└── utils/                  # Helper functions
```

## Technology Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Drag & Drop**: @dnd-kit
- **Icons**: Lucide React
- **Deployment**: Firebase Hosting

## Development

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
npm run type     # Run TypeScript type checking
```

### Code Style

- Use TypeScript for all components
- Follow React functional component patterns
- Use Tailwind CSS for styling
- Maintain modular component structure

## Deployment

### Automatic Deployment
This project is configured for automatic deployment to Firebase Hosting via GitHub Actions:

- **Production**: Deploys automatically when code is pushed to `main` branch
- **Preview**: Creates preview deployments for pull requests

### Manual Deployment
To deploy manually:

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Deploy
npm run deploy
```

### Live URL
🌐 **Live Demo**: [https://json-ordering-tool.web.app](https://json-ordering-tool.web.app)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.