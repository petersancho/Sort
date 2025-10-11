import { NextRequest, NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'
import path from 'path'
import fs from 'fs-extra'
import { database } from '@/lib/database'

export async function POST(request: NextRequest) {
  try {
    await database.initialize()
    const db = database.getDB()

    const { fromPath, toDirectory, toPath } = await request.json()

    if (!fromPath || (!toDirectory && !toPath)) {
      return NextResponse.json(
        { success: false, error: 'fromPath and (toDirectory or toPath) are required' },
        { status: 400 }
      )
    }

    const targetPath = toPath || path.join(toDirectory, path.basename(fromPath))

    await fs.ensureDir(path.dirname(targetPath))
    await fs.move(fromPath, targetPath, { overwrite: false })

    const name = path.parse(targetPath).name
    const ext = path.parse(targetPath).ext.toLowerCase()

    await new Promise<void>((resolve, reject) => {
      db.run(
        `UPDATE files SET path = ?, name = ?, extension = ?, modified_at = CURRENT_TIMESTAMP WHERE path = ?`,
        [targetPath, name, ext, fromPath],
        (err) => (err ? reject(err) : resolve())
      )
    })

    return NextResponse.json({ success: true, path: targetPath })
  } catch (error) {
    console.error('Move error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to move file' },
      { status: 500 }
    )
  }
}


