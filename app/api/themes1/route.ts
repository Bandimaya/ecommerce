import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

// Use a temporary file for storing the theme settings on the server.
// In a real application, this would be a database.
const tempDir = 'C:\\Users\\gurug\\.gemini\\tmp\\7d5cbbd579eccd1430f11027dbe4ff93ea8b44987b403bdf4b12e5dceb935f3c9';
const themeFilePath = path.join(tempDir, 'theme.json');

async function ensureDirExists() {
    try {
        await fs.access(tempDir);
    } catch {
        await fs.mkdir(tempDir, { recursive: true });
    }
}

/**
 * Handles POST requests to save the theme configuration.
 */
export async function POST(request: NextRequest) {
    try {
        await ensureDirExists();
        const body = await request.json();
        
        // Basic validation
        if (!body || typeof body !== 'object') {
            return NextResponse.json({ success: false, message: 'Invalid theme data.' }, { status: 400 });
        }

        const currentData = JSON.stringify(body, null, 2);
        await fs.writeFile(themeFilePath, currentData, 'utf8');

        return NextResponse.json({ success: true, message: 'Theme saved successfully.' });
    } catch (error) {
        console.error('Error saving theme:', error);
        return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
    }
}

/**
 * Handles GET requests to fetch the theme configuration.
 */
export async function GET() {
    try {
        await ensureDirExists();
        const fileContent = await fs.readFile(themeFilePath, 'utf8');
        const themeConfig = JSON.parse(fileContent);
        return NextResponse.json({ success: true, data: themeConfig });
    } catch (error: any) {
        // If the file doesn't exist, it's not an error, just means no theme is saved yet.
        if (error.code === 'ENOENT') {
            return NextResponse.json({ success: true, data: null });
        }
        console.error('Error fetching theme:', error);
        return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
    }
}
