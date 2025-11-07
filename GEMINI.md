
# GEMINI.md

## Project Overview

This is a mobile application built with Expo and React Native. The application, named "PlaceApp", seems to be a directory or guide for places, allowing users to create and manage lists of establishments.

The project uses file-based routing with Expo Router. The main navigation is a tab bar with four tabs: "Home", "Estabelecimentos" (Establishments), "Listas" (Lists), and "Perfil" (Profile). The app also includes an authentication flow with login and registration screens.

The main technologies used are:

*   **Expo:** A framework for building universal React applications.
*   **React Native:** A framework for building native mobile apps with React.
*   **Expo Router:** A file-based router for React Native and web applications.
*   **TypeScript:** A typed superset of JavaScript.

## Building and Running

To build and run the project, use the following commands:

*   **Install dependencies:**
    ```bash
    npm install
    ```

*   **Start the development server:**
    ```bash
    npx expo start
    ```

*   **Run on Android:**
    ```bash
    npm run android
    ```

*   **Run on iOS:**
    ```bash
    npm run ios
    ```

*   **Run on the web:**
    ```bash
    npm run web
    ```

*   **Lint the code:**
    ```bash
    npm run lint
    ```

## Development Conventions

*   **File-based Routing:** The app uses Expo Router, which means that the file and directory structure in the `app` directory defines the navigation of the app.
*   **Authentication:** The authentication flow is handled in the `app/(auth)` directory. The `AuthContext` is used to manage the authentication state.
*   **Styling:** The app uses a custom color scheme defined in `constants/Colors.ts`.
*   **Icons:** The app uses `@expo/vector-icons` for icons.
