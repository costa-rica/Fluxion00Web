# Fluxion00Web

## Overview

This project interfaces with the AI Agents of the Fluxion00 API. The agents in the API have tools to query the database and will have tools to access certain files and documentation.

### source of project

This is a starter project for a dashboard application built with Next.js and TypeScript. It will use Tailwind CSS for styling and Redux Toolkit for state management. The navigation and folder structure will use App Router.

## Requriements for this project

This project will be a chat interface for the AI Agents of the Fluxion00 API. This starter project uses Tailwind CSS for the styling and we want to use the same styling as the NewsNexus Portal. The main difference is that the NewsNexus Portal is a news website and the Fluxion00Web is a chat interface for the AI Agents of the Fluxion00 API and it will use websockets to facilitate the chat interface.

This application maybe viewed on a desktop or mobile device. So we want to make sure the application is responsive.

This application will connect with the Fluxion00API on everything except login. The Fluxion00API base url is in the NEXT_PUBLIC_API_BASE_URL env varialbe. The login url is in the NEXT_PUBLIC_API_BASE_URL_FOR_LOGIN env varialbe. The documentation for the Fluxion00API is in the docs folder, docs/API_REFERENCE.md.

### AppSidebar

This will have the username, a toggle for the theme, and NavItems which will be links to the different pages. Right now there will just be a chat page and logout button.

### Login and Authentication

There will be a login page. The login page will accept an email and password and sent to requests using the NEXT_PUBLIC_API_BASE_URL_FOR_LOGIN environment variable. There will be no registration page or reset password page. Any references to register or reset password shoudl be replaced with sending the user to the NewsNexus Portal using the NEXT_PUBLIC_API_BASE_URL_FOR_LOGIN environment variable.

But users who have been logged into the NewsNexus Portal will not need to log in again. The token can be passed from the NewsNexus Portal to the Fluxion00Web project and the Fluxion00API will have the same JWT secret as the NewsNexus Portal to authenticate the user.

- To help accomplish this News Nexus API uses `const jwt = require("jsonwebtoken");` to code the JWT token.

### Chat page

The chat page will be modular. It will have a chat window with the chat history that is scrollable. The chat window will have a text input field and a send button. There will also be a component that will display a status log of the agent's actions.

For starters let's build a simple chat interface that will use websockets to facilitate the chat interface. Currently the API does not support the status and log of the agent's actions yet.
