const searchInput = document.getElementById('search');
            const perPageSelect = document.getElementById('perPage');
            const paginationDiv = document.getElementById('pagination');
            const ownerDetailsDiv = document.getElementById('ownerDetails');
            const ownerCardDiv = document.getElementById('ownerCard');
            const repositoriesList = document.getElementById('repositoriesList');
            let currentPage = 1;

            searchInput.addEventListener('input', function () {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(fetchRepositories, 500);
            });

            perPageSelect.addEventListener('change', function () {
                currentPage = 1;
                fetchRepositories();
            });

            async function fetchRepositories() {
                const username = document.getElementById('username').value;
                const perPage = perPageSelect.value;
                const search = document.getElementById('search').value;

                document.getElementById('loader').style.display = 'block';
                repositoriesList.innerHTML = '';
                ownerDetailsDiv.style.display = 'none';

                try {
                    const response = await fetch(`https://api.github.com/search/repositories?q=user:${username}+${search}&per_page=${perPage}&page=${currentPage}`);
                    const result = await response.json();

                    document.getElementById('loader').style.display = 'none';

                    if (result.message === 'Not Found') {
                        repositoriesList.innerHTML = 'User not found.';
                        return;
                    }

                    if (result.items.length > 0) {
                        displayOwnerDetails(result.items[0].owner);
                        displayRepositories(result.items);
                        createPagination(result.total_count, perPage);
                    } else {
                        repositoriesList.innerHTML = 'No repositories found.';
                    }
                } catch (error) {
                    document.getElementById('loader').style.display = 'none';
                    console.error('Error fetching repositories:', error);
                }
            }

            function displayOwnerDetails(owner) {
                ownerDetailsDiv.style.display = 'block';

                const ownerCard = document.createElement('div');
                ownerCard.className = 'card';

                const avatarUrl = owner.avatar_url;
                if (avatarUrl) {
                    const avatarImg = document.createElement('img');
                    avatarImg.src = avatarUrl;
                    ownerCard.appendChild(avatarImg);
                }

                const ownerName = document.createElement('p');
                ownerName.textContent = `Name: ${owner.login}`;
                ownerCard.appendChild(ownerName);

                const ownerBio = document.createElement('p');
                ownerBio.textContent = `Bio: ${owner.bio || 'N/A'}`;
                ownerCard.appendChild(ownerBio);

                const ownerGithubLink = document.createElement('p');
                ownerGithubLink.innerHTML = `Github: <a href="${owner.html_url}" target="_blank">${owner.html_url}</a>`;
                ownerCard.appendChild(ownerGithubLink);

                const ownerRepoCount = document.createElement('p');
                ownerRepoCount.textContent = `Number of Repositories: ${owner.public_repos}`;
                ownerCard.appendChild(ownerRepoCount);

                ownerCardDiv.innerHTML = '';
                ownerCardDiv.appendChild(ownerCard);
            }

            function displayRepositories(repositories) {
                repositories.forEach(repo => {
                    const repoCard = document.createElement('div');
                    repoCard.className = 'card';

                    const repoName = document.createElement('h3');
                    repoName.textContent = repo.name;
                    repoCard.appendChild(repoName);

                    const repoLanguages = document.createElement('p');
                    repoLanguages.textContent = `Languages: ${repo.language || 'N/A'}`;
                    repoCard.appendChild(repoLanguages);

                    const repoDescription = document.createElement('p');
                    repoDescription.textContent = `Description: ${repo.description || 'N/A'}`;
                    repoCard.appendChild(repoDescription);

                    repositoriesList.appendChild(repoCard);
                });
            }

            function createPagination(totalRepositories, perPage) {
                const totalPages = Math.ceil(totalRepositories / perPage);
                paginationDiv.innerHTML = '';

                for (let i = 1; i <= totalPages; i++) {
                    const button = document.createElement('button');
                    button.textContent = i;
                    button.onclick = () => {
                        currentPage = i;
                        fetchRepositories();
                    };
                    paginationDiv.appendChild(button);
                }
            }