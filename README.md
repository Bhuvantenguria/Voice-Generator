# Voice Generator

A full-stack application for generating AI voiceovers with a modern React frontend and Node.js backend.

## Features

- User authentication with Clerk
- AI-powered voice generation
- File management with Firebase Storage
- Payment processing with Stripe
- Responsive modern UI with Tailwind CSS
- Internationalization support

## Project Structure

```
├── backend/           # Express.js backend
│   ├── src/
│   │   ├── config/   # Configuration files
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── routes/
│   │   ├── services/
│   │   └── utils/
│   └── tests/
└── frontend/         # Next.js frontend
    ├── src/
    │   ├── app/     # App router pages
    │   ├── components/
    │   ├── hooks/
    │   ├── services/
    │   └── utils/
    └── public/
```

## Prerequisites

- Node.js >= 18
- npm or yarn
- Docker (optional)

## Getting Started

1. Clone the repository
```bash
git clone <repository-url>
cd voice-generator
```

2. Install dependencies
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

3. Set up environment variables
```bash
# Backend
cp backend/.env.example backend/.env

# Frontend
cp frontend/.env.example frontend/.env
```

4. Start the development servers
```bash
# Start backend
cd backend
npm run dev

# Start frontend
cd frontend
npm run dev
```

## Docker Setup

To run the application using Docker:

```bash
docker-compose up
```

## Testing

```bash
# Run backend tests
cd backend
npm test

# Run frontend tests
cd frontend
npm test
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 