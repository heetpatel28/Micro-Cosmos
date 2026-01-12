# Microservice Generator Developer Portal

A futuristic, production-grade dashboard UI for a Microservice Generator Developer Portal. Built with React, TypeScript, Tailwind CSS, and Framer Motion.

## 🎨 Features

- **Dark Futuristic Theme**: Glassmorphism panels with neon accents (blue/cyan/purple)
- **3D Interactive Effects**: Hover tilts and depth on glass cards
- **Animated Step Rail**: Vertical progress indicator with glowing active states
- **Live Terminal Logs**: Real-time system logs with typewriter animations
- **Smooth Transitions**: Framer Motion powered animations throughout
- **Responsive Design**: Works on desktop and tablet devices

## 🚀 Quick Start

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The dashboard will be available at `http://localhost:5173`

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## 📁 Project Structure

```
src/
├── components/
│   ├── workspace/
│   │   └── StepPanels.tsx      # Dynamic step panels
│   ├── ActionBar.tsx            # Bottom action bar with generate/download
│   ├── Dashboard.tsx            # Main dashboard component
│   ├── GlassCard.tsx            # 3D glass card with hover effects
│   ├── LogsTerminal.tsx         # Terminal-style log viewer
│   ├── StatusBar.tsx            # Top status bar
│   └── StepRail.tsx             # Animated vertical step indicator
├── App.tsx                      # Root app component
├── main.tsx                     # Entry point
└── index.css                    # Global styles and Tailwind imports
```

## 🎯 Usage

1. **Select Microservice**: Choose the type of microservice (API, GraphQL, Worker, etc.)
2. **Choose Stack**: Select your preferred technology stack
3. **Pick Language**: Select the core programming language
4. **Select Component**: Choose the main component type
5. **Choose Version**: Select the version specification
6. **Generate**: Click "Generate Code" to create the microservice
7. **Download**: Once complete, download the generated ZIP file

## 🎨 Design Philosophy

The dashboard is designed to feel like a **DevOps Command Center** rather than a traditional form-based interface. Every interaction is animated, providing visual feedback and making the system feel "alive."

### Key Design Elements

- **Glassmorphism**: Frosted glass panels with subtle borders
- **Neon Accents**: Cyan, blue, and purple glowing elements
- **3D Depth**: Perspective transforms and hover effects
- **Process Visualization**: Step-by-step workflow with progress indicators
- **Live Feedback**: Terminal logs showing system activity

## 🛠️ Tech Stack

- **React 18**: UI framework
- **TypeScript**: Type safety
- **Tailwind CSS**: Utility-first styling
- **Framer Motion**: Animation library
- **Lucide React**: Icon library
- **Vite**: Build tool and dev server

## 📝 Notes

- All data is currently mocked for demonstration purposes
- The generation process simulates real workflow steps
- Logs are displayed in real-time with typewriter effects
- The UI is fully responsive and works on modern browsers

