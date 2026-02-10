/**
 * Script per automatizzare patch version, commit e push
 * Uso: node deploy.mjs [messaggio_commit_opzionale]
 */

import { execSync } from 'child_process';
import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

// Config
const PACKAGE_PATH = resolve('./package.json');
const BRANCH = 'main'; // o master

// Helper per eseguire comandi
const run = (cmd) => {
    console.log(`> ${cmd}`);
    try {
        execSync(cmd, { stdio: 'inherit' });
    } catch (error) {
        console.error(`Errore eseguendo comando: ${cmd}`);
        process.exit(1);
    }
};

// 1. Leggi versione corrente
const pkg = JSON.parse(readFileSync(PACKAGE_PATH, 'utf-8'));
const currentVersion = pkg.version;
console.log(`Versione corrente: ${currentVersion}`);

// 2. Incrementa patch version (semplice semver bump)
const versionParts = currentVersion.split('.').map(Number);
versionParts[2] += 1;
const newVersion = versionParts.join('.');
console.log(`Nuova versione: ${newVersion}`);

// 3. Aggiorna package.json
pkg.version = newVersion;
writeFileSync(PACKAGE_PATH, JSON.stringify(pkg, null, 2) + '\n');

// 4. Git commands
const commitMsg = process.argv[2] || `chore: release version ${newVersion}`;

console.log('Eseguendo git add...');
// Usiamo exclude per evitare problemi con "nul" su Windows se presente
// Ma se 'nul' non esiste, il comando potrebbe fallire o ignorarlo.
// Proviamo add . generico, se fallisce proviamo con exclude
try {
    execSync('git add .', { stdio: 'inherit' });
} catch (e) {
    console.warn('git add . fallito, provo con exclude nul...');
    try {
        execSync('git add . -- ":(exclude)nul"', { stdio: 'inherit' });
    } catch (e2) {
        console.error('Impossibile aggiungere i file a git.');
        process.exit(1);
    }
}

console.log(`Commit con messaggio: "${commitMsg}"`);
run(`git commit -m "${commitMsg}"`);

console.log('Push su remoto...');
run(`git push origin ${BRANCH}`);

console.log('Deploy completato con successo! 🚀');
