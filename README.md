# Antique Body

A Next.js application with authentication, MySQL database, and Prisma ORM.

## Setup Guide

### 1. MySQL Server Setup

1. Download and install MySQL Server from [MySQL Downloads](https://dev.mysql.com/downloads/mysql/)
2. Follow the installation instructions for your operating system
3. Make sure the MySQL service is running

### 2. Create Database

1. Open terminal/command prompt
2. Connect to MySQL with:
   ```bash
   mysql -u root -p
   ```
3. Enter your password when prompted
4. Create a new database:
   ```sql
   CREATE DATABASE antique_body;
   ```
5. Exit MySQL:
   ```sql
   EXIT;
   ```

### 3. Project Setup

1. Install project dependencies:
   ```bash
   npm install
   ```

### 4. Prisma Setup

1. Initialize Prisma:

   ```bash
   npx prisma init
   ```

2. Configure the database connection in the `.env` file:

   ```
   DATABASE_URL="mysql://root:password@localhost:3306/antique_body"
   ```

   Replace `password` with your MySQL password

3. Run Prisma migrations:

   ```bash
   npx prisma migrate dev --name init
   ```

4. Open Prisma Studio to manage your database:
   ```bash
   npx prisma studio
   ```

### 5. VSCode Settings (Recommended)

To avoid code style conflicts and ensure a consistent development experience across the team, create a .vscode/settings.json file in your project root with the following content:

 ```bash
{
  "editor.formatOnSave": true,
  "files.autoSave": "afterDelay",
  "editor.tabSize": 4,
  "editor.insertSpaces": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit",
    "source.organizeImports": "explicit"
  },
  "eslint.validate": ["typescript", "typescriptreact"],
  "[typescript]": {
    "editor.codeActionsOnSave": {
      "source.organizeImports": "explicit"
    }
  },
  "[typescriptreact]": {
    "editor.codeActionsOnSave": {
      "source.organizeImports": "explicit"
    }
  },
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "[php]": {
    "editor.defaultFormatter": "bmewburn.vscode-intelephense-client"
  }
}
   ```
📁 Folder structure:

```bash
/project-root
  ├── antique_body/
  └── .vscode/
        └── settings.json
```

### 6. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Documentation

For detailed information about the project architecture, features, and development guidelines, refer to the [official project documentation](https://docs.google.com/document/d/1uhMHEOEpmGGR_CIzmqTFkvjIex92ZNdqMljhpRSzTG8/edit?tab=t.0).

## Pull Request Guidelines

### Naming Convention

All pull requests should follow this naming pattern:

```
WPR/[issue-number]-name_of_feature
```

Example:

```
WPR/1-user_authentication
```

## Technologies

- [Next.js](https://nextjs.org/)
- [NextAuth.js](https://next-auth.js.org/)
- [Prisma](https://www.prisma.io/)
- [MySQL](https://www.mysql.com/)
- [React](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
