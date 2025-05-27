import { createReducer, on } from '@ngrx/store';
import * as VideosActions from './videos.actions';
import { SermonsModel } from '../../shared/components/video-checker/youtube.model';

export interface VideosState {
  youtube_videos: SermonsModel[];
  loading: boolean;
  all: SermonsModel[];
  filtered: SermonsModel[];
}

export const initialState: VideosState = {
  youtube_videos: [],
  loading: false,
  all: [],
  filtered: [],
};

export const videosReducer = createReducer(
  initialState,
  on(VideosActions.loadYouTubePlayListVideos, (state) => ({
    ...state,
    loading: state.youtube_videos.length > 0 ? false : true,
  })),
  on(VideosActions.sortVideos, (state, { order }) => {
    const sorted = [...state.filtered].sort((a, b) =>
      order === 'newest'
        ? new Date(b.date).getTime() - new Date(a.date).getTime()
        : new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    return { ...state, filtered: sorted };
  }),

  on(VideosActions.filterVideos, (state, { search }) => {
    const term = search.toLowerCase();
    const filtered = state.all.filter(
      (s) =>
        s.title.toLowerCase().includes(term) ||
        s.speaker.toLowerCase().includes(term)
    );
    return { ...state, filtered };
  }),
  on(
    VideosActions.loadYouTubePlayListVideosSuccess,
    (state, { youtube_videos }) => {
      const order = 'newest';
      const videos: SermonsModel[] = youtube_videos.map((item) => ({
        title: item.snippet.title,
        date: item.snippet.publishedAt,
        speaker:
          item.snippet.videoOwnerChannelTitle || item.snippet.channelTitle,
        videoUrl: `https://www.youtube.com/watch?v=${
          item.snippet.resourceId.videoId
        }&list=${item.snippet.playlistId}&index=${item.snippet.position + 1}`,
        thumbnail:
          item.snippet.thumbnails.high?.url ||
          item.snippet.thumbnails.default?.url,
      }));

      const sorted = videos.sort((a, b) =>
        order === 'newest'
          ? new Date(b.date).getTime() - new Date(a.date).getTime()
          : new Date(a.date).getTime() - new Date(b.date).getTime()
      );
      return {
        ...state,
        youtube_videos: sorted,
        all: sorted,
        filtered: sorted,
        loading: false,
      };
    }
  )
);
