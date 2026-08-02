(function () {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  const project = PROJECTS.find(p => p.id === id);

  if (!project) {
    window.location.href = 'index.html';
    return;
  }

  document.title = project.title + ' — Alok Banik';

  document.getElementById('projectImage').src = project.image;
  document.getElementById('projectImage').alt = project.title;
  document.getElementById('projectCategory').textContent = project.category;
  document.getElementById('projectTitle').textContent = project.title;
  document.getElementById('projectRole').textContent = project.role;
  document.getElementById('projectTools').textContent = project.tools;
  document.getElementById('projectPlatform').textContent = project.platform;
  document.getElementById('projectLink').href = project.link;
  document.getElementById('projectLink').textContent = 'View on ' + project.platform + ' ↗';

  if (project.date) {
    document.getElementById('projectDate').textContent = project.date;
  } else {
    document.getElementById('projectDateItem').remove();
  }

  document.getElementById('projectProblem').textContent = project.problem;
  document.getElementById('projectProcess').textContent = project.process;
  document.getElementById('projectOutcome').textContent = project.outcome;

  const otherList = document.getElementById('workList');
  const others = PROJECTS.filter(p => p.id !== project.id);

  others.forEach((p, i) => {
    const row = document.createElement('a');
    row.className = 'work-row reveal-up';
    row.href = 'project.html?id=' + p.id;
    row.dataset.img = p.image;
    row.innerHTML =
      '<span class="work-row-idx">' + String(i + 1).padStart(2, '0') + '</span>' +
      '<span class="work-row-title">' + p.title + '</span>' +
      '<span class="work-row-cat">' + p.category + '</span>' +
      '<span class="work-row-cta">View project <i>→</i></span>';
    otherList.appendChild(row);
  });
})();
