<div id="top">

<!-- HEADER STYLE: CLASSIC -->
<div align="center">


# EXPENSE-TRACKER

<em>Master Your Finances, Empower Your Future Today</em>

<!-- BADGES -->
<img src="https://img.shields.io/github/last-commit/jeevanba273/Expense-Tracker?style=flat&logo=git&logoColor=white&color=0080ff" alt="last-commit">
<img src="https://img.shields.io/github/languages/top/jeevanba273/Expense-Tracker?style=flat&color=0080ff" alt="repo-top-language">
<img src="https://img.shields.io/github/languages/count/jeevanba273/Expense-Tracker?style=flat&color=0080ff" alt="repo-language-count">

<em>Built with the tools and technologies:</em>

<img src="https://img.shields.io/badge/JSON-000000.svg?style=flat&logo=JSON&logoColor=white" alt="JSON">
<img src="https://img.shields.io/badge/npm-CB3837.svg?style=flat&logo=npm&logoColor=white" alt="npm">
<img src="https://img.shields.io/badge/Autoprefixer-DD3735.svg?style=flat&logo=Autoprefixer&logoColor=white" alt="Autoprefixer">
<img src="https://img.shields.io/badge/PostCSS-DD3A0A.svg?style=flat&logo=PostCSS&logoColor=white" alt="PostCSS">
<img src="https://img.shields.io/badge/JavaScript-F7DF1E.svg?style=flat&logo=JavaScript&logoColor=black" alt="JavaScript">
<br>
<img src="https://img.shields.io/badge/React-61DAFB.svg?style=flat&logo=React&logoColor=black" alt="React">
<img src="https://img.shields.io/badge/TypeScript-3178C6.svg?style=flat&logo=TypeScript&logoColor=white" alt="TypeScript">
<img src="https://img.shields.io/badge/Vite-646CFF.svg?style=flat&logo=Vite&logoColor=white" alt="Vite">
<img src="https://img.shields.io/badge/ESLint-4B32C3.svg?style=flat&logo=ESLint&logoColor=white" alt="ESLint">

</div>
<br>

---

## 📄 Table of Contents

- [Overview](#-overview)
- [Getting Started](#-getting-started)
    - [Prerequisites](#-prerequisites)
    - [Installation](#-installation)
    - [Usage](#-usage)
    - [Testing](#-testing)
- [Features](#-features)
- [Project Structure](#-project-structure)
    - [Project Index](#-project-index)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)

---

## ✨ Overview

Expense-Tracker is a powerful developer tool designed to simplify financial management through an intuitive interface and robust backend integration.

**Why Expense-Tracker?**

This project empowers developers to create a user-friendly financial management application, leveraging modern web technologies for seamless expense tracking. The core features include:

- 💻 **TypeScript Integration:** Ensures strict type-checking and modern JavaScript compatibility, enhancing code quality.
- 🎨 **Tailwind CSS Support:** Streamlines styling with utility-first design, ensuring responsive and modern UI.
- 💳 **Stripe Integration:** Facilitates seamless payment processing and subscription management, enhancing user experience.
- 📊 **Real-time Data Management:** Utilizes Supabase for dynamic data handling, ensuring user-specific data synchronization.
- 🖥️ **User-Friendly Interface:** Provides intuitive components for managing transactions, budgets, and financial goals.
- 📈 **Analytics and Visualization:** Offers insightful visualizations of financial data, aiding users in tracking spending patterns.

---

## 📌 Features

|      | Component       | Details                              |
| :--- | :-------------- | :----------------------------------- |
| ⚙️  | **Architecture**  | <ul><li>Single Page Application (SPA)</li><li>Component-based structure using React</li><li>State management with React hooks</li></ul> |
| 🔩 | **Code Quality**  | <ul><li>TypeScript for type safety</li><li>ESLint for linting</li><li>Prettier for code formatting</li></ul> |
| 📄 | **Documentation** | <ul><li>README.md for project overview</li><li>Inline comments for code clarity</li><li>Type definitions for TypeScript</li></ul> |
| 🔌 | **Integrations**  | <ul><li>Supabase for backend services</li><li>React Router for navigation</li><li>Vite for development server and build tool</li></ul> |
| 🧩 | **Modularity**    | <ul><li>Reusable components (e.g., forms, buttons)</li><li>Separation of concerns (UI vs. logic)</li><li>Custom hooks for shared logic</li></ul> |
| 🧪 | **Testing**       | <ul><li>Unit tests with Jest</li><li>React Testing Library for component testing</li><li>Coverage reports available</li></ul> |
| ⚡️  | **Performance**   | <ul><li>Optimized bundle size with Vite</li><li>Lazy loading of components</li><li>Efficient state updates with React hooks</li></ul> |
| 🛡️ | **Security**      | <ul><li>Environment variables for sensitive data</li><li>Supabase authentication for user management</li><li>Input validation to prevent SQL injection</li></ul> |
| 📦 | **Dependencies**  | <ul><li>React, TypeScript, TailwindCSS</li><li>Supabase client for database interactions</li><li>Various ESLint plugins for code quality</li></ul> |
| 🚀 | **Scalability**   | <ul><li>Component-based architecture for easy scaling</li><li>Backend as a service (Supabase) for handling increased load</li><li>Modular code structure for feature expansion</li></ul> |

---

## 📁 Project Structure

```sh
└── Expense-Tracker/
    ├── check_user_preferences.sql
    ├── dist
    │   ├── _redirects
    │   ├── assets
    │   └── index.html
    ├── eslint.config.js
    ├── index.html
    ├── package-lock.json
    ├── package.json
    ├── postcss.config.js
    ├── public
    │   └── _redirects
    ├── src
    │   ├── App.tsx
    │   ├── components
    │   ├── contexts
    │   ├── index.css
    │   ├── lib
    │   ├── main.tsx
    │   ├── pages
    │   ├── stripe-config.ts
    │   ├── types
    │   ├── utils
    │   └── vite-env.d.ts
    ├── supabase
    │   ├── functions
    │   └── migrations
    ├── tailwind.config.js
    ├── tsconfig.app.json
    ├── tsconfig.json
    ├── tsconfig.node.json
    └── vite.config.ts
```

---

### 📑 Project Index

<details open>
	<summary><b><code>EXPENSE-TRACKER/</code></b></summary>
	<!-- __root__ Submodule -->
	<details>
		<summary><b>__root__</b></summary>
		<blockquote>
			<div class='directory-path' style='padding: 8px 0; color: #666;'>
				<code><b>⦿ __root__</b></code>
			<table style='width: 100%; border-collapse: collapse;'>
			<thead>
				<tr style='background-color: #f8f9fa;'>
					<th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
					<th style='text-align: left; padding: 8px;'>Summary</th>
				</tr>
			</thead>
				<tr style='border-bottom: 1px solid #eee;'>
					<td style='padding: 8px;'><b><a href='https://github.com/jeevanba273/Expense-Tracker/blob/master/tsconfig.node.json'>tsconfig.node.json</a></b></td>
					<td style='padding: 8px;'>- Configuration settings define the TypeScript compilation process for the project, ensuring compatibility with modern JavaScript features and strict type-checking<br>- By specifying options such as module resolution and linting rules, it enhances code quality and maintainability<br>- This setup supports the integration of TypeScript files, particularly for the Vite configuration, contributing to a robust and efficient development environment within the overall codebase architecture.</td>
				</tr>
				<tr style='border-bottom: 1px solid #eee;'>
					<td style='padding: 8px;'><b><a href='https://github.com/jeevanba273/Expense-Tracker/blob/master/postcss.config.js'>postcss.config.js</a></b></td>
					<td style='padding: 8px;'>- Configures PostCSS to enhance the styling capabilities of the project by integrating Tailwind CSS for utility-first design and Autoprefixer for automatic vendor prefixing<br>- This setup streamlines the development process, ensuring that styles are both modern and compatible across various browsers, thereby contributing to a more efficient and responsive user interface within the overall codebase architecture.</td>
				</tr>
				<tr style='border-bottom: 1px solid #eee;'>
					<td style='padding: 8px;'><b><a href='https://github.com/jeevanba273/Expense-Tracker/blob/master/index.html'>index.html</a></b></td>
					<td style='padding: 8px;'>- Serves as the foundational entry point for the Zero-Import Expense Tracker application, establishing the essential HTML structure and linking to the main JavaScript module<br>- It sets up the user interface by defining the root element where the application will render, ensuring a responsive design and seamless integration with the underlying functionality provided by the TypeScript code.</td>
				</tr>
				<tr style='border-bottom: 1px solid #eee;'>
					<td style='padding: 8px;'><b><a href='https://github.com/jeevanba273/Expense-Tracker/blob/master/eslint.config.js'>eslint.config.js</a></b></td>
					<td style='padding: 8px;'>- Configures ESLint for a TypeScript project, ensuring adherence to best practices and coding standards<br>- It integrates recommended settings for JavaScript and TypeScript, while also incorporating plugins for React hooks and refresh functionality<br>- By defining specific rules and global variables, it enhances code quality and consistency across the codebase, ultimately facilitating a smoother development experience.</td>
				</tr>
				<tr style='border-bottom: 1px solid #eee;'>
					<td style='padding: 8px;'><b><a href='https://github.com/jeevanba273/Expense-Tracker/blob/master/tailwind.config.js'>tailwind.config.js</a></b></td>
					<td style='padding: 8px;'>- Configures Tailwind CSS for the project by specifying the content sources that will utilize the utility-first CSS framework<br>- It establishes the theme settings and allows for future extensions and plugins, ensuring a streamlined design process across the application<br>- This setup enhances the overall styling capabilities, promoting consistency and efficiency in the user interface development within the codebase architecture.</td>
				</tr>
				<tr style='border-bottom: 1px solid #eee;'>
					<td style='padding: 8px;'><b><a href='https://github.com/jeevanba273/Expense-Tracker/blob/master/tsconfig.app.json'>tsconfig.app.json</a></b></td>
					<td style='padding: 8px;'>- Configuration settings define the TypeScript compiler options for the application, ensuring compatibility with modern JavaScript features and React<br>- By enforcing strict type-checking and linting rules, it enhances code quality and maintainability<br>- The setup facilitates a streamlined development process, allowing for efficient module resolution and JSX transformation, ultimately contributing to a robust and scalable codebase architecture.</td>
				</tr>
				<tr style='border-bottom: 1px solid #eee;'>
					<td style='padding: 8px;'><b><a href='https://github.com/jeevanba273/Expense-Tracker/blob/master/vite.config.ts'>vite.config.ts</a></b></td>
					<td style='padding: 8px;'>- Configures the Vite build tool for a React application, enhancing development efficiency and performance<br>- By integrating the React plugin, it streamlines the setup for building user interfaces while optimizing dependency management by excluding specific libraries<br>- This setup plays a crucial role in ensuring a smooth development experience and effective asset handling within the overall project architecture.</td>
				</tr>
				<tr style='border-bottom: 1px solid #eee;'>
					<td style='padding: 8px;'><b><a href='https://github.com/jeevanba273/Expense-Tracker/blob/master/tsconfig.json'>tsconfig.json</a></b></td>
					<td style='padding: 8px;'>- Facilitates TypeScript project configuration by managing references to application and Node.js specific settings<br>- It serves as a central point for organizing TypeScript compilation options, ensuring that the application and Node environments are properly configured and integrated within the overall codebase architecture<br>- This structure enhances maintainability and scalability of the project as it evolves.</td>
				</tr>
				<tr style='border-bottom: 1px solid #eee;'>
					<td style='padding: 8px;'><b><a href='https://github.com/jeevanba273/Expense-Tracker/blob/master/package.json'>package.json</a></b></td>
					<td style='padding: 8px;'>- Defines the configuration and dependencies for the expense-tracker project, facilitating the development and build processes<br>- It establishes scripts for development, building, and linting, ensuring code quality and adherence to standards<br>- By integrating essential libraries and tools, it supports a modern React application architecture, enabling efficient management of expenses through a user-friendly interface.</td>
				</tr>
				<tr style='border-bottom: 1px solid #eee;'>
					<td style='padding: 8px;'><b><a href='https://github.com/jeevanba273/Expense-Tracker/blob/master/check_user_preferences.sql'>check_user_preferences.sql</a></b></td>
					<td style='padding: 8px;'>- Facilitates the retrieval and verification of user preferences and associated order data within the application<br>- It enables the examination of user-specific settings, recent orders, and the integrity of customer information linked to payment processing<br>- This functionality supports user management and enhances the overall user experience by ensuring accurate data representation across the platform.</td>
				</tr>
			</table>
		</blockquote>
	</details>
	<!-- supabase Submodule -->
	<details>
		<summary><b>supabase</b></summary>
		<blockquote>
			<div class='directory-path' style='padding: 8px 0; color: #666;'>
				<code><b>⦿ supabase</b></code>
			<!-- functions Submodule -->
			<details>
				<summary><b>functions</b></summary>
				<blockquote>
					<div class='directory-path' style='padding: 8px 0; color: #666;'>
						<code><b>⦿ supabase.functions</b></code>
					<!-- stripe-checkout Submodule -->
					<details>
						<summary><b>stripe-checkout</b></summary>
						<blockquote>
							<div class='directory-path' style='padding: 8px 0; color: #666;'>
								<code><b>⦿ supabase.functions.stripe-checkout</b></code>
							<table style='width: 100%; border-collapse: collapse;'>
							<thead>
								<tr style='background-color: #f8f9fa;'>
									<th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
									<th style='text-align: left; padding: 8px;'>Summary</th>
								</tr>
							</thead>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='https://github.com/jeevanba273/Expense-Tracker/blob/master/supabase/functions/stripe-checkout/index.ts'>index.ts</a></b></td>
									<td style='padding: 8px;'>- Facilitates the integration of Stripes checkout process within a Supabase environment, enabling users to create payment or subscription sessions<br>- It handles user authentication, customer management, and session creation while ensuring proper error handling and CORS support<br>- This functionality is essential for managing financial transactions seamlessly in the broader application architecture, enhancing user experience and operational efficiency.</td>
								</tr>
							</table>
						</blockquote>
					</details>
					<!-- get-invoice Submodule -->
					<details>
						<summary><b>get-invoice</b></summary>
						<blockquote>
							<div class='directory-path' style='padding: 8px 0; color: #666;'>
								<code><b>⦿ supabase.functions.get-invoice</b></code>
							<table style='width: 100%; border-collapse: collapse;'>
							<thead>
								<tr style='background-color: #f8f9fa;'>
									<th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
									<th style='text-align: left; padding: 8px;'>Summary</th>
								</tr>
							</thead>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='https://github.com/jeevanba273/Expense-Tracker/blob/master/supabase/functions/get-invoice/index.ts'>index.ts</a></b></td>
									<td style='padding: 8px;'>- Facilitates the retrieval of invoice PDFs from Stripe by handling incoming HTTP requests<br>- It processes payment intent IDs, retrieves associated invoices, and serves the invoice as a downloadable PDF<br>- Additionally, it manages CORS headers to ensure compatibility with various clients, enhancing the overall functionality of the Supabase project by integrating payment processing capabilities seamlessly.</td>
								</tr>
							</table>
						</blockquote>
					</details>
					<!-- create-checkout Submodule -->
					<details>
						<summary><b>create-checkout</b></summary>
						<blockquote>
							<div class='directory-path' style='padding: 8px 0; color: #666;'>
								<code><b>⦿ supabase.functions.create-checkout</b></code>
							<table style='width: 100%; border-collapse: collapse;'>
							<thead>
								<tr style='background-color: #f8f9fa;'>
									<th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
									<th style='text-align: left; padding: 8px;'>Summary</th>
								</tr>
							</thead>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='https://github.com/jeevanba273/Expense-Tracker/blob/master/supabase/functions/create-checkout/index.ts'>index.ts</a></b></td>
									<td style='padding: 8px;'>- Facilitates the creation of a checkout session for subscription services using Stripe<br>- It manages customer records by either updating existing customers or creating new ones based on their email<br>- Upon successful session creation, it returns a URL for the checkout process, ensuring a seamless integration with the overall project architecture focused on handling user subscriptions and payments efficiently.</td>
								</tr>
							</table>
						</blockquote>
					</details>
					<!-- create-portal Submodule -->
					<details>
						<summary><b>create-portal</b></summary>
						<blockquote>
							<div class='directory-path' style='padding: 8px 0; color: #666;'>
								<code><b>⦿ supabase.functions.create-portal</b></code>
							<table style='width: 100%; border-collapse: collapse;'>
							<thead>
								<tr style='background-color: #f8f9fa;'>
									<th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
									<th style='text-align: left; padding: 8px;'>Summary</th>
								</tr>
							</thead>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='https://github.com/jeevanba273/Expense-Tracker/blob/master/supabase/functions/create-portal/index.ts'>index.ts</a></b></td>
									<td style='padding: 8px;'>- Facilitates the creation of billing portal sessions for customers using Stripe<br>- By handling incoming requests, it retrieves the customer ID and generates a session URL, allowing users to manage their billing settings seamlessly<br>- Additionally, it ensures proper CORS handling for cross-origin requests, enhancing the integration within the broader application architecture that leverages Supabase and Stripe for user management and billing functionalities.</td>
								</tr>
							</table>
						</blockquote>
					</details>
					<!-- stripe-webhook Submodule -->
					<details>
						<summary><b>stripe-webhook</b></summary>
						<blockquote>
							<div class='directory-path' style='padding: 8px 0; color: #666;'>
								<code><b>⦿ supabase.functions.stripe-webhook</b></code>
							<table style='width: 100%; border-collapse: collapse;'>
							<thead>
								<tr style='background-color: #f8f9fa;'>
									<th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
									<th style='text-align: left; padding: 8px;'>Summary</th>
								</tr>
							</thead>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='https://github.com/jeevanba273/Expense-Tracker/blob/master/supabase/functions/stripe-webhook/index.ts'>index.ts</a></b></td>
									<td style='padding: 8px;'>- Handles Stripe webhook events to manage user subscriptions and preferences within the Supabase database<br>- It processes events such as checkout session completions, subscription updates, and cancellations, ensuring user data reflects the current subscription status<br>- By integrating Stripe and Supabase, it automates user management, enhancing the overall functionality of the application while maintaining compliance with CORS policies for secure communication.</td>
								</tr>
							</table>
						</blockquote>
					</details>
				</blockquote>
			</details>
		</blockquote>
	</details>
	<!-- src Submodule -->
	<details>
		<summary><b>src</b></summary>
		<blockquote>
			<div class='directory-path' style='padding: 8px 0; color: #666;'>
				<code><b>⦿ src</b></code>
			<table style='width: 100%; border-collapse: collapse;'>
			<thead>
				<tr style='background-color: #f8f9fa;'>
					<th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
					<th style='text-align: left; padding: 8px;'>Summary</th>
				</tr>
			</thead>
				<tr style='border-bottom: 1px solid #eee;'>
					<td style='padding: 8px;'><b><a href='https://github.com/jeevanba273/Expense-Tracker/blob/master/src/vite-env.d.ts'>vite-env.d.ts</a></b></td>
					<td style='padding: 8px;'>- Defines TypeScript types for Vite client, enhancing type safety and developer experience within the project<br>- By integrating Vites type definitions, it ensures seamless interaction with Vites features, facilitating efficient development and reducing potential runtime errors<br>- This contributes to the overall architecture by promoting a robust and maintainable codebase, aligning with modern front-end development practices.</td>
				</tr>
				<tr style='border-bottom: 1px solid #eee;'>
					<td style='padding: 8px;'><b><a href='https://github.com/jeevanba273/Expense-Tracker/blob/master/src/stripe-config.ts'>stripe-config.ts</a></b></td>
					<td style='padding: 8px;'>- Defines the configuration for Stripe products within the project, specifically outlining the Pro subscription plan<br>- This configuration facilitates the integration of payment processing by providing essential details such as the price ID, name, and description of the subscription<br>- It plays a crucial role in enabling seamless user access to premium features, thereby enhancing the overall user experience and monetization strategy of the application.</td>
				</tr>
				<tr style='border-bottom: 1px solid #eee;'>
					<td style='padding: 8px;'><b><a href='https://github.com/jeevanba273/Expense-Tracker/blob/master/src/main.tsx'>main.tsx</a></b></td>
					<td style='padding: 8px;'>- Initializes the React application by rendering the main App component within a StrictMode context, ensuring adherence to best practices and highlighting potential issues during development<br>- This entry point serves as the foundation for the entire codebase, linking the user interface with the underlying application logic while applying global styles defined in the accompanying CSS file.</td>
				</tr>
				<tr style='border-bottom: 1px solid #eee;'>
					<td style='padding: 8px;'><b><a href='https://github.com/jeevanba273/Expense-Tracker/blob/master/src/App.tsx'>App.tsx</a></b></td>
					<td style='padding: 8px;'>- Facilitates the main application interface by integrating various components and pages within a structured layout<br>- It manages user authentication and navigation, ensuring a seamless experience across features such as dashboard, transactions, and settings<br>- By leveraging context providers, it maintains application state and handles user interactions, while also displaying an authentication modal when necessary, enhancing user engagement and security throughout the application.</td>
				</tr>
			</table>
			<!-- pages Submodule -->
			<details>
				<summary><b>pages</b></summary>
				<blockquote>
					<div class='directory-path' style='padding: 8px 0; color: #666;'>
						<code><b>⦿ src.pages</b></code>
					<table style='width: 100%; border-collapse: collapse;'>
					<thead>
						<tr style='background-color: #f8f9fa;'>
							<th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
							<th style='text-align: left; padding: 8px;'>Summary</th>
						</tr>
					</thead>
						<tr style='border-bottom: 1px solid #eee;'>
							<td style='padding: 8px;'><b><a href='https://github.com/jeevanba273/Expense-Tracker/blob/master/src/pages/ImportExport.tsx'>ImportExport.tsx</a></b></td>
							<td style='padding: 8px;'>- Facilitates the Import and Export functionality within the application, allowing users to manage their transaction data effectively<br>- It emphasizes data privacy by ensuring that all information is stored locally and provides guidance on backup practices<br>- Additionally, it alerts users about the risks of clearing browser data, ensuring they can restore their information through backups, thereby enhancing user confidence in data management.</td>
						</tr>
						<tr style='border-bottom: 1px solid #eee;'>
							<td style='padding: 8px;'><b><a href='https://github.com/jeevanba273/Expense-Tracker/blob/master/src/pages/Settings.tsx'>Settings.tsx</a></b></td>
							<td style='padding: 8px;'>- Settings component facilitates user management and subscription handling within the application<br>- It displays user settings and subscription plans while providing feedback on payment success<br>- Upon detecting a successful payment, it refreshes user preferences and shows a confirmation message<br>- Additionally, it includes a debug section for developers to manually check subscription status and user preferences, enhancing the overall user experience and administrative capabilities.</td>
						</tr>
						<tr style='border-bottom: 1px solid #eee;'>
							<td style='padding: 8px;'><b><a href='https://github.com/jeevanba273/Expense-Tracker/blob/master/src/pages/Analytics.tsx'>Analytics.tsx</a></b></td>
							<td style='padding: 8px;'>The component utilizes charts to display transaction data, enabling users to easily interpret their financial trends.-<strong>User InteractionIt supports interactive features, such as hovering over chart elements to reveal detailed information, thereby enriching the user experience.-</strong>Contextual IntegrationBy integrating with the application's context, it seamlessly accesses user-specific data, ensuring that the analytics presented are personalized and relevant.In summary, the <code>Analytics.tsx</code> file is a crucial element of the codebase that empowers users to visualize and analyze their financial data effectively, contributing to the overall goal of enhancing financial literacy and management within the application.</td>
						</tr>
						<tr style='border-bottom: 1px solid #eee;'>
							<td style='padding: 8px;'><b><a href='https://github.com/jeevanba273/Expense-Tracker/blob/master/src/pages/Budget.tsx'>Budget.tsx</a></b></td>
							<td style='padding: 8px;'>- Budget management component facilitates users in tracking and managing their financial allocations across various expense categories<br>- It allows users to set, edit, and remove budgets while providing a visual summary of total budgets, expenditures, and usage percentages<br>- By integrating user preferences, it enhances the budgeting experience, ensuring users can effectively monitor their spending habits and make informed financial decisions.</td>
						</tr>
						<tr style='border-bottom: 1px solid #eee;'>
							<td style='padding: 8px;'><b><a href='https://github.com/jeevanba273/Expense-Tracker/blob/master/src/pages/Auth.tsx'>Auth.tsx</a></b></td>
							<td style='padding: 8px;'>- Provides an authentication interface for users to sign up or sign in to their accounts<br>- It facilitates email and password authentication, including password validation and error handling, while also offering an option for Google sign-in<br>- This component enhances user experience by managing authentication states and displaying relevant messages, thereby integrating seamlessly into the overall application architecture focused on user account management.</td>
						</tr>
						<tr style='border-bottom: 1px solid #eee;'>
							<td style='padding: 8px;'><b><a href='https://github.com/jeevanba273/Expense-Tracker/blob/master/src/pages/Goals.tsx'>Goals.tsx</a></b></td>
							<td style='padding: 8px;'>Users can create new financial goals, set target amounts, and specify deadlines, helping them stay organized and focused on their financial aspirations.-<strong>Expense ForecastingThe component calculates and displays forecasts related to user spending, enabling users to make informed decisions about their financial habits and adjustments to their goals.-</strong>User InteractionIt includes modals for adding new goals and upgrading features, enhancing user engagement and experience.In summary, the <code>Goals.tsx</code> file is essential for empowering users to take control of their financial planning, making it a critical component of the overall application architecture.</td>
						</tr>
						<tr style='border-bottom: 1px solid #eee;'>
							<td style='padding: 8px;'><b><a href='https://github.com/jeevanba273/Expense-Tracker/blob/master/src/pages/Dashboard.tsx'>Dashboard.tsx</a></b></td>
							<td style='padding: 8px;'>- Facilitates the user experience on the Dashboard by providing an interactive interface for managing financial transactions<br>- It integrates various components such as QuickStats, ExpenseChart, and TransactionList to present key financial insights<br>- Additionally, it allows users to add transactions seamlessly while ensuring authentication, thereby enhancing user engagement and financial tracking within the overall application architecture.</td>
						</tr>
						<tr style='border-bottom: 1px solid #eee;'>
							<td style='padding: 8px;'><b><a href='https://github.com/jeevanba273/Expense-Tracker/blob/master/src/pages/Transactions.tsx'>Transactions.tsx</a></b></td>
							<td style='padding: 8px;'>- Facilitates the management and visualization of user transactions within the application<br>- It enables users to search, filter, and sort their transactions by various criteria, such as date, amount, category, and type<br>- Additionally, it provides an interface for adding new transactions, enhancing user engagement and financial tracking<br>- This component plays a crucial role in the overall architecture by integrating transaction data with user preferences and contextual features.</td>
						</tr>
						<tr style='border-bottom: 1px solid #eee;'>
							<td style='padding: 8px;'><b><a href='https://github.com/jeevanba273/Expense-Tracker/blob/master/src/pages/PaymentHistory.tsx'>PaymentHistory.tsx</a></b></td>
							<td style='padding: 8px;'>- PaymentHistory component provides users with a comprehensive view of their transaction history, displaying details such as order date, description, amount, and payment status<br>- It facilitates invoice downloads for successful payments, enhancing user experience by allowing easy access to financial records<br>- This component integrates seamlessly within the broader application architecture, leveraging context and external services to deliver dynamic and personalized payment information.</td>
						</tr>
					</table>
				</blockquote>
			</details>
			<!-- utils Submodule -->
			<details>
				<summary><b>utils</b></summary>
				<blockquote>
					<div class='directory-path' style='padding: 8px 0; color: #666;'>
						<code><b>⦿ src.utils</b></code>
					<table style='width: 100%; border-collapse: collapse;'>
					<thead>
						<tr style='background-color: #f8f9fa;'>
							<th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
							<th style='text-align: left; padding: 8px;'>Summary</th>
						</tr>
					</thead>
						<tr style='border-bottom: 1px solid #eee;'>
							<td style='padding: 8px;'><b><a href='https://github.com/jeevanba273/Expense-Tracker/blob/master/src/utils/helpers.ts'>helpers.ts</a></b></td>
							<td style='padding: 8px;'>- Utility functions enhance the overall functionality of the project by providing essential operations for data manipulation and presentation<br>- Key features include generating unique identifiers, formatting currency and dates, calculating daily expenses, and preparing data for visual representation<br>- Additionally, capabilities for exporting transaction data to JSON and CSV formats facilitate user interaction and data management, contributing to a seamless user experience within the application.</td>
						</tr>
						<tr style='border-bottom: 1px solid #eee;'>
							<td style='padding: 8px;'><b><a href='https://github.com/jeevanba273/Expense-Tracker/blob/master/src/utils/check-tables.ts'>check-tables.ts</a></b></td>
							<td style='padding: 8px;'>- Provides utility functions for validating and checking the integrity of database tables within the project<br>- By ensuring that tables meet specific criteria, it enhances data consistency and reliability across the application<br>- This functionality supports the overall architecture by facilitating seamless interactions with the database, ultimately contributing to a robust and maintainable codebase.</td>
						</tr>
						<tr style='border-bottom: 1px solid #eee;'>
							<td style='padding: 8px;'><b><a href='https://github.com/jeevanba273/Expense-Tracker/blob/master/src/utils/supabase.ts'>supabase.ts</a></b></td>
							<td style='padding: 8px;'>- Utility functions facilitate interaction with a Supabase backend, managing transactions, categories, budgets, and user preferences<br>- They enable fetching, creating, updating, and deleting data while ensuring seamless integration with real-time updates<br>- This enhances user experience by providing dynamic data handling and personalized settings, contributing to the overall architecture of a responsive and user-centric application.</td>
						</tr>
						<tr style='border-bottom: 1px solid #eee;'>
							<td style='padding: 8px;'><b><a href='https://github.com/jeevanba273/Expense-Tracker/blob/master/src/utils/storage.ts'>storage.ts</a></b></td>
							<td style='padding: 8px;'>- Provides essential functionality for managing user data in an expense tracking application<br>- It facilitates the storage, retrieval, and manipulation of transactions, categories, budgets, and user preferences using IndexedDB<br>- By ensuring user-specific data handling, it supports features like data export and import, enhancing user experience and data management within the overall architecture of the project.</td>
						</tr>
					</table>
				</blockquote>
			</details>
			<!-- lib Submodule -->
			<details>
				<summary><b>lib</b></summary>
				<blockquote>
					<div class='directory-path' style='padding: 8px 0; color: #666;'>
						<code><b>⦿ src.lib</b></code>
					<table style='width: 100%; border-collapse: collapse;'>
					<thead>
						<tr style='background-color: #f8f9fa;'>
							<th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
							<th style='text-align: left; padding: 8px;'>Summary</th>
						</tr>
					</thead>
						<tr style='border-bottom: 1px solid #eee;'>
							<td style='padding: 8px;'><b><a href='https://github.com/jeevanba273/Expense-Tracker/blob/master/src/lib/supabase.ts'>supabase.ts</a></b></td>
							<td style='padding: 8px;'>- Establishes a Supabase client for seamless interaction with the Supabase backend, ensuring secure authentication and session management<br>- By leveraging environment variables for configuration, it safeguards sensitive information while enabling features like token auto-refresh and session persistence<br>- This integration plays a crucial role in the overall architecture, facilitating data operations and user authentication across the application.</td>
						</tr>
					</table>
				</blockquote>
			</details>
			<!-- components Submodule -->
			<details>
				<summary><b>components</b></summary>
				<blockquote>
					<div class='directory-path' style='padding: 8px 0; color: #666;'>
						<code><b>⦿ src.components</b></code>
					<!-- dashboard Submodule -->
					<details>
						<summary><b>dashboard</b></summary>
						<blockquote>
							<div class='directory-path' style='padding: 8px 0; color: #666;'>
								<code><b>⦿ src.components.dashboard</b></code>
							<table style='width: 100%; border-collapse: collapse;'>
							<thead>
								<tr style='background-color: #f8f9fa;'>
									<th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
									<th style='text-align: left; padding: 8px;'>Summary</th>
								</tr>
							</thead>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='https://github.com/jeevanba273/Expense-Tracker/blob/master/src/components/dashboard/QuickStats.tsx'>QuickStats.tsx</a></b></td>
									<td style='padding: 8px;'>- QuickStats component provides an interactive dashboard feature that displays key financial metrics, including total income, total expenses, and net balance<br>- It enhances user engagement by allowing users to view detailed transaction information through modals<br>- By leveraging user preferences for currency and locale, it ensures a personalized experience, making financial insights accessible and visually appealing within the broader application architecture.</td>
								</tr>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='https://github.com/jeevanba273/Expense-Tracker/blob/master/src/components/dashboard/SpendingTrend.tsx'>SpendingTrend.tsx</a></b></td>
									<td style='padding: 8px;'>- SpendingTrend component visualizes a users spending habits over the past week, providing insights into daily expenditures through an interactive bar chart<br>- It calculates daily totals, displays todays burn rate compared to the 7-day average, and offers contextual information on spending trends<br>- This enhances user engagement by allowing them to track financial behavior and make informed decisions based on their spending patterns.</td>
								</tr>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='https://github.com/jeevanba273/Expense-Tracker/blob/master/src/components/dashboard/TransactionList.tsx'>TransactionList.tsx</a></b></td>
									<td style='padding: 8px;'>- TransactionList component serves as a user interface element that displays a list of recent transactions, allowing users to view, edit, and delete entries<br>- It integrates with the application context to manage transaction data and user preferences, enhancing user interaction with features like sorting, filtering, and modal dialogs for transaction details<br>- Additionally, it supports adding new transactions, contributing to a comprehensive dashboard experience.</td>
								</tr>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='https://github.com/jeevanba273/Expense-Tracker/blob/master/src/components/dashboard/ExpenseChart.tsx'>ExpenseChart.tsx</a></b></td>
									<td style='padding: 8px;'>- ExpenseChart component visualizes user expenses by category, providing an interactive breakdown of spending<br>- It aggregates transaction data, formats it for display, and renders either a pie chart or a simple circle based on the number of categories<br>- Users can hover over segments to see detailed information, enhancing their understanding of financial habits and encouraging better budgeting decisions.</td>
								</tr>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='https://github.com/jeevanba273/Expense-Tracker/blob/master/src/components/dashboard/BudgetOverview.tsx'>BudgetOverview.tsx</a></b></td>
									<td style='padding: 8px;'>- BudgetOverview component provides a visual summary of user budgets, displaying spent amounts and limits for each category<br>- It calculates and ranks budgets based on spending percentage, highlighting the top three budgets<br>- Users can easily identify their financial status through color-coded indicators and access options to manage or create budgets, enhancing their overall budgeting experience within the application.</td>
								</tr>
							</table>
						</blockquote>
					</details>
					<!-- transaction Submodule -->
					<details>
						<summary><b>transaction</b></summary>
						<blockquote>
							<div class='directory-path' style='padding: 8px 0; color: #666;'>
								<code><b>⦿ src.components.transaction</b></code>
							<table style='width: 100%; border-collapse: collapse;'>
							<thead>
								<tr style='background-color: #f8f9fa;'>
									<th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
									<th style='text-align: left; padding: 8px;'>Summary</th>
								</tr>
							</thead>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='https://github.com/jeevanba273/Expense-Tracker/blob/master/src/components/transaction/ImportExport.tsx'>ImportExport.tsx</a></b></td>
									<td style='padding: 8px;'>- Facilitates the import and export of transaction data within the application, allowing users to back up their financial records or restore previously saved data<br>- Users can choose between JSON and CSV formats for export, enhancing data portability<br>- Additionally, it provides feedback on the import status, ensuring a user-friendly experience while prioritizing data privacy by keeping all information stored locally.</td>
								</tr>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='https://github.com/jeevanba273/Expense-Tracker/blob/master/src/components/transaction/AddTransaction.tsx'>AddTransaction.tsx</a></b></td>
									<td style='padding: 8px;'>Allows users to enter transaction amounts, dates, and descriptions.-<strong>Emoji SelectionOffers a categorized list of emojis to visually represent different transaction types, enhancing user engagement.-</strong>Integration with ContextUtilizes the application context to manage state and provide a seamless user experience.In summary, the <code>AddTransaction</code> component is essential for enabling users to effectively manage their financial transactions, thereby supporting the overall goal of the application to provide comprehensive financial tracking and management solutions.</td>
								</tr>
							</table>
						</blockquote>
					</details>
					<!-- settings Submodule -->
					<details>
						<summary><b>settings</b></summary>
						<blockquote>
							<div class='directory-path' style='padding: 8px 0; color: #666;'>
								<code><b>⦿ src.components.settings</b></code>
							<table style='width: 100%; border-collapse: collapse;'>
							<thead>
								<tr style='background-color: #f8f9fa;'>
									<th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
									<th style='text-align: left; padding: 8px;'>Summary</th>
								</tr>
							</thead>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='https://github.com/jeevanba273/Expense-Tracker/blob/master/src/components/settings/SubscriptionPlans.tsx'>SubscriptionPlans.tsx</a></b></td>
									<td style='padding: 8px;'>- Facilitates user interaction with subscription plans, enabling seamless upgrades and management of payment options<br>- It dynamically displays available plans, features, and pricing while handling payment completion and user preference updates<br>- By integrating with Stripe for secure transactions, it ensures users can easily navigate their subscription choices and access premium features, enhancing overall user experience within the application.</td>
								</tr>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='https://github.com/jeevanba273/Expense-Tracker/blob/master/src/components/settings/UserSettings.tsx'>UserSettings.tsx</a></b></td>
									<td style='padding: 8px;'>- UserSettings component facilitates user customization by allowing preferences for currency and locale to be set and saved<br>- It enhances the overall user experience by providing a straightforward interface for adjusting display formats and currency symbols<br>- The component integrates seamlessly within the application architecture, ensuring that user preferences are updated and reflected throughout the application, thereby promoting a personalized user environment.</td>
								</tr>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='https://github.com/jeevanba273/Expense-Tracker/blob/master/src/components/settings/SubscriptionPlans.test.tsx'>SubscriptionPlans.test.tsx</a></b></td>
									<td style='padding: 8px;'>- Testing functionality for the SubscriptionPlans component ensures that users can view available subscription tiers, their pricing, and feature comparisons<br>- It verifies the correct rendering of plans, highlights the current plan, and simulates user interactions for plan selection, ultimately enhancing the user experience by confirming that the subscription options are displayed and function as intended within the application.</td>
								</tr>
							</table>
						</blockquote>
					</details>
					<!-- layout Submodule -->
					<details>
						<summary><b>layout</b></summary>
						<blockquote>
							<div class='directory-path' style='padding: 8px 0; color: #666;'>
								<code><b>⦿ src.components.layout</b></code>
							<table style='width: 100%; border-collapse: collapse;'>
							<thead>
								<tr style='background-color: #f8f9fa;'>
									<th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
									<th style='text-align: left; padding: 8px;'>Summary</th>
								</tr>
							</thead>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='https://github.com/jeevanba273/Expense-Tracker/blob/master/src/components/layout/Sidebar.tsx'>Sidebar.tsx</a></b></td>
									<td style='padding: 8px;'>- Sidebar component enhances user navigation within the application by providing a collapsible interface that organizes key features and settings<br>- It dynamically displays navigation items based on user preferences and access levels, ensuring a tailored experience<br>- Additionally, it incorporates user information at the bottom, fostering a personalized touch while maintaining a clean and responsive design that adapts to different screen sizes.</td>
								</tr>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='https://github.com/jeevanba273/Expense-Tracker/blob/master/src/components/layout/Header.tsx'>Header.tsx</a></b></td>
									<td style='padding: 8px;'>- Header component serves as a dynamic navigation bar for the Zero-Import Expense Tracker application<br>- It enhances user experience by displaying the current date and time, adapting its appearance based on scroll position, and providing user authentication options<br>- The component also integrates user preferences, allowing for personalized plan tier display, and facilitates menu toggling and sign-in/sign-out functionalities, contributing to the overall architecture of a responsive and user-friendly interface.</td>
								</tr>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='https://github.com/jeevanba273/Expense-Tracker/blob/master/src/components/layout/Layout.tsx'>Layout.tsx</a></b></td>
									<td style='padding: 8px;'>- Provides a flexible layout component that structures the applications main interface, integrating a header and a sidebar for navigation<br>- It manages the sidebars visibility and collapse state, ensuring a responsive design<br>- By facilitating navigation and authentication checks, it enhances user experience and accessibility, serving as a foundational element within the overall architecture of the project.</td>
								</tr>
							</table>
						</blockquote>
					</details>
				</blockquote>
			</details>
			<!-- types Submodule -->
			<details>
				<summary><b>types</b></summary>
				<blockquote>
					<div class='directory-path' style='padding: 8px 0; color: #666;'>
						<code><b>⦿ src.types</b></code>
					<table style='width: 100%; border-collapse: collapse;'>
					<thead>
						<tr style='background-color: #f8f9fa;'>
							<th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
							<th style='text-align: left; padding: 8px;'>Summary</th>
						</tr>
					</thead>
						<tr style='border-bottom: 1px solid #eee;'>
							<td style='padding: 8px;'><b><a href='https://github.com/jeevanba273/Expense-Tracker/blob/master/src/types/index.ts'>index.ts</a></b></td>
							<td style='padding: 8px;'>- Defines essential types and interfaces for managing financial transactions, user preferences, and budget tracking within the application<br>- It establishes a structured approach to handle transaction data, categorize expenses, and manage user settings, thereby facilitating a cohesive architecture that supports financial planning and analysis features throughout the codebase.</td>
						</tr>
					</table>
				</blockquote>
			</details>
			<!-- contexts Submodule -->
			<details>
				<summary><b>contexts</b></summary>
				<blockquote>
					<div class='directory-path' style='padding: 8px 0; color: #666;'>
						<code><b>⦿ src.contexts</b></code>
					<table style='width: 100%; border-collapse: collapse;'>
					<thead>
						<tr style='background-color: #f8f9fa;'>
							<th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
							<th style='text-align: left; padding: 8px;'>Summary</th>
						</tr>
					</thead>
						<tr style='border-bottom: 1px solid #eee;'>
							<td style='padding: 8px;'><b><a href='https://github.com/jeevanba273/Expense-Tracker/blob/master/src/contexts/AuthContext.tsx'>AuthContext.tsx</a></b></td>
							<td style='padding: 8px;'>- AuthContext facilitates user authentication and session management within the application<br>- It manages user state, loading status, and the visibility of the authentication modal<br>- By integrating with Supabase, it ensures that only confirmed users can access their preferences and handles sign-out processes while clearing user data<br>- This context enhances the overall user experience by providing a seamless authentication flow across the application.</td>
						</tr>
						<tr style='border-bottom: 1px solid #eee;'>
							<td style='padding: 8px;'><b><a href='https://github.com/jeevanba273/Expense-Tracker/blob/master/src/contexts/AppContext.tsx'>AppContext.tsx</a></b></td>
							<td style='padding: 8px;'>- AppContext serves as a central hub for managing application state related to user transactions, categories, budgets, and preferences<br>- It facilitates data fetching and updates, ensuring real-time synchronization with user-specific data<br>- By providing essential functionalities such as adding, updating, and removing transactions and categories, it enhances user experience and supports financial tracking within the broader architecture of the application.</td>
						</tr>
					</table>
				</blockquote>
			</details>
		</blockquote>
	</details>
</details>

---

## 🚀 Getting Started

### 📋 Prerequisites

This project requires the following dependencies:

- **Programming Language:** TypeScript
- **Package Manager:** Npm

### ⚙️ Installation

Build Expense-Tracker from the source and intsall dependencies:

1. **Clone the repository:**

    ```sh
    git clone https://github.com/jeevanba273/Expense-Tracker
    ```

2. **Navigate to the project directory:**

    ```sh
    cd Expense-Tracker
    ```

3. **Install the dependencies:**

**Using [npm](https://www.npmjs.com/):**

```sh
npm install
```

### 💻 Usage

Run the project with:

**Using [npm](https://www.npmjs.com/):**

```sh
npm start
```

### 🧪 Testing

Expense-tracker uses the {__test_framework__} test framework. Run the test suite with:

**Using [npm](https://www.npmjs.com/):**

```sh
npm test
```

---

## 📈 Roadmap

- [X] **`Task 1`**: <strike>Implement feature one.</strike>
- [ ] **`Task 2`**: Implement feature two.
- [ ] **`Task 3`**: Implement feature three.

---

## 🤝 Contributing

- **💬 [Join the Discussions](https://github.com/jeevanba273/Expense-Tracker/discussions)**: Share your insights, provide feedback, or ask questions.
- **🐛 [Report Issues](https://github.com/jeevanba273/Expense-Tracker/issues)**: Submit bugs found or log feature requests for the `Expense-Tracker` project.
- **💡 [Submit Pull Requests](https://github.com/jeevanba273/Expense-Tracker/blob/main/CONTRIBUTING.md)**: Review open PRs, and submit your own PRs.

<details closed>
<summary>Contributing Guidelines</summary>

1. **Fork the Repository**: Start by forking the project repository to your github account.
2. **Clone Locally**: Clone the forked repository to your local machine using a git client.
   ```sh
   git clone https://github.com/jeevanba273/Expense-Tracker
   ```
3. **Create a New Branch**: Always work on a new branch, giving it a descriptive name.
   ```sh
   git checkout -b new-feature-x
   ```
4. **Make Your Changes**: Develop and test your changes locally.
5. **Commit Your Changes**: Commit with a clear message describing your updates.
   ```sh
   git commit -m 'Implemented new feature x.'
   ```
6. **Push to github**: Push the changes to your forked repository.
   ```sh
   git push origin new-feature-x
   ```
7. **Submit a Pull Request**: Create a PR against the original project repository. Clearly describe the changes and their motivations.
8. **Review**: Once your PR is reviewed and approved, it will be merged into the main branch. Congratulations on your contribution!
</details>

<details closed>
<summary>Contributor Graph</summary>
<br>
<p align="left">
   <a href="https://github.com{/jeevanba273/Expense-Tracker/}graphs/contributors">
      <img src="https://contrib.rocks/image?repo=jeevanba273/Expense-Tracker">
   </a>
</p>
</details>

---

<div align="left"><a href="#top">⬆ Return</a></div>

---
