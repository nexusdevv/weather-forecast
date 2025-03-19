# Weather Forecast App

A modern, minimalist weather forecast application built with Next.js and TypeScript that provides real-time weather information with a sleek black and white design. This application allows users to search for cities worldwide and get current weather conditions as well as 5-day forecasts.

![Weather Forecast App Screenshot](https://i.imgur.com/au6lBzG.png)

## Features

- **Real-time Weather Data**: Current temperature, conditions, humidity, wind speed, and "feels like" information
- **5-Day Forecast**: View upcoming weather predictions for the next 5 days
- **Historical Weather**: See simulated weather data for the past 5 days
- **Global City Search**: Search for cities worldwide with smart autocomplete suggestions
- **Responsive Design**: Works beautifully on desktop, tablet, and mobile devices
- **Smooth Animations**: Beautiful transitions and loading animations
- **Error Handling**: User-friendly error messages for invalid city searches or API failures
- **Minimalist UI**: Clean, modern black and white design focused on readability

## Live Demo

[View Live Demo](https://weatherforecastpro.vercel.app)

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone https://github.com/nexusdevv/weather-forecast.git
cd weather-forecast
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Create a `.env.local` file in the root directory and add your API keys:

```
NEXT_PUBLIC_OPENWEATHER_API_KEY=your_openweathermap_api_key
NEXT_PUBLIC_GEODB_API_KEY=your_geodb_api_key
```

4. Start the development server:

```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Usage

1. When you first open the application, you'll see a search bar.
2. Type a city name to search for weather information.
3. As you type, the application will suggest matching cities.
4. Select a city from the dropdown or hit enter to search.
5. View the current weather conditions and forecast.
6. Toggle between "Forecast" and "Past Days" to see weather data for different time periods.

## Project Structure

```
├── app/
│   ├── components/
│   │   ├── animations/     # Animation components
│   │   ├── icons/          # Weather icons components
│   │   └── weather/        # Weather-related components
│   ├── services/           # API services
│   ├── globals.css         # Global styles
│   └── page.tsx            # Main application page
├── public/                 # Static assets
├── next.config.js          # Next.js configuration
└── package.json            # Dependencies and scripts
```

## Technologies Used

- **Next.js 15.2.3**: React framework for server-side rendering and static site generation
- **TypeScript**: For type safety and better developer experience
- **Tailwind CSS**: For utility-first styling
- **React Hooks**: For state management and side effects
- **Fetch API**: For data fetching from external APIs

## APIs Used

### OpenWeatherMap API

This application uses the [OpenWeatherMap API](https://openweathermap.org/api) to fetch current weather data and forecasts. You'll need to obtain an API key from their website to use this application.

Endpoints used:
- Current Weather: `/weather`
- 5-Day Forecast: `/forecast`

### GeoDB Cities API

[GeoDB Cities API](https://rapidapi.com/wirefreethought/api/geodb-cities/) is used for city search functionality. It provides city suggestions as users type in the search bar.

## Error Handling

The application implements robust error handling:
- For invalid city searches, a user-friendly amber alert is displayed
- For API failures, the application falls back to local data
- Network errors are handled gracefully with appropriate user feedback

## Performance Optimizations

- **Caching**: API responses are cached to reduce unnecessary network requests
- **Debouncing**: Search inputs are debounced to limit API calls while typing
- **Lazy Loading**: Components are loaded only when needed
- **Fallback Mechanisms**: Local data is used when API calls fail

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the GPL-3.0 License - see the [LICENSE](LICENSE) file for details.

## Acknowledgements

- [OpenWeatherMap](https://openweathermap.org/) for providing weather data
- [GeoDB Cities](https://wirefreethought.github.io/geodb-cities-api-docs/) for city data
- [Next.js](https://nextjs.org/) for the amazing React framework
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework

---

Created with Next.js by [Nexus](https://github.com/nexusdevv)
