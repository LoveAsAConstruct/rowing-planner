<script>
  import { segments } from '../stores/segments.js';
  import { get } from 'svelte/store';

  let distance = '';
  let time = '';
  let strokeRate = '';

  function addSegment() {
    segments.update(s => [...s, { distance, time, strokeRate }]);
    distance = '';
    time = '';
    strokeRate = '';
  }

  function removeSegment(index) {
    segments.update(s => s.filter((_, i) => i !== index));
  }
</script>

<div>
  <input type="number" bind:value={distance} placeholder="Distance" />
  <input type="number" bind:value={time} placeholder="Time" />
  <input type="number" bind:value={strokeRate} placeholder="Stroke Rate" />
  <button on:click={addSegment}>Add Segment</button>

  <ul>
    {#each $segments as segment, index}
      <li>
        {segment.distance}m, {segment.time}min, {segment.strokeRate}spm
        <button on:click={() => removeSegment(index)}>Remove</button>
      </li>
    {/each}
  </ul>
</div>
