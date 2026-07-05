# Task 1: Initial Navigation Flow

## Technical Approach

- Install React Navigation dependencies (`@react-navigation/native`, `@react-navigation/native-stack`, `react-native-screens`, `react-native-safe-area-context`)
- Update `App.js` to wrap app with NavigationContainer and set up stack navigator
- Create four screen components:
  - `HomeScreen.js` - Full-width "Strength Session" CTA button
  - `StrengthSessionScreen.js` - "New Session" button and historical sessions placeholder
  - `SessionTypeSelectionScreen.js` - Three session types (only Session A enabled)
  - `SessionInputScreen.js` - Text area for session data input
- Wire up navigation between screens
- Use React Native StyleSheet for consistent styling
- Keep all session data in-memory only (no persistence for MVP)

## LLM Prompts Needed

### Prompt 1: Set Up Navigation and Create Screens

```text
Set up React Navigation in the personal-mobile-app with a stack navigator containing four screens:

1. HomeScreen - Display a full-width CTA button labeled "Strength Session" that navigates to the Strength Session screen. Center the button on the screen.

2. StrengthSessionScreen - Display:
   - A full-width "New Session" CTA button at the top that navigates to Session Type Selection screen
   - A placeholder section below for "Historical Sessions" (just a button for now, no functionality)
   - Navigation back to home

3. SessionTypeSelectionScreen - Display three session type options:
   - "Session A" (enabled, clickable, navigates to Session Input screen)
   - "Session B" (disabled for MVP - grayed out, not clickable)
   - "Ad-hoc Session" (disabled for MVP - grayed out, not clickable)
   - Each should be a full-width button/option
   - Pass the selected session type to the next screen

4. SessionInputScreen - Display:
   - Header showing the selected session type (e.g., "Session A")
   - Large text area for inputting session data/notes
   - Save/Done button (for MVP, just navigates back - no actual save functionality)
   - Navigation back to previous screen

Install all necessary React Navigation dependencies. Use React Native StyleSheet for styling. Keep buttons full-width with appropriate padding and touch targets. Use a clean, minimal design.
```

## Additional Context

- This is MVP functionality - Session B and Ad-hoc Session are UI placeholders only
- Session data is in-memory only (no persistence)
- Text area input is temporary - will be replaced with structured inputs in future iterations
- All navigation should use React Navigation's native stack navigator

### Notes & Retrospective

[to be added once this task-work is completed]

