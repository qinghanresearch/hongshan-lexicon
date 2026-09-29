(() => {
  const english = document.documentElement.lang === 'en';
  const switcher = document.querySelector('[data-language-switch]');
  if (switcher) {
    const target = new URL(switcher.href);
    target.search = location.search;
    // Only shared semantic anchors are preserved between separately edited prose.
    if (['#usage', '#research', '#related'].includes(location.hash)) target.hash = location.hash;
    switcher.href = target.href;
  }
  const indexNode = document.getElementById('search-index');
  if (indexNode) {
    const index = JSON.parse(indexNode.textContent);
    const q = document.getElementById('q');
    const category = document.getElementById('category');
    const params = new URLSearchParams(location.search);
    q.value = params.get('q') || '';
    category.value = [...category.options].some(o => o.value === params.get('category')) ? params.get('category') : 'all';
    const cards = [...document.querySelectorAll('[data-id]')];
    function filter() {
      const words = q.value.normalize('NFKC').toLowerCase().trim().split(/\s+/).filter(Boolean);
      const ids = new Set(index.filter(e => (category.value === 'all' || e.category === category.value) && words.every(w => e.text.normalize('NFKC').toLowerCase().includes(w))).map(e => e.id));
      cards.forEach(c => { c.hidden = !ids.has(c.dataset.id); });
      document.getElementById('result-count').textContent = `${ids.size} ${english ? 'entries' : '个词条'}`;
      document.getElementById('empty-state').hidden = ids.size !== 0;
      const url = new URL(location.href);
      if(q.value) url.searchParams.set('q', q.value); else url.searchParams.delete('q');
      if(category.value !== 'all') url.searchParams.set('category',category.value); else url.searchParams.delete('category');
      history.replaceState(null,'',url);
      if(switcher) { const target = new URL(switcher.href); target.search = url.search; switcher.href = target.href; }
    }
    q.addEventListener('input',filter);
    category.addEventListener('change',filter);
    q.closest('form').addEventListener('submit',e => { e.preventDefault(); filter(); });
    filter();
  }
})();
