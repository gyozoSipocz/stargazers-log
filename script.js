const repositoryList = document.querySelector('#repository-list');
const repositoryCount = document.querySelector('#repository-count');
const statusMessage = document.querySelector('#status-message');

function formatDate(dateString) {
  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return 'Date unavailable';
  }

  return new Intl.DateTimeFormat(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
}

function createRepositoryItem(event) {
  const item = document.createElement('li');
  item.className = 'repository-item';

  const mark = document.createElement('span');
  mark.className = 'repository-mark';
  mark.setAttribute('aria-hidden', 'true');
  mark.textContent = '⌘';

  const details = document.createElement('div');
  details.className = 'repository-details';

  const link = document.createElement('a');
  link.className = 'repository-name';
  link.href = event.url;
  link.target = '_blank';
  link.rel = 'noreferrer';
  link.textContent = event.repository;

  const description = document.createElement('p');
  description.className = 'repository-description';
  description.textContent = event.description || 'No description provided.';

  const meta = document.createElement('div');
  meta.className = 'repository-meta';

  if (event.language) {
    const language = document.createElement('span');
    language.className = 'language';
    language.dataset.language = event.language;
    language.textContent = event.language;
    meta.append(language);
  }

  const date = document.createElement('time');
  date.dateTime = event.created_at;
  date.textContent = `Starred ${formatDate(event.created_at)}`;
  meta.append(date);

  details.append(link, description, meta);
  item.append(mark, details);
  return item;
}

async function loadRepositories() {
  try {
    const response = await fetch('./events.json');

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const data = await response.json();
    const events = Array.isArray(data.events) ? data.events : [];

    repositoryList.replaceChildren(...events.map(createRepositoryItem));
    repositoryCount.textContent = `${events.length} ${events.length === 1 ? 'repository' : 'repositories'}`;
    statusMessage.hidden = events.length > 0;
    statusMessage.textContent = events.length ? '' : 'No starred repositories to show yet.';
  } catch (error) {
    repositoryCount.textContent = 'Unavailable';
    statusMessage.textContent = 'Could not load the starred repositories. Please try again later.';
    statusMessage.hidden = false;
    console.error('Unable to load events.json:', error);
  }
}

loadRepositories();
