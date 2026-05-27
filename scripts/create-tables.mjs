import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import pkg from 'pg';

const { Client } = pkg;

const __dirname = dirname(fileURLToPath(import.meta.url));

function loadEnv() {
    const envPath = resolve(__dirname, '..', '.env.local');
    try {
        const content = readFileSync(envPath, 'utf-8');
        for (const line of content.split('\n')) {
            const trimmed = line.trim();
            if (!trimmed || trimmed.startsWith('#')) continue;
            const eq = trimmed.indexOf('=');
            if (eq === -1) continue;
            const key = trimmed.slice(0, eq).trim();
            const value = trimmed.slice(eq + 1).trim();
            if (!process.env[key]) {
                process.env[key] = value;
            }
        }
    } catch {
        console.warn('Warning: .env.local not found, using existing env vars only');
    }
}

function getConnectionString() {
    if (process.env.DATABASE_URL) {
        return process.env.DATABASE_URL;
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!supabaseUrl) {
        throw new Error(
            'Missing DATABASE_URL and NEXT_PUBLIC_SUPABASE_URL. ' +
                'Set DATABASE_URL=postgresql://postgres:password@host:5432/postgres in .env.local'
        );
    }

    const url = new URL(supabaseUrl);
    const host = url.hostname;
    const dbPassword = process.env.DATABASE_PASSWORD ?? process.env.POSTGRES_PASSWORD ?? 'postgres';
    const dbUser = process.env.DATABASE_USER ?? 'postgres';
    const dbName = process.env.DATABASE_NAME ?? 'postgres';

    return `postgresql://${dbUser}:${dbPassword}@${host}:5432/${dbName}`;
}

async function main() {
    loadEnv();

    const connectionString = getConnectionString();
    console.log(`Connecting to database at ${connectionString.replace(/\/\/.*@/, '//***@')}...`);

    const client = new Client({ connectionString });
    await client.connect();

    try {
        const sqlPath = resolve(__dirname, 'schema.sql');
        const sql = readFileSync(sqlPath, 'utf-8');
        console.log(`Executing schema from ${sqlPath}...`);
        await client.query(sql);
        console.log('All tables created successfully.');
    } finally {
        await client.end();
    }
}

main().catch((err) => {
    console.error('Failed to create tables:', err.message);
    process.exit(1);
});
