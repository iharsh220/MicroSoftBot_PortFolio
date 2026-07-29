const https = require('https');

function getGithubUrl(path) {
  const token = process.env.GITHUB_TOKEN;
  const owner = process.env.GITHUB_OWNER || 'harshgohil';
  const repo = process.env.GITHUB_REPO || 'micro-soft-bot-port-folio';

  return {
    hostname: 'api.github.com',
    path: `/repos/${owner}/${repo}${path}`,
    headers: {
      'User-Agent': 'PortfolioBot',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    }
  };
}

function httpsGet(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        let data = '';
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => {
          try {
            resolve({ status: res.statusCode, data: JSON.parse(data) });
          } catch (e) {
            resolve({ status: res.statusCode, data });
          }
        });
      })
      .on('error', reject);
  });
}

async function getRepositories() {
  const url = getGithubUrl('/repos');

  try {
    const response = await httpsGet(url);

    if (response.status !== 200) {
      return [];
    }

    return response.data.map((repo) => ({
      name: repo.name,
      description: repo.description,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      language: repo.language,
      url: repo.html_url
    }));
  } catch (error) {
    return [];
  }
}

module.exports = { getRepositories };