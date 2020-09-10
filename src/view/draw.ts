import {Draw} from '../packages';

const d2 = new Draw({
  container: document.getElementById('webgl2'),
  type: 'show'
});

const d1 = new Draw({
  container: document.getElementById('webgl1'),
  onSync: (action) => {
    d2.action(action);
  }
});

// @ts-ignore
window.undo = () => {
  d1.action({
    type: 'undo',
  });
};

// @ts-ignore
window.redo = () => {
  d1.action({
    type: 'redo',
  });
};


