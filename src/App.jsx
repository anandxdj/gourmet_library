import { useState, useEffect, useCallback } from 'react';
import MealCard from './components/MealCard';

const App = () => {
  const [meals, setMeals] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('instructions');
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 24;

  const fetchMeals = useCallback(async (page = '') => {
    setIsLoading(true);
    try {
      // If there's a search term, the API behavior might change, 
      // but based on the provided endpoints, we'll filter client-side for now 
      // while keeping the page limit manageable for performance.
      const url = `https://api.freeapi.app/api/v1/public/meals?page=${page}&limit=${itemsPerPage}`;
      const res = await fetch(url);
      const json = await res.json();
      if (json.data) {
        setMeals(json.data.data);
        setTotalPages(json.data.totalPages);
      }
    } catch (err) {
      console.error('Error fetching meals:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Use a microtask to avoid synchronous setState inside the effect body
    // which can trigger cascading renders warning in some environments.
    Promise.resolve().then(() => {
      fetchMeals(currentPage);
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage, fetchMeals]);

  const fetchMealById = async (id) => {
    if (!id) return;
    setIsDetailLoading(true);
    document.body.style.overflow = 'hidden';
    try {
      const res = await fetch(`https://api.freeapi.app/api/v1/public/meals/${id}`);
      const json = await res.json();
      if (json.data) {
        setSelectedMeal(json.data);
        setActiveTab('instructions');
      }
    } catch (err) {
      console.error('Error fetching meal details:', err);
    } finally {
      setIsDetailLoading(false);
    }
  };

  const fetchRandomMeal = async () => {
    setIsDetailLoading(true);
    document.body.style.overflow = 'hidden';
    try {
      const res = await fetch('https://api.freeapi.app/api/v1/public/meals/meal/random');
      const json = await res.json();
      if (json.data) {
        setSelectedMeal(json.data);
        setActiveTab('instructions');
      }
    } catch (err) {
      console.error('Error fetching random meal:', err);
    } finally {
      setIsDetailLoading(false);
    }
  };

  const closeModal = () => {
    setSelectedMeal(null);
    document.body.style.overflow = 'auto';
  };

  const getIngredients = (meal) => {
    if (!meal) return [];
    let ingredients = [];
    for (let i = 1; i <= 20; i++) {
      const ingredient = meal[`strIngredient${i}`];
      const measure = meal[`strMeasure${i}`];
      if (ingredient && ingredient.trim()) {
        ingredients.push({
          name: ingredient.trim(),
          measure: measure ? measure.trim() : ''
        });
      }
    }
    return ingredients;
  };

  // Client-side filtering within the current page or fetched set
  const filteredMeals = meals.filter(meal =>
    meal.strMeal?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-amber-500/30 font-sans">
      
      {/* ================= HEADER ================= */}
      <header className="relative pt-12 pb-8 px-6 md:pt-20 md:pb-12 md:px-12 max-w-[1400px] mx-auto">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-amber-600/10 blur-[150px] rounded-full -z-10"></div>
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-12">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] font-black uppercase tracking-widest">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
              </span>
              280+ Premium Recipes
            </div>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-white leading-[0.9]">
              ForkLab<br />
              <span className="text-zinc-700">LIBRARY.</span>
            </h1>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full lg:w-auto">
            <div className="relative flex-1 sm:w-80 group">
              <span className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-amber-500 transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
              <input
                type="text"
                placeholder="Find your next meal..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 text-white pl-14 pr-5 py-4 rounded-2xl focus:outline-none focus:border-amber-500 transition-all font-medium"
              />
            </div>
            
            <button 
              onClick={fetchRandomMeal}
              className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-zinc-950 rounded-xl font-bold text-xs uppercase tracking-[0.15em] transition-all shadow-lg shadow-amber-500/10 flex items-center justify-center gap-2 active:scale-95"
            >
              <span className="text-base"></span> Surprise Me
            </button>
          </div>
        </div>
      </header>

      {/* ================= RECIPE GRID ================= */}
      <main className="px-6 md:px-12 max-w-[1400px] mx-auto pb-20">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="aspect-[4/5] bg-zinc-900 rounded-[2.5rem] animate-pulse"></div>
            ))}
          </div>
        ) : filteredMeals.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
              {filteredMeals.map((meal) => (
                <MealCard 
                  key={meal.id} 
                  meal={meal} 
                  onClick={fetchMealById} 
                />
              ))}
            </div>

            {/* Pagination Controls */}
            <div className="mt-24 flex flex-col items-center gap-6">
              <div className="flex items-center gap-2">
                <button 
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(p => p - 1)}
                  className="w-10 h-10 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-white disabled:opacity-10 disabled:cursor-not-allowed hover:border-amber-500 transition-all"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                
                <div className="flex items-center gap-2 mx-4">
                   {[...Array(Math.min(5, totalPages))].map((_, i) => {
                      const pageNum = i + 1;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`w-10 h-10 rounded-lg text-xs font-bold transition-all ${currentPage === pageNum ? 'bg-amber-500 text-zinc-950' : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'}`}
                        >
                          {pageNum}
                        </button>
                      );
                   })}
                   {totalPages > 5 && <span className="text-zinc-700 px-1">...</span>}
                </div>

                <button 
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(p => p + 1)}
                  className="w-10 h-10 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-white disabled:opacity-10 disabled:cursor-not-allowed hover:border-amber-500 transition-all"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
              <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">
                Showing Page {currentPage} of {totalPages}
              </p>
            </div>
          </>
        ) : (
          <div className="py-20 text-center">
            <h3 className="text-3xl font-serif text-white mb-2">No results found.</h3>
            <p className="text-zinc-400">Try adjusting your search or clear filters.</p>
          </div>
        )}
      </main>

      {/* ================= DETAIL MODAL ================= */}
      { (selectedMeal || isDetailLoading) && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-10 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-black/95 backdrop-blur-md" onClick={!isDetailLoading ? closeModal : undefined}></div>
          
          <div className="relative w-full max-w-6xl h-full md:max-h-[85vh] bg-zinc-950 md:rounded-[3rem] overflow-hidden border-zinc-800 shadow-2xl flex flex-col md:flex-row animate-in zoom-in-95 duration-500">
            
            <button 
              onClick={closeModal}
              className="absolute top-6 right-6 z-[110] w-12 h-12 bg-white/10 hover:bg-amber-500 hover:text-zinc-950 backdrop-blur-xl text-white rounded-full flex items-center justify-center transition-all border border-white/10"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {isDetailLoading ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-6">
                 <div className="w-16 h-16 border-4 border-zinc-800 border-t-amber-500 rounded-full animate-spin"></div>
                 <p className="text-amber-500 uppercase tracking-widest text-xs font-black">Fetching Details...</p>
              </div>
            ) : (
              <>
                <div className="w-full md:w-[45%] h-[40vh] md:h-auto relative shrink-0">
                  <img src={selectedMeal.strMealThumb} alt={selectedMeal.strMeal} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent"></div>
                  <div className="absolute bottom-10 left-10 right-10">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="px-3 py-1 bg-amber-500 text-zinc-950 text-[10px] font-black uppercase tracking-widest rounded-md">{selectedMeal.strCategory}</span>
                      <span className="px-3 py-1 bg-zinc-800 text-white text-[10px] font-bold uppercase tracking-widest rounded-md border border-zinc-700">{selectedMeal.strArea}</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-serif text-white leading-[1.1]">{selectedMeal.strMeal}</h2>
                  </div>
                </div>

                <div className="flex-1 flex flex-col min-h-0">
                  <div className="px-10 pt-10 border-b border-zinc-900 flex gap-10 overflow-x-auto">
                    {['instructions', 'ingredients'].map(tab => (
                      <button 
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`pb-6 text-[10px] font-black uppercase tracking-[0.2em] relative transition-colors ${activeTab === tab ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
                      >
                        {tab === 'instructions' ? 'The Process' : 'Ingredients'}
                        {activeTab === tab && <span className="absolute bottom-0 left-0 w-full h-1 bg-amber-500"></span>}
                      </button>
                    ))}
                    {selectedMeal.strYoutube && (
                       <a href={selectedMeal.strYoutube} target="_blank" rel="noreferrer" className="pb-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 hover:text-red-500 transition-colors">
                          Video Guide
                       </a>
                    )}
                  </div>

                  <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
                    {activeTab === 'instructions' ? (
                      <div className="space-y-10">
                        {selectedMeal.strInstructions.split('\n').filter(s => s.trim().length > 10).map((step, idx) => (
                          <div key={idx} className="flex gap-8 group">
                            <span className="text-4xl font-serif text-zinc-800 font-bold tabular-nums shrink-0 group-hover:text-amber-500/30 transition-colors">
                              {(idx + 1).toString().padStart(2, '0')}
                            </span>
                            <p className="text-zinc-200 leading-relaxed text-lg font-normal pt-2">
                              {step.trim()}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1">
                        {getIngredients(selectedMeal).map((ing, idx) => (
                          <div key={idx} className="flex items-center justify-between py-4 border-b border-zinc-900 group">
                            <span className="text-zinc-100 group-hover:text-amber-500 transition-colors font-semibold text-sm">{ing.name}</span>
                            <span className="text-zinc-400 text-sm font-medium bg-zinc-900/50 px-2 py-1 rounded-md">{ing.measure}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
