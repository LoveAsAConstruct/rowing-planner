<script>
    import SegmentManager from './SegmentManager.svelte';
    import ProgressBar from './ProgressBar.svelte';
  </script>
  
  <main>
    <h1>Rowing Piece Planner</h1>
    <SegmentManager />
    <ProgressBar />
  </main>
  
  <style>
    main {
      padding: 20px;
      font-family: Arial, sans-serif;
      max-width: 800px;
      margin: auto;
      background-color: #fefef9;
      border-radius: 10px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }
  
    h1 {
      text-align: center;
      color: #2f1c1c;
    }
  </style>
  