import { FC, useEffect, useState } from "react";
import { Grid, Stack, Pagination } from "@mui/material";
import { useSearchParams } from "react-router-dom";
import { useGetPopularMovies, useGetPopularTvShows } from "../movies.queries";
import { MovieCard } from "@/modules/movies/components/MovieCard";
import { parseImagePath } from "@/api/api.config";
import { MovieCardLoader } from "./MovieCardLoader";

export const MoviesGrid: FC = () => {
  const [search, setSearch] = useSearchParams();
  const [page, setPage] = useState(
    !!search.get("page") ? +`${search.get("page")}` : 1
  );

  const tvShowsRes = useGetPopularTvShows(page)
  const moviesRes = useGetPopularMovies(page)

  const showsAndMoviesArr = tvShowsRes.data !== undefined && moviesRes.data !== undefined ? [...tvShowsRes.data?.results, ...moviesRes.data?.results] : [];

  const sortByPopularityArr = showsAndMoviesArr.sort((a, b) => a.popularity < b.popularity ? 1 : -1)

  const loader = Array(12)
    .fill(null)
    .map((_, index) => <MovieCardLoader key={index} />);

  const movies = sortByPopularityArr.map((item) => {
   const tvType = item.original_title ? "Movie" : "Tv show";
    return (
      <MovieCard
        key={item.id}
        movieId={`${item.id}`}
        title={item.original_title || item.original_name}
        image={parseImagePath(item.poster_path)}
        tvType={tvType}
      />
    );
  });

  useEffect(() => {
    setSearch({ page: `${page}` });
  }, [page, setSearch]);

  return (
    <Stack spacing={5}>
      <Grid container spacing={5}>
        {tvShowsRes.isFetching || moviesRes.isFetching ? loader : movies}
      </Grid>
      <Grid container justifyContent="center">
        <Pagination
          onChange={(_, num) => setPage(num)}
          count={500}
          page={page}
        />
      </Grid>
    </Stack>
  );
};
