# Home-E - A Hackathon Story

> **Built with sweat, tears, and pure determination during HetchHacks 2024**

A beautiful, customizable family management application built with Vue 3 and Electron. What started as a hackathon project is now on a journey to become a full-fledged mobile and desktop application.

![Vue.js](https://img.shields.io/badge/Vue.js-3.5-4FC08D?style=flat&logo=vue.js&logoColor=white)
![Electron](https://img.shields.io/badge/Electron-39-47848F?style=flat&logo=electron&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-blue?style=flat)

---

## The Story

### The Hackathon Journey

In the heat of HetchHacks 2025, we set out to build something meaningful—a family hub that could bring families closer together through shared organization and communication.

**The Challenge:** Build a complete family management application from scratch.

**The Stack:** Vue 3 + Electron + Vite + LocalStorage

**The Result:** A fully functional desktop app with customizable widgets, shopping lists, meal planning, activity tracking, and more—all built with modern web technologies and packaged as a native desktop application.

### The Vision

This hackathon project is just the beginning. Our goal is to evolve Family Hub into a production-ready application that can run on:
- **iOS & Android** (via Capacitor)
- **Windows, macOS & Linux** (via Electron)
- **Web** (as a PWA)

We're documenting our journey, learning from our mistakes, and building something that families will actually want to use.

---

## Features

### Dashboard
- **Customizable Widget System** - Drag-and-drop widgets with smart layout optimization
- **Multiple Widget Types** - Shopping lists, meal countdowns, todo lists, activity trackers
- **Responsive Grid Layout** - Automatically optimizes widget placement
- **Resizable Widgets** - Full-width or half-width widgets that adapt to your needs

### Shopping List
- **Grouped Items** - Organize by category or store
- **Family Collaboration** - Share lists with family members
- **Quick Add** - Fast item entry with smart suggestions

### Meal Countdown
- **Visual Timers** - Beautiful countdown displays for meal times
- **Customizable Schedules** - Set meal times for your family
- **Notifications** - Never miss a meal again

### Todo List
- **Task Management** - Organize family tasks and chores
- **Priority Levels** - Mark important tasks
- **Progress Tracking** - See what's done and what's pending

### Activity Tracker
- **Family Activities** - Track shared activities and events
- **Visual Progress** - See activity patterns over time
- **Member Assignments** - Assign activities to family members

### Profile & Settings
- **Family Members** - Manage family member profiles
- **Role Management** - Admin and member roles
- **Theme Customization** - Choose from multiple beautiful themes:
  - Default (Fresh Sky)
  - Dark Mode
  - Ocean
  - Sunset

---

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/Mykyta-G/Hackaton-HetchHacks.git
cd Hackaton-HetchHacks

# Install dependencies
npm install
```

### Development

```bash
# Start development server (Vue + Electron)
npm run dev
```

This will:
- Start the Vite dev server on `http://localhost:5173`
- Launch Electron with hot-reload enabled
- Watch for file changes automatically

### Building

```bash
# Build for production
npm run build

# Start production build
npm start
```

---

## Project Structure

```
Hackaton-HetchHacks/
├── src/
│   ├── components/          # Reusable Vue components
│   │   ├── widgets/         # Dashboard widgets
│   │   └── ShoppingList/    # Shopping list components
│   ├── views/               # Main application views
│   ├── stores/              # State management (reactive stores)
│   ├── utils/               # Utility functions
│   └── App.vue             # Root component
├── assets/                  # Static assets
├── main.js                  # Electron main process
├── preload.js              # Electron preload script
└── vite.config.js          # Vite configuration
```

---

## Tech Stack

- **Frontend Framework:** Vue 3 (Composition API)
- **Desktop Framework:** Electron 39
- **Build Tool:** Vite 7
- **State Management:** Vue Reactive Stores
- **Storage:** LocalStorage (persistent state)
- **Styling:** CSS Custom Properties (theming)

---

## Design Philosophy

Family Hub was designed with these principles in mind:

1. **Simplicity First** - Clean, intuitive interfaces that anyone can use
2. **Customization** - Every family is different; the app adapts to you
3. **Performance** - Fast, responsive, and lightweight
4. **Beauty** - Modern UI with beautiful themes and smooth animations

---

## Roadmap

### Phase 1: Hackathon MVP 
- [x] Desktop app with Electron
- [x] Dashboard with widgets
- [x] Core features (Shopping, Meals, Todos, Activities)
- [x] Theme system
- [x] LocalStorage persistence

### Phase 2: Mobile Port (In Progress) 
- [ ] Capacitor integration
- [ ] iOS app build
- [ ] Android app build
- [ ] Mobile-optimized UI
- [ ] Touch gestures

### Phase 3: Backend & Sync (Planned) 
- [ ] Cloud sync
- [ ] Real-time collaboration
- [ ] User authentication
- [ ] Multi-device support

### Phase 4: Production Ready (Future)
- [ ] App store submissions
- [ ] Performance optimization
- [ ] Comprehensive testing
- [ ] Documentation
- [ ] Community features

---

## Contributing

This project started as a hackathon project, but we're open to contributions! Whether you're fixing bugs, adding features, or improving documentation, your help is welcome.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Acknowledgments

- **HetchHacks 2024** - For the amazing hackathon experience

---

## Contact

Have questions, suggestions, or just want to say hi? Open an issue or reach out!

---

**Built with ❤️ during HetchHacks 2025**

*From hackathon prototype to production app—one commit at a time.*
