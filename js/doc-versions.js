(function () {
  var select = document.getElementById('doc-version');
  if (!select) return;

  var current = location.pathname.match(/docs\/(v[^/]+)\//);
  current = current ? current[1] : null;

  fetch('../versions.json')
    .then(function (r) { return r.json(); })
    .then(function (data) {
      data.versions.forEach(function (v) {
        var opt = document.createElement('option');
        opt.value = v;
        opt.textContent = v === data.latest ? v + ' (latest)' : v;
        if (v === current) opt.selected = true;
        select.appendChild(opt);
      });
      if (!current) select.value = data.latest;
    })
    .catch(function () {
      if (current) {
        var opt = document.createElement('option');
        opt.value = current;
        opt.textContent = current;
        opt.selected = true;
        select.appendChild(opt);
      }
    });

  select.addEventListener('change', function () {
    if (select.value && select.value !== current) {
      location.href = '../' + select.value + '/';
    }
  });
})();
