import { Draw } from '../packages';

const w2 = new Draw({
  container: document.getElementById('webgl2'),
  type: 'show'
});

new Draw({
  container: document.getElementById('webgl1'),
  onSync(action) {
    w2.action(action);
  }
});


