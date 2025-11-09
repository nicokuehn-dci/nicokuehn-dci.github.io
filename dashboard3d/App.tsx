import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChartContainer } from './components/ChartContainer';
import { RadarChartViz } from './components/RadarChartViz';
import { BarChartViz } from './components/BarChartViz';
import { PieChartViz } from './components/PieChartViz';
import { GITHUB_USERNAME } from './constants';

// --- Interfaces ---
interface Repo {
  id: number;
  name: string;
  stargazers_count: number;
  language: string;
  size: number;
  full_name: string;
  pushed_at: string;
  topics: string[];
}

interface RadarDataPoint {
  subject: string;
  A: number;
  fullMark: number;
}

interface BarDataPoint {
    name: string;
    value: number;
}

interface PieDataPoint {
    name: string;
    value: number;
}

interface RadarChart {
  title: string;
  type: 'radar';
  data: RadarDataPoint[];
}

interface BarChart {
    title: string;
    type: 'bar';
    data: BarDataPoint[];
}

interface PieChart {
    title: string;
    type: 'pie';
    data: PieDataPoint[];
}

type Chart = RadarChart | BarChart | PieChart;

// --- New Interface for Carousel Item ---
interface ChartCarouselItem {
  id: string; // Unique ID for updating
  title: string;
  type: 'radar' | 'bar' | 'pie'; // Used for potential skeleton loading
  data: Chart | null; // The actual chart data, or null if loading/error
  isLoading: boolean;
  errorMessage: string | null;
}


const App: React.FC = () => {
  const [charts, setCharts] = useState<ChartCarouselItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [globalLoading, setGlobalLoading] = useState(true); // Renamed from 'loading'
  const [globalError, setGlobalError] = useState<string | null>(null); // Renamed from 'error'
  const [loadingMessage, setLoadingMessage] = useState('Analyzing GitHub profile...');

  // Use a ref to hold the current definitions of the charts for incremental updates
  const chartStatesRef = useRef<ChartCarouselItem[]>([]);

  // Callback to update a specific chart in the ref and trigger a re-render
  const updateChartState = useCallback((id: string, update: Partial<ChartCarouselItem>) => {
    chartStatesRef.current = chartStatesRef.current.map(item =>
      item.id === id ? { ...item, ...update } : item
    );
    setCharts([...chartStatesRef.current]); // Trigger re-render with the updated array
  }, []); // Dependencies array is empty as it doesn't depend on external state that changes.


  useEffect(() => {
    const fetchAndProcessRepos = async () => {
      setGlobalLoading(true);
      setGlobalError(null);
      setLoadingMessage('Analyzing GitHub profile...');

      let repos: Repo[] = [];
      try {
        setLoadingMessage('Fetching repository data...');
        const response = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100`);
        if (!response.ok) {
          throw new Error(`Failed to fetch repositories. Status: ${response.status}. This may be due to API rate limits.`);
        }
        repos = await response.json();
        repos.sort((a, b) => new Date(b.pushed_at).getTime() - new Date(a.pushed_at).getTime());

      } catch (err: any) {
        setGlobalError(err.message);
        setGlobalLoading(false);
        setCharts([]); // Clear charts if initial fetch fails
        return; // Exit early
      }

      // Define the sequence of charts and their types/initial titles
      const chartDefinitions = [
        { id: 'languagesByRepoCount', title: "Top Languages by Repo Count (%)", type: 'pie' as const },
        { id: 'popularity', title: "Most Starred Repositories", type: 'radar' as const },
        { id: 'largestRepos', title: "Largest Repositories (KB)", type: 'bar' as const },
        { id: 'languageUsageBySize', title: "Language Usage by Code Size (%)", type: 'pie' as const },
        { id: 'topics', title: "Top Repository Topics", type: 'radar' as const },
      ];

      if (repos.length === 0) {
        // If no repos, set all placeholders with a "no data" message
        chartStatesRef.current = chartDefinitions.map(def => ({
          ...def,
          data: null,
          isLoading: false,
          errorMessage: "No data available for this chart."
        }));
        setCharts([...chartStatesRef.current]);
        setGlobalLoading(false);
        return;
      }
      
      // Initialize charts with loading state before processing
      chartStatesRef.current = chartDefinitions.map(def => ({
        ...def,
        data: null,
        isLoading: true, // Initially all individual charts are loading
        errorMessage: null,
      }));
      setCharts([...chartStatesRef.current]); // Render initial loading states
      setGlobalLoading(false); // Global loading for initial fetch is now complete

      // --- Chart Processing ---
      // 1. Top Languages by Repo Count (Pie Chart)
      setLoadingMessage('Analyzing language distribution by repository count...');
      try {
        const languageCounts = repos.reduce((acc, repo) => {
          if (repo.language) { acc[repo.language] = (acc[repo.language] || 0) + 1; }
          return acc;
        }, {} as Record<string, number>);

        const sortedLanguages = Object.entries(languageCounts).sort(([, a], [, b]) => b - a);
        let languagePieData: PieDataPoint[] = [];
        if (sortedLanguages.length > 0) {
          const OTHER_THRESHOLD = 5;
          if (sortedLanguages.length > OTHER_THRESHOLD) {
            const topLanguages = sortedLanguages.slice(0, OTHER_THRESHOLD);
            const otherCount = sortedLanguages.slice(OTHER_THRESHOLD).reduce((sum, [, count]) => sum + count, 0);
            languagePieData = topLanguages.map(([lang, count]) => ({ name: lang, value: count }));
            if (otherCount > 0) { languagePieData.push({ name: 'Other', value: otherCount }); }
          } else {
            languagePieData = sortedLanguages.map(([lang, count]) => ({ name: lang, value: count }));
          }
          const languageChart: PieChart = { title: chartDefinitions[0].title, type: 'pie', data: languagePieData };
          updateChartState('languagesByRepoCount', { data: languageChart, isLoading: false });
        } else {
          updateChartState('languagesByRepoCount', { data: null, isLoading: false, errorMessage: "No sufficient language data." });
        }
      } catch (err: any) {
        updateChartState('languagesByRepoCount', { data: null, isLoading: false, errorMessage: `Error processing: ${err.message}` });
      }

      // 2. Repository Popularity (Radar Chart)
      setLoadingMessage('Analyzing repository popularity...');
      try {
        const sortedReposByStars = [...repos].filter(repo => repo.stargazers_count > 0).sort((a, b) => b.stargazers_count - a.stargazers_count).slice(0, 6);
        const maxStars = sortedReposByStars.length > 0 ? sortedReposByStars[0].stargazers_count : 1;
        const popularityChart: RadarChart = {
          title: chartDefinitions[1].title,
          type: 'radar',
          data: sortedReposByStars.map(repo => ({ subject: repo.name, A: repo.stargazers_count, fullMark: maxStars })),
        };
        if (popularityChart.data.length > 2) { // Radar charts need at least 3 points to form a shape
          updateChartState('popularity', { data: popularityChart, isLoading: false });
        } else {
          updateChartState('popularity', { data: null, isLoading: false, errorMessage: "Not enough starred repositories for radar chart (min 3)." });
        }
      } catch (err: any) {
        updateChartState('popularity', { data: null, isLoading: false, errorMessage: `Error processing: ${err.message}` });
      }

      // 3. Largest Repositories (Bar Chart)
      setLoadingMessage('Analyzing largest repositories...');
      try {
        const sortedReposBySize = [...repos].filter(repo => repo.size > 0).sort((a, b) => b.size - a.size).slice(0, 6);
        const sizeChart: BarChart = {
          title: chartDefinitions[2].title,
          type: 'bar',
          data: sortedReposBySize.map(repo => ({ name: repo.name, value: repo.size })).reverse(),
        };
        if (sizeChart.data.length > 0) {
          updateChartState('largestRepos', { data: sizeChart, isLoading: false });
        } else {
          updateChartState('largestRepos', { data: null, isLoading: false, errorMessage: "No repositories with size data." });
        }
      } catch (err: any) {
        updateChartState('largestRepos', { data: null, isLoading: false, errorMessage: `Error processing: ${err.message}` });
      }

      // 4. Language Usage by Code Size (Percentage) (Pie Chart)
      setLoadingMessage('Analyzing language usage by code size...');
      try {
        const languageSizes = repos.reduce((acc, repo) => {
            if (repo.language && repo.size > 0) { acc[repo.language] = (acc[repo.language] || 0) + repo.size; }
            return acc;
        }, {} as Record<string, number>);
        
        const sortedLanguagesBySize = Object.entries(languageSizes).sort(([, a], [, b]) => b - a);

        let pieChartData: PieDataPoint[] = [];
        if (sortedLanguagesBySize.length > 0) {
            const OTHER_SIZE_THRESHOLD = 5;
            if (sortedLanguagesBySize.length > OTHER_SIZE_THRESHOLD) { 
                const top5 = sortedLanguagesBySize.slice(0, OTHER_SIZE_THRESHOLD);
                const otherSize = sortedLanguagesBySize.slice(OTHER_SIZE_THRESHOLD).reduce((sum, [, size]) => sum + size, 0);
                pieChartData = top5.map(([lang, size]) => ({ name: lang, value: size }));
                if (otherSize > 0) { pieChartData.push({ name: 'Other', value: otherSize }); }
            } else { 
                pieChartData = sortedLanguagesBySize.map(([lang, size]) => ({ name: lang, value: size }));
            }
            
            const languageUsageChart: PieChart = { title: chartDefinitions[3].title, type: 'pie', data: pieChartData };
            updateChartState('languageUsageBySize', { data: languageUsageChart, isLoading: false });
        } else {
            updateChartState('languageUsageBySize', { data: null, isLoading: false, errorMessage: "No sufficient language size data." });
        }
      } catch (err: any) {
        updateChartState('languageUsageBySize', { data: null, isLoading: false, errorMessage: `Error processing: ${err.message}` });
      }
        
      // 5. Top Repository Topics (Radar Chart)
      setLoadingMessage('Analyzing repository topics...');
      try {
        const topicCounts = repos.reduce((acc, repo) => {
            if (repo.topics) { repo.topics.forEach(topic => { acc[topic] = (acc[topic] || 0) + 1; }); }
            return acc;
        }, {} as Record<string, number>);
        const sortedTopics = Object.entries(topicCounts).sort(([, a], [, b]) => b - a).slice(0, 6);
        const maxTopicCount = sortedTopics.length > 0 ? sortedTopics[0][1] : 1;
        const topicsChart: RadarChart = {
            title: chartDefinitions[4].title,
            type: 'radar',
            data: sortedTopics.map(([topic, count]) => ({ subject: topic, A: count, fullMark: maxTopicCount })),
        };
        if (topicsChart.data.length > 2) { // Radar charts need at least 3 points
          updateChartState('topics', { data: topicsChart, isLoading: false });
        } else {
          updateChartState('topics', { data: null, isLoading: false, errorMessage: "Not enough topics for radar chart (min 3)." });
        }
      } catch (err: any) {
        updateChartState('topics', { data: null, isLoading: false, errorMessage: `Error processing: ${err.message}` });
      }
    };
    fetchAndProcessRepos();
  }, [updateChartState]); // Add updateChartState to dependencies


  const handlePrev = () => {
    // Only allow navigation if charts are fully loaded (no individual chart is loading)
    // and there's no global loading or error.
    if (!globalLoading && !globalError && charts.every(c => !c.isLoading)) {
      setCurrentIndex((prev) => (prev === 0 ? charts.length - 1 : prev - 1));
    }
  };

  const handleNext = () => {
    // Only allow navigation if charts are fully loaded
    if (!globalLoading && !globalError && charts.every(c => !c.isLoading)) {
      setCurrentIndex((prev) => (prev === charts.length - 1 ? 0 : prev + 1));
    }
  };
  
  const renderContent = () => {
    if (globalLoading) {
      return <div className="text-center text-gray-400">{loadingMessage}</div>;
    }
    if (globalError) {
      return <div className="text-center text-red-400 bg-red-900/50 border border-red-700 rounded-lg p-4">{globalError}</div>;
    }
    // If charts array is empty after global loading, means no repos or no data.
    if (charts.length === 0) {
      return <div className="text-center text-gray-500">Not enough data to generate statistics.</div>
    }

    return (
       <>
        <div className="relative w-full max-w-sm aspect-square sm:w-[380px] sm:h-[380px] [transform-style:preserve-3d]">
          {charts.map((chartItem, index) => {
            let adjustedOffset = index - currentIndex;
            if (adjustedOffset > charts.length / 2) adjustedOffset -= charts.length;
            if (adjustedOffset < -charts.length / 2) adjustedOffset += charts.length;
            
            const absOffset = Math.abs(adjustedOffset);
            const isActive = absOffset === 0;
            const isVisible = absOffset <= 2;

            let transform = 'scale(0.5) translateZ(-500px)';
            let opacity = 0;
            const zIndex = charts.length - absOffset;
            let backlightOpacity = 0;
            let blur = 'blur(0px)';

            if (isVisible) {
              const sign = Math.sign(adjustedOffset);
              if (isActive) {
                transform = 'rotateY(0deg) translateX(0%) translateZ(0px) scale(1)';
                opacity = 1;
                backlightOpacity = 1;
                blur = 'blur(0px)';
              } else if (absOffset === 1) {
                transform = `rotateY(${-50 * sign}deg) translateX(${100 * sign}%) translateZ(-250px) scale(0.8)`;
                opacity = 0.5;
                backlightOpacity = 0.3;
                blur = 'blur(5px)'; // Apply blur for depth of field
              } else if (absOffset === 2) {
                transform = `rotateY(${-60 * sign}deg) translateX(${160 * sign}%) translateZ(-500px) scale(0.65)`;
                opacity = 0.2;
                backlightOpacity = 0.1;
                blur = 'blur(10px)'; // More blur for further elements
              }
            }

            return (
              <div
                key={chartItem.id} // Use chartItem.id for key
                className="absolute w-full h-full transition-all duration-[1200ms] ease-out"
                style={{
                  transform,
                  opacity,
                  zIndex,
                  pointerEvents: isActive ? 'auto' : 'none',
                  filter: blur
                }}
              >
                <div 
                  className="absolute rounded-full"
                  style={{
                    inset: '-20px',
                    background: 'radial-gradient(circle, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0) 70%)',
                    filter: 'blur(40px)',
                    transition: 'opacity 1200ms ease-out',
                    opacity: backlightOpacity
                  }}
                />
                <ChartContainer title={chartItem.title} isActive={isActive} type={chartItem.type}>
                  {chartItem.isLoading && (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400 p-4">
                      <svg className="animate-spin h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <p className="mt-2 text-sm">Loading {chartItem.title}...</p>
                    </div>
                  )}
                  {chartItem.errorMessage && (
                    <div className="flex flex-col items-center justify-center h-full text-red-400 p-4 text-center">
                      <p className="font-semibold">Error for {chartItem.title}:</p>
                      <p className="text-sm break-words">{chartItem.errorMessage}</p>
                    </div>
                  )}
                  {!chartItem.isLoading && !chartItem.errorMessage && chartItem.data && (
                    <>
                      {chartItem.data.type === 'radar' && <RadarChartViz data={chartItem.data.data} />}
                      {chartItem.data.type === 'bar' && <BarChartViz data={chartItem.data.data} />}
                      {chartItem.data.type === 'pie' && <PieChartViz data={chartItem.data.data} />}
                    </>
                  )}
                   {!chartItem.isLoading && !chartItem.errorMessage && !chartItem.data && (
                      <div className="flex items-center justify-center h-full text-gray-500 text-sm p-4 text-center">
                        No sufficient data for {chartItem.title}.
                      </div>
                    )}
                </ChartContainer>
              </div>
            );
          })}
        </div>
        
        <div className="mt-8 flex gap-4">
          <button 
            onClick={handlePrev} 
            className="bg-gray-800 border border-gray-600 text-gray-300 px-6 py-2 rounded-lg font-semibold transition-all hover:bg-gray-700 hover:border-gray-500 active:scale-95 disabled:opacity-50"
            aria-label="Previous chart"
            disabled={charts.length <= 1 || charts.some(c => c.isLoading) || globalLoading || globalError !== null} // Disable if any chart is loading
          >
            Previous
          </button>
          <button 
            onClick={handleNext}
            className="bg-gray-800 border border-gray-600 text-gray-300 px-6 py-2 rounded-lg font-semibold transition-all hover:bg-gray-700 hover:border-gray-500 active:scale-95 disabled:opacity-50"
            aria-label="Next chart"
            disabled={charts.length <= 1 || charts.some(c => c.isLoading) || globalLoading || globalError !== null} // Disable if any chart is loading
          >
            Next
          </button>
        </div>
      </>
    );
  };


  return (
    <div className="w-full min-h-screen bg-gray-950 text-gray-300 font-sans flex flex-col items-center justify-center p-4 sm:p-8">
      <header className="text-center mb-8 md:mb-12">
        <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-200 to-gray-500 font-handwritten">
          GitHub Deep Dive
        </h1>
        <p className="text-gray-500 mt-2 text-lg">A dynamic overview of my GitHub activity.</p>
      </header>

      <main className="w-full max-w-6xl flex flex-col items-center [perspective:1200px]">
        {renderContent()}
      </main>

      <footer className="mt-12 text-xs text-gray-700">
        Live Data from GitHub API
      </footer>
    </div>
  );
};

export default App;