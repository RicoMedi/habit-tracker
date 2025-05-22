# Habit Tracker App

A modern web application built with Next.js to help users build and maintain positive habits through daily tracking and progress visualization.

## Features

### Authentication

- 🔐 Secure user authentication with email/password
- 🚪 Protected routes and authenticated access
- 🔄 Automatic session management

### Habit Management

- ✨ Create new habits with detailed configuration
  - Title and description
  - Daily or weekly frequency
  - Custom color coding
  - Specific days for weekly habits
  - Start date and reminder time
- 📝 Full CRUD functionality
  - Create new habits
  - View habit details
  - Delete habits with confirmation
- 🎯 Habit completion tracking
  - Mark habits as complete
  - Track daily progress

### User Interface

- 🌓 Dark/Light mode support
- 📱 Fully responsive design
- 🎨 Modern and clean UI with Tailwind CSS
- ⚡ Smooth animations and transitions
- 🔄 Real-time updates and loading states
- 🎭 Custom modal components

### Database

- 🔥 Real-time Firestore database
- 🔒 Secure data access with Firestore rules
- 📊 Efficient data querying with indexes
- 🔄 Optimistic UI updates

## Tech Stack

- **Frontend**: Next.js 15.3.1 with TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: Firebase Auth
- **Database**: Firestore
- **State Management**: React Context
- **Date Handling**: date-fns
- **Deployment**: Netlify

## Getting Started

### Prerequisites

- Node.js (Latest LTS version recommended)
- npm or yarn
- Firebase account

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/habit-tracker.git
cd habit-tracker
```

2. Install dependencies:

```bash
npm install

```

3. Set up environment variables:
   Create a `.env.local` file in the root directory and add your Firebase configuration:

```
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

4. Run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Project Structure

```
habit-tracker/
├── src/
│   ├── app/              # Next.js app directory and pages
│   ├── components/       # React components
│   │   ├── auth/        # Authentication components
│   │   ├── habits/      # Habit management components
│   │   └── ui/          # Shared UI components
│   ├── contexts/        # React contexts (Auth, Theme)
│   ├── utils/           # Utility functions
│   └── config/          # Configuration files
├── public/              # Static assets
└── docs/               # Documentation files
```

## Current Status

### Completed Features

- ✅ User authentication system
- ✅ Habit creation and management
- ✅ Daily/Weekly habit tracking
- ✅ Dark/Light mode
- ✅ Responsive design
- ✅ Database integration
- ✅ Protected routes

### In Progress

- 🚧 Statistics and streaks
- 🚧 Data visualization
- 🚧 User profile management
- 🚧 Testing implementation
- 🚧 Deployment setup

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built with [Next.js](https://nextjs.org)
- Styled with [Tailwind CSS](https://tailwindcss.com)
- Powered by [Firebase](https://firebase.google.com)

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.


