# Project Structure & Functionality Overview

This document serves as a reference for the `focus_app_demo` project, outlining its page structure, key features, and navigation flow.

## 1. Project Overview
A React-based mobile application demo focused on productivity. It features a "Focus Mode" to block distractions and earn "Play Time," along with task management and usage statistics.

## 2. Navigation & Routing
The app uses `react-router-dom` with a `SessionGuard` to handle session persistence.
- **Entry**: `/` redirects to `/onboarding`
- **Main Layout**: `BottomNav` is visible on main pages (`Home`, `Apps`, `Tasks`, `Profile`).
- **Focus Flow**: Dedicated routes (`/focus`, `/success`, `/fail`) hide the bottom navigation.

## 3. Page Breakdown

### 3.1 Onboarding (`/onboarding`)
- **Purpose**: Initial setup for first-time users.
- **Features**:
  - **Permissions Request**: Explains and requests Accessibility, Overlay, Usage Access, and Device Admin permissions.
  - **App Analysis**: Simulates scanning installed apps to categorize them (Social, Games, Work, etc.).

### 3.2 Home (`/home`)
- **Purpose**: Main dashboard.
- **Features**:
  - **Header**: User greeting, Avatar, link to History and Notifications.
  - **Today's Focus Card**: Shows accumulated focus time, goal progress, and reward balance.
  - **Mode Selection**:
    - **Focus Mode**: Starts the timer to block apps and earn rewards.
    - **Play Mode**: Uses earned rewards to allow access to fun apps.
  - **Daily Goal Widget**: Displays current primary goal and progress.
  - **Mini Stats**: Quick view of productivity trends and blocked distractions.

### 3.3 Focus Timer (`/focus`)
- **Purpose**: The active session screen.
- **Features**:
  - **Timer**: Large countdown or count-up timer depending on mode.
  - **Modes**: Supports `focus`, `play`, and `task` modes.
  - **Hold to Stop**: Requires holding the stop button for 5 seconds to prevent impulsive quitting.
  - **Visual Feedback**: Dynamic background and animations.
  - **Rewards**: Shows earned minutes in real-time.

### 3.4 Tasks (`/tasks`)
- **Purpose**: Task management.
- **Features**:
  - **Task List**: Active tasks with progress bars (Accumulated vs Target time).
  - **Task Actions**: "Continue" (starts Focus timer for this task), "Complete", or "Abandon".
  - **Gamification**: Shows potential rewards for task completion.
  - **History Snippet**: Brief view of recent completed/failed tasks.

### 3.5 App Groups (`/apps`)
- **Purpose**: Manage app blocking rules.
- **Features**:
  - **Group List**: Pre-defined categories (Work, Social, Games, Sleep, Creativity).
  - **Group Details**: Shows app count and associated icon/color.
  - **Editing**: Entry point to edit specific groups (simulated).

### 3.6 History (`/history`)
- **Purpose**: Review past performance.
- **Features**:
  - **Filters**: Filter by Date Range (Today, Yesterday, Last 7 Days) and Mode (Focus vs Task).
  - **Session Log**: Detailed list of sessions with duration, status (Completed/Failed), and rewards earned.

### 3.7 Profile (`/profile`)
- **Purpose**: User profile and stats summary.
- **Features**:
  - **Stats**: Total Focus Time, Weekly Focus Trend (Bar chart).
  - **Settings Access**: Link to General Settings.
  - **Account Actions**: Log Out.

### 3.8 General Settings (`/settings`)
- **Purpose**: App configuration.
- **Features**:
  - **Reward Rules**: Configure Focus-to-Reward ratio (e.g., 25m focus = 5m reward).
  - **Eye Care**: Configure Usage Threshold and Rest Duration.
  - **Permissions**: Toggle permissions (simulated).
  - **Force Unlock**: Set PIN for emergency unlocking.

### 3.9 Session Results (`/success`, `/fail`)
- **Purpose**: Post-session feedback.
- **Features**:
  - **Success**: Confetti animation, summary of time focused and rewards earned.
  - **Failure**: Encouraging message, progress made before quitting.

### 3.10 Overlays (`/pages/Overlays.tsx`)
- **BlockScreen (`/block`)**: Shown when a user tries to open a blocked app. Features a "Go Back" button and streak risk warning.
- **RestReminder (`/rest`)**: Full-screen "Take a Break" overlay with a countdown.
- **EyeCare (`/eyecare`)**: Breathing exercise overlay.
- **FloatingBubble (`/simulation`)**: Simulates a floating timer over other apps.

## 4. Key Technical Concepts
- **State Management**: Uses `React.useState` and `localStorage` for simple persistence.
- **SessionGuard**: A wrapper component in `App.tsx` that checks for active sessions in `localStorage` and redirects to `/focus` if the user tries to leave during an active session.
- **Mock Data**: Most data (History, Tasks, App Groups) is currently mocked within the components.
