import { json } from '@sveltejs/kit';
import fetch from 'node-fetch';

async function getSpotifyAccessToken() {
  const client_id = process.env.SPOTIFY_CLIENT_ID;
  const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
  const auth_token = Buffer.from(`${client_id}:${client_secret}`, 'utf-8').toString('base64');

  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth_token}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: 'grant_type=client_credentials'
  });

  const data = await response.json();
  return data.access_token;
}

export async function GET({ url }) {
  const access_token = await getSpotifyAccessToken();

  const split = url.searchParams.get('split');
  const strokeRate = url.searchParams.get('strokeRate');
  const time = url.searchParams.get('time'); // You can use the time parameter as well

  const recommendations_response = await fetch(`https://api.spotify.com/v1/recommendations?limit=10&seed_genres=workout&target_tempo=${split}&target_energy=${strokeRate / 10}`, {
    headers: {
      'Authorization': `Bearer ${access_token}`
    }
  });

  const recommendations_data = await recommendations_response.json();

  return json(recommendations_data);
}
