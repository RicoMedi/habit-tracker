# Habit Tracker App

A modern web application built with Next.js to help users build and maintain positive habits through daily tracking and progress visualization.

## Features

- 🔐 Secure user authentication
- 📝 Full CRUD functionality for habit management
- 📊 Daily habit completion tracking
- 🔥 Streak monitoring and statistics
- 📱 Responsive design for all devices
- 📈 Personalized progress insights

## Tech Stack

- **Frontend**: Next.js 15.3.1 with TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: Firebase
- **Database**: Firestore
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js (Latest LTS version recommended)
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/habit-tracker.git
cd habit-tracker
```

2. Install dependencies:

```bash
npm install
# or
yarn install
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

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint for code quality

## Project Structure

```
habit-tracker/
├── app/              # Next.js app directory
├── components/       # React components
├── lib/             # Utility functions and Firebase setup
├── public/          # Static assets
└── styles/          # Global styles and Tailwind config
```

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

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
