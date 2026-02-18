<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally and deploy it to Render.

View your app in AI Studio: https://ai.studio/apps/drive/1yJx7tb6wy_hce1URxtmcJemAqmf8B1nm

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Deploy to Render

This is a React/TypeScript frontend application built with Vite. To deploy to Render:

### Automated Deployment

1. Connect your GitHub repository to Render
2. Create a new **Web Service**
3. Configure the service:
   - **Environment**: `Node`
   - **Build Command**: `./build.sh`
   - **Start Command**: `npm start`
   - **Port**: The app will run on port 10000 (configured in the start script)

### Environment Variables

Set the following environment variable in Render:
- `GEMINI_API_KEY`: Your Gemini API key

### Manual Deployment

If you prefer to deploy manually:

```bash
# Build the application
npm install
npm run build

# Start the production server
npm start
```

The application will be built using Vite and served as static files from the `dist` directory.

### Build Process

- The `build.sh` script handles dependency installation and building
- The `Procfile` configures the web process for Render
- The production server uses `serve` to host the static files from the `dist` folder

