#!/usr/bin/env node

/**
 * Simple development server for TestProject Todo App
 * Builds TypeScript files and serves them with hot reload
 */

import { createServer } from 'http';
import { readFileSync, existsSync, statSync, watchFile } from 'fs';
import { join, dirname, extname } from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 3000;

// MIME types for different file extensions
const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

let isBuilding = false;

function buildProject() {
  if (isBuilding) return Promise.resolve();
  
  isBuilding = true;
  console.log('🔨 Building project...');
  
  return new Promise((resolve, reject) => {
    const build = spawn('npm', ['run', 'build'], { 
      stdio: 'inherit',
      shell: true 
    });
    
    build.on('close', (code) => {
      isBuilding = false;
      if (code === 0) {
        console.log('✅ Build completed successfully');
        resolve();
      } else {
        console.error('❌ Build failed with code:', code);
        reject(new Error(`Build failed with code ${code}`));
      }
    });
  });
}

function serveFile(filePath, res) {
  try {
    const ext = extname(filePath);
    const mimeType = MIME_TYPES[ext] || 'text/plain';
    
    if (!existsSync(filePath)) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('File not found');
      return;
    }
    
    const content = readFileSync(filePath);
    res.writeHead(200, { 
      'Content-Type': mimeType,
      'Cache-Control': 'no-cache'
    });
    res.end(content);
  } catch (error) {
    console.error('Error serving file:', error);
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Internal Server Error');
  }
}

const server = createServer(async (req, res) => {
  console.log(`📡 ${req.method} ${req.url}`);
  
  // Parse URL
  let pathname = new URL(req.url, `http://localhost:${PORT}`).pathname;
  
  // Default to index.html for root
  if (pathname === '/') {
    pathname = '/index.html';
  }
  
  // Remove leading slash
  const relativePath = pathname.startsWith('/') ? pathname.slice(1) : pathname;
  
  // Try to serve from root first, then from dist
  let filePath = join(__dirname, relativePath);
  
  if (!existsSync(filePath) && relativePath.endsWith('.js')) {
    filePath = join(__dirname, 'dist', relativePath);
  }
  
  if (!existsSync(filePath) && pathname === '/index.html') {
    filePath = join(__dirname, 'index.html');
  }
  
  // Handle CSS files from src
  if (relativePath.endsWith('.css')) {
    const srcPath = join(__dirname, 'src', relativePath);
    if (existsSync(srcPath)) {
      filePath = srcPath;
    }
  }
  
  serveFile(filePath, res);
});

// Watch for changes and rebuild
function setupWatcher() {
  const watchPaths = [
    join(__dirname, 'src'),
    join(__dirname, 'tsconfig.json'),
    join(__dirname, 'package.json')
  ];
  
  watchPaths.forEach(watchPath => {
    if (existsSync(watchPath)) {
      if (statSync(watchPath).isDirectory()) {
        // For directories, we'd need to implement recursive watching
        // For now, just watch the main source file
        const indexPath = join(watchPath, 'index.ts');
        if (existsSync(indexPath)) {
          watchFile(indexPath, { interval: 1000 }, () => {
            console.log('📝 Source files changed, rebuilding...');
            buildProject().catch(console.error);
          });
        }
      } else {
        watchFile(watchPath, { interval: 1000 }, () => {
          console.log('📝 Configuration changed, rebuilding...');
          buildProject().catch(console.error);
        });
      }
    }
  });
}

// Start the server
async function start() {
  try {
    // Initial build
    await buildProject();
    
    // Start server
    server.listen(PORT, () => {
      console.log(`🚀 Dev server running at http://localhost:${PORT}`);
      console.log('📁 Serving files from current directory and dist/');
      console.log('👀 Watching for changes...\n');
    });
    
    // Setup file watching
    setupWatcher();
    
  } catch (error) {
    console.error('Failed to start development server:', error);
    process.exit(1);
  }
}

start();