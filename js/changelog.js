document.addEventListener('DOMContentLoaded', async () => {
  const status = document.getElementById('changelog-status');
  const list = document.getElementById('changelog-list');
  const API = 'https://api.github.com/repos/glrmrissi/isi_music/releases?per_page=20';

  function escapeHtml(s) {
    return s
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function renderInline(s) {
    return s
      .replace(/\*\*([^*]+)\*\*/g, '<strong class="text-light-text dark:text-on-surface">$1</strong>')
      .replace(/`([^`]+)`/g, '<code class="bg-slate-100 dark:bg-surface-container px-1 rounded text-light-primary dark:text-primary font-code-sm text-code-sm">$1</code>')
      .replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g, '<a class="text-light-primary dark:text-primary hover:underline" href="$2" target="_blank" rel="noopener">$1</a>');
  }

  function renderMarkdown(body) {
    const html = [];
    let inList = false;
    const closeList = () => { if (inList) { html.push('</ul>'); inList = false; } };

    for (const rawLine of body.split('\n')) {
      const line = escapeHtml(rawLine.trimEnd());
      const trimmed = line.trim();

      if (/^&lt;(\/?)details|^&lt;\/?summary|^<details|^<\/details|^<summary/.test(rawLine.trim()) || trimmed === '---') {
        continue;
      }

      const h = trimmed.match(/^(#{1,4})\s+(.+)$/);
      if (h) {
        closeList();
        html.push(`<h4 class="font-headline-md text-[16px] text-light-text dark:text-on-surface mt-4 mb-2">${renderInline(h[2])}</h4>`);
        continue;
      }

      const li = trimmed.match(/^[*-]\s+(.+)$/);
      if (li) {
        if (!inList) { html.push('<ul class="list-disc list-inside space-y-1 my-2">'); inList = true; }
        html.push(`<li>${renderInline(li[1])}</li>`);
        continue;
      }

      closeList();
      if (trimmed === '') continue;
      html.push(`<p class="my-2">${renderInline(trimmed)}</p>`);
    }
    closeList();
    return html.join('\n');
  }

  try {
    const res = await fetch(API, { headers: { Accept: 'application/vnd.github+json' } });
    if (!res.ok) throw new Error(`GitHub API: ${res.status}`);
    const releases = await res.json();

    const published = releases.filter((r) => !r.draft);
    if (published.length === 0) {
      status.innerHTML = '<p class="font-code-sm text-code-sm text-light-text-muted dark:text-on-surface-variant">No releases published yet.</p>';
      return;
    }

    status.remove();
    for (const r of published) {
      const date = r.published_at
        ? new Date(r.published_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
        : '';
      const card = document.createElement('article');
      card.className = 'glass-card rounded-lg p-6';
      card.innerHTML = `
        <div class="flex items-center justify-between flex-wrap gap-2 mb-4">
          <a class="font-headline-md text-[20px] text-light-primary dark:text-primary hover:underline" href="${escapeHtml(r.html_url)}" target="_blank" rel="noopener">${escapeHtml(r.name || r.tag_name)}</a>
          <div class="flex items-center gap-3">
            ${r.prerelease ? '<span class="font-label-caps text-label-caps px-2 py-1 rounded bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300">PRE-RELEASE</span>' : ''}
            <span class="font-code-sm text-code-sm text-light-text-muted dark:text-on-surface-variant">${escapeHtml(date)}</span>
          </div>
        </div>
        <div class="font-body-base text-body-base text-light-text-muted dark:text-on-surface-variant">${renderMarkdown(r.body || '')}</div>`;
      list.appendChild(card);
    }
  } catch (e) {
    status.innerHTML = `<p class="font-code-sm text-code-sm text-light-text-muted dark:text-on-surface-variant">
      Could not load changelog (${escapeHtml(e.message)}).
      <a class="text-light-primary dark:text-primary hover:underline" href="https://github.com/glrmrissi/isi_music/releases" target="_blank" rel="noopener">View releases on GitHub</a>.
    </p>`;
  }
});
