import React, { useEffect, useMemo, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';

type GitStats = {
  followers: number;
  public_repos: number;
  stars: number;
  recentCommits: number; // approximate via recent PushEvent commits
};

// Helper function to extract username from GitHub URL or return as-is if already a username
function extractUsername(input: string): string {
  if (!input) return '';
  
  // Remove whitespace
  const trimmed = input.trim();
  
  // If it looks like a URL, extract the username
  if (trimmed.includes('github.com/')) {
    // Handle various GitHub URL formats
    const match = trimmed.match(/github\.com\/([^/?#]+)/);
    return match ? match[1] : trimmed;
  }
  
  // If it starts with @, remove it
  if (trimmed.startsWith('@')) {
    return trimmed.substring(1);
  }
  
  // Otherwise, assume it's already a username
  return trimmed;
}

async function fetchGithubStats(username: string, token?: string): Promise<GitStats> {
  const headers: Record<string, string> = { Accept: 'application/vnd.github.v3+json' };
  if (token) headers['Authorization'] = `token ${token}`;

  // fetch user summary
  const userRes = await fetch(`https://api.github.com/users/${encodeURIComponent(username)}`, { headers });
  if (!userRes.ok) throw new Error(`Failed to fetch user: ${userRes.status}`);
  const u = await userRes.json();

  // fetch repos (public, up to 100)
  const reposRes = await fetch(`https://api.github.com/users/${encodeURIComponent(username)}/repos?per_page=100`, { headers });
  if (!reposRes.ok) throw new Error(`Failed to fetch repos: ${reposRes.status}`);
  const repos = await reposRes.json();
  const stars = Array.isArray(repos) ? repos.reduce((s: number, r: any) => s + (r.stargazers_count || 0), 0) : 0;

  // fetch recent public events to estimate commits (PushEvent payloads)
  let recentCommits = 0;
  try {
    const eventsRes = await fetch(`https://api.github.com/users/${encodeURIComponent(username)}/events/public`, { headers });
    if (eventsRes.ok) {
      const events = await eventsRes.json();
      if (Array.isArray(events)) {
        for (const ev of events) {
          if (ev.type === 'PushEvent' && ev.payload && Array.isArray(ev.payload.commits)) {
            recentCommits += ev.payload.commits.length;
          }
        }
      }
    }
  } catch (e) {
    // ignore events failure
  }

  return {
    followers: u.followers || 0,
    public_repos: u.public_repos || 0,
    stars: stars || 0,
    recentCommits: recentCommits || 0,
  };
}

const MetricBox: React.FC<{ x: number; value: number; label: string; color: string; max: number }> = ({ x, value, label, color, max }) => {
  // map value to height
  const height = Math.max(0.2, (value / Math.max(1, max)) * 4);
  return (
    <group position={[x, height / 2, 0]}>
      <mesh>
        <boxGeometry args={[0.9, height, 0.9]} />
        <meshStandardMaterial color={color} metalness={0.4} roughness={0.6} />
      </mesh>
      <Html position={[0, height / 2 + 0.3, 0]} center>
        <div style={{ background: 'rgba(12,14,20,0.8)', color: 'white', padding: '6px 8px', borderRadius: 8, fontSize: 12, textAlign: 'center', minWidth: 80 }}>
          <div style={{ fontWeight: 800 }}>{label}</div>
          <div style={{ fontSize: 14, marginTop: 6 }}>{value}</div>
        </div>
      </Html>
    </group>
  );
};

const Github3DDashboard: React.FC<{ username?: string; token?: string; onBack?: () => void }> = ({ username: initialUsername, token: initialToken, onBack }) => {
  const [username, setUsername] = useState(extractUsername(initialUsername || ''));
  const [token, setToken] = useState(initialToken || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<GitStats | null>(null);

  useEffect(() => {
    const cleanUsername = extractUsername(initialUsername || '');
    if (cleanUsername) {
      // Update state with cleaned username
      setUsername(cleanUsername);
      
      // small delay
      setTimeout(() => {
        (async () => {
          try {
            setLoading(true);
            setError(null);
            const s = await fetchGithubStats(cleanUsername, initialToken);
            setStats(s);
          } catch (e: any) {
            setError(e.message || 'Failed to fetch');
          } finally {
            setLoading(false);
          }
        })();
      }, 120);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialUsername]);

  const doFetch = async () => {
    const cleanUsername = extractUsername(username);
    if (!cleanUsername) return setError('Enter a username');
    setLoading(true);
    setError(null);
    try {
      const s = await fetchGithubStats(cleanUsername, token);
      setStats(s);
      setUsername(cleanUsername); // Update to cleaned version
    } catch (e: any) {
      setError(e.message || 'Failed to fetch');
    } finally {
      setLoading(false);
    }
  };

  const metrics = useMemo(() => {
    if (!stats) return [];
    return [
      { key: 'followers', value: stats.followers, label: 'Followers', color: '#61dafb' },
      { key: 'public_repos', value: stats.public_repos, label: 'Repos', color: '#90ee90' },
      { key: 'stars', value: stats.stars, label: 'Stars', color: '#ffd166' },
      { key: 'recentCommits', value: stats.recentCommits, label: 'Recent commits', color: '#f68b8b' },
    ];
  }, [stats]);

  const max = useMemo(() => {
    if (!metrics.length) return 1;
    return Math.max(...metrics.map(m => m.value), 1);
  }, [metrics]);

  return (
    <div className="p-8 md:p-12 bg-white dark:bg-gray-800 min-h-[70vh] transition-colors duration-500">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-gray-800 dark:text-gray-200">3D GitHub Dashboard</h1>
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="px-3 py-1 rounded-md bg-gray-700 text-white">Back</button>
          </div>
        </div>

        <div className="mb-4 flex gap-3 items-center">
          <input 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            placeholder="GitHub username or URL (e.g. nicokuehn-dci or https://github.com/nicokuehn-dci)" 
            className="flex-1 bg-transparent border border-gray-200 dark:border-gray-700 rounded-md px-3 py-2 focus:outline-none text-gray-800 dark:text-gray-200" 
          />
          <input 
            value={token} 
            onChange={(e) => setToken(e.target.value)} 
            placeholder="Optional token" 
            type="password" 
            className="w-64 bg-transparent border border-gray-200 dark:border-gray-700 rounded-md px-3 py-2 focus:outline-none text-gray-800 dark:text-gray-200" 
          />
          <button onClick={doFetch} disabled={loading} className="px-4 py-2 rounded-md bg-gradient-to-r from-indigo-600 to-violet-600 text-white disabled:opacity-50">
            {loading ? 'Fetching...' : 'Fetch'}
          </button>
        </div>

        {loading && <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">Fetching GitHub data for <strong>{username}</strong>…</div>}
        {error && <div className="text-sm text-red-600 dark:text-red-400 mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
          <strong>Error:</strong> {error}
          {error.includes('404') && <div className="mt-1 text-xs">Username "{username}" not found. Please check the spelling or try a different username.</div>}
        </div>}

        <div style={{ height: 520, borderRadius: 12, overflow: 'hidden', background: 'linear-gradient(180deg, #0b1220, #07101a)' }}>
          <Canvas camera={{ position: [0, 3, 8], fov: 50 }}>
            <ambientLight intensity={0.6} />
            <directionalLight position={[5, 10, 5]} intensity={1} />
            <directionalLight position={[-5, -5, -5]} intensity={0.4} />
            <group position={[0, 0, 0]}>
              {/* ground */}
              <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
                <planeGeometry args={[40, 40]} />
                <meshStandardMaterial color="#05060a" metalness={0.2} roughness={0.85} />
              </mesh>

              {/* metric boxes */}
              {metrics.map((m, i) => (
                <MetricBox key={m.key} x={(i - (metrics.length - 1) / 2) * 1.6} value={m.value} label={m.label} color={m.color} max={max} />
              ))}
            </group>
            <OrbitControls enablePan={true} enableZoom={true} />
          </Canvas>
        </div>

        <div className="mt-4 text-sm text-gray-400">Stats are fetched live from the GitHub API. Recent commit count is an approximate value derived from recent public events.</div>
      </div>
    </div>
  );
};

export default Github3DDashboard;
