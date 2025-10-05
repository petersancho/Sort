import { NextRequest, NextResponse } from 'next/server'
import { FileScanner } from '@/lib/file-scanner'
import { database } from '@/lib/database'
import os from 'os'
import path from 'path'
import fs from 'fs-extra'

export async function POST(request: NextRequest) {
  try {
    await database.initialize()
    
    const scanner = new FileScanner()
    const homeDir = os.homedir()
    
    // Define directories to scan (check if they exist first)
    const possibleDirectories = [
      path.join(homeDir, 'Documents'),
      path.join(homeDir, 'Downloads'),
      path.join(homeDir, 'Desktop'),
      path.join(homeDir, 'Pictures'),
      path.join(homeDir, 'Movies'),
      path.join(homeDir, 'Music'),
      path.join(homeDir, 'Documents', 'Projects'),
      path.join(homeDir, 'Documents', 'Work'),
      path.join(homeDir, 'Documents', 'Personal')
    ]
    
    // Filter to only existing directories
    const directoriesToScan = []
    for (const dir of possibleDirectories) {
      try {
        const exists = await fs.pathExists(dir)
        if (exists) {
          const stat = await fs.stat(dir)
          if (stat.isDirectory()) {
            directoriesToScan.push(dir)
          }
        }
      } catch (error) {
        console.log(`Directory ${dir} not accessible:`, error.message)
      }
    }
    
    console.log(`Scanning ${directoriesToScan.length} directories:`, directoriesToScan)
    
    let allFiles: any[] = []
    
    for (const dir of directoriesToScan) {
      try {
        console.log(`Scanning directory: ${dir}`)
        const files = await scanner.scanDirectory(dir, true)
        console.log(`Found ${files.length} files in ${dir}`)
        allFiles.push(...files)
      } catch (error) {
        console.error(`Error scanning ${dir}:`, error)
      }
    }
    
    console.log(`Total files found: ${allFiles.length}`)
    
    // Save files to database
    if (allFiles.length > 0) {
      await scanner.saveFilesToDatabase(allFiles)
    }
    
    // Get updated stats
    const stats = await scanner.getSystemStats()
    
    return NextResponse.json({
      success: true,
      message: `Scanned ${allFiles.length} files from ${directoriesToScan.length} directories`,
      stats,
      filesScanned: allFiles.length,
      directoriesScanned: directoriesToScan
    })
    
  } catch (error) {
    console.error('Scan error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to scan files: ' + error.message },
      { status: 500 }
    )
  }
}
