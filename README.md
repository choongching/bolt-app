# Travel Spinner - Interactive 3D Globe Experience

A beautiful travel destination discovery app with an interactive 3D rotating globe powered by Mapbox GL JS.

## Project Overview

**URL**: https://wanderlust-spinner.netlify.app

This application features:
- Interactive 3D rotating globe with Mapbox GL JS
- Destination markers with smooth animations
- Automatic globe rotation with user interaction support
- Responsive design for desktop and mobile
- Travel destination recommendations based on traveler type
- User authentication and saved destinations

## Features

### 🌍 Interactive 3D Globe
- **Mapbox GL JS Integration**: High-performance 3D globe with satellite imagery
- **Automatic Rotation**: Smooth continuous rotation when not interacting
- **Interactive Controls**: Drag to rotate, scroll to zoom, click markers for details
- **Destination Markers**: Animated pins showing travel destinations
- **Atmospheric Effects**: Beautiful space-like atmosphere around the globe

### 🎯 Smart Destination Selection
- **Traveler Type Filtering**: Destinations tailored to solo, couple, family, friends, or business travel
- **Animated Selection**: Smooth camera transitions to selected destinations
- **Detailed Information**: Comprehensive destination details with itineraries

### 📱 Responsive Design
- **Mobile Optimized**: Touch-friendly controls and responsive layout
- **Cross-Platform**: Works seamlessly on desktop, tablet, and mobile devices
- **Performance Optimized**: Efficient rendering for smooth experience

## Setup Instructions

### 1. Mapbox Configuration

To enable the interactive 3D globe, you need a Mapbox access token:

1. **Get Mapbox Token**:
   - Visit [mapbox.com](https://www.mapbox.com/)
   - Create a free account
   - Go to your [Account page](https://account.mapbox.com/)
   - Copy your default public token

2. **Configure Environment Variables**:
   Create a `.env` file in the project root:
   ```env
   VITE_MAPBOX_ACCESS_TOKEN=your_actual_mapbox_token_here
   ```

3. **Update Token in Code**:
   In `src/components/globe/MapboxGlobe.tsx`, replace:
   ```typescript
   mapboxgl.accessToken = 'YOUR_ACTUAL_MAPBOX_TOKEN_HERE';
   ```
   with:
   ```typescript
   mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
   ```

### 2. Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### 3. Netlify Deployment

1. **Environment Variables**:
   - Go to your Netlify site dashboard
   - Navigate to Site settings > Environment variables
   - Add: `VITE_MAPBOX_ACCESS_TOKEN` with your Mapbox token

2. **Deploy**:
   ```bash
   npm run build
   ```
   Upload the `dist` folder to Netlify or connect your Git repository for automatic deployments.

## Technical Implementation

### Globe Component Architecture

```
src/components/globe/
├── MapboxGlobe.tsx          # Main Mapbox GL JS implementation
└── SpinningGlobe.tsx        # Wrapper with fallback support
```

### Key Features Implementation

1. **3D Globe Initialization**:
   ```typescript
   const map = new mapboxgl.Map({
     container: mapContainer.current,
     style: 'mapbox://styles/mapbox/satellite-streets-v12',
     projection: 'globe', // Enable 3D globe
     zoom: 1.5,
     center: [0, 20],
     antialias: true,
   });
   ```

2. **Atmospheric Effects**:
   ```typescript
   map.setFog({
     color: 'rgb(186, 210, 235)',
     'high-color': 'rgb(36, 92, 223)',
     'horizon-blend': 0.02,
     'space-color': 'rgb(11, 11, 25)',
     'star-intensity': 0.6,
   });
   ```

3. **Automatic Rotation**:
   ```typescript
   function spinGlobe() {
     if (spinEnabled && !userInteracting && zoom < 5) {
       const center = map.getCenter();
       center.lng -= distancePerSecond;
       map.easeTo({ center, duration: 1000 });
     }
     requestAnimationFrame(spinGlobe);
   }
   ```

4. **Interactive Markers**:
   ```typescript
   const marker = new mapboxgl.Marker(customElement)
     .setLngLat([destination.longitude, destination.latitude])
     .setPopup(popup)
     .addTo(map);
   ```

### Responsive Design

- **Mobile Touch Controls**: Native Mapbox touch support
- **Adaptive UI**: Responsive overlays and controls
- **Performance**: Optimized rendering for mobile devices

### Fallback Support

The component includes fallback behavior when Mapbox token is not configured:
- Shows setup instructions
- Maintains core functionality
- Graceful degradation

## Browser Compatibility

- **Modern Browsers**: Chrome 79+, Firefox 70+, Safari 13+, Edge 79+
- **WebGL Support**: Required for 3D globe rendering
- **Mobile**: iOS Safari 13+, Chrome Mobile 79+

## Performance Optimization

- **Efficient Rendering**: Mapbox GL JS hardware acceleration
- **Lazy Loading**: Components load only when needed
- **Memory Management**: Proper cleanup of map instances
- **Responsive Images**: Optimized marker graphics

## Troubleshooting

### Common Issues

1. **Globe Not Loading**:
   - Check Mapbox token configuration
   - Verify internet connection
   - Check browser WebGL support

2. **Performance Issues**:
   - Reduce marker count for older devices
   - Lower globe quality settings if needed
   - Check for memory leaks in browser dev tools

3. **Mobile Touch Issues**:
   - Ensure proper viewport meta tag
   - Check for conflicting touch event handlers
   - Test on actual devices, not just browser emulation

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test on multiple devices
5. Submit a pull request

## License

This project is built with:
- **Vite** - Build tool
- **React** - UI framework
- **TypeScript** - Type safety
- **Mapbox GL JS** - 3D globe and mapping
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations

For more information, visit the [project repository](https://github.com/your-repo/travel-spinner).

<!-- Force deploy trigger: Updated with environment variables configuration -->