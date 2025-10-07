# Kasatria Periodic Table

An interactive 3D periodic table visualization built with Next.js 14, TypeScript, and Three.js. This application displays data from Google Sheets in various 3D layouts with Google OAuth authentication.

## Features

- 🔐 **Google OAuth Authentication** - Secure login with Google Identity Services
- 📊 **Google Sheets Integration** - Real-time data from published CSV
- 🎨 **3D Visualizations** - Four different layout algorithms:
  - **Table**: 20×10 grid layout
  - **Sphere**: Spherical distribution
  - **Double Helix**: Two intertwined helices
  - **Grid**: 5×4×10 3D grid
- 🎭 **Smooth Animations** - GSAP-powered transitions between layouts
- 🎨 **Color-coded Tiles** - Net worth-based color coding:
  - 🔴 Red: < $100,000
  - 🟠 Orange: $100,000 - $199,999
  - 🟢 Green: ≥ $200,000
- 📱 **Responsive Design** - Works on desktop and mobile devices

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **3D Graphics**: Three.js with CSS3DRenderer
- **Animations**: GSAP
- **Authentication**: Google Identity Services
- **Data**: CSV parsing from Google Sheets

## Prerequisites

Before setting up the project, you'll need:

1. **Node.js** (v18 or higher)
2. **Google Cloud Console** account
3. **Google Sheets** with data to visualize

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
# Create new Next.js project
npx create-next-app@latest kasatria-periodic-table --typescript --tailwind --eslint --app

# Navigate to project directory
cd kasatria-periodic-table

# Install additional dependencies
npm install three @types/three csv-parse gsap
```

### 2. Google Cloud Console Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the **Google+ API** and **Google Identity Services**
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client IDs**
5. Select **Web application**
6. Add authorized origins:
   - `http://localhost:3000` (for development)
   - Your production domain (for deployment)
7. Copy the **Client ID** for the next step

### 3. Environment Variables

Create a `.env.local` file in the root directory:

```env
# Google OAuth 2.0 Client ID
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id_here

# CSV URL from Google Sheets (optional - defaults to provided URL)
NEXT_PUBLIC_CSV_URL=https://docs.google.com/spreadsheets/d/e/2PACX-1vSYQFf5uPRx3VOAoT2irE6Kw8LjXQse_QHHKMcyiy6qiwK07q_1JFwlNcAhkWShAoL74NurBBrQbhHR/pub?gid=8699197&single=true&output=csv
```

### 4. Google Sheets Setup

1. Create a Google Sheet with your data
2. **Important**: Share the sheet with `lisa@kasatria.com` (as specified in requirements)
3. Publish the sheet to web:
   - Go to **File** → **Share** → **Publish to web**
   - Select **CSV** format
   - Copy the published URL
   - Update `NEXT_PUBLIC_CSV_URL` in your `.env.local` file

#### Expected CSV Format

Your Google Sheet should have columns that can be mapped to:
- `name` (or `fullName`) - Person's name
- `netWorth` (or `networth`, `wealth`) - Net worth value
- `rank` (or `position`) - Ranking position
- `company` (or `organization`) - Company name
- `country` (or `nation`) - Country

The system automatically converts headers to camelCase and handles various naming conventions.

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_GOOGLE_CLIENT_ID`
   - `NEXT_PUBLIC_CSV_URL` (if different from default)
4. Deploy!

### Other Deployment Options

The app can be deployed to any platform that supports Next.js:
- Netlify
- AWS Amplify
- Railway
- DigitalOcean App Platform

## Project Structure

```
├── app/
│   ├── globals.css          # Global styles and 3D element styles
│   ├── layout.tsx           # Root layout component
│   ├── page.tsx             # Login page with Google OAuth
│   └── scene/
│       ├── page.tsx         # Server component that fetches CSV data
│       └── SceneClient.tsx  # Client component with Three.js scene
├── lib/
│   ├── fetchCsv.ts          # CSV fetching and parsing utility
│   └── layoutTargets/       # Layout algorithms
│       ├── table.ts         # 20×10 table layout
│       ├── sphere.ts        # Spherical distribution
│       ├── doubleHelix.ts   # Double helix layout
│       ├── grid.ts          # 5×4×10 grid layout
│       └── index.ts         # Exports
├── components/              # Reusable components (if needed)
├── public/                  # Static assets
└── styles/                  # Additional stylesheets
```

## Usage

1. **Login**: Click "Sign in with Google" on the homepage
2. **Navigate**: Use mouse to orbit around the 3D scene
3. **Switch Layouts**: Click buttons (Table, Sphere, Double Helix, Grid)
4. **View Details**: Hover over tiles to see person information
5. **Logout**: Click logout button to return to login page

## Layout Algorithms

### Table Layout (20×10)
- Fixed grid with 20 columns and 10 rows
- Items fill row-major order
- Flat 2D arrangement

### Sphere Layout
- Items distributed over a sphere surface
- Uses Fibonacci spiral distribution
- Each item faces outward from center

### Double Helix Layout
- Two intertwined helices along Y-axis
- Alternates items between strands
- Phase offset of π between strands

### Grid Layout (5×4×10)
- 3D grid with 5×4×10 dimensions
- Items distributed in 3D space
- Centered at origin

## Customization

### Adding New Layouts

1. Create new layout file in `lib/layoutTargets/`
2. Export function that returns `LayoutTarget[]`
3. Add layout type to `LayoutType` union
4. Add button and handler in `SceneClient.tsx`

### Modifying Tile Appearance

Edit the `createElement` function in `SceneClient.tsx` to customize:
- Tile size and styling
- Information display
- Color coding rules

### Data Format Changes

Modify `lib/fetchCsv.ts` to handle different CSV formats:
- Add new field mappings
- Change parsing logic
- Update data transformation

## Troubleshooting

### Common Issues

1. **Google OAuth not working**
   - Verify `NEXT_PUBLIC_GOOGLE_CLIENT_ID` is set correctly
   - Check authorized origins in Google Cloud Console
   - Ensure Google+ API is enabled

2. **CSV data not loading**
   - Verify Google Sheet is published to web
   - Check CSV URL is accessible
   - Ensure sheet is shared with `lisa@kasatria.com`

3. **3D scene not rendering**
   - Check browser console for Three.js errors
   - Verify all dependencies are installed
   - Ensure proper WebGL support

4. **Layout animations not smooth**
   - Check GSAP is properly imported
   - Verify animation targets are correct
   - Monitor performance in browser dev tools

### Performance Optimization

- Limit number of items for better performance
- Use `requestAnimationFrame` for smooth animations
- Implement object pooling for large datasets
- Add loading states for better UX

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Create an issue in the repository
- Contact: lisa@kasatria.com
- Documentation: [Next.js Docs](https://nextjs.org/docs)
- Three.js Examples: [Three.js Examples](https://threejs.org/examples/)

## Acknowledgments

- Three.js team for the amazing 3D library
- Google for Identity Services
- Next.js team for the excellent framework
- GSAP for smooth animations

