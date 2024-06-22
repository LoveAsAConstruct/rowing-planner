<script>
    import { segments } from '../stores/segments.js';
    import { get } from 'svelte/store';
  
    let playlist = [];
  
    $: averageSplit = get(segments).reduce((acc, segment) => acc + Number(segment.split), 0) / get(segments).length || 0;
    $: averageStrokeRate = get(segments).reduce((acc, segment) => acc + Number(segment.strokeRate), 0) / get(segments).length || 0;
    $: totalTime = get(segments).reduce((acc, segment) => acc + Number(segment.time), 0);
  
    async function generatePlaylist() {
      const response = await fetch(`/api/spotify?split=${averageSplit}&strokeRate=${averageStrokeRate}&time=${totalTime}`);
      const data = await response.json();
      playlist = data.tracks.map(track => track.name); // Extract track names from the response
    }
  </script>
  
  <div class="playlist-generator">
    <button on:click={generatePlaylist}>Generate Playlist</button>
  
    {#if playlist.length > 0}
      <h3>Suggested Playlist:</h3>
      <ul>
        {#each playlist as song}
          <li>{song}</li>
        {/each}
      </ul>
    {/if}
  </div>
  
  <style>
    .playlist-generator {
      margin-top: 20px;
      padding: 20px;
      background-color: #f9f9f9;
      border-radius: 10px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }
  
    .playlist-generator button {
      padding: 10px 20px;
      background-color: #ca9679;
      color: #fff;
      border: none;
      border-radius: 5px;
      cursor: pointer;
    }
  
    .playlist-generator ul {
      list-style-type: none;
      padding: 0;
    }
  
    .playlist-generator li {
      padding: 5px 0;
    }
  </style>
  