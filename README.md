# Package Tracking Viewer

A simple, responsive React web application designed for Yellow Corporation customers to track their orders and view essential details like status, ETAs, and pickup locations.

## Design Considerations
* **Simplicity & Performance:** Built using functional React components and modern Hooks to keep the codebase lean.
* **Mobile-First Responsiveness:** Utilized CSS Grid to ensure the layout elegantly scales from mobile screens to desktop environments.
* **Yellow Corp Branding:** Integrated subtle yellow branding touches fitting the company's profile.

## Dependencies
* **React:** UI library.
* **Vite:** Build tool and development server for faster compilation.
* *(No heavy external state management or UI libraries were used to keep the project strictly within the 4-5 hour constraint and ensure simplicity).*

## Setup & Running Locally

1. **Clone the repository:**
   `git clone [your-github-repo-link]`
2. **Navigate to the directory:**
   `cd package-tracker`
3. **Install dependencies:**
   `npm install`
4. **Run the development server:**
   `npm run dev`
5. Open your browser and navigate to `http://localhost:5173`.

## Testing Strategy & Approach

A production-ready scaling strategy could involve:
**Unit Testing:** Using **Jest** and **React Testing Library** to independently test utility functions and component rendering (e.g., ensuring the `order-card` correctly displays "Pending" if no status is provided).

## Scaling Strategy (i18n / Multiple Countries)
To scale this app globally:
* Integrate `react-i18next` to extract hardcoded strings into dictionary files (`en.json`, `sv.json`, etc.).
* Use the JavaScript `Intl` API or `date-fns` to format the ETA timestamps to the user's local timezone.