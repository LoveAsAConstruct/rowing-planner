<script>
    import { segments } from '../stores/segments.js';
  
    $: totalDistance = $segments.reduce((acc, segment) => acc + Number(segment.distance), 0);
  </script>
  
  <div class="progress-bar">
    {#each $segments as segment}
      <div class="segment" style="width: {segment.distance / totalDistance * 100}%;">
        {segment.distance}m
      </div>
    {/each}
  </div>
  
  <style>
    .progress-bar {
      display: flex;
      height: 30px;
      background-color: #eee;
    }
  
    .segment {
      background-color: #ca9679;
      border: 1px solid #2f1c;
      text-align: center;
      line-height: 30px;
    }
  </style>
  