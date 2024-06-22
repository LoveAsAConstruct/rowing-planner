<script>
    import { writable, derived } from 'svelte/store';

    let totalDistance = 2000; // Total distance in meters
    let segments = writable([
        { id: 1, distance: 500, split: 120, strokeRate: 30 }
    ]);

    // Derived store to calculate cumulative distances
    let cumulativeDistances = derived(segments, $segments => {
        let total = 0;
        return $segments.map(segment => {
            let start = total;
            total += segment.distance;
            return { ...segment, start };
        });
    });

    // Function to add a new segment
    function addSegment() {
        const newSegment = {
            id: Date.now(),
            distance: 500,
            split: 120,
            strokeRate: 30
        };
        segments.update(currentSegments => [...currentSegments, newSegment]);
    }

    // Function to update a segment
    function updateSegment(id, property, value) {
        segments.update(currentSegments => {
            return currentSegments.map(segment =>
                segment.id === id ? { ...segment, [property]: value } : segment
            );
        });
    }

    // Function to delete a segment
    function deleteSegment(id) {
        segments.update(currentSegments =>
            currentSegments.filter(segment => segment.id !== id)
        );
    }

    // Function to generate a color based on the segment ID
    function getColor(id) {
        const baseColors = ['#FF6347', '#4682B4', '#32CD32', '#FFD700', '#6A5ACD', '#FF69B4', '#20B2AA'];
        return baseColors[id % baseColors.length];
    }
</script>

<style>
    .progress-bar {
        width: 100%;
        height: 30px;
        background-color: lightgray;
        position: relative;
        margin-bottom: 20px;
    }
    .segment {
        height: 100%;
        display: inline-block;
        position: absolute;
    }
    input {
        width: 50px;
    }
    button {
        margin-top: 10px;
    }
</style>

<div class="progress-bar">
    {#each $cumulativeDistances as segment}
        <div class="segment" style="left: {segment.start / totalDistance * 100}%; width: {segment.distance / totalDistance * 100}%; background-color: {getColor(segment.id)}">
            <input type="number" bind:value={segment.distance} on:input={() => updateSegment(segment.id, 'distance', parseInt(segment.distance, 10))} />
            <input type="number" bind:value={segment.split} on:input={() => updateSegment(segment.id, 'split', parseInt(segment.split, 10))} />
            <input type="number" bind:value={segment.strokeRate} on:input={() => updateSegment(segment.id, 'strokeRate', parseInt(segment.strokeRate, 10))} />
        </div>
    {/each}
</div>
<button on:click={addSegment}>Add Segment</button>
{#each $segments as segment}
    <button on:click={() => deleteSegment(segment.id)}>Delete Segment {segment.id}</button>
{/each}
