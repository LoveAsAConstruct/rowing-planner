<script>
  import { segments } from '../stores/segments.js';
  import { get } from 'svelte/store';
  import { v4 as uuidv4 } from 'uuid'; // Import UUID library for unique IDs

  let distance = '';
  let split = '';
  let strokeRate = '';
  let editingIndex = null;

  function addSegment() {
    const time = (distance / 500) * split; // Convert split time to total time based on distance
    segments.update(s => {
      if (editingIndex !== null) {
        s[editingIndex] = { ...s[editingIndex], distance, split, strokeRate, time };
        editingIndex = null;
      } else {
        s.push({ id: uuidv4(), distance, split, strokeRate, time, color: getRandomColor() });
      }
      return s;
    });
    clearForm();
  }

  function editSegment(index) {
    let segment = get(segments)[index];
    distance = segment.distance;
    split = segment.split;
    strokeRate = segment.strokeRate;
    editingIndex = index;
  }

  function removeSegment(index) {
    segments.update(s => s.filter((_, i) => i !== index));
  }

  function moveSegmentUp(index) {
    if (index > 0) {
      segments.update(s => {
        [s[index - 1], s[index]] = [s[index], s[index - 1]];
        return s;
      });
    }
  }

  function moveSegmentDown(index) {
    if (index < get(segments).length - 1) {
      segments.update(s => {
        [s[index], s[index + 1]] = [s[index + 1], s[index]];
        return s;
      });
    }
  }

  function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  function clearForm() {
    distance = '';
    split = '';
    strokeRate = '';
    editingIndex = null;
  }

  $: totalTime = get(segments).reduce((acc, segment) => acc + Number(segment.time), 0);
  $: totalDistance = get(segments).reduce((acc, segment) => acc + Number(segment.distance), 0);
  $: averageSplit = totalDistance > 0 ? totalTime / (totalDistance / 500) : 0;
  $: averageStrokeRate = get(segments).length > 0 ? get(segments).reduce((acc, segment) => acc + Number(segment.strokeRate), 0) / get(segments).length : 0;
</script>

<div class="segment-manager">
  <input type="number" bind:value={distance} placeholder="Distance (m)" />
  <input type="number" bind:value={split} placeholder="Split (sec/500m)" />
  <input type="number" bind:value={strokeRate} placeholder="Stroke Rate" />
  <button on:click={addSegment}>{editingIndex !== null ? 'Update Segment' : 'Add Segment'}</button>
  {#if editingIndex !== null}
    <button on:click={clearForm}>Cancel Edit</button>
  {/if}

  <ul>
    {#each $segments as segment, index}
      <li>
        {segment.distance}m, {segment.split}s/500m, {segment.strokeRate}spm
        <button on:click={() => editSegment(index)}>Edit</button>
        <button on:click={() => removeSegment(index)}>Remove</button>
        <button on:click={() => moveSegmentUp(index)}>Move Up</button>
        <button on:click={() => moveSegmentDown(index)}>Move Down</button>
      </li>
    {/each}
  </ul>

  <div class="summary">
    <p>Total Time: {totalTime.toFixed(2)} seconds</p>
    <p>Average Split: {averageSplit.toFixed(2)} seconds/500m</p>
    <p>Average Stroke Rate: {averageStrokeRate.toFixed(2)} spm</p>
  </div>
</div>

<style>
  .segment-manager {
    padding: 20px;
    background-color: #f9f9f9;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  .segment-manager input {
    margin: 5px;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
  }

  .segment-manager button {
    padding: 10px 20px;
    background-color: #ca9679;
    color: #fff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }

  .segment-manager ul {
    list-style-type: none;
    padding: 0;
  }

  .segment-manager li {
    background-color: #fff;
    padding: 10px;
    margin: 5px 0;
    border-radius: 5px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .segment-manager li button {
    margin-left: 10px;
    background-color: #e74c3c;
  }

  .segment-manager li button:first-of-type {
    background-color: #3498db;
  }

  .segment-manager li button:nth-of-type(3) {
    background-color: #2ecc71;
  }

  .segment-manager li button:nth-of-type(4) {
    background-color: #f39c12;
  }

  .summary {
    margin-top: 20px;
    padding: 10px;
    background-color: #eee;
    border-radius: 5px;
  }

  .summary p {
    margin: 5px 0;
  }
</style>
