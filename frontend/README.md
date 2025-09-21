# AI Community Forum (Frontend)

A modern, responsive, and feature-rich community forum built with React, Material-UI, and Vite. This frontend application connects to a Node.js/Express/MongoDB backend to provide a complete forum experience with user authentication, posts, comments, voting, and leaderboards.

## 🚀 Features

### Enhanced UI/UX
- **Modern Design System**: Built with a custom theme and design tokens for consistency
- **Responsive Layout**: Fully responsive design that works on all devices
- **Dark/Light Mode**: Seamless theme switching with system preference detection
- **Smooth Animations**: Micro-interactions and transitions for better user experience
- **Accessible Components**: WCAG 2.1 compliant components with proper ARIA labels
- **Optimized Performance**: Code splitting, lazy loading, and optimized assets

### Core Functionality
- **User Authentication**: Secure JWT-based authentication with registration, login, and profile management
- **Rich Content**: Create and edit posts with Markdown support and rich text formatting
- **Interactive Comments**: Nested comment threads with reply functionality
- **Voting System**: Upvote/downvote posts and comments with real-time updates
- **Gamification**: Earn reputation points for contributions and track your progress
- **Leaderboards**: Discover top contributors with various ranking metrics
- **AI-Powered Features**: Generate post drafts with AI assistance
- **Tagging System**: Categorize and discover content with tags
- **User Profiles**: Customizable profiles with avatars and bios
- **Real-time Updates**: WebSocket integration for live updates

### New Additions
- **Modern Navigation**: Sticky header with smooth scrolling and active state indicators
- **Enhanced Search**: Full-text search with filters and suggestions
- **Custom Icons**: Beautiful SVG icons and logo
- **Loading States**: Skeleton loaders for better perceived performance
- **Form Validation**: Client-side validation with helpful error messages
- **Theme Customization**: Easily customize colors, typography, and components

## 🛠️ Tech Stack

### Core Technologies
- **Frontend Framework**: React 18 with Hooks
- **Routing**: React Router 6 with data APIs
- **UI Library**: Material-UI (MUI) v5 with custom theme
- **Animation**: Framer Motion for smooth animations
- **Form Management**: Formik with Yup validation
- **Rich Text Editing**: React Quill with custom modules
- **HTTP Client**: Axios with interceptors for auth
- **State Management**: React Context API + useReducer
- **Build Tool**: Vite 4.x with HMR
- **Code Quality**: ESLint + Prettier + TypeScript
- **Testing**: Jest + React Testing Library + Cypress
- **Styling**: CSS Modules + CSS Variables
- **Icons**: Material Icons + Custom SVG
- **Date Handling**: date-fns
- **Internationalization**: i18next (ready for future localization)

### New Dependencies
- **Framer Motion**: For smooth animations and gestures
- **React Icons**: Comprehensive icon library
- **React Hot Toast**: Beautiful toast notifications
- **React Intersection Observer**: For scroll-based animations
- **React Slick**: Responsive carousel component
- **React Markdown**: For rendering markdown content
- **React Copy to Clipboard**: Easy copy functionality

## Getting Started

### Prerequisites

- Node.js 16+ (LTS recommended)
- npm 7+ or yarn 1.22+
- Backend API server (Node.js/Express/MongoDB)
- Git for version control

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/ai-forum-frontend.git
   cd ai-forum-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   ```

3. Configure environment variables:
   Create a `.env` file in the root directory with the following variables:
   ```env
   VITE_API_URL=http://localhost:5000
   VITE_APP_NAME="AI Community Forum"
   ```

4. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

```
src/
├── assets/               # Static assets (images, fonts, etc.)
├── components/           # Reusable UI components
│   ├── common/           # Common components (buttons, inputs, modals, etc.)
│   ├── layout/           # Layout components (Navbar, Footer, Sidebar)
│   ├── posts/            # Post-related components
│   ├── comments/         # Comment-related components
│   └── ui/               # Basic UI elements
├── contexts/             # React contexts (Auth, Theme, etc.)
├── hooks/                # Custom React hooks
│   ├── useAuth.js        # Authentication hook
│   ├── useForm.js        # Form handling hook
│   └── ...
├── pages/                # Page components
│   ├── Home/             # Home/Feed page
│   ├── Post/             # Single post page
│   ├── CreatePost/       # Post creation/editing
│   ├── Profile/          # User profile
│   └── ...
├── services/             # API service functions
│   ├── api.js            # Axios instance and interceptors
│   ├── auth.js           # Authentication services
│   ├── posts.js          # Post-related API calls
│   └── ...
├── styles/               # Global styles and theme
│   ├── global.css        # Global CSS
│   └── theme.js          # MUI theme configuration
├── utils/                # Utility functions
│   ├── api.js            # API utilities
│   ├── dateUtils.js      # Date formatting
│   ├── errorHandler.js   # Error handling utilities
│   ├── fileUpload.js     # File upload utilities
│   ├── storage.js        # Local/session storage utilities
│   └── validators.js     # Validation schemas
├── App.jsx               # Main application component
└── main.jsx              # Application entry point
```

## Available Scripts

In the project directory, you can run:

### `npm run dev` or `yarn dev`

Runs the app in development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

### `npm run build` or `yarn build`

Builds the app for production to the `dist` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

### `npm run preview` or `yarn preview`

Locally preview the production build. Make sure to run `build` first.

### `npm run lint` or `yarn lint`

Runs ESLint to check for code quality issues.

### `npm run format` or `yarn format`

Formats all files in the `src` directory using Prettier.

### `npm test` or `yarn test`

Launches the test runner in interactive watch mode.

## Environment Variables

The following environment variables can be set in a `.env` file in the root directory:

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `VITE_API_URL` | Backend API base URL | `http://localhost:5000` | Yes |
| `VITE_APP_NAME` | Application name | `"AI Community Forum"` | No |
| `VITE_ENABLE_ANALYTICS` | Enable analytics | `false` | No |
| `VITE_GA_TRACKING_ID` | Google Analytics ID | - | No |
| `VITE_SENTRY_DSN` | Sentry DSN for error tracking | - | No |

## Development Workflow

1. **Fork** the repository and create your feature branch
2. **Set up** the development environment
3. **Make your changes** following the code style
4. **Test** your changes
5. **Commit** your changes with a descriptive message
6. **Push** to your fork and submit a pull request

### Code Style

- Use 2 spaces for indentation
- Use single quotes for strings
- Use camelCase for variables and functions
- Use PascalCase for React components
- Always add prop types and default props
- Write meaningful commit messages

## Testing

We use Jest and React Testing Library for testing. To run tests:

```bash
npm test
# or
yarn test
```

## Deployment

### Building for Production

```bash
npm run build
```

This will create a `dist` directory with the production build.

### Deploying to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/git/external?repository-url=YOUR_REPO_URL&project-name=ai-forum&repo-name=ai-forum-frontend)

1. Push your code to a Git repository
2. Import the project to Vercel
3. Set up environment variables
4. Deploy!

## API Documentation

For detailed API documentation, please refer to the [Backend API Documentation](https://github.com/yourusername/ai-forum-backend#api-documentation).

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Contact

Your Name - [@your_twitter](https://twitter.com/your_username) - your.email@example.com

Project Link: [https://github.com/yourusername/ai-forum-frontend](https://github.com/yourusername/ai-forum-frontend)

## Acknowledgments

- [Material-UI](https://mui.com/) - For the comprehensive UI component library
- [Vite](https://vitejs.dev/) - For the lightning-fast development experience
- [React](https://reactjs.org/) - For the component-based architecture
- [Formik](https://formik.org/) & [Yup](https://github.com/jquense/yup) - For form handling and validation
- [date-fns](https://date-fns.org/) - For modern JavaScript date utilities
- [React Quill](https://github.com/zenoamaro/react-quill) - For the rich text editor
- [Axios](https://axios-http.com/) - For promise-based HTTP client
- [Jest](https://jestjs.io/) - For delightful JavaScript testing
- [ESLint](https://eslint.org/) & [Prettier](https://prettier.io/) - For code quality and formatting
