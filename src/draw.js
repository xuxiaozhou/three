import Draw from '../packages/Draw';

const d2 = new Draw({
  container: document.getElementById('webgl2'),
  type: 'show'
});

const d1 = new Draw({
  container: document.getElementById('webgl1'),
  onSync(action) {
    d2.action(action);
  }
});

window.undo = () => {
  d1.action({
    type: 'undo',
  });
};

window.redo = () => {
  d1.action({
    type: 'redo',
  });
};


