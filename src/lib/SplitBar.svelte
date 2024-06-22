<script>
  import { createEventDispatcher } from 'svelte';

  export let partitions = [{ distance: 1000 }];
  export let totalDistance = 1000;
  const dispatch = createEventDispatcher();

  let dragging = null;

  function handleClick(event) {
    const rect = event.target.getBoundingClientRect();
    const offsetX = event.clientX - rect.left;
    const newDistance = (offsetX / rect.width) * totalDistance;

    const newPartition = { distance: newDistance, split: 2, strokeRate: 30, editing: false };
    partitions = partitions.flatMap((partition) =>
      partition.distance > newDistance
        ? [{ ...partition, distance: partition.distance - newDistance }, newPartition]
        : [partition]
    );
    dispatch('update', partitions);
  }

  function handleMouseDown(index, event) {
    event.preventDefault();
    dragging = { index, startX: event.clientX };
  }

  function handleMouseMove(event) {
    if (dragging !== null) {
      const dx = event.clientX - dragging.startX;
      const newDistance = partitions[dragging.index].distance + (dx / window.innerWidth) * totalDistance;

      partitions[dragging.index].distance = Math.max(newDistance, 10); // Minimum width for better UX
      dragging.startX = event.clientX;
      dispatch('update', partitions);
    }
  }

  function handleMouseUp() {
    dragging = null;
  }

  function handleKeyDown(index, event) {
    if (event.key === 'Enter' || event.key === ' ') {
      handleClick(event);
    }
  }
</script>

<style>
  .progress-bar {
    width: 100%;
    background-color: #e0e0e0;
    border-radius: 8px;
    overflow: hidden;
    display: flex;
    cursor: pointer;
  }
  .partition {
    height: 24px;
    background-color: #76c7c0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    color: white;
    position: relative;
  }
  .partition-handle {
    width: 5px;
    cursor: ew-resize;
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    background-color: #444;
  }
</style>

<div
  class="progress-bar"
  on:click={handleClick}
  on:mousemove={handleMouseMove}
  on:mouseup={handleMouseUp}
  role="progressbar"
  tabindex="0"
  on:keydown={handleKeyDown}
>
  {#each partitions as partition, index}
    <div class="partition" style="width: {Math.min((partition.distance / totalDistance) * 100, 100)}%">
      {partition.split}m / {partition.strokeRate}
      <div class="partition-handle" on:mousedown={(e) => handleMouseDown(index, e)} role="separator"></div>
    </div>
  {/each}
</div>
