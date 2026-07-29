import type { Movie } from '../types';

interface MovieCardProps {
  movie: Movie;
  onPlayMovie: (movie: Movie) => void;
}

export default function MovieCard({ movie, onPlayMovie }: MovieCardProps) {
  return (
    <div
      onClick={() => onPlayMovie(movie)}
      className="group relative flex flex-col rounded-2xl bg-dark-card border border-border-dark overflow-hidden transition-all duration-300 hover:scale-[1.03] hover:border-accent hover:shadow-xl hover:shadow-black/50 cursor-pointer"
    >
      {/* Poster Image */}
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-black/60">
        <img
          src={movie.poster}
          alt={movie.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&q=80';
          }}
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-dark-card via-black/20 to-transparent opacity-90 group-hover:opacity-60 transition-opacity" />

        {/* Rating Badge */}
        <div className="absolute top-2.5 left-2.5 px-2 py-1 rounded-lg bg-black/70 backdrop-blur-md border border-white/10 text-accent font-bold text-[11px] flex items-center gap-1 shadow-md">
          {movie.rating}
        </div>

        {/* Play Icon Hover Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10">
          <div className="size-14 rounded-full bg-accent text-black flex items-center justify-center shadow-2xl transform scale-75 group-hover:scale-100 transition-transform">
            <svg className="size-7 fill-current ml-1" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="p-3.5 flex flex-col gap-1">
        <div className="flex items-center justify-between text-[11px] text-text-muted">
          <span>{movie.year}</span>
          <span>{movie.duration}</span>
        </div>

        <h3 className="text-xs font-bold text-text-primary line-clamp-1 group-hover:text-accent transition-colors">
          {movie.title}
        </h3>

        <p className="text-[10px] text-text-muted">{movie.genre}</p>
      </div>
    </div>
  );
}
