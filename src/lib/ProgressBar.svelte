<script>
    import { segments } from '../stores/segments.js';
  
    $: totalDistance = $segments.reduce((acc, segment) => acc + Number(segment.distance), 0);
  </script>
  
  <div class="progress-bar">
    {#each $segments as segment}
      <div class="segment" style="width: {segment.distance / totalDistance * 100}%; background-color: {segment.color};">
        {segment.distance}m
      </div>
    {/each}
  </div>
  
  <style>
    .progress-bar {
      display: flex;
      height: 30px;
      background-color: #eee;
      border-radius: 5px;
      overflow: hidden;
      margin-top: 20px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }
  
    .segment {
      text-align: center;
      line-height: 30px;
      color: #fff;
      font-weight: bold;
    }
  </style>
  