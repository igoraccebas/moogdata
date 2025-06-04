# Moog Pro Light

This is a minimal Next.js application that lets you manage simple projects for Moog Pro Light.

## Features

- Create projects with a name and select either a 2-slot or 5-slot panel type.
- Each slot can be assigned a module: Relais, 0-10v, or Test.
- Every slot has 8 channels and each channel contains 5 editable cells.
- Channels are draggable to rearrange their order inside a slot using native drag and drop.
- Data is persisted to `localStorage` in the browser.

## Running the app

1. Install dependencies (requires internet access):
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```

Due to environment restrictions, dependencies may not be installed in Codex.
