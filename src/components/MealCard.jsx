
const MealCard = ({ meal, onClick }) => {
  return (
    <div 
      onClick={() => onClick(meal.id)}
      className="group relative flex flex-col bg-zinc-900/20 rounded-[2rem] overflow-hidden cursor-pointer transition-all duration-300 hover:bg-zinc-900/40 hover:-translate-y-1 border border-zinc-800/50 hover:border-zinc-700"
    >
      {/* Image Container */}
      <div className="relative aspect-[4/5] overflow-hidden">
        <img 
          src={meal.strMealThumb} 
          alt={meal.strMeal} 
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        {/* Subtle Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent opacity-60 group-hover:opacity-30 transition-opacity"></div>
        
        {/* Category Badge */}
        <div className="absolute top-4 right-4">
          <span className="px-2.5 py-1 bg-black/40 backdrop-blur-md border border-white/5 text-white text-[9px] font-bold uppercase tracking-widest rounded-full">
            {meal.strCategory}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <p className="text-amber-500/80 text-[9px] font-black uppercase tracking-[0.2em] mb-1.5">{meal.strArea}</p>
          <h3 className="text-lg font-serif text-white leading-snug group-hover:text-amber-400 transition-colors line-clamp-2">
            {meal.strMeal}
          </h3>
        </div>
        
        <div className="mt-4 flex items-center justify-between">
          <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider group-hover:text-zinc-300 transition-colors">View Recipe</span>
          <div className="w-7 h-7 rounded-full bg-zinc-800 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-zinc-950 transition-all duration-300">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MealCard;
