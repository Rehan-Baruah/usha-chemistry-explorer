# Interactive Periodic Table with Usha AI

An educational web application that combines an interactive periodic table with an AI-powered chemistry assistant named Usha, designed to provide detailed information about chemical elements and answer chemistry-related questions.

## Features

- **Interactive Periodic Table**
  - Displays all 118 elements with detailed information on hover/click
  - Color-coded by element classification
  - Responsive design that works on all devices

- **Element Information**
  - Detailed popups with atomic properties
  - Electron configuration
  - Classification and period information
  - Reactivity traits

- **Usha AI Assistant**
  - General chemistry Q&A
  - Element-specific information and explanations
  - Context-aware responses based on the selected element

- **Advanced Filtering**
  - Filter by element classification (metals, non-metals, metalloids)
  - Filter by block (s, p, d, f)
  - Filter by series (lanthanides, actinides)
  - Filter by reactivity traits

## Tech Stack

- **Frontend**: React with TypeScript
- **Styling**: TailwindCSS
- **Build Tool**: Vite
- **AI**: Gemini 2.0 Flash API
- **State Management**: React Query
- **UI Components**: Radix UI Primitives with Shadcn/ui

## Getting Started

### Prerequisites

- Node.js (v16 or later)
- pnpm (recommended) or npm
- Gemini API key

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/your-username/usha-chemistry-explorer.git
   cd usha-chemistry-explorer
   ```

2. Install dependencies
   ```bash
   pnpm install
   # or
   npm install
   ```

3. Create a `.env` file in the root directory and add your Gemini API key:
   ```
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. Start the development server
   ```bash
   pnpm dev
   # or
   npm run dev
   ```

5. Open [http://localhost:8080](http://localhost:8080) in your browser

## Usage

- **Explore Elements**: Hover or click on any element to see its detailed information
- **Chat with Usha**: Click the chat icon in the bottom-right corner to ask chemistry questions
- **Filter Elements**: Use the filter panel to find elements by various properties

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Periodic table data sourced from various open chemistry resources
- Powered by Google's Gemini AI
- Built with modern web technologies

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

