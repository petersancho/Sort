# Sort System

A comprehensive file organization platform designed to be the foundation for all your projects, finances, and task management needs.

## Features

### 🔍 Intelligent File Scanner
- Automatically categorizes files by type (Documents, Images, Code, Media, etc.)
- Scans common directories (Documents, Downloads, Desktop, Pictures, etc.)
- Smart file organization with customizable rules
- Real-time file monitoring and updates

### 📁 Project Manager
- Template-based project creation
- Pre-configured folder structures for different project types:
  - **Web Development**: Full-stack application structure
  - **Design Project**: Creative workflow organization
  - **Finance Project**: Financial document management
  - **Personal Project**: General project organization
- Automatic file generation with project-specific templates

### 💰 Finance Tracker
- Financial document organization
- Receipt and invoice management
- Budget tracking and analysis
- Tax document organization

### ✅ Todo System
- Task management with file associations
- Project-linked todos
- Priority and status tracking
- Due date management

### 📊 Analytics Dashboard
- System usage insights
- File organization statistics
- Project progress tracking
- Storage optimization recommendations

## Tech Stack

- **Frontend**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS with custom Eurostile Extended font
- **Backend**: Node.js API routes
- **Database**: SQLite for local storage
- **File System**: Node.js fs-extra for file operations
- **Animations**: Framer Motion for smooth interactions

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run the development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

### First Time Setup

1. **Scan Your Files:**
   - Click "Scan All Files" on the dashboard
   - The system will automatically categorize files in your home directory

2. **Create Your First Project:**
   - Navigate to the Projects section
   - Choose a template that fits your needs
   - The system will create organized folder structures

3. **Set Up Finance Tracking:**
   - Use the Finance module to organize receipts and invoices
   - Create budget tracking documents

## Project Structure

```
Sort-main/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── projects/          # Project management pages
│   ├── finance/           # Finance tracking pages
│   ├── todos/             # Todo management pages
│   └── globals.css        # Global styles
├── lib/                   # Core libraries
│   ├── database.ts        # Database management
│   ├── file-scanner.ts    # File scanning logic
│   ├── project-manager.ts # Project management
│   └── finance-tracker.ts # Finance management
├── data/                  # Local database storage
└── public/               # Static assets
```

## API Endpoints

### File Management
- `POST /api/scan-files` - Scan and categorize files
- `GET /api/stats` - Get system statistics
- `GET /api/files` - Get files by category

### Project Management
- `GET /api/projects` - Get all projects
- `POST /api/projects` - Create new project
- `GET /api/projects/templates` - Get available templates

### Finance Tracking
- `GET /api/finance/documents` - Get financial documents
- `POST /api/finance/documents` - Add financial document

### Todo Management
- `GET /api/todos` - Get all todos
- `POST /api/todos` - Create new todo
- `PUT /api/todos/:id` - Update todo

## Customization

### Adding New File Categories
Edit `lib/file-scanner.ts` to add new file types and categories:

```typescript
private categorizeFile(extension: string, mimeType: string): string {
  const ext = extension.toLowerCase()
  
  // Add your custom categories here
  if (['.your-extension'].includes(ext)) {
    return 'Your Category'
  }
  
  // ... existing categories
}
```

### Creating Custom Project Templates
Add new templates to `lib/project-manager.ts`:

```typescript
private templates: { [key: string]: ProjectTemplate } = {
  'your-template': {
    name: 'Your Template',
    description: 'Template description',
    folders: ['folder1', 'folder2'],
    files: [
      {
        name: 'README.md',
        content: 'Your template content'
      }
    ]
  }
}
```

## Security & Privacy

- **Local Storage**: All data is stored locally on your machine
- **No Cloud Sync**: Your files remain private and secure
- **Read-Only Scanning**: The system only reads file information, never modifies files without permission
- **Customizable Rules**: You control how files are organized

## Performance

- **Efficient Scanning**: Only scans when requested
- **Smart Caching**: File information is cached in local database
- **Background Processing**: File operations don't block the UI
- **Optimized Queries**: Fast database operations with proper indexing

## Contributing

This is a personal file organization system. Feel free to fork and customize for your own needs.

## License

Private use only. This system is designed for personal file organization and project management.

---

**Note**: This system is designed to work with macOS and requires appropriate file system permissions to scan directories. Always backup your files before running any file organization operations.
