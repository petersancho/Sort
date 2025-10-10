import fs from 'fs-extra'
import path from 'path'
import { promisify } from 'util'
import { database } from './database'

export interface ProjectTemplate {
  name: string
  description: string
  folders: string[]
  files: { name: string; content: string }[]
}

export interface Project {
  id?: number
  name: string
  description: string
  path: string
  template: string
  created_at?: string
  updated_at?: string
  status: 'active' | 'archived' | 'completed'
  metadata?: any
}

export class ProjectManager {
  private db = database.getDB()
  private run = promisify(this.db.run.bind(this.db))
  private all = promisify(this.db.all.bind(this.db))
  private get = promisify(this.db.get.bind(this.db))

  private templates: { [key: string]: ProjectTemplate } = {
    'web-development': {
      name: 'Web Development',
      description: 'Full-stack web application project',
      folders: [
        'src/components',
        'src/pages',
        'src/styles',
        'src/utils',
        'src/hooks',
        'public/images',
        'public/icons',
        'docs',
        'tests',
        'assets/designs',
        'assets/mockups'
      ],
      files: [
        {
          name: 'README.md',
          content: `# Project Name

## Description
Project description here

## Getting Started
\`\`\`bash
npm install
npm run dev
\`\`\`

## Project Structure
- \`src/\` - Source code
- \`public/\` - Static assets
- \`docs/\` - Documentation
- \`tests/\` - Test files
`
        },
        {
          name: '.gitignore',
          content: `# Dependencies
node_modules/
npm-debug.log*

# Production builds
dist/
build/

# Environment variables
.env
.env.local

# IDE
.vscode/
.idea/

# OS
.DS_Store
Thumbs.db
`
        }
      ]
    },
    'design-project': {
      name: 'Design Project',
      description: 'Creative design project with assets and documentation',
      folders: [
        '01-research',
        '02-concepts',
        '03-refinements',
        '04-final',
        'assets/source',
        'assets/exports',
        'assets/resources',
        'presentations',
        'documentation'
      ],
      files: [
        {
          name: 'PROJECT_BRIEF.md',
          content: `# Design Project Brief

## Project Overview
Design project description here

## Deliverables
- [ ] Research documentation
- [ ] Concept explorations
- [ ] Final designs
- [ ] Presentation materials

## Timeline
- Research: Week 1
- Concepts: Week 2
- Refinements: Week 3
- Final: Week 4
`
        }
      ]
    },
    'finance-project': {
      name: 'Finance Project',
      description: 'Financial tracking and analysis project',
      folders: [
        'receipts',
        'invoices',
        'statements',
        'budgets',
        'reports',
        'tax-documents',
        'contracts',
        'analysis'
      ],
      files: [
        {
          name: 'BUDGET.md',
          content: `# Financial Project Budget

## Project Overview
Financial project description here

## Budget Categories
- Income: $0.00
- Expenses: $0.00
- Net: $0.00

## Tracking
- Monthly reviews
- Quarterly analysis
- Annual summary
`
        }
      ]
    },
    'personal-project': {
      name: 'Personal Project',
      description: 'General personal project organization',
      folders: [
        'planning',
        'resources',
        'notes',
        'output',
        'archive'
      ],
      files: [
        {
          name: 'PROJECT_NOTES.md',
          content: `# Personal Project

## Overview
Personal project description here

## Goals
- [ ] Goal 1
- [ ] Goal 2
- [ ] Goal 3

## Notes
- Add your notes here

## Resources
- Useful links and resources
`
        }
      ]
    }
  }

  async createProject(project: Project, basePath?: string): Promise<Project> {
    const template = this.templates[project.template]
    if (!template) {
      throw new Error(`Template '${project.template}' not found`)
    }

    // Set default path if not provided
    if (!project.path) {
      const homeDir = require('os').homedir()
      project.path = path.join(homeDir, 'Projects', project.name)
    }

    // Create project directory structure
    await this.createProjectStructure(project.path, template)

    // Save to database
    const result = await (this.run as any)(`
      INSERT INTO projects (name, description, path, template, status, metadata)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [
      project.name,
      project.description,
      project.path,
      project.template,
      project.status || 'active',
      JSON.stringify(project.metadata || {})
    ])

    return {
      ...project,
      id: (result as any).lastID,
      path: project.path
    }
  }

  private async createProjectStructure(projectPath: string, template: ProjectTemplate) {
    // Create main project directory
    await fs.ensureDir(projectPath)

    // Create folders
    for (const folder of template.folders) {
      await fs.ensureDir(path.join(projectPath, folder))
    }

    // Create files
    for (const file of template.files) {
      const filePath = path.join(projectPath, file.name)
      await fs.writeFile(filePath, file.content)
    }
  }

  async getProjects(): Promise<Project[]> {
    return await (this.all as any)('SELECT * FROM projects ORDER BY created_at DESC')
  }

  async getProject(id: number): Promise<Project | null> {
    return await (this.get as any)('SELECT * FROM projects WHERE id = ?', [id])
  }

  async updateProject(id: number, updates: Partial<Project>): Promise<void> {
    const fields = []
    const values = []

    for (const [key, value] of Object.entries(updates)) {
      if (key !== 'id' && value !== undefined) {
        fields.push(`${key} = ?`)
        values.push(typeof value === 'object' ? JSON.stringify(value) : value)
      }
    }

    if (fields.length === 0) return

    fields.push('updated_at = CURRENT_TIMESTAMP')
    values.push(id)

    await (this.run as any)(`
      UPDATE projects 
      SET ${fields.join(', ')}
      WHERE id = ?
    `, values)
  }

  async deleteProject(id: number): Promise<void> {
    await (this.run as any)('DELETE FROM projects WHERE id = ?', [id])
  }

  getAvailableTemplates(): ProjectTemplate[] {
    return Object.values(this.templates)
  }

  getTemplate(name: string): ProjectTemplate | null {
    return this.templates[name] || null
  }

  async getProjectStats() {
    const total: any = await (this.get as any)('SELECT COUNT(*) as count FROM projects')
    const active: any = await (this.get as any)('SELECT COUNT(*) as count FROM projects WHERE status = "active"')
    const completed: any = await (this.get as any)('SELECT COUNT(*) as count FROM projects WHERE status = "completed"')
    const archived: any = await (this.get as any)('SELECT COUNT(*) as count FROM projects WHERE status = "archived"')

    return {
      total: total?.count || 0,
      active: active?.count || 0,
      completed: completed?.count || 0,
      archived: archived?.count || 0
    }
  }
}
