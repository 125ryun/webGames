new Vue({
  el: '#app',
  data: {
    fieldElement: 0,
    btnElements: [],

    N: 10,
    initialPress: 1,
  },
  methods: {
    initData() {
      this.fieldElement = document.getElementById('field');

      var everyBtnElements = [];
      for (let i=1; i<=N; i++) {
        let nr = fieldElement.insertRow();
        for (let j=1; j <=N; j++) {
          let nc = nr.insertCell();

          let btn = document.createElement('button');
          btn.textContent = '';
          btn.addEventListener('click', this.btnLeftClick());
          btn.addEventListener('contextmenu', this.btnRightClick());

          nc.append(btn);
          everyBtnElements.push(btn);
        }
      }
      for (var i=0; i<N; i++) {
        let tmparr = [];
        for (var j=0; j<N; j++) {
            tmparr.push(everyBtnElements[i * N + j]);
        }
        btnElements.push(tmparr);
    }
    },
    btnLeftClick() {},
    btnRightClick() {},
  },
  mounted() {
    this.initData();
  },
});