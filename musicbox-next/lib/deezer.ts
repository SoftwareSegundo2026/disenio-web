export interface DeezerTrackResult {
  id: number;
  title: string;
  preview: string;
  artist: { name: string };
}

export interface DeezerSearchResponse {
  data: DeezerTrackResult[];
  total: number;
}

export async function searchDeezerTrack(
  trackName: string,
  artistName?: string | null
): Promise<DeezerTrackResult | null> {
  let query = trackName;
  if (artistName) query = `${artistName} ${trackName}`;

  const res = await fetch(
    `/api/deezer/search?q=${encodeURIComponent(query)}&limit=5`
  );

  if (!res.ok) return null;

  const body: DeezerSearchResponse = await res.json();

  if (!body.data || body.data.length === 0) return null;

  if (artistName) {
    const exact = body.data.find(
      (t) =>
        t.artist.name.toLowerCase() === artistName.toLowerCase() &&
        t.title.toLowerCase() === trackName.toLowerCase()
    );
    if (exact) return exact;
  }

  return body.data[0];
}
